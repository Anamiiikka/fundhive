const express = require('express');
const { createProject, getProjects, getProjectById, likeProject, addComment, investInProject, crowdfundProject } = require('../controllers/projectController');

const router = express.Router();

router.post('/projects', createProject);
router.get('/projects', getProjects);
router.get('/projects/:id', getProjectById);
router.post('/posts/:id/like', likeProject);
router.post('/posts/:id/comments', addComment);
router.post('/posts/:id/invest', investInProject);
router.post('/posts/:id/crowdfund', crowdfundProject);

module.exports = router;