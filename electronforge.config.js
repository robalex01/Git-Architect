const path = require('path');

module.exports = {
  packagerConfig: {
    asar: true,
    // Windows icon for the installer/exe (Electron expects .ico for best results)
    // We'll point to an .ico next to the PNG if present.
    icon: path.join(__dirname, 'Git Architect.ico'),
  },
  rebuildConfig: {},
  makers: [
    {
      name: '@electron-forge/maker-squirrel',
      platforms: ['win32'],
    },
    {
      name: '@electron-forge/maker-zip',
      platforms: ['win32'],
    },
    {
      name: '@electron-forge/maker-deb',
      platforms: ['linux'],
    },
    {
      name: '@electron-forge/maker-dmg',
      platforms: ['darwin'],
    },
  ],
  plugins: [
    {
      name: '@electron-forge/plugin-vite',
      args: {
        build: {
          renderer: {
            entry: 'renderer/index.html',
          },
        },
      },
    },
  ],
  // Electron main entry attendu par electron-forge
  // (sinon il peut ne pas considérer l'app comme “startable”)
  mainProcess: {
    entry: 'electron/main/index.ts',
  },
  electronVersion: '32.2.0',
};




