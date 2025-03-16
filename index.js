const express = require('express');
const cors = require('cors');
const axios = require('axios');
const { all } = require('axios');
const app = express();
const PORT = process.env.PORT || 3000;

// API-konstanter
const JOB_SEARCH_API = 'https://jobsearch.api.jobtechdev.se/search';
const JOB_LINKS_API = 'https://links.api.jobtechdev.se/joblinks';

//https://jobsearch.api.jobtechdev.se/search?worktime-extent=947z_JGS_Uk2

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


//https://proxyserver-production-fe16.up.railway.app/api/jobs/deltid?q=deltid
app.get('/api/jobs/deltid', async (req, res) => {
    try {
        if (Object.keys(req.query).length === 0) {
            // No search parameters, use JOB_LINKS_API
            const response = await axios.get(JOB_LINKS_API);
            res.json(response.data);
        } else {
            // Search parameters exist, use JOB_SEARCH_API
            let allJobs = [];
            let page = 0;
            const limit = 100;
            let totalResults = 0;

            do {
                const response = await axios.get( JOB_LINKS_API, {
                    params: {
                        ...req.query,
                        limit,
                        offset: page * limit
                    },
                    headers: {
                        'Accept': 'application/json'
                    }
                });

                const jobLinks = response.data.hits || [];
                allJobs = allJobs.concat(jobLinks);

                if (page === 0) {
                    totalResults = response.data.total.value || 0;
                }

                page++;

            } while (allJobs.length < totalResults);

            res.json(allJobs);
        }
    } catch (error) {
        console.error('Error fetching job links:', error);
        res.status(500).json({ 
            error: 'Failed to fetch job links',
            details: error.message 
        });
    }
});


//hanterar ?q=sommar%20OR%20summer%20OR%20feriejobb
//?q=feriejobb
//?q=sommar
//?q=summer
app.get('/api/sjob/', async (req, res) => {
    try {
        if (Object.keys(req.query).length === 0) {
            const response = await axios.get(JOB_LINKS_API);
            return res.json(response.data);
        }
        
        let allJobs = [];
        const limit = 100;
        let publishedBefore = null;

        while (true) {
            const params = { ...req.query, limit };
            if (publishedBefore) {
                params['published-before'] = publishedBefore;
            }
            const response = await axios.get(JOB_SEARCH_API, {
                params,
                headers: { 'Accept': 'application/json' }
            });

            const hits = response.data.hits || [];
            if (hits.length === 0) break;

            allJobs = allJobs.concat(hits);
            // Sätt nästa "published-before" till datumet för sista träffen i batchen
            publishedBefore = hits[hits.length - 1].publication_date;

            if (hits.length < limit) break;
        }
        
        res.json(allJobs);
    } catch (error) {
        console.error('Error fetching job links:', error);
        res.status(500).json({ 
            error: 'Failed to fetch job links',
            details: error.message 
        });
    }
});

// Starta servern
app.listen(PORT, () => {
  console.log(`Server körs på port ${PORT}`);
});