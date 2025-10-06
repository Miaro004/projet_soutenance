const db = require('../config/database');

class Circuit {
  static async createTable() {
    const query = `
      CREATE TABLE IF NOT EXISTS circuits (
        id INT AUTO_INCREMENT PRIMARY KEY,
        nom VARCHAR(100) NOT NULL,
        description TEXT,
        nombre_bornes INT NOT NULL,
        is_active BOOLEAN DEFAULT TRUE,
        created_by INT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (created_by) REFERENCES users(id)
      )
    `;
    return await db.query(query);
  }

  static async create(circuitData) {
    const { nom, description, nombre_bornes, created_by } = circuitData;
    const query = `
      INSERT INTO circuits (nom, description, nombre_bornes, created_by)
      VALUES (?, ?, ?, ?)
    `;
    const result = await db.query(query, [nom, description, nombre_bornes, created_by]);
    return result.insertId;
  }

  static async findAll() {
    const query = `
      SELECT c.*, u.nom as createur_nom, u.prenom as createur_prenom
      FROM circuits c
      LEFT JOIN users u ON c.created_by = u.id
      ORDER BY c.created_at DESC
    `;
    return await db.query(query);
  }

  static async findById(id) {
    const query = 'SELECT * FROM circuits WHERE id = ?';
    const rows = await db.query(query, [id]);
    return rows[0];
  }

  static async update(id, circuitData) {
    const { nom, description, nombre_bornes, is_active } = circuitData;
    const query = `
      UPDATE circuits 
      SET nom = ?, description = ?, nombre_bornes = ?, is_active = ?
      WHERE id = ?
    `;
    return await db.query(query, [nom, description, nombre_bornes, is_active, id]);
  }

  static async delete(id) {
    const query = 'UPDATE circuits SET is_active = FALSE WHERE id = ?';
    return await db.query(query, [id]);
  }
}

module.exports = Circuit;