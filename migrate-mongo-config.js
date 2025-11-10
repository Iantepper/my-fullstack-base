const config = {
  mongodb: {
    url: 'mongodb://localhost:27017/mentores-platform',
    databaseName: 'mentores-platform',
    options: {}
  },
  migrationsDir: 'migrations',
  changelogCollectionName: 'changelog',
  migrationFileExtension: '.js',
  useFileHash: false,
  moduleSystem: 'esm'
};

export default config;