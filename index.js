const express = require('express');
const cors = require('cors');
const axios = require('axios');
const app = express();
const PORT = process.env.PORT || 3000;

// API-konstanter
const JOB_SEARCH_API = 'https://jobsearch.api.jobtechdev.se/search';
const JOB_LINKS_API = 'https://links.api.jobtechdev.se/joblinks';

// Middleware
app.use(cors());
app.use(express.json());

// Enkel test route
app.get('/', (req, res) => {
  res.json({ message: 'API fungerar!' });
});

// Hämta jobbannonser baserat på sökning
app.get('/api/jobs', async (req, res) => {
    try {
        const response = await axios.get(JOB_SEARCH_API, {
            params: req.query,
            headers: {
                'Authorization': `Bearer ${process.env.JOB_SEARCH_API_KEY}`
            }
        });
        res.json(response.data);
    } catch (error) {
        console.error('Error fetching job data:', error.message);
        res.status(500).json({ error: 'Failed to fetch job data' });
    }
});

// Hämta jobbannonser om ingen sökning sker
app.get('/api/job-links', async (req, res) => {
    try {
        const response = await axios.get(JOB_LINKS_API);
        res.json(response.data);
    } catch (error) {
        console.error('Error fetching job links:', error.message);
        res.status(500).json({ error: 'Failed to fetch job links' });
    }
});

// Starta servern
app.listen(PORT, () => {
  console.log(`Server körs på port ${PORT}`);
});