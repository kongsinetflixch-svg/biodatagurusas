import { PDFDocument } from 'pdf-lib';
import * as pdf from 'pdf-parse';
import * as fs from 'fs';

const pdfParser = (pdf.default || pdf) as any;

async function test() {
  try {
    const pdfPath = '/mnt/user-uploads/eops.PDF';
    const buffer = fs.readFileSync(pdfPath);
    
    console.log('Testing PDF direct parsing...');
    
    // Check encryption
    const pdfDoc = await PDFDocument.load(buffer, { ignoreEncryption: false });
    console.log('Is Encrypted:', pdfDoc.isEncrypted);
    
    // Parse text
    const data = await pdfParser(buffer);
    const text = data.text;
    console.log('Text Length:', text.length);
    console.log('Preview:', text.substring(0, 500).replace(/\n/g, ' '));
    
    // Check specific patterns
    const nameMatch = text.match(/Nama\s*[:\s]\s*([^\n\r*]{3,})/i);
    console.log('Name Match:', nameMatch ? nameMatch[1].trim() : 'NONE');
    
    const icMatch = text.match(/\b(\d{6}[-\s]?\d{2}[-\s]?\d{4})\b/);
    console.log('IC Match:', icMatch ? icMatch[0] : 'NONE');
    
  } catch (e) {
    console.error('ERROR:', e.message);
  }
}

test();
