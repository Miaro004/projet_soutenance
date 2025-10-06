const db = require('../config/database');

class Borne {
  static async createTable() {
    const query = `
      CREATE TABLE IF NOT EXISTS bornes (
        id INT AUTO_INCREMENT PRIMARY KEY,
        circuit_id INT NOT NULL,
        rang INT NOT NULL,
        user_id INT NOT NULL,
        conditions TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (circuit_id) REFERENCES circuits(id),
        FOREIGN KEY (user_id) REFERENCES users(id),
        UNIQUE KEY unique_circuit_rang (circuit_id, rang)
      )
    `;
    return await db.query(query);
  }

  static async create(borneData) {
    const { circuit_id, rang, user_id, conditions } = borneData;
    const query = `
      INSERT INTO bornes (circuit_id, rang, user_id, conditions)
      VALUES (?, ?, ?, ?)
    `;
    const result = await db.query(query, [circuit_id, rang, user_id, conditions]);
    return result.insertId;
  }

  static async findByCircuit(circuit_id) {
    const query = `
      SELECT b.*, u.nom, u.prenom, u.fonction, u.role
      FROM bornes b
      INNER JOIN users u ON b.user_id = u.id
      WHERE b.circuit_id = ?
      ORDER BY b.rang ASC
    `;
    return await db.query(query, [circuit_id]);
  }

  static async findByUser(user_id) {
    const query = `
      SELECT b.*, c.nom as circuit_nom
      FROM bornes b
      INNER JOIN circuits c ON b.circuit_id = c.id
      WHERE b.user_id = ? AND c.is_active = TRUE
      ORDER BY b.rang ASC
    `;
    return await db.query(query, [user_id]);
  }

  static async findById(id) {
    const query = 'SELECT * FROM bornes WHERE id = ?';
    const rows = await db.query(query, [id]);
    return rows[0];
  }

  static async update(id, borneData) {
    const { circuit_id, rang, user_id, conditions } = borneData;
    const query = `
      UPDATE bornes 
      SET circuit_id = ?, rang = ?, user_id = ?, conditions = ?
      WHERE id = ?
    `;
    return await db.query(query, [circuit_id, rang, user_id, conditions, id]);
  }

  static async delete(id) {
    const query = 'DELETE FROM bornes WHERE id = ?';
    return await db.query(query, [id]);
  }

  static async getNextBorne(circuit_id, current_rang) {
    const query = 'SELECT * FROM bornes WHERE circuit_id = ? AND rang > ? ORDER BY rang ASC LIMIT 1';
    const rows = await db.query(query, [circuit_id, current_rang]);
    return rows[0];
  }
}

module.exports = Borne;