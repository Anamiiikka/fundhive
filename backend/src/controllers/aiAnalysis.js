const Groq = require('groq-sdk');
const dotenv = require('dotenv');

dotenv.config();

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

async function aiAnalysis(req, res) {
  try {
    const { prompt } = req.body;

    if (!prompt) {
      return res.status(400).json({ message: 'Prompt is required' });
    }

    const chatCompletion = await groq.chat.completions.create({
      messages: [{ role: 'user', content: prompt }],
      model: 'llama-3.3-70b-versatile',
      temperature: 1,
      max_completion_tokens: 1024,
      top_p: 1,
      stream: false,
      stop: null,
    });

    const rawResponse = chatCompletion.choices[0].message.content;

    // Parse the structured response
    const lines = rawResponse.split('\n').map(line => line.trim()).filter(line => line);
    let score = 0;
    let report = [];
    let inAnalysisSection = false;

    for (const line of lines) {
      if (line.startsWith('Business Analysis Score:')) {
        const scoreMatch = line.match(/Business Analysis Score:\s*(\d+)/);
        score = scoreMatch ? parseInt(scoreMatch[1], 10) : 0;
      } else if (line.startsWith('Analysis:')) {
        inAnalysisSection = true;
      } else if (inAnalysisSection && line.startsWith('-')) {
        report.push(line.replace('-', '').trim());
      }
    }

    if (score < 0 || score > 100) {
      throw new Error('Invalid score received from AI');
    }
    if (report.length === 0) {
      report = ['No detailed analysis provided by AI.'];
    }

    res.status(200).json({ score, report });
  } catch (error) {
    console.error('Error fetching AI analysis:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
}

module.exports = aiAnalysis;