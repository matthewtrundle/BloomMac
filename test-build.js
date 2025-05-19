const { exec } = require('child_process');

exec('cd /Users/mattrundle/Documents/Bloom && npm run build', (error, stdout, stderr) => {
  if (error) {
    console.error('Build error:', error);
    console.error('stderr:', stderr);
    return;
  }
  console.log('Build output:', stdout);
});