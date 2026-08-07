// @ts-nocheck
import { PDFDocument } from 'pdf-lib';
import pdf from 'pdf-parse';

const pdfParser = (pdf.default || pdf) as any;

export async function parseEOperasiPDF(base64: string) {
  try {
    const buffer = Buffer.from(base64, 'base64');
    
    // Check if it's password protected using pdf-lib FIRST
    // pdf-parse can hang or crash on encrypted files without clear errors
    try {
      const pdfDoc = await PDFDocument.load(buffer, { ignoreEncryption: false });
      if (pdfDoc.isEncrypted) {
        throw new Error('Fail PDF ini dilindungi kata laluan. Sila muat naik fail yang tidak dikunci.');
      }
    } catch (pdfLibError) {
      const errMsg = pdfLibError.message.toLowerCase();
      if (errMsg.includes('password') || errMsg.includes('encrypted') || errMsg.includes('decrypt')) {
        throw new Error('Fail PDF ini dilindungi kata laluan. Sila muat naik fail yang tidak dikunci.');
      }
      console.warn('pdf-lib pre-check failed:', pdfLibError);
      // If it's not a password error, we let pdf-parse try anyway
    }

    let text = "";
    try {
      const data = await pdfParser(buffer);
      text = data.text;
      console.log('PDF text extracted length:', text?.length);
    } catch (e) {
      console.error('pdf-parse failed:', e);
      throw new Error(`Ralat memproses PDF: ${e.message}. Sila pastikan fail PDF tidak dilindungi kata laluan.`);
    }

    if (!text || text.trim().length < 10) {
      throw new Error('Gagal mengekstrak teks daripada PDF. Pastikan ia adalah fail "Paparan Semakan Data" asli dari eOperasi dan bukan hasil imbasan (scan).');
    }

    // Mapping patterns for eOperasi PDF
    const profile: any = {};
    
    // Debug: Log the first 500 characters to see the structure
    console.log('PDF Preview:', text.substring(0, 500).replace(/\n/g, ' '));

    // Name - improved patterns for Malaysian names
    const nameMatch = text.match(/Nama\s*[:\s]\s*([^\n\r*]{3,})/i) || 
                      text.match(/NAMA\s*[:\s]\s*([^\n\r*]{3,})/i);
    if (nameMatch) profile.nama = nameMatch[1].trim();

    // IC - improved regex to handle spaces, dashes and bare numbers
    const icMatch = text.match(/No\.?\s*Kp\s*[:\s]\s*([\d\s-]+)/i) || 
                    text.match(/NO\.?\s*KAD\s*PENGENALAN\s*[:\s]\s*([\d\s-]+)/i) ||
                    text.match(/\b(\d{6}[-\s]?\d{2}[-\s]?\d{4})\b/);
    if (icMatch) profile.kp = icMatch[1].replace(/[\s-]/g, '').trim();

    // Phone
    const phoneMatch = text.match(/No\s*Telefon\s*[:\s]\s*([\d-]+)/i) ||
                       text.match(/TEL\s*[:\s]\s*([\d-]+)/i);
    if (phoneMatch) profile.tel = phoneMatch[1].trim();

    // Email
    const emailMatch = text.match(/E-mel\s*[:\s]\s*([^\s\n\r*]+)/i) || 
                       text.match(/Email\s*[:\s]\s*([^\s\n\r*]+)/i);
    if (emailMatch) profile.email = emailMatch[1].trim();

    // Address - more robust address extraction
    const addressMatch = text.match(/Alamat\s*Tinggal\s*Semasa\s*[:\s]\s*([^\*]+?)(?=\s*Poskod|\s*No\s*Telefon|$)/i) ||
                         text.match(/ALAMAT\s*[:\s]\s*([^\*]+?)(?=\s*POSKOD|\s*TEL|$)/i);
    if (addressMatch) profile.alamat = addressMatch[1].replace(/\s+/g, ' ').trim();

    // Poskod
    const poskodMatch = text.match(/Poskod\s*[:\s]\s*(\d{5})/i) ||
                        text.match(/POSKOD\s*[:\s]\s*(\d{5})/i);
    if (poskodMatch) profile.poskod = poskodMatch[1].trim();

    // Gred - broader DG match
    const gredMatch = text.match(/Gred\s*Jawatan\s*(?:Semasa)?\s*[:\s]\s*(DG\d+)/i) || 
                      text.match(/\b(DG\d+)\b/i);
    if (gredMatch) profile.gred = gredMatch[1].toUpperCase().trim();

    // Kelulusan (Basic extraction)
    const kelulusan = [];
    const academicSections = text.split(/Peringkat\s*Akademik/i);
    
    if (academicSections.length > 1) {
      for (let i = 1; i < academicSections.length; i++) {
        const section = academicSections[i];
        const instMatch = section.match(/Nama\s*Institusi\s*[:\s]\s*([^\n\r*]+)/i);
        const yearMatch = section.match(/Tahun\s*[:\s]\s*(\d{4})/i);
        const degMatch = section.match(/[:\s]\s*([^\n\r*]+)/i); // First line after header is usually the degree
        
        if (instMatch || yearMatch) {
          kelulusan.push({
            id: `imported-a-${i}`,
            kelayakan: degMatch ? degMatch[1].trim() : 'Ijazah',
            bidang: 'Sila Kemaskini',
            institusi: instMatch ? instMatch[1].trim() : '-',
            tahun: yearMatch ? yearMatch[1].trim() : '-'
          });
        }
      }
    }

    // Sejarah Perkhidmatan (Basic extraction)
    const history: any[] = [];
    const historyMatches = text.matchAll(/Nama\s*Tempat\s*Berkhidmat\s*[:\s]\s*([^\n\r*]+)[\s\S]*?Tarikh\s*Mula\s*[:\s]\s*([\d/]+)/gi);
    let count = 0;
    for (const match of historyMatches) {
      if (count >= 10) break;
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
      kelulusan: kelulusan.length > 0 ? kelulusan : undefined,
      sejarah: history.length > 0 ? history : undefined
    };
  } catch (error) {
    console.error('Error parsing PDF:', error);
    throw new Error(error.message || 'Gagal memproses fail PDF eOperasi.');
  }
}