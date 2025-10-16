

/*

Build a job board that displays the latest job postings fetched from the Hacker News API, 
with each posting displaying the job title, poster, and date posted.

*/

import { useState, useEffect, useRef } from "react";

const PAGE_SIZE = 6;

const JobList = ({ jobs }) => {
  const divStyle = {
    border: "1px solid black",
    borderRadius: "2px",
    padding: "10px",
    margin: "10px 0",
  };
  return jobs.length ? (
    jobs.map((job) => (
      <div key={job.id} style={divStyle}>
        <h4>{job?.title}</h4>
        <span style={{ fontSize: 14 }}>{`By ${job.by}`}</span>
      </div>
    ))
  ) : (
    <p>No jobs available</p>
  );
};

export default function App() {
  const [fetchingJobDetails, setFetchingJobDetails] = useState(false);
  const [page, setPage] = useState(0);
  const [jobIds, setJobIds] = useState(null);
  const [jobs, setJobs] = useState([]);

  // cache all IDs once
  const allIdsRef = useRef(null);
  // track pages fetched (prevents accidental duplicate merges)
  const fetchedPages = useRef(new Set());

  async function fetchJobIds(currPage, signal) {
    if (!allIdsRef.current) {
      const res = await fetch(
        "https://hacker-news.firebaseio.com/v0/jobstories.json",
        { signal },
      );
      const ids = await res.json();
      if (signal.aborted) return null; // bail if aborted while parsing
      allIdsRef.current = ids;
      setJobIds(ids);
    }
    const ids = allIdsRef.current || [];
    const start = currPage * PAGE_SIZE;
    return ids.slice(start, start + PAGE_SIZE);
  }

  async function fetchDetailsForJobIds(ids, signal) {
    const reqs = ids.map((id) =>
      fetch(`https://hacker-news.firebaseio.com/v0/item/${id}.json`, {
        signal,
      }).then((r) => r.json()),
    );
    return Promise.all(reqs);
  }

  async function fetchJobs(currPage, signal) {
    // guard: if we already fetched this page, skip
    if (fetchedPages.current.has(currPage)) return;

    setFetchingJobDetails(true);
    try {
      const pageIds = await fetchJobIds(currPage, signal);
      if (!pageIds || signal.aborted || pageIds.length === 0) return;

      const pageJobs = await fetchDetailsForJobIds(pageIds, signal);
      if (signal.aborted) return;

      // merge + dedupe by id
      setJobs((prev) => {
        const merged = [...prev, ...pageJobs];
        const seen = new Set();
        return merged.filter(
          (j) => j && j.id && !seen.has(j.id) && seen.add(j.id),
        );
      });

      fetchedPages.current.add(currPage);
    } catch (e) {
      // Ignore cancellation; surface other errors
      if (e && e.name !== "AbortError") {
        console.error(e);
      }
    } finally {
      // safe even after abort
      setFetchingJobDetails(false);
    }
  }

  useEffect(() => {
    const ac = new AbortController();
    fetchJobs(page, ac.signal);
    return () => {
      ac.abort();
    };
  }, [page]);

  return (
    <div>
      <h1 className="title">Hacker News Jobs Board</h1>
      {jobIds === null ? (
        <p className="loading">Loading...</p>
      ) : (
        <>
          <JobList jobs={jobs} />
          {jobs.length > 0 && page * PAGE_SIZE + PAGE_SIZE < jobIds.length && (
            <button
              type="button"
              onClick={() => setPage((p) => p + 1)}
              disabled={fetchingJobDetails}
            >
              {fetchingJobDetails ? "Loading.." : "Load Jobs"}
            </button>
          )}
        </>
      )}
    </div>
  );
}



/*

const ac = new AbortController();

try {
  const res = await fetch(url, { signal: ac.signal });
  const data = await res.json();
} catch (e) {
  if (e.name === "AbortError") {
    // fetch was cancelled; safe to ignore
  } else {
    throw e; // real error
  }
}

// later (e.g., effect cleanup)
ac.abort("component unmounted");

*/

// Cleanup on unmount/remount (StrictMode): Abort in useEffect cleanup to avoid setting state for a component that’s gone.
// Prevent duplicates/races: Abort previous request when starting a new one (e.g., on debounced search).
// Best practices: Always pass { signal } to cancellable APIs (fetch, some DB libs, etc.).
// In try/catch, ignore only AbortError. Log/throw others.
// Use a functional state updater after fetch resolves; never update state if signal.aborted is true