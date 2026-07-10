const fs = require('fs');
const path = require('path');
const sharp = require('sharp');
const pngToIco = require('png-to-ico');

const SIZES = [16, 24, 32, 48, 64, 128, 256];

(async () => {
  const input = path.join(process.cwd(), 'Git Architect.png');
  const outIco = path.join(process.cwd(), 'Git Architect.ico');
  const outPreviewPng = path.join(process.cwd(), 'Git Architect.ico.png');

  if (!fs.existsSync(input)) {
    console.error('Missing input:', input);
    process.exit(1);
  }

  // Recadrer sur un canevas carré transparent pour éviter toute déformation
  // (le logo source n'est pas carré).
  const meta = await sharp(input).metadata();
  const side = Math.max(meta.width, meta.height);

  const squareBuffer = await sharp(input)
    .resize(side, side, {
      fit: 'contain',
      background: { r: 0, g: 0, b: 0, alpha: 0 },
      position: 'center',
    })
    .png()
    .toBuffer();

  // Générer chaque résolution requise puis les empaqueter en un vrai .ico
  // multi-résolution via png-to-ico (sharp ne sait pas écrire de .ico).
  const buffers = await Promise.all(
    SIZES.map((size) =>
      sharp(squareBuffer)
        .resize(size, size, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
        .png()
        .toBuffer()
    )
  );

  const icoBuffer = await pngToIco(buffers);
  fs.writeFileSync(outIco, icoBuffer);

  // Aperçu PNG 256x256 (pratique pour la doc / le README), pas utilisé au build.
  await sharp(squareBuffer).resize(256, 256).toFile(outPreviewPng);

  console.log('ICO written:', outIco);
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
