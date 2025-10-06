const db = require('../config/database');

class Mouvement {
  static async createTable() {
    const query = `
      CREATE TABLE IF NOT EXISTS mouvements (
        id INT AUTO_INCREMENT PRIMARY KEY,
        dossier_id INT NOT NULL,
        borne_id INT NOT NULL,
        type_mouvement ENUM('arrivee', 'sortie') NOT NULL,
        user_id INT NOT NULL,
        observations TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (dossier_id) REFERENCES dossiers(id),
        FOREIGN KEY (borne_id) REFERENCES bornes(id),
        FOREIGN KEY (user_id) REFERENCES users(id)
      )
    `;
    return await db.query(query);
  }

  static async create(mouvementData) {
    const { dossier_id, borne_id, type_mouvement, user_id, observations } = mouvementData;
    const query = `
      INSERT INTO mouvements (dossier_id, borne_id, type_mouvement, user_id, observations)
      VALUES (?, ?, ?, ?, ?)
    `;
    const result = await db.query(query, [dossier_id, borne_id, type_mouvement, user_id, observations]);
    return result.insertId;
  }

  static async findByDossier(dossier_id) {
    const query = `
      SELECT m.*, u.nom, u.prenom, b.rang
      FROM mouvements m
      INNER JOIN users u ON m.user_id = u.id
      INNER JOIN bornes b ON m.borne_id = b.id
      WHERE m.dossier_id = ?
      ORDER BY m.created_at ASC
    `;
    return await db.query(query, [dossier_id]);
  }

  static async findLastMouvement(dossier_id) {
    const query = `
      SELECT m.* 
      FROM mouvements m
      WHERE m.dossier_id = ?
      ORDER BY m.created_at DESC
      LIMIT 1
    `;
    const rows = await db.query(query, [dossier_id]);
    return rows[0];
  }
}

module.exports = Mouvement;