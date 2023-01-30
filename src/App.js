import React, { useState, useEffect } from "react";
import ReactTable from 'react-table-6';
import 'react-table-6/react-table.css';
import { GraphQLClient } from "graphql-request";

const client = new GraphQLClient("https://admin.graphql.dev.intoexpert.com/graphql", {headers: {
    Authorization: "eyJraWQiOiJXeXpEaEZcL2JDUW5cL2J5eXpcL1FpNWVXSmZaZzA5VGNOYTkyNUF6QTMxS3VFPSIsImFsZyI6IlJTMjU2In0.eyJzdWIiOiJlMWFhN2U3YS05MmM2LTRhNzktYjljNC1lOGE1M2QzMTE4MWYiLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwiaXNzIjoiaHR0cHM6XC9cL2NvZ25pdG8taWRwLmV1LXdlc3QtMS5hbWF6b25hd3MuY29tXC9ldS13ZXN0LTFfcjQ0Q3M2Y1BNIiwiY29nbml0bzp1c2VybmFtZSI6ImU5Mjk2NWU5LWUxYzktNGU2Mi05NjQ4LWYzMmQ3NjU3OGY4ZCIsIm9yaWdpbl9qdGkiOiI3ZDI2NzIxZi02Yjk3LTQyMjAtODI1Ni1lNWJkOWFmMGViNzIiLCJhdWQiOiI3Nm4ycm44dnQ2dGxla3J1cmJ0Zjh0MDhhbSIsImV2ZW50X2lkIjoiOGUxOTU1ZjItMDcxOS00OTE4LTk4ODAtNmVmNGI3NTA4M2RmIiwidG9rZW5fdXNlIjoiaWQiLCJhdXRoX3RpbWUiOjE2NzUwOTM2MzcsImV4cCI6MTY3NTA5NzIzNiwiaWF0IjoxNjc1MDkzNjM3LCJqdGkiOiJlZWUxZWYwNy1mNDg3LTQ4ZTEtOWY1MS0yODVmZGQyYTMzZDkiLCJlbWFpbCI6ImVnbWFhbG91ZkBnbWFpbC5jb20ifQ.USGf86AWKOp45xl6CXTvrZMMIJYnZ4oHGn72PCXtYcOwklxTiBXxkkeMdHre0fUA1DK37OCQ9hDEgVazjNYnrZU54x0uNzqsG08hnYEAp3VPvVOast2HncdMv7_jhtRK01Y6tNJSLDfM10f_kb8_U5e32SNOop6GNMQym7u0BrsUHKYWkJ548MQ1-YGZcxP9hWbtByekL7ABpf6sXJwQYN7bMxkgLeO1QaMlNvm0AMrJfan3gzdWUCbpg7VEnbLkTaQfCp1qN-yN0EFXS5DEHwpCmUuEOPbvz117JzS2sHi7OW_kYCK6nPXCPEOErSUaRJ5GHQOEjZJN30XWdb9VXA",
  }});
const App = () => {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [expertState, setExpertState] = useState([]);
  // const [selectedNames, setSelectedNames] = useState([]);
  // const [selectedStatuses, setSelectedStatuses] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const result = await client.request(`
       query MyQuery($username: String, $clientType: String = "1") {
        getClient(
          username: $username
          clientType: $clientType
          limit: 1000
          offset: 0
          viewOnlyMode: false
        ) {
          data {
            availableToChat
            email
            phoneNumber
            clientType
            expertState
            personalInfo {
              firstName
              lastName
              dob
              genderId
              nationalities {
                name
                flag
              }
            }
            educations {
              degreeName
            }
            address {
              country
            }
            sections {
              progressPercentage
            }
            subjects {
              curriculumIds
              subjectName
            }
            preferredLanguage
          }
          total
        }
      }
    `, 
      );
      const rows = result.getClient?.data?.map(r => ({...r, name: r.personalInfo.firstName + " " + r.personalInfo.lastName ,  age: (((r.personalInfo?.dob))/ 60 / 60 / 24 / 365), subject:(r.subjects.subjectName) }))
      setData(rows);
      setFilteredData(rows);
    };
    fetchData();
  }, []);

  const columns = [
    {
      Header: "Email",
      accessor: "email",
    },
    {
      Header: "Name",
      accessor: "name",
    },
    {
      Header: "age",
      accessor: "personalInfo.dob",
    },
    {
      Header: "Phone Number",
      accessor: "phoneNumber",
    },
    {
      Header: "Expert State",
      accessor: "expertState",
    },
    {
      Header: "Gender",
      accessor: "personalInfo.genderId",
    },
    {
      Header: "Progress Percentage",
      accessor: "sections.progressPercentage",
    },
    {
      Header: "Subject Ids",
      accessor: "subject",
    },
  ];

 const handleNameFilter = (e) => {
    const searchTerm = e.target.value.toLowerCase();
    setFilteredData(
      data.filter((d) => d.name.toLowerCase().includes(searchTerm))
    );
  };

  const handleEmailFilter = (e) => {
    const searchTerm = e.target.value.toLowerCase();
    setFilteredData(
      data.filter((d) => d.email.toLowerCase().includes(searchTerm))
    );
  };

  const handlePhoneFilter = (e) => {
    const searchTerm = e.target.value.toLowerCase();
    setFilteredData(
      data.filter((d) => d.phoneNumber?.includes(searchTerm))
      
    );
  };

   const handleGenderFilter = (e) => {
    const searchTerm = e.target.value.toLowerCase();
    setFilteredData(
      data.filter((d) => d.personalInfo?.genderId?.includes(searchTerm))
    );
  };

   const handleProgressPercentageFilter = (e) => {
    const searchTerm = e.target.value.toLowerCase();
    setFilteredData(
      data.filter((d) => d.sections?.progressPercentage?.includes(searchTerm))
    );
  };




  return (
    <div>
       <input
        type="text"
        placeholder="Filter by name"
        onChange={handleNameFilter}
      />
       <input
        type="text"
        placeholder="Filter by email"
        onChange={handleEmailFilter}
      />
      <input
        type="text"
        placeholder="Filter by age"
        onChange={handlePhoneFilter}
      />
      <input
        type="text"
        placeholder="Filter by phone number"
        onChange={handlePhoneFilter}
      />
      <input
        type="text"
        placeholder="Filter by Gender"
        onChange={handleGenderFilter || []}
      />
       <input
        type="text"
        placeholder="Filter by Progress Percentage"
        onChange={handleProgressPercentageFilter}
      />
      <ReactTable data={filteredData} columns={columns} />
    </div>
  );
};

export default App;