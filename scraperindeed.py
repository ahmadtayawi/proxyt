import csv
from jobspy import scrape_jobs

jobs = scrape_jobs(
    site_name=["indeed"],
    search_term="Internship",
    #search_term='"engineering intern" software summer (java OR python OR c++) 2025 -tax -marketing'

   # google_search_term="software engineer jobs near San Francisco, CA since yesterday",
    location="Sweden",
    results_wanted=1000,
    hours_old=500,
    country_indeed='Sweden',
    
    
    # linkedin_fetch_description=True # gets more info such as description, direct job url (slower)
    # proxies=["208.195.175.46:65095", "208.195.175.45:65095", "localhost"],
)
print(f"Found {len(jobs)} jobs")
print(jobs.head())
jobs.to_csv("jobs.csv", quoting=csv.QUOTE_NONNUMERIC, escapechar="\\", index=False, encoding='utf-8-sig')


#with open('jobs.md', 'w', encoding='utf-8-sig') as f:
 #   f.write("# Job Listings\n\n")
  #  f.write(f"Found {len(jobs)} jobs.\n\n")
   # f.write(jobs.to_markdown(index=False))