import { jsPDF } from 'jspdf';

// Bloom Psychology brand configuration
export const brandConfig = {
  colors: {
    primary: '#C06B93',
    primaryDark: '#A05578',
    secondary: '#F8BBD0',
    tertiary: '#F8E1E7',
    background: '#FAFAF9',
    backgroundLight: '#FFF9FA',
    text: '#4A3842',
    textLight: '#6B5B62',
    textMuted: '#9B8B92',
    white: '#FFFFFF',
    accent: '#E8A4C4',
    success: '#4CAF50',
    warning: '#FF9800',
    error: '#F44336'
  },
  fonts: {
    title: 'helvetica',
    body: 'helvetica',
    special: 'times'
  },
  spacing: {
    margin: 20,
    padding: 15,
    lineHeight: 7,
    sectionGap: 25
  }
};

export interface PDFSection {
  title?: string;
  content?: string;
  items?: string[];
  type?: 'checklist' | 'tips' | 'warning' | 'normal' | 'highlight';
  icon?: string;
}

export interface PDFDocument {
  title: string;
  subtitle?: string;
  author?: string;
  description?: string;
  sections: PDFSection[];
  footer?: string;
}

export class BloomPDFGenerator {
  private pdf: jsPDF;
  private pageWidth: number;
  private pageHeight: number;
  private margin: number;
  private currentY: number;
  private pageNumber: number;

  constructor() {
    this.pdf = new jsPDF('p', 'mm', 'a4');
    this.pageWidth = this.pdf.internal.pageSize.getWidth();
    this.pageHeight = this.pdf.internal.pageSize.getHeight();
    this.margin = brandConfig.spacing.margin;
    this.currentY = 0;
    this.pageNumber = 1;
  }

  private addNewPageIfNeeded(requiredSpace: number = 50): void {
    if (this.currentY + requiredSpace > this.pageHeight - this.margin - 20) {
      this.addFooter();
      this.pdf.addPage();
      this.pageNumber++;
      this.currentY = this.margin;
      this.addPageHeader();
    }
  }

  private addPageHeader(): void {
    // Add subtle header on subsequent pages
    if (this.pageNumber > 1) {
      this.pdf.setFillColor(248, 225, 231); // Light pink
      this.pdf.rect(0, 0, this.pageWidth, 15, 'F');
      
      this.pdf.setTextColor(200, 107, 147);
      this.pdf.setFontSize(10);
      this.pdf.setFont('helvetica', 'normal');
      this.pdf.text('Bloom Psychology North Austin', this.margin, 10);
      
      this.currentY = 25;
    }
  }

  private addFooter(): void {
    const footerY = this.pageHeight - 15;
    
    this.pdf.setTextColor(150, 150, 150);
    this.pdf.setFontSize(8);
    this.pdf.setFont('helvetica', 'normal');
    
    // Page number
    this.pdf.text(`Page ${this.pageNumber}`, this.pageWidth / 2, footerY, { align: 'center' });
    
    // Website
    this.pdf.setTextColor(200, 107, 147);
    this.pdf.text('bloompsychologynorthaustin.com', this.pageWidth - this.margin, footerY, { align: 'right' });
  }

  private drawDecorative(x: number, y: number, type: 'flower' | 'leaf' | 'heart' = 'flower'): void {
    this.pdf.setDrawColor(248, 187, 208);
    this.pdf.setLineWidth(0.5);
    
    switch (type) {
      case 'flower':
        // Simple flower design
        for (let i = 0; i < 5; i++) {
          const angle = (i * 72) * Math.PI / 180;
          const petalX = x + Math.cos(angle) * 3;
          const petalY = y + Math.sin(angle) * 3;
          this.pdf.circle(petalX, petalY, 2);
        }
        this.pdf.setFillColor(200, 107, 147);
        this.pdf.circle(x, y, 1.5, 'F');
        break;
      
      case 'leaf':
        // Simple leaf design
        this.pdf.ellipse(x, y, 3, 6, 'D');
        this.pdf.line(x, y - 6, x, y + 6);
        break;
      
      case 'heart':
        // Simple heart design
        this.pdf.setFillColor(248, 187, 208);
        this.pdf.circle(x - 1.5, y - 1, 2, 'F');
        this.pdf.circle(x + 1.5, y - 1, 2, 'F');
        this.pdf.triangle(x - 3, y, x + 3, y, x, y + 4, 'F');
        break;
    }
  }

