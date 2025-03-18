from flask import Flask, jsonify
from flask_cors import CORS
import csv
from jobspy import scrape_jobs

app = Flask(__name__)
CORS(app)  # Aktivera CORS

# Hämta jobb från Indeed
jobs = scrape_jobs(
    site_name=["indeed"],
    search_term="Internship",
    location="Sweden",
    results_wanted=1000,
    hours_old=500,
    country_indeed='Sweden',
)

@app.route('/api/ijobs', methods=['GET'])
def get_jobs():
    data = jobs.to_dict(orient="records")
    return jsonify(data)

if __name__ == '__main__':
    app.run(debug=True, port=5000)
#http://localhost:5000/api/jobs