async function fetchTweetsAsMap(ids, { baseUrl = "https://tweet", headers = {} } = {}) {
  const tasks = ids.map(id =>
    fetch(`${baseUrl}/${encodeURIComponent(id)}`, { headers })
      .then(r => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json();
      })
  );

  const settled = await Promise.allSettled(tasks);

  // Build { id: data | null } while keeping 1:1 with input ids
  const out = {};
  ids.forEach((id, i) => {
    const s = settled[i];
    out[id] = s.status === "fulfilled" ? s.value : null; // or attach s.reason
  });

  return out;
}

// Example
(async () => {
  const ids = ["123", "456", "789"];
  const map = await fetchTweetsAsMap(ids, {
    headers: { Authorization: "Bearer <token>" }
  });
  console.log(map);
  // { "123": {...} | null, "456": {...} | null, "789": {...} | null }
})();



import axios from "axios";

async function fetchByIds(ids, baseUrl = "https://tweet") {
  const calls = ids.map((id) => axios.get(`${baseUrl}/${encodeURIComponent(id)}`));
  const settled = await Promise.allSettled(calls);

  const dataById = {};
  const errorsById = {};

  settled.forEach((res, i) => {
    const id = ids[i];
    if (res.status === "fulfilled") dataById[id] = res.value.data;
    else errorsById[id] = res.reason; // or set dataById[id] = null
  });

  return { dataById, errorsById };
}

// usage:
// const { dataById, errorsById } = await fetchByIds(["123","456","789"]);
