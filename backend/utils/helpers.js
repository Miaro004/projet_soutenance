const generateNumeroDossier = () => {
  const timestamp = Date.now().toString();
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  return `DOS-${timestamp}-${random}`;
};

const formatDate = (date) => {
  return new Date(date).toLocaleDateString('fr-FR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

const hasAccessToDossierInfo = (userRole) => {
  return ['admin', 'user_accueil'].includes(userRole);
};

const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

module.exports = {
  generateNumeroDossier,
  formatDate,
  hasAccessToDossierInfo,
  validateEmail
};