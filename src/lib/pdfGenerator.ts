import jsPDF from 'jspdf';

type TextSegment = { text: string, bold: boolean };
type Line = TextSegment[];

/**
 * Parses basic markdown bold syntax (**text**) into segments.
 */
function parseMarkdown(text: string): TextSegment[] {
  const segments: TextSegment[] = [];
  const parts = text.split('**');
  for (let i = 0; i < parts.length; i++) {
    if (parts[i] !== undefined && parts[i] !== '') {
      segments.push({ text: parts[i], bold: i % 2 === 1 });
    }
  }
  return segments;
}

/**
 * Wraps rich text (mixed bold/normal) for canvas rendering.
 */
function wrapRichText(ctx: CanvasRenderingContext2D, text: string, maxWidth: number, normalFont: string, boldFont: string): Line[] {
  const paragraphs = text.split('\n');
  const lines: Line[] = [];

  paragraphs.forEach(para => {
    if (para.trim() === '') {
      lines.push([]); // Empty line
      return;
    }
    const segments = parseMarkdown(para);
    let currentLine: Line = [];
    let currentLineWidth = 0;

    segments.forEach(seg => {
      ctx.font = seg.bold ? boldFont : normalFont;
      const words = seg.text.split(' ');

      words.forEach((word, index) => {
        const isLastWord = index === words.length - 1;
        const wordWithSpace = word + (isLastWord ? '' : ' ');
        
        ctx.font = seg.bold ? boldFont : normalFont;
        const wordWidth = ctx.measureText(wordWithSpace).width;
        const wordWidthNoSpace = ctx.measureText(word).width;

        if (currentLineWidth + wordWidthNoSpace > maxWidth && currentLineWidth > 0) {
          lines.push(currentLine);
          currentLine = [{ text: wordWithSpace, bold: seg.bold }];
          currentLineWidth = wordWidth;
        } else {
          if (currentLine.length > 0 && currentLine[currentLine.length - 1].bold === seg.bold) {
            currentLine[currentLine.length - 1].text += wordWithSpace;
          } else {
            currentLine.push({ text: wordWithSpace, bold: seg.bold });
          }
          currentLineWidth += wordWidth;
        }
      });
    });
    if (currentLine.length > 0) {
      lines.push(currentLine);
    }
  });
  return lines;
}

/**
 * Generates a professional Asylum Statement PDF in US Letter size.
 * Uses Canvas rasterization to support complex scripts (Bengali), custom fonts, and inline bolding.
 */
export const generateAsylumPDF = async (content: string, name: string, isBengali: boolean = false) => {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'letter'
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 20;
  const contentWidth = pageWidth - (margin * 2);

  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Canvas context not available');

  // High resolution scaling for crisp text
  const scale = 3;
  const canvasWidthPx = contentWidth * 3.78 * scale; // mm to px approx
  canvas.width = canvasWidthPx;
  
  // Font settings (Size 12-15)
  const baseFontSizePt = isBengali ? 14 : 13; 
  const fontSizePx = baseFontSizePt * scale * 1.333; // pt to px conversion approx
  
  const fontFamily = isBengali 
    ? '"SolaimanLipi", "Noto Sans Bengali", "Siyam Rupali", sans-serif'
    : '"Times New Roman", Times, serif';

  const normalFont = `normal ${fontSizePx}px ${fontFamily}`;
  const boldFont = `bold ${fontSizePx}px ${fontFamily}`;

  ctx.textBaseline = 'top';

  const lines = wrapRichText(ctx, content, canvasWidthPx, normalFont, boldFont);
  const lineHeight = fontSizePx * 1.5;
  const pxToMm = 1 / (3.78 * scale);
  const maxContentHeightMm = pageHeight - 50;
  const maxLinesPerPage = Math.floor(maxContentHeightMm / (lineHeight * pxToMm));

  let currentLineIndex = 0;
  while (currentLineIndex < lines.length) {
    if (currentLineIndex > 0) doc.addPage();
    
    const linesForThisPage = lines.slice(currentLineIndex, currentLineIndex + maxLinesPerPage);
    const pageCanvas = document.createElement('canvas');
    pageCanvas.width = canvasWidthPx;
    pageCanvas.height = linesForThisPage.length * lineHeight;
    const pCtx = pageCanvas.getContext('2d')!;
    
    // Fill with white background to ensure visibility
    pCtx.fillStyle = 'white';
    pCtx.fillRect(0, 0, pageCanvas.width, pageCanvas.height);
    pCtx.textBaseline = 'top';

    linesForThisPage.forEach((line, i) => {
      let x = 0;
      line.forEach(seg => {
        pCtx.font = seg.bold ? boldFont : normalFont;
        pCtx.fillStyle = 'black';
        pCtx.fillText(seg.text, x, i * lineHeight);
        x += pCtx.measureText(seg.text).width;
      });
    });

    const imgData = pageCanvas.toDataURL('image/jpeg', 1.0);
    doc.addImage(imgData, 'JPEG', margin, 25, contentWidth, linesForThisPage.length * lineHeight * pxToMm);
    
    currentLineIndex += maxLinesPerPage;
  }

  // Add Header and Footer to all pages
  const totalPages = doc.internal.pages.length - 1;
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    
    // Header
    doc.setFont('times', 'normal');
    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text(`Asylum Statement - ${name}`, margin, 12);
    doc.setDrawColor(200);
    doc.line(margin, 15, pageWidth - margin, 15);

    // Footer
    doc.setFontSize(9);
    doc.setTextColor(150);
    doc.text(`Page ${i} of ${totalPages}`, pageWidth - margin, pageHeight - 10, { align: 'right' });
    doc.text(`Generated by Writer Badol`, margin, pageHeight - 10);
  }

  return doc;
};
