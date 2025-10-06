-- Création de la base de données
CREATE DATABASE IF NOT EXISTS sged_mahajanga CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE sged_mahajanga;

-- Table des utilisateurs
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
);

-- Table des circuits
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
);

-- Table des bornes
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
);

-- Table des dossiers
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
);

-- Table des mouvements
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
);

-- Table de l'historique
CREATE TABLE IF NOT EXISTS historiques (
    id INT AUTO_INCREMENT PRIMARY KEY,
    dossier_id INT NOT NULL,
    action VARCHAR(100) NOT NULL,
    details TEXT,
    user_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (dossier_id) REFERENCES dossiers(id),
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Table des messages
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
);

-- Table des notifications
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
);
