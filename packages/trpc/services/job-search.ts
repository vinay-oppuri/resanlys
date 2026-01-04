export interface Job {
    id: string;
    title: string;
    company: string;
    location: string;
    description: string;
    url: string;
    source: 'adzuna' | 'rapidapi' | 'google_jobs' | 'mock';
    postedAt?: string;
    salary?: string;
}

export class JobSearchService {
    private adzunaAppId = process.env.ADZUNA_APP_ID;
    private adzunaAppKey = process.env.ADZUNA_APP_KEY;
    private rapidApiKey = process.env.RAPIDAPI_KEY;

    async searchAdzuna(query: string, location: string): Promise<Job[]> {
        if (!this.adzunaAppId || !this.adzunaAppKey) {
            console.warn("Adzuna API credentials missing. AppID:", !!this.adzunaAppId, "AppKey:", !!this.adzunaAppKey);
            return [];
        }

        try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 10000); // 10s timeout

            const url = `https://api.adzuna.com/v1/api/jobs/us/search/1?app_id=${this.adzunaAppId}&app_key=${this.adzunaAppKey}&results_per_page=10&what=${encodeURIComponent(query)}&where=${encodeURIComponent(location)}`;
            console.log(`[JobSearchService] Fetching: ${url.replace(this.adzunaAppId, '***').replace(this.adzunaAppKey, '***')}`);

            const response = await fetch(url, { signal: controller.signal });
            clearTimeout(timeoutId);

            if (!response.ok) {
                console.error(`Adzuna API Error: ${response.status} ${response.statusText}`);
                const text = await response.text();
                console.error(`Adzuna Error Body: ${text}`);
                return [];
            }

            const data = await response.json();
            console.log(`[JobSearchService] Found ${data.results?.length} results for query "${query}"`);

            return data.results.map((job: any) => ({
                id: String(job.id),
                title: job.title,
                company: job.company.display_name,
                location: job.location.display_name,
                description: job.description,
                url: job.redirect_url,
                source: 'adzuna',
                postedAt: job.created,
                salary: job.salary_min ? `$${job.salary_min} - $${job.salary_max}` : undefined
            }));
        } catch (error: any) {
            if (error.name === 'AbortError') {
                console.error("Adzuna Request Timed Out");
            } else {
                console.error("Adzuna Request Failed:", error);
            }
            return [];
        }
    }

    async searchRapidApiJSearch(query: string, location: string): Promise<Job[]> {
        if (!this.rapidApiKey) {
            console.warn("RapidAPI Request Failed: API key missing");
            return [];
        }

        try {
            const url = `https://jsearch.p.rapidapi.com/search?query=${encodeURIComponent(query)} in ${encodeURIComponent(location)}&num_pages=1`;
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'x-rapidapi-key': this.rapidApiKey,
                    'x-rapidapi-host': 'jsearch.p.rapidapi.com'
                }
            });

            if (!response.ok) {
                console.error(`RapidAPI Error: ${response.statusText}`);
                return [];
            }

            const data = await response.json();
            return (data.data || []).map((job: any) => ({
                id: job.job_id,
                title: job.job_title,
                company: job.employer_name,
                location: job.job_city ? `${job.job_city}, ${job.job_country}` : job.job_country,
                description: job.job_description,
                url: job.job_apply_link,
                source: 'rapidapi',
                postedAt: job.job_posted_at_datetime_utc,
                salary: job.job_min_salary ? `$${job.job_min_salary} - $${job.job_max_salary}` : undefined
            }));
        } catch (error) {
            console.error("RapidAPI Request Failed:", error);
            return [];
        }
    }

    getGoogleJobsUrl(query: string, location: string): string {
        const q = encodeURIComponent(`${query} jobs in ${location}`);
        return `https://www.google.com/search?q=${q}&ibp=htl;jobs`;
    }

    async searchAll(query: string, location: string): Promise<Job[]> {
        const [adzunaJobs, rapidApiJobs] = await Promise.all([
            this.searchAdzuna(query, location),
            this.searchRapidApiJSearch(query, location)
        ]);

        return [...adzunaJobs, ...rapidApiJobs];
    }
}

export const jobSearchService = new JobSearchService();
