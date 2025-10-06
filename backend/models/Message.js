const db = require('../config/database');

class Message {
  static async createTable() {
    const query = `
      CREATE TABLE IF NOT EXISTS messages (
        id INT AUTO_INCREMENT PRIMARY KEY,
        expediteur_id INT NOT NULL,
        destinataire_id INT NOT NULL,
        sujet VARCHAR(255),
        contenu TEXT NOT NULL,
        lu BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (expediteur_id) REFERENCES users(id),
        FOREIGN KEY (destinataire_id) REFERENCES users(id)
      )
    `;
    return await db.query(query);
  }

  static async create(messageData) {
    const { expediteur_id, destinataire_id, sujet, contenu } = messageData;
    const query = `
      INSERT INTO messages (expediteur_id, destinataire_id, sujet, contenu)
      VALUES (?, ?, ?, ?)
    `;
    const result = await db.query(query, [expediteur_id, destinataire_id, sujet, contenu]);
    return result.insertId;
  }

  static async findByUser(user_id) {
    const query = `
      SELECT m.*, 
        exp.nom as exp_nom, exp.prenom as exp_prenom,
        dest.nom as dest_nom, dest.prenom as dest_prenom
      FROM messages m
      INNER JOIN users exp ON m.expediteur_id = exp.id
      INNER JOIN users dest ON m.destinataire_id = dest.id
      WHERE m.expediteur_id = ? OR m.destinataire_id = ?
      ORDER BY m.created_at DESC
    `;
    return await db.query(query, [user_id, user_id]);
  }

  static async findConversation(user1_id, user2_id) {
    const query = `
      SELECT m.*,
        exp.nom as exp_nom, exp.prenom as exp_prenom,
        dest.nom as dest_nom, dest.prenom as dest_prenom
      FROM messages m
      INNER JOIN users exp ON m.expediteur_id = exp.id
      INNER JOIN users dest ON m.destinataire_id = dest.id
      WHERE (m.expediteur_id = ? AND m.destinataire_id = ?)
         OR (m.expediteur_id = ? AND m.destinataire_id = ?)
      ORDER BY m.created_at ASC
    `;
    return await db.query(query, [user1_id, user2_id, user2_id, user1_id]);
  }

  static async markAsLu(id) {
    const query = 'UPDATE messages SET lu = TRUE WHERE id = ?';
    return await db.query(query, [id]);
  }

  static async countUnread(user_id) {
    const query = 'SELECT COUNT(*) as count FROM messages WHERE destinataire_id = ? AND lu = FALSE';
    const rows = await db.query(query, [user_id]);
    return rows[0].count;
  }
}

module.exports = Message;