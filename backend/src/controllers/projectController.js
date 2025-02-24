const createProject = require('./createProject');
const getProjects = require('./getProjects');
const getProjectById = require('./getProjectById');
const likeProject = require('./likeProject');
const addComment = require('./addComment');
const investInProject = require('./investInProject');
const crowdfundProject = require('./crowdfundProject');

module.exports = {
  createProject,
  getProjects,
  getProjectById,
  likeProject,
  addComment,
  investInProject,
  crowdfundProject,
};