const User = require('../models/User');

async function populateProjectUser(project) {
  const user = await User.findOne({ auth0Id: project.userId }).select('username avatarUrl');
  console.log('Populated user for project:', { projectId: project._id, user }); // Debug log
  return {
    ...project.toObject(),
    userId: user
      ? { auth0Id: project.userId, username: user.username, avatarUrl: user.avatarUrl } // Include auth0Id
      : { auth0Id: project.userId, username: 'Unknown User', avatarUrl: 'https://via.placeholder.com/64' },
  };
}

module.exports = { populateProjectUser };