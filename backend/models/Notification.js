const db = require('../config/database');

class Notification {
  static async createTable() {
    const query = `
      CREATE TABLE IF NOT EXISTS notifications (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        type VARCHAR(50) NOT NULL,
        titre VARCHAR(255) NOT NULL,
        message TEXT NOT NULL,
        lien VARCHAR(255),
        lu BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id)
      )
    `;
    return await db.query(query);
  }

  static async create(notificationData) {
    const { user_id, type, titre, message, lien } = notificationData;
    const query = `
      INSERT INTO notifications (user_id, type, titre, message, lien)
      VALUES (?, ?, ?, ?, ?)
    `;
    const result = await db.query(query, [user_id, type, titre, message, lien]);
    return result.insertId;
  }

  static async findByUser(user_id) {
    const query = `
      SELECT * FROM notifications 
      WHERE user_id = ? 
      ORDER BY created_at DESC 
      LIMIT 50
    `;
    return await db.query(query, [user_id]);
  }

  static async markAsLu(id) {
    const query = 'UPDATE notifications SET lu = TRUE WHERE id = ?';
    return await db.query(query, [id]);
  }

  static async markAllAsLu(user_id) {
    const query = 'UPDATE notifications SET lu = TRUE WHERE user_id = ? AND lu = FALSE';
    return await db.query(query, [user_id]);
  }

  static async countUnread(user_id) {
    const query = 'SELECT COUNT(*) as count FROM notifications WHERE user_id = ? AND lu = FALSE';
    const rows = await db.query(query, [user_id]);
    return rows[0].count;
  }
}

module.exports = Notification;