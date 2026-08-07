
import { PDFDocument } from 'pdf-lib';

/**
 * Extracts text from a PDF buffer using pdf-parse v2.4.5 API.
 */
const extractPdfText = async (buffer: Buffer): Promise<string> => {
  try {
    // Dynamic import to handle ESM/CJS build issues in TanStack Start
    const { PDFParse } = await import("pdf-parse");
    
    if (!PDFParse) {
      throw new Error("Pustaka 'pdf-parse' tidak dapat dimuatkan.");
    }

    const parser = new PDFParse({ data: buffer });
    
    try {
      const result = await parser.getText();
      if (!result || typeof result.text !== 'string') {
        throw new Error("Gagal mengekstrak teks daripada PDF.");
      }
      return result.text;
    } finally {
      // Always cleanup to prevent memory leaks
      if (typeof parser.destroy === 'function') {
        await parser.destroy();
      }
    }
  } catch (err) {
    console.error("extractPdfText error:", err);
    throw new Error("Ralat memproses teks PDF. Sila cuba semula dengan fail “Paparan Semakan Data” daripada eOperasi.");
  }
};

export async function parseEOperasiPDF(base64: string) {
  try {
    const buffer = Buffer.from(base64, 'base64');
    
    // Check for valid PDF header
    const header = buffer.subarray(0, 5).toString();
    if (header !== '%PDF-') {
      throw new Error("Fail yang dimuat naik bukan PDF yang sah.");
    }
    
    // Pre-check for password protection using pdf-lib
    try {
      const pdfDoc = await PDFDocument.load(buffer, { ignoreEncryption: false });
      if (pdfDoc.isEncrypted) {
        throw new Error('Fail PDF ini dilindungi kata laluan. Sila muat naik fail yang tidak dikunci.');
      }
    } catch (pdfLibError: any) {
      const errMsg = (pdfLibError?.message || "").toLowerCase();
      if (errMsg.includes('password') || errMsg.includes('encrypted') || errMsg.includes('decrypt')) {
        throw new Error('Fail PDF ini dilindungi kata laluan. Sila muat naik fail yang tidak dikunci.');
      }

      // If it's another error, we let extractPdfText handle it or fail later
    }

    const text = await extractPdfText(buffer);
    console.log('PDF text extracted length:', text?.length);

    if (!text || text.trim().length < 10) {
      throw new Error('Gagal mengekstrak teks daripada PDF. Pastikan ia adalah fail "Paparan Semakan Data" asli dari eOperasi.');
    }

    // Mapping patterns for eOperasi PDF
    const profile: any = {};
    
    // Debug: Log a snippet for structure verification
    console.log('PDF Preview:', text.substring(0, 500).replace(/\n/g, ' '));

    // Normalization helper
    const normalize = (val: string | undefined, isEmail = false) => {
      if (!val) return val;
      if (isEmail) return val.trim();
      return val.trim().toUpperCase();
    };

    // Name - Stop before "Status Perkahwinan" as requested
    const nameMatch = text.match(/Nama\s*[:\s]\s*([^\n\r*]+?)(?=\s*Status\s*Perkahwinan|$)/i) || 
                      text.match(/NAMA\s*[:\s]\s*([^\n\r*]+?)(?=\s*Status\s*Perkahwinan|$)/i);
    if (nameMatch) profile.nama = normalize(nameMatch[1]);

    // IC
    const icMatch = text.match(/No\.?\s*Kp\s*[:\s]\s*([\d\s-]+)/i) || 
                    text.match(/NO\.?\s*KAD\s*PENGENALAN\s*[:\s]\s*([\d\s-]+)/i) ||
                    text.match(/\b(\d{6}[-\s]?\d{2}[-\s]?\d{4})\b/);
    if (icMatch && icMatch[1]) profile.kp = icMatch[1].replace(/[\s-]/g, '').trim();


    // Phone
    const phoneMatch = text.match(/No\s*Telefon\s*[:\s]\s*([\d-]+)/i) ||
                       text.match(/TEL\s*[:\s]\s*([\d-]+)/i);
    if (phoneMatch && phoneMatch[1]) profile.tel = phoneMatch[1].trim();


    // Email
    const emailMatch = text.match(/E-mel\s*[:\s]\s*([^\s\n\r*]+)/i) || 
                       text.match(/Email\s*[:\s]\s*([^\s\n\r*]+)/i);
    if (emailMatch && emailMatch[1]) profile.email = normalize(emailMatch[1], true);


    // Address - Take multi-line, exclude specific metadata fields
    const addressMatch = text.match(/Alamat\s*Tinggal\s*Semasa\s*[:\s]\s*([\s\S]+?)(?=\s*Poskod|\s*Bandar|\s*Negeri|\s*Mukim|\s*No\s*Telefon|$)/i);
    if (addressMatch && addressMatch[1]) {
      profile.alamat = normalize(addressMatch[1].replace(/\s+/g, ' '));
    }


    // Poskod
    const poskodMatch = text.match(/Poskod\s*[:\s]\s*(\d{5})/i) ||
                        text.match(/POSKOD\s*[:\s]\s*(\d{5})/i);
    if (poskodMatch && poskodMatch[1]) profile.poskod = poskodMatch[1].trim();


    // Gred
    const gredMatch = text.match(/Gred\s*Jawatan\s*(?:Semasa)?\s*[:\s]\s*(DG\d+)/i) || 
                      text.match(/\b(DG\d+)\b/i);
    if (gredMatch && gredMatch[1]) profile.gred = gredMatch[1].toUpperCase().trim();


    // Kelulusan
    const kelulusan = [];
    const academicSections = text.split(/Peringkat\s*Akademik/i);
    if (academicSections.length > 1) {
      for (let i = 1; i < academicSections.length; i++) {
        const section = academicSections[i];
        if (!section) continue;
        const instMatch = section.match(/Nama\s*Institusi\s*[:\s]\s*([^\n\r*]+)/i);
        const yearMatch = section.match(/Tahun\s*[:\s]\s*(\d{4})/i);
        const degMatch = section.match(/[:\s]\s*([^\n\r*]+)/i);

        
        if (instMatch || yearMatch) {
          kelulusan.push({
            id: `imported-a-${i}-${Date.now()}`,
            kelayakan: normalize(degMatch ? degMatch[1] : 'IJAZAH'),
            bidang: 'SILA KEMASKINI',
            institusi: normalize(instMatch && instMatch[1] ? instMatch[1] : '-'),
            tahun: yearMatch && yearMatch[1] ? yearMatch[1].trim() : '-'
          });

        }
      }
    }

    // Sejarah Perkhidmatan
    const history: any[] = [];
    const historyMatches = Array.from(text.matchAll(/Nama\s*Tempat\s*Berkhidmat\s*[:\s]\s*([^\n\r*]+)[\s\S]*?Tarikh\s*Mula\s*[:\s]\s*([\d/]+)/gi));
    let count = 0;
    for (const match of historyMatches) {
      if (count >= 10) break;
      history.push({
        id: `imported-h-${count}-${Date.now()}`,
        sekolah: normalize(match[1] || ""),
        tahun: (match[2] || "").trim().split('/').pop() || "",
        subjek: 'PEGAWAI PERKHIDMATAN PENDIDIKAN'

      });
      count++;
    }

    return {
      profile,
      kelulusan: kelulusan.length > 0 ? kelulusan : undefined,
      sejarah: history.length > 0 ? history : undefined
    };
  } catch (error: any) {
    console.error('Error parsing PDF:', error);
    throw new Error(error?.message || 'Gagal memproses fail PDF eOperasi.');
  }

}