  public generatePDF(document: PDFDocument): void {
    // Set background
    this.pdf.setFillColor(250, 250, 249);
    this.pdf.rect(0, 0, this.pageWidth, this.pageHeight, 'F');

    // Create header
    this.createHeader(document);

    // Add sections
    document.sections.forEach((section, index) => {
      this.addSection(section, index);
    });

    // Add final footer/closing
    this.addClosing(document);
    this.addFooter();
  }

  private createHeader(document: PDFDocument): void {
    // Decorative header background
    this.pdf.setFillColor(200, 107, 147);
    this.pdf.rect(0, 0, this.pageWidth, 50, 'F');
    
    // Add decorative pattern
    for (let i = 0; i < 8; i++) {
      this.drawDecorative(25 + i * 25, 45, i % 2 === 0 ? 'flower' : 'leaf');
    }

    // Title
    this.pdf.setTextColor(255, 255, 255);
    this.pdf.setFontSize(28);
    this.pdf.setFont('helvetica', 'bold');
    const titleLines = this.pdf.splitTextToSize(document.title, this.pageWidth - 40);
    this.pdf.text(titleLines, this.pageWidth / 2, 25, { align: 'center' });

    // Subtitle
    if (document.subtitle) {
      this.pdf.setFontSize(16);
      this.pdf.setFont('helvetica', 'normal');
      this.pdf.text(document.subtitle, this.pageWidth / 2, 38, { align: 'center' });
    }

    // Sub-header with description
    if (document.description) {
      this.pdf.setFillColor(248, 225, 231);
      this.pdf.rect(0, 50, this.pageWidth, 25, 'F');
      
      this.pdf.setTextColor(74, 56, 66);
      this.pdf.setFontSize(12);
      this.pdf.setFont('helvetica', 'italic');
      
      const descLines = this.pdf.splitTextToSize(document.description, this.pageWidth - 60);
      this.pdf.text(descLines, this.pageWidth / 2, 60, { align: 'center' });
      
      this.currentY = 85;
    } else {
      this.currentY = 65;
    }

    // Add decorative divider
    this.pdf.setDrawColor(248, 187, 208);
    this.pdf.setLineWidth(0.5);
    this.pdf.line(this.margin * 2, this.currentY, this.pageWidth - this.margin * 2, this.currentY);
    this.currentY += 10;
  }

  private addSection(section: PDFSection, index: number): void {
    this.addNewPageIfNeeded();

    // Section styling based on type
    switch (section.type) {
      case 'warning':
        this.addWarningSection(section);
        break;
      case 'highlight':
        this.addHighlightSection(section);
        break;
      case 'checklist':
        this.addChecklistSection(section);
        break;
      case 'tips':
        this.addTipsSection(section);
        break;
      default:
        this.addNormalSection(section);
    }

    this.currentY += brandConfig.spacing.sectionGap;
  }

  private addWarningSection(section: PDFSection): void {
    // Warning background
    this.pdf.setFillColor(255, 243, 224); // Light orange
    this.pdf.rect(this.margin - 5, this.currentY - 5, this.pageWidth - 2 * this.margin + 10, 0, 'F');
    
    // Warning icon
    this.pdf.setFillColor(255, 152, 0);
    this.pdf.circle(this.margin + 8, this.currentY + 8, 8, 'F');
    this.pdf.setTextColor(255, 255, 255);
    this.pdf.setFontSize(16);
    this.pdf.setFont('helvetica', 'bold');
    this.pdf.text('!', this.margin + 8, this.currentY + 12, { align: 'center' });

    // Title
    if (section.title) {
      this.pdf.setTextColor(74, 56, 66);
      this.pdf.setFontSize(18);
      this.pdf.setFont('helvetica', 'bold');
      this.pdf.text(section.title, this.margin + 20, this.currentY + 12);
      this.currentY += 20;
    }

    // Content
    if (section.content) {
      this.pdf.setTextColor(74, 56, 66);
      this.pdf.setFontSize(11);
      this.pdf.setFont('helvetica', 'normal');
      const lines = this.pdf.splitTextToSize(section.content, this.pageWidth - 2 * this.margin - 10);
      this.pdf.text(lines, this.margin + 5, this.currentY);
      this.currentY += lines.length * brandConfig.spacing.lineHeight;
    }

    // Items
    if (section.items) {
      section.items.forEach((item) => {
        this.addNewPageIfNeeded(15);
        
        // Warning bullet
        this.pdf.setFillColor(255, 152, 0);
        this.pdf.circle(this.margin + 10, this.currentY + 3, 2, 'F');
        
        this.pdf.setTextColor(74, 56, 66);
        this.pdf.setFontSize(11);
        const itemLines = this.pdf.splitTextToSize(item, this.pageWidth - 2 * this.margin - 20);
        this.pdf.text(itemLines, this.margin + 18, this.currentY + 5);
        this.currentY += itemLines.length * brandConfig.spacing.lineHeight + 3;
      });
    }

    // Close warning box
    const warningHeight = this.currentY - (this.pdf.getFillColor() as any).y + 10;
    this.pdf.setFillColor(255, 243, 224);
    this.pdf.rect(this.margin - 5, (this.pdf.getFillColor() as any).y - 5, this.pageWidth - 2 * this.margin + 10, warningHeight, 'F');
  }

