import React, {useState} from 'react'
/*
Note: This is a follow up to the Data Table II question, you should complete that question first before attempting this question.

In Data Table II, we built a users data table that displays users in a paginated format and allows for sorting rows by specific columns in both ascending and descending order.

However, the DataTable component is tightly coupled to the user data it is meant to be rendered and cannot be used for other types of data.

Generalize the component to take in the data and any necessary configuration so that the DataTable component can render any kinds of data.

Requirements
The DataTable component should not contain any logic that is specific to users.
Modify the DataTable component to take in any props/attributes necessary to be generalized.
The appearance and functionality of the end result should remain – it should look the same and still allow for pagination and sorting.
To assist in your testing, another data set (src/data/houses.json) is being provided for you to test your generalized component with.

Hint: Have a look at TanStack Table to get a sense of the configuration approach and available options for production-ready data table libraries.
*/

/*
const columns = [
  {
    label: 'Name',
    key: 'name',
    renderCell: (row) => row.name,
    comparator: (a, b, direction) =>
      direction === 'asc'
        ? a.name.localeCompare(b.name)
        : b.name.localeCompare(a.name),
  },
  {
    label: 'Age',
    key: 'age',
    renderCell: (row) => row.age,
    comparator: (a, b, direction) =>
      direction === 'asc' ? a.age - b.age : b.age - a.age,
  },
];
*/

function sortData(data, columns, field, direction){
  const dataClone = data.slice()
  const col = columns.find((col)=> col.key === field)
  const comparator = col && col.comparator
  if(!comparator) return dataClone;
  return dataClone.sort((a,b) => comparator(a, b, direction))
}

function paginateData(data, pageNum, pageSize){
  const start = (pageNum -1 )* pageSize;
  const end = start + pageSize;
  const pageData = data.slice(start, end)
  const totalPages = Math.ceil(data.length/pageSize)
  return {totalPages, pageData}
}

export default function DataTable({ data, columns }) {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [sortField, setSortField] = useState(null);
  const [sortDirection, setSortDirection] = useState('asc'); // 'asc' | 'desc'

  const sortedData = sortData(data, columns, sortField, sortDirection);
  const { maxPages, pageData } = paginateData(sortedData, page, pageSize);

  return (
    <div>
      <table>
        <thead>
          <tr>
            {columns.map(({ label, key }) => (
              <th key={key}>
                <button
                  onClick={() => {
                    if (sortField !== key) {
                      setSortField(key);
                      setSortDirection('asc');
                    } else {
                      setSortDirection(
                        sortDirection === 'asc' ? 'desc' : 'asc',
                      );
                    }
                    setPage(1);
                  }}
                >
                  {label}
                </button>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {pageData.map((item) => (
            <tr key={item.id}>
              {columns.map(({ key, renderCell }) => (
                <td key={key}>{renderCell(item)}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      <hr />

      <div className="pagination">
        <select
          aria-label="Page size"
          value={pageSize}
          onChange={(event) => {
            const newSize = Number(event.target.value);
            setPageSize(newSize);
            setPage(1);
          }}
        >
          {[5, 10, 20].map((size) => (
            <option key={size} value={size}>
              Show {size}
            </option>
          ))}
        </select>

        <div className="pages">
          <button
            disabled={page === 1}
            onClick={() => {
              setPage(page - 1);
            }}
          >
            Prev
          </button>

          {maxPages === 0 ? (
            <span>0 pages</span>
          ) : (
            <span aria-label="Page number">
              Page {page} of {maxPages}
            </span>
          )}

          <button
            disabled={page === maxPages || maxPages === 0}
            onClick={() => {
              setPage(page + 1);
            }}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}

import React from 'react';
import users from './users';
import houses from './houses';

const userColumns = [
  {
    label: 'ID',
    key: 'id',
    renderCell: (user) => user.id,
    comparator: (a, b, direction) =>
      direction === 'asc' ? a.id - b.id : b.id - a.id,
  },
  {
    label: 'Name',
    key: 'name',
    renderCell: (user) => user.name,
    comparator: (a, b, direction) =>
      direction === 'asc'
        ? a.name.localeCompare(b.name)
        : b.name.localeCompare(a.name),
  },
  {
    label: 'Age',
    key: 'age',
    renderCell: (user) => user.age,
    comparator: (a, b, direction) =>
      direction === 'asc' ? a.age - b.age : b.age - a.age,
  },
  {
    label: 'Occupation',
    key: 'occupation',
    renderCell: (user) => user.occupation,
    comparator: (a, b, direction) =>
      direction === 'asc'
        ? a.occupation.localeCompare(b.occupation)
        : b.occupation.localeCompare(a.occupation),
  },
];

const houseColumns = [
  {
    label: 'ID',
    key: 'id',
    renderCell: (house) => house.id,
    comparator: (a, b, direction) =>
      direction === 'asc' ? a.id - b.id : b.id - a.id,
  },
  {
    label: 'Street',
    key: 'street',
    renderCell: (house) => house.street,
    comparator: (a, b, direction) =>
      direction === 'asc'
        ? a.street.localeCompare(b.street)
        : b.street.localeCompare(a.street),
  },
  {
    label: 'City',
    key: 'city',
    renderCell: (house) => house.city,
    comparator: (a, b, direction) =>
      direction === 'asc'
        ? a.city.localeCompare(b.city)
        : b.city.localeCompare(a.city),
  },
  {
    label: 'State',
    key: 'state',
    renderCell: (house) => house.state,
    comparator: (a, b, direction) =>
      direction === 'asc'
        ? a.state.localeCompare(b.state)
        : b.state.localeCompare(a.state),
  },
  {
    label: 'Built Year',
    key: 'built_year',
    renderCell: (house) => house.built_year,
    comparator: (a, b, direction) =>
      direction === 'asc'
        ? a.built_year - b.built_year
        : b.built_year - a.built_year,
  },
];

export default function App() {
  return (
    <div>
      <h2>Users</h2>
      <DataTable data={users} columns={userColumns} />
      <br />
      <h2>Houses</h2>
      <DataTable data={houses} columns={houseColumns} />
    </div>
  );
}