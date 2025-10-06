const validateUser = (req, res, next) => {
  const { nom, prenom, email, password, role, fonction } = req.body;

  if (!nom || !prenom || !email || !password || !role || !fonction) {
    return res.status(400).json({ message: 'Tous les champs obligatoires doivent être remplis.' });
  }

  if (!['admin', 'user_accueil', 'user_standard'].includes(role)) {
    return res.status(400).json({ message: 'Rôle invalide.' });
  }

  next();
};

const validateDossier = (req, res, next) => {
  const { numero_dossier, type_dossier, circuit_id } = req.body;

  if (!numero_dossier || !type_dossier || !circuit_id) {
    return res.status(400).json({ message: 'Numéro de dossier, type et circuit sont obligatoires.' });
  }

  next();
};

const validateCircuit = (req, res, next) => {
  const { nom, nombre_bornes } = req.body;

  if (!nom || !nombre_bornes) {
    return res.status(400).json({ message: 'Nom et nombre de bornes sont obligatoires.' });
  }

  if (nombre_bornes < 2) {
    return res.status(400).json({ message: 'Un circuit doit avoir au moins 2 bornes.' });
  }

  next();
};

const validateBorne = (req, res, next) => {
  const { circuit_id, rang, user_id } = req.body;

  if (!circuit_id || !rang || !user_id) {
    return res.status(400).json({ message: 'Circuit, rang et utilisateur sont obligatoires.' });
  }

  next();
};

module.exports = {
  validateUser,
  validateDossier,
  validateCircuit,
  validateBorne
};