  private addHighlightSection(section: PDFSection): void {
    // Highlight background
    this.pdf.setFillColor(248, 225, 231);
    const startY = this.currentY;
    
    // Title
    if (section.title) {
      this.pdf.setTextColor(200, 107, 147);
      this.pdf.setFontSize(18);
      this.pdf.setFont('helvetica', 'bold');
      this.pdf.text(section.title, this.pageWidth / 2, this.currentY + 10, { align: 'center' });
      this.currentY += 20;
    }

    // Content
    if (section.content) {
      this.pdf.setTextColor(74, 56, 66);
      this.pdf.setFontSize(12);
      this.pdf.setFont('helvetica', 'normal');
      const lines = this.pdf.splitTextToSize(section.content, this.pageWidth - 2 * this.margin - 20);
      this.pdf.text(lines, this.pageWidth / 2, this.currentY, { align: 'center' });
      this.currentY += lines.length * brandConfig.spacing.lineHeight + 10;
    }

    // Draw highlight box
    const highlightHeight = this.currentY - startY + 10;
    this.pdf.rect(this.margin, startY - 5, this.pageWidth - 2 * this.margin, highlightHeight, 'F');
  }

  private addChecklistSection(section: PDFSection): void {
    // Section title
    if (section.title) {
      this.pdf.setTextColor(200, 107, 147);
      this.pdf.setFontSize(18);
      this.pdf.setFont('helvetica', 'bold');
      this.pdf.text(section.title, this.margin, this.currentY);
      this.currentY += 10;
    }

    // Section description
    if (section.content) {
      this.pdf.setTextColor(139, 123, 129);
      this.pdf.setFontSize(11);
      this.pdf.setFont('helvetica', 'italic');
      const lines = this.pdf.splitTextToSize(section.content, this.pageWidth - 2 * this.margin);
      this.pdf.text(lines, this.margin, this.currentY);
      this.currentY += lines.length * brandConfig.spacing.lineHeight + 5;
    }

    // Checklist items
    if (section.items) {
      section.items.forEach((item, index) => {
        this.addNewPageIfNeeded(15);
        
        // Checkbox
        this.pdf.setDrawColor(200, 107, 147);
        this.pdf.setLineWidth(1);
        this.pdf.rect(this.margin + 5, this.currentY, 5, 5);
        
        // Item text
        this.pdf.setTextColor(74, 56, 66);
        this.pdf.setFontSize(11);
        this.pdf.setFont('helvetica', 'normal');
        const itemLines = this.pdf.splitTextToSize(item, this.pageWidth - 2 * this.margin - 20);
        this.pdf.text(itemLines, this.margin + 15, this.currentY + 4);
        this.currentY += itemLines.length * brandConfig.spacing.lineHeight + 5;
      });
    }
  }

  private addTipsSection(section: PDFSection): void {
    // Section title with icon
    if (section.title) {
      // Lightbulb icon
      this.pdf.setFillColor(255, 235, 59);
      this.pdf.circle(this.margin + 8, this.currentY + 5, 8, 'F');
      this.pdf.setTextColor(74, 56, 66);
      this.pdf.setFontSize(14);
      this.pdf.text('💡', this.margin + 5, this.currentY + 8);
      
      this.pdf.setTextColor(200, 107, 147);
      this.pdf.setFontSize(18);
      this.pdf.setFont('helvetica', 'bold');
      this.pdf.text(section.title, this.margin + 20, this.currentY + 8);
      this.currentY += 15;
    }

    // Tips items
    if (section.items) {
      section.items.forEach((item, index) => {
        this.addNewPageIfNeeded(20);
        
        // Tip box
        this.pdf.setFillColor(255, 249, 250);
        this.pdf.rect(this.margin + 5, this.currentY - 2, this.pageWidth - 2 * this.margin - 10, 0, 'F');
        
        // Tip number
        this.pdf.setFillColor(200, 107, 147);
        this.pdf.circle(this.margin + 10, this.currentY + 4, 5, 'F');
        this.pdf.setTextColor(255, 255, 255);
        this.pdf.setFontSize(10);
        this.pdf.setFont('helvetica', 'bold');
        this.pdf.text((index + 1).toString(), this.margin + 10, this.currentY + 6, { align: 'center' });
        
        // Tip text
        this.pdf.setTextColor(74, 56, 66);
        this.pdf.setFontSize(11);
        this.pdf.setFont('helvetica', 'normal');
        const itemLines = this.pdf.splitTextToSize(item, this.pageWidth - 2 * this.margin - 25);
        this.pdf.text(itemLines, this.margin + 20, this.currentY + 5);
        
        const tipHeight = itemLines.length * brandConfig.spacing.lineHeight + 8;
        this.pdf.rect(this.margin + 5, this.currentY - 2, this.pageWidth - 2 * this.margin - 10, tipHeight, 'F');
        
        this.currentY += tipHeight + 5;
      });
    }
  }

