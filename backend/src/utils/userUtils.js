const User = require('../models/User');

async function ensureUser(userId, name, email, userPicture) {
  let user = await User.findOne({ auth0Id: userId });

  if (!user) {
    const baseUsername = (name || 'user').replace(/\s+/g, '').toLowerCase();
    let username = baseUsername;
    let counter = 1;
    while (await User.findOne({ username })) {
      username = `${baseUsername}${counter++}`;
    }

    user = new User({
      auth0Id: userId,
      name: name || 'Unnamed User',
      email: email || null,
      avatarUrl: userPicture || 'https://via.placeholder.com/64',
      username,
    });
    await user.save();
  } else if (!user.avatarUrl && userPicture) {
    user.avatarUrl = userPicture;
    await user.save();
  }

  return user;
}

module.exports = { ensureUser };