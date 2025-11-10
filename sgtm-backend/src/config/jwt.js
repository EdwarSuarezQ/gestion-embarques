module.exports = {
  secret: process.env.JWT_SECRET || 'secret_key_change_in_production',
  expiresIn: process.env.JWT_EXPIRE || '7d',
  refreshSecret: process.env.JWT_REFRESH_SECRET || 'refresh_secret_key_change_in_production',
  refreshExpiresIn: process.env.JWT_REFRESH_EXPIRE || '30d'
};