  private addNormalSection(section: PDFSection): void {
    // Section title
    if (section.title) {
      this.pdf.setTextColor(200, 107, 147);
      this.pdf.setFontSize(16);
      this.pdf.setFont('helvetica', 'bold');
      this.pdf.text(section.title, this.margin, this.currentY);
      this.currentY += 10;
    }

    // Section content
    if (section.content) {
      this.pdf.setTextColor(74, 56, 66);
      this.pdf.setFontSize(11);
      this.pdf.setFont('helvetica', 'normal');
      const lines = this.pdf.splitTextToSize(section.content, this.pageWidth - 2 * this.margin);
      this.pdf.text(lines, this.margin, this.currentY);
      this.currentY += lines.length * brandConfig.spacing.lineHeight + 5;
    }

    // Items with bullets
    if (section.items) {
      section.items.forEach((item) => {
        this.addNewPageIfNeeded(15);
        
        // Flower bullet
        this.drawDecorative(this.margin + 8, this.currentY + 3, 'flower');
        
        this.pdf.setTextColor(74, 56, 66);
        this.pdf.setFontSize(11);
        const itemLines = this.pdf.splitTextToSize(item, this.pageWidth - 2 * this.margin - 20);
        this.pdf.text(itemLines, this.margin + 18, this.currentY + 5);
        this.currentY += itemLines.length * brandConfig.spacing.lineHeight + 3;
      });
    }
  }

  private addClosing(document: PDFDocument): void {
    this.addNewPageIfNeeded(60);
    
    // Closing message box
    this.pdf.setFillColor(248, 225, 231);
    this.pdf.rect(this.margin, this.currentY, this.pageWidth - 2 * this.margin, 40, 'F');
    
    // Heart decoration
    this.drawDecorative(this.pageWidth / 2, this.currentY + 10, 'heart');
    
    this.pdf.setTextColor(74, 56, 66);
    this.pdf.setFontSize(14);
    this.pdf.setFont('helvetica', 'bold');
    this.pdf.text('Remember: You\'re Not Alone', this.pageWidth / 2, this.currentY + 20, { align: 'center' });
    
    this.pdf.setFontSize(11);
    this.pdf.setFont('helvetica', 'normal');
    this.pdf.text('We\'re here to support you every step of the way.', this.pageWidth / 2, this.currentY + 30, { align: 'center' });
    
    this.currentY += 50;
    
    // Contact info
    this.pdf.setTextColor(200, 107, 147);
    this.pdf.setFontSize(12);
    this.pdf.setFont('helvetica', 'bold');
    this.pdf.text('Bloom Psychology North Austin', this.pageWidth / 2, this.currentY, { align: 'center' });
    
    this.pdf.setTextColor(74, 56, 66);
    this.pdf.setFontSize(10);
    this.pdf.setFont('helvetica', 'normal');
    this.pdf.text('Specializing in Maternal Mental Health & Women\'s Wellness', this.pageWidth / 2, this.currentY + 7, { align: 'center' });
    this.pdf.text('bloompsychologynorthaustin.com', this.pageWidth / 2, this.currentY + 14, { align: 'center' });
    
    // Copyright
    this.currentY += 25;
    this.pdf.setTextColor(150, 150, 150);
    this.pdf.setFontSize(8);
    this.pdf.text(`© ${new Date().getFullYear()} Bloom Psychology North Austin. All rights reserved.`, this.pageWidth / 2, this.currentY, { align: 'center' });
  }

  public save(filename: string): void {
    this.pdf.save(filename);
  }
}

// Helper function to generate PDF from any resource
export function generateResourcePDF(document: PDFDocument, filename: string): void {
  const generator = new BloomPDFGenerator();
  generator.generatePDF(document);
  generator.save(filename);
}