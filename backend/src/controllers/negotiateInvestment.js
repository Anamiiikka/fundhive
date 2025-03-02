const Project = require('../models/Project');

async function negotiateInvestment(req, res) {
    try {
      const { investorId, proposedAmount, proposedEquity } = req.body;
      const projectId = req.params.id;
  
      console.log('Received negotiation request:', { projectId, investorId, proposedAmount, proposedEquity });
  
      if (!projectId) {
        return res.status(400).json({ message: 'Project ID is required' });
      }
  
      const project = await Project.findById(projectId);
      if (!project) return res.status(404).json({ message: 'Project not found' });
  
      const negotiationRequest = {
        investorId,
        proposedAmount: Number(proposedAmount),
        proposedEquity: Number(proposedEquity),
      };
  
      project.negotiationRequests.push(negotiationRequest);
      await project.save();
  
      console.log('Negotiation request saved:', negotiationRequest);
  
      res.status(201).json({ message: 'Negotiation request sent', negotiationRequest });
    } catch (error) {
      console.error('Error negotiating investment:', error);
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  }

async function respondToNegotiation(req, res) {
  try {
    const { projectId, requestId } = req.params;
    const { status } = req.body;

    const project = await Project.findById(projectId);
    if (!project) return res.status(404).json({ message: 'Project not found' });

    const request = project.negotiationRequests.id(requestId);
    if (!request) return res.status(404).json({ message: 'Negotiation request not found' });

    if (!['accepted', 'rejected'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    request.status = status;
    if (status === 'accepted') {
      project.currentFunding += request.proposedAmount;
    }

    await project.save();
    res.status(200).json({ message: `Negotiation request ${status}`, project });
  } catch (error) {
    console.error('Error responding to negotiation:', error);
    res.status(500).json({ message: 'Server error' });
  }
}

module.exports = { negotiateInvestment, respondToNegotiation };