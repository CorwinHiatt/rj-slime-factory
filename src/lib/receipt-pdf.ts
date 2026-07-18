import { PDFDocument, StandardFonts, rgb, PDFFont, PDFPage } from 'pdf-lib';

export interface ReceiptOrder {
  orderId: string;
  dateStr: string;
  shippingName: string;
  items: { name: string; price: number; quantity: number }[];
  subtotal: number;
  shippingCost: number;
  total: number;
  isPickup: boolean;
  shippingAddress: string;
}

// Brand palette as [r,g,b] 0-1
const PINK: [number, number, number] = [1, 0.42, 0.616];
const PURPLE: [number, number, number] = [0.545, 0.361, 0.965];
const TEAL: [number, number, number] = [0.024, 0.839, 0.627];
const DEEP = rgb(0.427, 0.231, 0.922);
const DARK = rgb(0.102, 0.102, 0.18);
const GRAY = rgb(0.42, 0.396, 0.467);
const LGRAY = rgb(0.63, 0.6, 0.69);
const TEALTX = rgb(0.024, 0.631, 0.478);
const WHITE = rgb(1, 1, 1);
const DIVIDER = rgb(0.93, 0.915, 0.96);
const DOT_COLORS = [rgb(...PINK), DEEP, rgb(...TEAL), rgb(1, 0.82, 0.4)];

const W = 384;
const M = 26;
const CONTENT_W = W - 2 * M;

function lerp(a: [number, number, number], b: [number, number, number], u: number): [number, number, number] {
  return [a[0] + (b[0] - a[0]) * u, a[1] + (b[1] - a[1]) * u, a[2] + (b[2] - a[2]) * u];
}

// ASCII-safe: StandardFonts use WinAnsi; strip anything outside it to avoid throws.
function safe(s: string): string {
  return s
    .replace(/[‘’]/g, "'")
    .replace(/[“”]/g, '"')
    .replace(/[–—]/g, '-')
    .replace(/[^\x20-\x7E]/g, '');
}

function wrap(text: string, font: PDFFont, size: number, maxW: number): string[] {
  const words = safe(text).split(/\s+/);
  const lines: string[] = [];
  let line = '';
  for (const w of words) {
    const test = line ? `${line} ${w}` : w;
    if (font.widthOfTextAtSize(test, size) > maxW && line) {
      lines.push(line);
      line = w;
    } else {
      line = test;
    }
  }
  if (line) lines.push(line);
  return lines;
}

