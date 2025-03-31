module.exports = {
  ci: {
    collect: {
      startServerCommand: 'npm run start',
      url: ['http://localhost:3000']
    },
    assert: {
      preset: 'lighthouse:recommended'
    }
  }
};
