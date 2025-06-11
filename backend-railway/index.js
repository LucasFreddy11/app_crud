require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const { Pool } = require('pg');
const cors = require('cors'); // Añadido para manejar CORS
const PORT = process.env.PORT || 8080;

const app = express();

// Middlewares
app.use(cors()); // Habilita CORS para todas las rutas
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Configuración avanzada de la conexión a PostgreSQL
const poolConfig = {
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { 
    rejectUnauthorized: false 
  } : false,
  connectionTimeoutMillis: 5000, // 5 segundos de timeout para conexión
  idleTimeoutMillis: 30000, // 30 segundos de inactividad
  max: 20 // Máximo de conexiones en el pool
};

const pool = new Pool(poolConfig);

// Manejo mejorado de errores de conexión
pool.on('error', (err) => {
  console.error('❌ Error inesperado en el pool de PostgreSQL:', err);
  process.exit(-1); // Termina la aplicación si hay error crítico
});

// Verificación de conexión mejorada
const testConnection = async () => {
  try {
    const { rows } = await pool.query('SELECT NOW() as current_time, version() as pg_version');
    console.log('✅ Conexión exitosa a PostgreSQL:');
    console.log('- Hora del servidor:', rows[0].current_time);
    console.log('- Versión de PostgreSQL:', rows[0].pg_version);
    
    // Verificar si la tabla existe
    const tableExists = await pool.query(
      `SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_name = 'items'
      )`
    );
    
    if (!tableExists.rows[0].exists) {
      console.warn('⚠️ La tabla "items" no existe en la base de datos');
    }
  } catch (err) {
    console.error('❌ Error al conectar a PostgreSQL:', err);
    throw err; // Relanza el error para manejo adicional
  }
};

// Rutas CRUD con manejo mejorado de errores
app.get('/api/items', async (req, res) => {
  try {
    console.log('📦 Obteniendo todos los items...');
    const { rows } = await pool.query('SELECT * FROM items ORDER BY id DESC');
    console.log(`✅ Encontrados ${rows.length} items`);
    res.json(rows);
  } catch (err) {
    console.error('❌ Error al obtener items:', err);
    res.status(500).json({ 
      error: 'Error al obtener items',
      details: err.message 
    });
  }
});

app.post('/api/items', async (req, res) => {
  const { name, description } = req.body;
  
  if (!name) {
    return res.status(400).json({ error: 'El campo "name" es requerido' });
  }

  try {
    console.log('➕ Creando nuevo item:', { name, description });
    const { rows } = await pool.query(
      'INSERT INTO items (name, description) VALUES ($1, $2) RETURNING *',
      [name, description]
    );
    console.log('✅ Item creado:', rows[0]);
    res.status(201).json(rows[0]);
  } catch (err) {
    console.error('❌ Error al crear item:', err);
    res.status(500).json({ 
      error: 'Error al crear item',
      details: err.message 
    });
  }
});

// Ruta de health check para Railway
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'OK',
    timestamp: new Date().toISOString()
  });
});

// Iniciar servidor después de verificar la conexión a la BD
const startServer = async () => {
  try {
    await testConnection();
    app.listen(PORT, () => {
      console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
      console.log(`🔗 Endpoints disponibles:`);
      console.log(`- GET    /api/items`);
      console.log(`- POST   /api/items`);
      console.log(`- GET    /health`);
    });
  } catch (err) {
    console.error('⛔ No se pudo iniciar el servidor debido a errores de base de datos');
    process.exit(1);
  }
};

startServer();

// Manejo de cierre elegante
process.on('SIGTERM', () => {
  console.log('🛑 Recibido SIGTERM. Cerrando pool de PostgreSQL...');
  pool.end().then(() => {
    console.log('✅ Pool de PostgreSQL cerrado');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('🛑 Recibido SIGINT. Cerrando servidor...');
  pool.end().then(() => {
    console.log('✅ Pool de PostgreSQL cerrado');
    process.exit(0);
  });
});