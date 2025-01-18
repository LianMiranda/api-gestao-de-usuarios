const User = require('./user');
const Profile = require('./profile');


Profile.hasOne(User, { foreignKey: 'profileId', as: 'user' });
User.belongsTo(Profile, { foreignKey: 'profileId', as: 'profile' });

module.exports = { User, Profile };
