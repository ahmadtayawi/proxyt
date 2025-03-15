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

// Hämta jobbannonser baserat på sökning eller om ingen sökning sker
app.get('/api/jobs', async (req, res) => {
    try {
        if (Object.keys(req.query).length === 0) {
            // No search parameters, use JOB_LINKS_API
            const response = await axios.get(JOB_LINKS_API);
            res.json(response.data);
        } else {
            // Search parameters exist, use JOB_SEARCH_API
            let allJobs = [];  // Changed from allJobLinks
            let page = 0;
            const limit = 100;
            let totalResults = 0;

            do {
                const response = await axios.get(JOB_SEARCH_API, {
                    params: {
                        ...req.query,
                        limit,
                        offset: page * limit
                    },
                    headers: {
                        'Authorization': `Bearer ${process.env.JOB_SEARCH_API_KEY}`
                    }
                });

                const jobLinks = response.data.hits || [];
                allJobs = allJobs.concat(jobLinks);  // Changed from allJobLinks

                if (page === 0) {
                    totalResults = response.data.total.value || 0;
                }

                page++;

            } while (allJobs.length < totalResults);  // Changed from allJobLinks

            const regex = /\b(intern(?:ship)?)\b/i;
            const filteredJobs = allJobs.filter(job =>  // Changed from allJobLinks
                job.headline && regex.test(job.headline)
            );

            res.json(filteredJobs);
        }
    } catch (error) {
        console.error('Error fetching job links:', error.message);
        res.status(500).json({ error: 'Failed to fetch job links' });
    }
});

// Starta servern
app.listen(PORT, () => {
  console.log(`Server körs på port ${PORT}`);
});