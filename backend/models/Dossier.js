const db = require('../config/database');

class Dossier {
  static async createTable() {
    const query = `
      CREATE TABLE IF NOT EXISTS dossiers (
        id INT AUTO_INCREMENT PRIMARY KEY,
        numero_dossier VARCHAR(50) UNIQUE NOT NULL,
        type_dossier VARCHAR(100) NOT NULL,
        description TEXT,
        informations_client JSON,
        circuit_id INT,
        borne_actuelle INT,
        statut ENUM('en_attente', 'en_cours', 'traite') DEFAULT 'en_attente',
        created_by INT,
        date_creation TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        date_modification TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (circuit_id) REFERENCES circuits(id),
        FOREIGN KEY (borne_actuelle) REFERENCES bornes(id),
        FOREIGN KEY (created_by) REFERENCES users(id)
      )
    `;
    return await db.query(query);
  }

  static async create(dossierData) {
    const { numero_dossier, type_dossier, description, informations_client, circuit_id, created_by } = dossierData;
    const query = `
      INSERT INTO dossiers (numero_dossier, type_dossier, description, informations_client, circuit_id, created_by)
      VALUES (?, ?, ?, ?, ?, ?)
    `;
    const result = await db.query(query, [numero_dossier, type_dossier, description, JSON.stringify(informations_client), circuit_id, created_by]);
    return result.insertId;
  }

  static async findById(id) {
    const query = `
      SELECT d.*, c.nom as circuit_nom, u.nom as createur_nom, u.prenom as createur_prenom
      FROM dossiers d
      LEFT JOIN circuits c ON d.circuit_id = c.id
      LEFT JOIN users u ON d.created_by = u.id
      WHERE d.id = ?
    `;
    const rows = await db.query(query, [id]);
    return rows[0];
  }

  static async findByNumero(numero) {
    const query = 'SELECT * FROM dossiers WHERE numero_dossier = ?';
    const rows = await db.query(query, [numero]);
    return rows[0];
  }

  static async findAll(filters = {}) {
    let query = `
      SELECT d.*, c.nom as circuit_nom, u.nom as createur_nom, u.prenom as createur_prenom
      FROM dossiers d
      LEFT JOIN circuits c ON d.circuit_id = c.id
      LEFT JOIN users u ON d.created_by = u.id
      WHERE 1=1
    `;
    const params = [];

    if (filters.statut) {
      query += ' AND d.statut = ?';
      params.push(filters.statut);
    }

    if (filters.type_dossier) {
      query += ' AND d.type_dossier = ?';
      params.push(filters.type_dossier);
    }

    if (filters.circuit_id) {
      query += ' AND d.circuit_id = ?';
      params.push(filters.circuit_id);
    }

    query += ' ORDER BY d.date_creation DESC';
    return await db.query(query, params);
  }

  static async update(id, dossierData) {
    const { type_dossier, description, informations_client, circuit_id, borne_actuelle, statut } = dossierData;
    const query = `
      UPDATE dossiers 
      SET type_dossier = ?, description = ?, informations_client = ?, circuit_id = ?, borne_actuelle = ?, statut = ?
      WHERE id = ?
    `;
    return await db.query(query, [type_dossier, description, JSON.stringify(informations_client), circuit_id, borne_actuelle, statut, id]);
  }

  static async updateStatut(id, statut) {
    const query = 'UPDATE dossiers SET statut = ? WHERE id = ?';
    return await db.query(query, [statut, id]);
  }

  static async updateBorneActuelle(id, borne_id) {
    const query = 'UPDATE dossiers SET borne_actuelle = ? WHERE id = ?';
    return await db.query(query, [borne_id, id]);
  }

  static async countByStatut() {
    const query = 'SELECT statut, COUNT(*) as count FROM dossiers GROUP BY statut';
    return await db.query(query);
  }

  static async getDossiersByUser(userId, userRole) {
    let query = '';
    if (userRole === 'user_accueil') {
      query = 'SELECT * FROM dossiers WHERE created_by = ? ORDER BY date_creation DESC';
      return await db.query(query, [userId]);
    } else {
      query = `
        SELECT d.* 
        FROM dossiers d
        INNER JOIN bornes b ON d.borne_actuelle = b.id
        WHERE b.user_id = ? AND d.statut = 'en_cours'
        ORDER BY d.date_modification DESC
      `;
      return await db.query(query, [userId]);
    }
  }
}

module.exports = Dossier;