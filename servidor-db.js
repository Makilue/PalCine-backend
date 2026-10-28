// ============================================================
// SERVIDOR-DB.JS - PALCINE con base de datos SQLite
// Rutas: /, /dashboard, /datos, /registrar y archivos estáticos
// ============================================================
const http = require('http');
const fs = require('fs');
const path = require('path');
const Database = require('better-sqlite3');

//tipos de archivo que el servidor puede entregar (css, imágenes, videos)
const tiposArchivo = {
  '.css': 'text/css; charset=utf-8',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.gif': 'image/gif',
  '.webp': 'image/webp',
  '.svg': 'image/svg+xml',
  '.mp4': 'video/mp4'
};

//conexión a la base de datos (si el archivo no existe, se crea)
const db = new Database('palcine.db');

//tabla de registros
db.exec(`
  CREATE TABLE IF NOT EXISTS registros (
    id       INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre   TEXT NOT NULL,
    correo   TEXT NOT NULL,
    pelicula TEXT NOT NULL,
    fecha    TEXT NOT NULL
  )
`);

//consultas preparadas (los "?" se llenan después, evita inyección SQL)
const insertar = db.prepare(
  'INSERT INTO registros (nombre, correo, pelicula, fecha) VALUES (?, ?, ?, ?)'
);
const listar = db.prepare('SELECT * FROM registros ORDER BY id');

const servidor = http.createServer((req, res) => {

  //pagina principal
  if (req.method === 'GET' && req.url === '/') {
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end(fs.readFileSync(path.join(__dirname, 'wireframe-cine.html')));

  //dashboard
  } else if (req.method === 'GET' && req.url === '/dashboard') {
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end(fs.readFileSync(path.join(__dirname, 'dashboard.html')));

  //LEER (SELECT): los datos vienen de la base de datos
  } else if (req.method === 'GET' && req.url === '/datos') {
    const datos = listar.all();
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(datos));

  //GUARDAR (INSERT): se inserta en la tabla
  } else if (req.method === 'POST' && req.url === '/registrar') {
    let cuerpo = '';
    req.on('data', chunk => { cuerpo += chunk; });
    req.on('end', () => {
      const datos = new URLSearchParams(cuerpo);
      insertar.run(
        datos.get('nombre'),
        datos.get('correo'),
        datos.get('pelicula'),
        new Date().toISOString()
      );
      //después de guardar, vuelve a la página principal
      res.writeHead(302, { 'Location': '/' });
      res.end();
    });

  //ARCHIVOS ESTÁTICOS: css, imágenes y videos de la misma carpeta
  } else if (req.method === 'GET') {
    const nombreArchivo = path.basename(decodeURIComponent(req.url.split('?')[0]));
    const ruta = path.join(__dirname, nombreArchivo);
    const tipo = tiposArchivo[path.extname(nombreArchivo).toLowerCase()];

    if (tipo && fs.existsSync(ruta)) {
      res.writeHead(200, { 'Content-Type': tipo });
      res.end(fs.readFileSync(ruta));
    } else {
      res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
      res.end('404 - No encontrado');
    }

  //cualquier otra cosa
  } else {
    res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('404 - No encontrado');
  }
});

servidor.listen(3000, () => {
  console.log('Servidor con base de datos en http://localhost:3000');
});