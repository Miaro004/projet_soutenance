const db = require('../config/database');

class Historique {
  static async createTable() {
    const query = `
      CREATE TABLE IF NOT EXISTS historiques (
        id INT AUTO_INCREMENT PRIMARY KEY,
        dossier_id INT NOT NULL,
        action VARCHAR(100) NOT NULL,
        details TEXT,
        user_id INT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (dossier_id) REFERENCES dossiers(id),
        FOREIGN KEY (user_id) REFERENCES users(id)
      )
    `;
    return await db.query(query);
  }

  static async create(historiqueData) {
    const { dossier_id, action, details, user_id } = historiqueData;
    const query = `
      INSERT INTO historiques (dossier_id, action, details, user_id)
      VALUES (?, ?, ?, ?)
    `;
    const result = await db.query(query, [dossier_id, action, details, user_id]);
    return result.insertId;
  }

  static async findByDossier(dossier_id) {
    const query = `
      SELECT h.*, u.nom, u.prenom
      FROM historiques h
      INNER JOIN users u ON h.user_id = u.id
      WHERE h.dossier_id = ?
      ORDER BY h.created_at DESC
    `;
    return await db.query(query, [dossier_id]);
  }

  static async findAll(filters = {}) {
    let query = `
      SELECT h.*, u.nom, u.prenom, d.numero_dossier
      FROM historiques h
      INNER JOIN users u ON h.user_id = u.id
      INNER JOIN dossiers d ON h.dossier_id = d.id
      WHERE 1=1
    `;
    const params = [];

    if (filters.user_id) {
      query += ' AND h.user_id = ?';
      params.push(filters.user_id);
    }

    if (filters.date_debut) {
      query += ' AND DATE(h.created_at) >= ?';
      params.push(filters.date_debut);
    }

    if (filters.date_fin) {
      query += ' AND DATE(h.created_at) <= ?';
      params.push(filters.date_fin);
    }

    query += ' ORDER BY h.created_at DESC LIMIT 100';
    return await db.query(query, params);
  }
}

module.exports = Historique;