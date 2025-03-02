const express = require('express');
const {
  createProject,
  getProjects,
  getProjectById,
  likeProject,
  addComment,
  investInProject,
  crowdfundProject,
  deleteProject,
} = require('../controllers/projectController');
const { negotiateInvestment, respondToNegotiation } = require('../controllers/negotiateInvestment');
const aiAnalysis = require('../controllers/aiAnalysis');
const uploadAadhaar = require('../controllers/uploadAadhaar');

const router = express.Router();

router.post('/projects', createProject);
router.get('/projects', getProjects);
router.get('/projects/:id', getProjectById);
router.post('/posts/:id/like', likeProject);
router.post('/posts/:id/comments', addComment);
router.post('/posts/:id/invest', investInProject);
router.post('/posts/:id/crowdfund', crowdfundProject);
router.post('/ai-analysis', aiAnalysis);
router.post('/posts/:id/negotiate', negotiateInvestment);
router.post('/posts/:projectId/negotiate/:requestId/respond', respondToNegotiation);
router.delete('/posts/:id', deleteProject);
router.post('/upload-aadhaar', uploadAadhaar); // New route

module.exports = router;