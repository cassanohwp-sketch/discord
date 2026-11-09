const mysql = require('mysql2/promise');
const config = require('../config');

const pool = mysql.createPool({
  host: config.db.host,
  user: config.db.user,
  password: config.db.password,
  database: config.db.database,
  port: config.db.port,
  waitForConnections: true,
  connectionLimit: 10
});

// Ambil pengaturan pesan berdasarkan server dan jenis
async function ambilPengaturanPesan(idServer, jenisPesan) {
  const [rows] = await pool.execute(
    `SELECT * FROM pengaturan_pesan
     WHERE id_server = ? AND jenis_pesan = ? AND status_aktif = 1
     LIMIT 1`,
    [idServer, jenisPesan]
  );
  return rows[0] || null;
}

// Pastikan server terdaftar
async function daftarkanServer(idServer, namaServer) {
  await pool.execute(
    `INSERT INTO pengaturan_server (id_server, nama_server)
     VALUES (?, ?)
     ON DUPLICATE KEY UPDATE nama_server = VALUES(nama_server)`,
    [idServer, namaServer]
  );
}

// Ambil semua peran otomatis
async function ambilPeranOtomatis(idServer) {
  const [rows] = await pool.execute(
    `SELECT id_peran FROM peran_otomatis WHERE id_server = ?`,
    [idServer]
  );
  return rows.map(r => r.id_peran);
}

module.exports = {
  pool,
  ambilPengaturanPesan,
  daftarkanServer,
  ambilPeranOtomatis
};