const db = require('../config/database');

class User {
  static async createTable() {
    const query = `
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        nom VARCHAR(100) NOT NULL,
        prenom VARCHAR(100) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        role ENUM('admin', 'user_accueil', 'user_standard') NOT NULL,
        fonction VARCHAR(100) NOT NULL,
        telephone VARCHAR(20),
        photo_profil VARCHAR(255),
        is_active BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `;
    return await db.query(query);
  }

  static async create(userData) {
    const { nom, prenom, email, password, role, fonction, telephone } = userData;
    const query = `
      INSERT INTO users (nom, prenom, email, password, role, fonction, telephone)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;
    const result = await db.query(query, [nom, prenom, email, password, role, fonction, telephone]);
    return result.insertId;
  }

  static async findByEmail(email) {
    const query = 'SELECT * FROM users WHERE email = ? AND is_active = TRUE';
    const rows = await db.query(query, [email]);
    return rows[0];
  }

  static async findById(id) {
    const query = 'SELECT id, nom, prenom, email, role, fonction, telephone, photo_profil, created_at FROM users WHERE id = ? AND is_active = TRUE';
    const rows = await db.query(query, [id]);
    return rows[0];
  }

  static async findAll() {
    const query = 'SELECT id, nom, prenom, email, role, fonction, telephone, photo_profil, is_active, created_at FROM users';
    return await db.query(query);
  }

  static async update(id, userData) {
    const fields = [];
    const values = [];

    if (userData.nom !== undefined) {
      fields.push('nom = ?');
      values.push(userData.nom);
    }
    if (userData.prenom !== undefined) {
      fields.push('prenom = ?');
      values.push(userData.prenom);
    }
    if (userData.email !== undefined) {
      fields.push('email = ?');
      values.push(userData.email);
    }
    if (userData.role !== undefined) {
      fields.push('role = ?');
      values.push(userData.role);
    }
    if (userData.fonction !== undefined) {
      fields.push('fonction = ?');
      values.push(userData.fonction);
    }
    if (userData.telephone !== undefined) {
      fields.push('telephone = ?');
      values.push(userData.telephone);
    }
    if (userData.photo_profil !== undefined) {
      fields.push('photo_profil = ?');
      values.push(userData.photo_profil);
    }
    if (userData.password !== undefined) {
      fields.push('password = ?');
      values.push(userData.password);
    }
    if (userData.is_active !== undefined) {
      fields.push('is_active = ?');
      values.push(userData.is_active);
    }

    if (fields.length === 0) {
      throw new Error('No fields to update');
    }

    const query = `UPDATE users SET ${fields.join(', ')} WHERE id = ?`;
    values.push(id);

    return await db.query(query, values);
  }

  static async delete(id) {
    const query = 'UPDATE users SET is_active = FALSE WHERE id = ?';
    return await db.query(query, [id]);
  }

  static async countByRole() {
    const query = 'SELECT role, COUNT(*) as count FROM users WHERE is_active = TRUE GROUP BY role';
    return await db.query(query);
  }
}

module.exports = User;