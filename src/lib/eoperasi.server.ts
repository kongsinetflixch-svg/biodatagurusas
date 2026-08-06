// @ts-nocheck
import { PDFDocument } from 'pdf-lib';
import pdf from 'pdf-parse';

export async function parseEOperasiPDF(base64: string) {
  try {
    const buffer = Buffer.from(base64, 'base64');
    
    let text = "";
    try {
      const data = await pdf(buffer);
      text = data.text;
      console.log('PDF text extracted length:', text?.length);
    } catch (e) {
      console.warn('pdf-parse failed:', e);
      // Check if it's password protected using pdf-lib
      try {
        await PDFDocument.load(buffer);
      } catch (pdfLibError) {
        if (pdfLibError.message.includes('password')) {
          throw new Error('Fail PDF ini dilindungi kata laluan. Sila muat naik fail yang tidak dikunci.');
        }
      }
      throw new Error(`Ralat memproses PDF: ${e.message}`);
    }

    if (!text || text.trim().length < 10) {
      throw new Error('Gagal mengekstrak teks daripada PDF. Pastikan ia adalah fail "Paparan Semakan Data" asli dari eOperasi dan bukan hasil imbasan (scan).');
    }

    // Mapping patterns for eOperasi PDF
    const profile: any = {};
    
    // Debug: Log the first 500 characters to see the structure
    console.log('PDF Preview:', text.substring(0, 500).replace(/\n/g, ' '));

    // Name - search for patterns like "Nama : NAMA GURU" or "Nama NAMA GURU"
    const nameMatch = text.match(/Nama\s*[:\s]\s*([^\n\r*]+)/i);
    if (nameMatch) profile.nama = nameMatch[1].trim();

    // IC - improved regex to handle spaces and dashes
    const icMatch = text.match(/No\.?\s*Kp\s*[:\s]\s*([\d\s-]+)/i) || text.match(/(\d{12})/);
    if (icMatch) profile.kp = icMatch[1].replace(/[\s-]/g, '').trim();

    // Phone
    const phoneMatch = text.match(/No\s*Telefon\s*[:\s]\s*([\d-]+)/i);
    if (phoneMatch) profile.tel = phoneMatch[1].trim();

    // Email
    const emailMatch = text.match(/E-mel\s*[:\s]\s*([^\s\n\r*]+)/i) || text.match(/Email\s*[:\s]\s*([^\s\n\r*]+)/i);
    if (emailMatch) profile.email = emailMatch[1].trim();

    // Address - capture multiple lines if needed
    const addressMatch = text.match(/Alamat\s*Tinggal\s*Semasa\s*[:\s]\s*([^\*]+?)(?=\s*Poskod|\s*No\s*Telefon|$)/i);
    if (addressMatch) profile.alamat = addressMatch[1].replace(/\s+/g, ' ').trim();

    // Poskod
    const poskodMatch = text.match(/Poskod\s*[:\s]\s*(\d{5})/i);
    if (poskodMatch) profile.poskod = poskodMatch[1].trim();

    // Gred - broader DG match
    const gredMatch = text.match(/Gred\s*Jawatan\s*(?:Semasa)?\s*[:\s]\s*(DG\d+)/i) || 
                      text.match(/\b(DG\d+)\b/i);
    if (gredMatch) profile.gred = gredMatch[1].toUpperCase().trim();

    // Kelulusan (Basic extraction)
    // Looking for lines with years (20XX) and degrees
    const academicMatch = text.match(/Nama\s*Institusi\s*:\s*([^\n\r*]+)/i);
    const yearMatch = text.match(/Tahun\s*:\s*(\d{4})/i);
    const degreeMatch = text.match(/Peringkat\s*Akademik\s*1\s*:\s*([^\n\r*]+)/i) || text.match(/Kelulusan\s*Tertinggi\s*:\s*([^\n\r*]+)/i);
    
    const kelulusan = [];
    if (academicMatch || degreeMatch) {
      kelulusan.push({
        id: 'imported-1',
        kelayakan: degreeMatch ? degreeMatch[1].trim() : 'Ijazah',
        bidang: 'Sila Kemaskini',
        institusi: academicMatch ? academicMatch[1].trim() : '-',
        tahun: yearMatch ? yearMatch[1].trim() : '-'
      });
    }

    // Sejarah Perkhidmatan (Basic extraction)
    const history: any[] = [];
    const historyMatches = text.matchAll(/Nama\s*Tempat\s*Berkhidmat\s*:\s*([^\n\r*]+)[\s\S]*?Tarikh\s*Mula\s*:\s*([\d/]+)/gi);
    let count = 0;
    for (const match of historyMatches) {
      if (count >= 5) break;
      history.push({
        id: `imported-h-${count}`,
        sekolah: match[1].trim(),
        tahun: match[2].trim().split('/').pop(), // Just year
        subjek: 'Pegawai Perkhidmatan Pendidikan'
      });
      count++;
    }

    return {
      profile,
      kelulusan,
      sejarah: history
    };
  } catch (error) {
    console.error('Error parsing PDF:', error);
    throw new Error(error.message || 'Gagal memproses fail PDF eOperasi.');
  }
}