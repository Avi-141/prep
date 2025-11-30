import { useState } from "react";
import users from "./users";

const pagination = (userList, pageNum, pageSize) => {
  const start = (pageNum - 1) * pageSize;
  const end = start + pageSize;

  const pageUsers = userList.slice(start, end);
  const totalPages = Math.ceil(userList.length / pageSize);
  return { pageUsers, totalPages };
};

export default function DataTable() {
  const columns = [
    { label: "ID", key: "id" },
    { label: "Name", key: "name" },
    { label: "Age", key: "age" },
    { label: "Occupation", key: "occupation" },
  ];
  const [message, setMessage] = useState("Data Table");
  const [pageSize, setPageSize] = useState(5);
  const [page, setPage] = useState(1);

  const { totalPages, pageUsers } = pagination(users, page, pageSize);

  return (
    <div>
      <h1>{message}</h1>
      <table>
        <thead>
          <tr>
            {columns.map(({ label, key }) => (
              <th key={key}>{label}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {pageUsers.map(({ id, name, age, occupation }) => (
            <tr key={id}>
              <td>{id}</td>
              <td>{name}</td>
              <td>{age}</td>
              <td>{occupation}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <select
        onChange={(e) => {
          setPageSize(Number(e.target.value));
          setPage(1);
        }}
      >
        <option name="show5" value={5}>
          Show 5
        </option>
        <option name="show10" value={10}>
          Show 10
        </option>
        <option name="show20" value={20}>
          Show 20
        </option>
      </select>
      <button
        onClick={() => {
          setPage(page - 1);
        }}
        disabled={page === 1}
      >
        Previous
      </button>
      <span>{`${page} of ${totalPages}`}</span>
      <button
        onClick={() => {
          setPage(page + 1);
        }}
        disabled={page === totalPages}
      >
        Next
      </button>
    </div>
  );
}
