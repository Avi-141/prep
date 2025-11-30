import { useState, useEffect } from "react";

const pgSize = 6;

function JobPosting({ job }) {
  const { by, url, time, title } = job;
  console.log(by, url, title);
  return (
    <div className="post">
      <h2 className="post__title">
        {url ? (
          <a href={url} target="_blank" rel="noopener">
            {title}
          </a>
        ) : (
          title
        )}
      </h2>
      <span>
        By {by}, at: {new Date(time * 1000).toLocaleString()}
      </span>
    </div>
  );
}
export default function App() {
  const [message, setMessage] = useState("Hello World!");
  // fetch job id list
  // for each id fetch curr page job details
  // fetch more when button is pressed

  const [page, setPage] = useState(0);
  const [jobIds, setJobIds] = useState(null);
  const [jobDetails, setJobDetails] = useState([]);
  const [fetchingJobDetails, setFetchingJobDetails] = useState(false);

  useEffect(() => {
    fetchJobDetails(page);
    //console.log(jobDetails)
  }, [page]);

  function sliceJobsForPage(currPage, currIds) {
    const start = currPage * pgSize;
    const end = start + pgSize;
    return currIds.slice(start, end);
  }
  async function fetchJobsIds(currPage) {
    let currJobIds = jobIds;
    if (!currJobIds) {
      const res = await fetch(
        "https://hacker-news.firebaseio.com/v0/jobstories.json",
      );
      currJobIds = await res.json();
      //console.log(currJobIds);
      setJobIds(currJobIds);
    }

    return sliceJobsForPage(currPage, currJobIds);
  }

  async function fetchJobDetails(currPage) {
    const pgJobIds = await fetchJobsIds(currPage);
    setFetchingJobDetails(true);

    const pageJobDetails = await Promise.all(
      pgJobIds.map(async (id) => {
        const res = await fetch(
          `https://hacker-news.firebaseio.com/v0/item/${id}.json`,
        );
        return res.json();
      }),
    );

    setFetchingJobDetails(false);
    setJobDetails([...jobDetails, ...pageJobDetails]);
    // https://hacker-news.firebaseio.com/v0/item/{id}.json
  }

  const hasMore = page * pgSize + pgSize < jobIds?.length;
  return (
    <div>
      {jobIds === null ? (
        <span>Loading...</span>
      ) : (
        <div>
          <div className="jobs">
            {jobDetails.map((job) => (
              <JobPosting key={job.id} job={job} />
            ))}
          </div>
          {fetchingJobDetails && <p>Loading jobs…</p>}
          {hasMore && !fetchingJobDetails && (
            <button onClick={() => setPage((p) => p + 1)}>Load More</button>
          )}
        </div>
      )}
    </div>
  );
}


/*

body {
  font-family: sans-serif;
}

.post {
  border: 1px solid black;
  border-radius: 4px;
  margin: 10px;
  padding: 10px;
  display: grid;
}
.post__title {
  font-size: 16px;
  font-weight: bold;
  margin-top: 0;
}
*/