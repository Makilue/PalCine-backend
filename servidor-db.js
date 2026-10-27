// ============================================================
// SERVIDOR-BD.JS â€” ALECNTECNOLOGY con una BASE DE DATOS REAL
// Reemplaza registros.json por SQLite (archivo alecntecnology.db).
// Las rutas son las mismas de siempre: /, /dashboard, /datos, /registrar
// ============================================================
const http = require('http');
const fs = require('fs');

// PASO 1: cargamos el "conector" de la base de datos.
// (se instala con: npm install better-sqlite3)
const Database = require('better-sqlite3');

// PASO 2: nos CONECTAMOS. Si el archivo no existe, SQLite lo crea.
const db = new Database('alecntecnology.db');

// PASO 3: creamos la TABLA si todavÃ­a no existe.
// Una tabla es como una hoja de Excel: columnas fijas, filas de datos.
db.exec(`
  CREATE TABLE IF NOT EXISTS registros (
    id      INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre  TEXT NOT NULL,
    correo  TEXT NOT NULL,
    mensaje TEXT,
    fecha   TEXT NOT NULL
  )
`);

// PASO 4: preparamos las dos consultas (SQL) que vamos a usar.
// Los signos "?" se llenan despuÃ©s; asÃ­ evitamos la inyecciÃ³n SQL.
const insertar = db.prepare(
  'INSERT INTO registros (nombre, correo, mensaje) VALUES (?, ?, ?, ?)'
);
const listar = db.prepare('SELECT * FROM registros ORDER BY id')
;

const servidor = http.createServer((req, res) => {

  if (req.method === 'GET' && req.url === '/') {
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end(fs.readFileSync('wireframe-cine.html'));

  } else if (req.method === 'GET' && req.url === '/dashboard') {
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end(fs.readFileSync('dashboard.html'));

  // LEER (SELECT): ahora los datos vienen de la base de datos.
  } else if (req.method === 'GET' && req.url === '/datos') {
    const datos = listar.all();   // devuelve un arreglo de objetos
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(datos));

  // GUARDAR (INSERT): ahora se inserta en la tabla, no en el JSON.
  } else if (req.method === 'POST' && req.url === '/registrar') {
    let cuerpo = '';
    req.on('data', chunk => { cuerpo += chunk; });
    req.on('end', () => {
      const datos = new URLSearchParams(cuerpo);
      insertar.run(
        datos.get('nombre'),
        datos.get('correo'),
        datos.get('mensaje'),
        new Date().toISOString()
      );
      res.writeHead(200, { 'Content-Type': 'text/plain; charset=utf-8' });
      res.end('Â¡Gracias! Tu mensaje fue registrado en la base de datos.');
    });

  } else {
    res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('404 - No encontrado');
  }
});

servidor.listen(3000, () => {
  console.log('Servidor con base de datos en http://localhost:3000');
});