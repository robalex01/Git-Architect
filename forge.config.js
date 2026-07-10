const path = require('path');

module.exports = {
  packagerConfig: {
    asar: true,
    name: 'Git Architect',
    executableName: 'git-architect',
    // Icône Windows (Electron/Forge attend un .ico réel pour l'exe/l'installeur)
    icon: path.join(__dirname, 'Git Architect.ico'),
    extraResource: [],
  },
  rebuildConfig: {},
  makers: [
    {
      name: '@electron-forge/maker-squirrel',
      platforms: ['win32'],
      config: {
        name: 'git_architect',
        setupIcon: path.join(__dirname, 'Git Architect.ico'),
      },
    },
    {
      name: '@electron-forge/maker-zip',
      platforms: ['win32', 'darwin', 'linux'],
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
};
