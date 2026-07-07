const fs = require('fs');
const path = require('path');

const redirectsFile = path.join(__dirname, '../redirects.json');
if (!fs.existsSync(redirectsFile)) {
  console.log('No redirects.json found. Skipping redirect generation.');
  process.exit(0);
}

const redirects = JSON.parse(fs.readFileSync(redirectsFile, 'utf8'));

for (const [source, destination] of Object.entries(redirects)) {
  // Remove leading slashes for safe path joining
  const cleanSource = source.replace(/^\/+/, '');
  const targetDir = path.join(__dirname, '..', cleanSource);
  
  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
  }

  const htmlContent = `<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <title>Redirecting...</title>
    <meta http-equiv="refresh" content="0; url=${destination}">
    <link rel="canonical" href="${destination}">
  </head>
  <body>
    <script>
      window.location.replace("${destination}");
    </script>
    <p>If you are not redirected automatically, follow this <a href="${destination}">link</a>.</p>
  </body>
</html>`;

  fs.writeFileSync(path.join(targetDir, 'index.html'), htmlContent, 'utf8');
  console.log(`Created redirect: /${cleanSource} -> ${destination}`);
}
