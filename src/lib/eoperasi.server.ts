// @ts-ignore
const pdf = require('pdf-parse');


export async function parseEOperasiPDF(base64: string) {
  try {
    const buffer = Buffer.from(base64, 'base64');
    const data = await pdf(buffer);
    const text = data.text;

    // Mapping patterns for eOperasi PDF
    const profile: any = {};
    
    // Name
    const nameMatch = text.match(/Nama\s*:\s*([^\n\r*]+)/i);
    if (nameMatch) profile.nama = nameMatch[1].trim();

    // IC
    const icMatch = text.match(/No\.?\s*Kp\s*:\s*(\d+)/i);
    if (icMatch) profile.kp = icMatch[1].trim();

    // Phone
    const phoneMatch = text.match(/No\s*Telefon\s*:\s*(\d+)/i);
    if (phoneMatch) profile.tel = phoneMatch[1].trim();

    // Email
    const emailMatch = text.match(/E-mel\s*:\s*([^\s\n\r]+)/i) || text.match(/Email\s*:\s*([^\s\n\r]+)/i);
    if (emailMatch) profile.email = emailMatch[1].trim();

    // Address
    const addressMatch = text.match(/Alamat\s*Tinggal\s*Semasa\s*:\s*([^\n\r*]+)/i);
    if (addressMatch) profile.alamat = addressMatch[1].trim();

    // Poskod
    const poskodMatch = text.match(/Poskod\s*:\s*(\d{5})/i);
    if (poskodMatch) profile.poskod = poskodMatch[1].trim();

    // Gred
    const gredMatch = text.match(/Gred\s*Jawatan\s*Semasa\s*:\s*(DG\d+)/i) || text.match(/Gred\s*Jawatan\s*:\s*(DG\d+)/i);
    if (gredMatch) profile.gred = gredMatch[1].trim();

    // Kelulusan (Basic extraction)
    const academicMatch = text.match(/Nama\s*Institusi\s*:\s*([^\n\r*]+)/i);
    const yearMatch = text.match(/Tahun\s*:\s*(\d{4})/i);
    const degreeMatch = text.match(/Peringkat\s*Akademik\s*1\s*:\s*([^\n\r*]+)/i);
    
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
    throw new Error('Gagal memproses fail PDF eOperasi.');
  }
}
