const User = require('../models/User');

async function populateProjectUser(project) {
  const user = await User.findOne({ auth0Id: project.userId }).select('username avatarUrl');
  return {
    ...project.toObject(),
    userId: user
      ? { username: user.username, avatarUrl: user.avatarUrl }
      : { username: 'Unknown User', avatarUrl: 'https://via.placeholder.com/64' },
  };
}

module.exports = { populateProjectUser };