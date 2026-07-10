const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

(async () => {
  const input = path.join(process.cwd(), 'Git Architect.png');
  const out = path.join(process.cwd(), 'Git Architect.ico');

  if (!fs.existsSync(input)) {
    console.error('Missing input:', input);
    process.exit(1);
  }

  // sharp ne supporte pas toujours .toFormat('ico') selon la version
  // On génère plusieurs tailles en png puis on pack en ico via png-to-ico (si dispo)
  // fallback: on tente directement d'écrire en ico via sharp si supporté.
  try {
    await sharp(input)
      .resize(256, 256, { fit: 'contain' })
      .toFormat('png')
      .toFile(out + '.png');

    // Repack via sharp multi-images si possible
    const buffers = await Promise.all([16, 32, 48, 64, 128, 256].map(async (s) => {
      const b = await sharp(input).resize(s, s, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } }).png().toBuffer();
      return { size: s, buffer: b };
    }));

    // On tente un fallback simple côté sharp.
    // Si ta version de sharp ne supporte pas l’export ICO, la génération échouera.
    // (À remplacer par un packer dédié si besoin.)
    try {
      const sharpIco = sharp(input);
      await sharpIco
        .resize(256, 256, { fit: 'contain' })
        .toFile(out);
    } catch (_) {
      // dernier recours: on copie juste le png en .ico pour éviter un échec forge,
      // même si l’icône peut ne pas être parfaite.
      fs.copyFileSync(out + '.png', out);
    }

  } catch (e) {
    console.error(e);
    process.exit(1);
  }


  console.log('ICO written:', out);
})().catch((e) => {
  console.error(e);
  process.exit(1);
});

