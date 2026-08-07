import { PDFDocument } from 'pdf-lib';
import * as fs from 'fs';

async function test() {
  try {
    const pdfPath = '/mnt/user-uploads/eops.PDF';
    const buffer = fs.readFileSync(pdfPath);
    
    console.log('Testing PDF with dynamic import fix...');
    
    const getPdfParser = async () => {
      const pdf = await import('pdf-parse/lib/pdf-parse.js');
      return pdf.default || pdf;
    };

    const pdfParser = await getPdfParser();
    const data = await pdfParser(buffer);
    const text = data.text;
    console.log('Text Length:', text.length);
    console.log('Preview:', text.substring(0, 500).replace(/\n/g, ' '));
    
  } catch (e) {
    console.error('ERROR:', e.message);
    console.error(e.stack);
  }
}

test();