export async function generateReceiptPdf(order: ReceiptOrder): Promise<Uint8Array> {
  const doc = await PDFDocument.create();
  const font = await doc.embedFont(StandardFonts.Helvetica);
  const bold = await doc.embedFont(StandardFonts.HelveticaBold);

  const headerH = 92;
  const rowH = 25;
  const noteSize = 9.5;
  const lineH = 13;

  const handcrafted =
    'Handcrafted just for you. River makes every order by hand himself - because he is a busy young entrepreneur, please allow about 2-4 weeks. Thanks so much for your patience!';
  const gift =
    'As one of our first 50 orders, an exclusive founder’s gift is included - our thank-you for believing in RJ Slime from day one!';
  const shipDetail = order.isPickup
    ? 'Local pickup: no shipping needed - we will email or text you to arrange a pickup time in Bend, OR once your order is ready.'
    : `Shipping to: ${order.shippingAddress}. You will get a tracking email once it ships.`;

  const noteW = CONTENT_W - 24;
  const hcLines = wrap(handcrafted, font, noteSize, noteW);
  const giftLines = wrap(gift, font, noteSize, noteW);
  const shipLines = wrap(shipDetail, font, noteSize, noteW);

  const boxH = (lines: string[]) => lines.length * lineH + 18;

  const bodyH =
    16 + 20 /* order receipt */ +
    12 + 42 /* meta */ +
    18 + 12 /* slimes label */ +
    order.items.length * rowH +
    10 + 3 * 15 /* totals */ +
    12 + 52 /* amount box */ +
    14 + boxH(hcLines) +
    9 + boxH(shipLines) +
    9 + boxH(giftLines) +
    20 + 52 /* footer */;

  const pageH = headerH + bodyH + M;
  const page: PDFPage = doc.addPage([W, pageH]);

  // ---- Header gradient band ----
  const steps = 80;
  const stepW = W / steps;
  for (let i = 0; i < steps; i++) {
    const t = i / (steps - 1);
    const col = t < 0.5 ? lerp(PINK, PURPLE, t / 0.5) : lerp(PURPLE, TEAL, (t - 0.5) / 0.5);
    page.drawRectangle({ x: i * stepW, y: pageH - headerH, width: stepW + 0.6, height: headerH, color: rgb(col[0], col[1], col[2]) });
  }
  page.drawText('RJ Slime', { x: M, y: pageH - 44, size: 26, font: bold, color: WHITE });
  page.drawText('HANDCRAFTED SLIME  -  BEND, OREGON', { x: M, y: pageH - 62, size: 7.5, font: bold, color: WHITE, opacity: 0.92 });
  // PAID pill
  const pillW = 58;
  const pillX = W - M - pillW;
  page.drawRectangle({ x: pillX, y: pageH - 46, width: pillW, height: 22, borderColor: WHITE, borderWidth: 1.2, color: WHITE, opacity: 0.18, borderOpacity: 0.6 });
  page.drawText('PAID', { x: pillX + 16, y: pageH - 40, size: 10, font: bold, color: WHITE });

  // ---- Body cursor (distance from bottom) ----
  let y = pageH - headerH - 16;
  const text = (s: string, x: number, size: number, f: PDFFont, color = DARK) =>
    page.drawText(safe(s), { x, y: y - size, size, font: f, color });
  const textAt = (s: string, x: number, yy: number, size: number, f: PDFFont, color = DARK, right = false) => {
    const str = safe(s);
    const w = right ? f.widthOfTextAtSize(str, size) : 0;
    page.drawText(str, { x: x - w, y: yy - size, size, font: f, color });
  };

  // Order Receipt title
  text('Order Receipt', M, 15, bold);
  y -= 32;

  // Meta box
  const metaTop = y;
  page.drawRectangle({ x: M, y: metaTop - 42, width: CONTENT_W, height: 42, color: rgb(0.98, 0.969, 1), borderColor: rgb(0.933, 0.906, 0.984), borderWidth: 1 });
  textAt('ORDER NO.', M + 15, metaTop - 14, 7.5, bold, LGRAY);
  textAt(order.orderId, M + 15, metaTop - 30, 12, bold, DEEP);
  textAt('DATE', W - M - 15, metaTop - 14, 7.5, bold, LGRAY, true);
  textAt(order.dateStr, W - M - 15, metaTop - 30, 12, bold, DARK, true);
  y = metaTop - 42 - 18;

  // Slimes label
  text('YOUR SLIMES', M, 8, bold, DEEP);
  y -= 12 + 6;

  // Items
  for (let i = 0; i < order.items.length; i++) {
    const it = order.items[i];
    const cy = y - rowH / 2 + 4;
    page.drawCircle({ x: M + 6, y: cy, size: 4.5, color: DOT_COLORS[i % DOT_COLORS.length] });
    textAt(it.name, M + 20, y - 5, 11.5, bold, DARK);
    textAt(`x${it.quantity}`, W - M - 66, y - 5, 9.5, font, LGRAY, true);
    textAt(`$${(it.price * it.quantity).toFixed(2)}`, W - M, y - 5, 11.5, bold, DARK, true);
    page.drawLine({ start: { x: M, y: y - rowH + 4 }, end: { x: W - M, y: y - rowH + 4 }, thickness: 0.6, color: DIVIDER });
    y -= rowH;
  }
  y -= 10;

  // Totals
  const totalRow = (label: string, value: string, valColor = DARK, valBold = true) => {
    textAt(label, M, y - 10, 10.5, font, GRAY);
    textAt(value, W - M, y - 10, 10.5, valBold ? bold : font, valColor, true);
    y -= 15;
  };
  totalRow('Subtotal', `$${order.subtotal.toFixed(2)}`);
  totalRow(
    order.isPickup ? 'Pickup' : 'Shipping',
    order.isPickup || order.shippingCost === 0 ? 'FREE' : `$${order.shippingCost.toFixed(2)}`,
    order.isPickup || order.shippingCost === 0 ? TEALTX : DARK
  );
  totalRow('Tax (Oregon - no sales tax)', '$0.00');
  y -= 12;

  // Amount paid box
  const abTop = y;
  page.drawRectangle({ x: M, y: abTop - 52, width: CONTENT_W, height: 52, color: rgb(0.961, 0.945, 1), borderColor: rgb(0.918, 0.878, 0.996), borderWidth: 1 });
  textAt('Amount Paid', M + 16, abTop - 22, 14, bold, DARK);
  textAt('PAID WITH CARD  -  VIA STRIPE', M + 16, abTop - 37, 7.5, bold, TEALTX);
  textAt(`$${order.total.toFixed(2)}`, W - M - 16, abTop - 34, 22, bold, DEEP, true);
  y = abTop - 52 - 14;

  // Note boxes
  const noteBox = (lines: string[], bg: ReturnType<typeof rgb>, border: ReturnType<typeof rgb>, txtColor: ReturnType<typeof rgb>) => {
    const h = boxH(lines);
    const boxTop = y;
    page.drawRectangle({ x: M, y: boxTop - h, width: CONTENT_W, height: h, color: bg, borderColor: border, borderWidth: 1 });
    let ly = boxTop - 15;
    for (const ln of lines) {
      page.drawText(ln, { x: M + 12, y: ly - noteSize, size: noteSize, font, color: txtColor });
      ly -= lineH;
    }
    y = boxTop - h - 9;
  };
  noteBox(hcLines, rgb(0.941, 0.992, 0.969), rgb(0.784, 0.949, 0.874), rgb(0.239, 0.361, 0.314));
  noteBox(shipLines, rgb(0.98, 0.98, 0.996), rgb(0.918, 0.914, 0.965), GRAY);
  noteBox(giftLines, rgb(1, 0.973, 0.925), rgb(0.984, 0.89, 0.69), rgb(0.573, 0.38, 0.055));

  // Footer
  y -= 11;
  page.drawLine({ start: { x: M, y }, end: { x: W - M, y }, thickness: 0.8, color: DIVIDER });
  y -= 8;
  const center = (s: string, size: number, f: PDFFont, color: ReturnType<typeof rgb>) => {
    const str = safe(s);
    const w = f.widthOfTextAtSize(str, size);
    page.drawText(str, { x: (W - w) / 2, y: y - size, size, font: f, color });
    y -= size + 5;
  };
  center('Thank you for your order!', 13, bold, DARK);
  center('rjslime.xyz', 11, bold, DEEP);
  center('Questions? hello@rjslimefactory.com  -  Bend, Oregon', 8.5, font, LGRAY);

  return doc.save();
}
