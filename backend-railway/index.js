require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const { Pool } = require('pg');
const PORT = process.env.PORT || 8080;

const app = express();
app.use(bodyParser.json());

// Configuración de la conexión a PostgreSQL en Railway
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

// Rutas CRUD
app.get('/api/items', async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM items');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ... (las otras rutas CRUD que mostré antes)

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});