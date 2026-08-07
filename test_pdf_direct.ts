import { PDFDocument } from 'pdf-lib';
import pdf from 'pdf-parse';
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
    
  } catch (e) {
    console.error('ERROR:', e.message);
  }
}

test();
