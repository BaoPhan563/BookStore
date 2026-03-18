import React, { useState, useEffect } from "react";
import axios from "axios";
import { getToken } from '../components/Login/app/static'; // Adjust the import path as necessary

const AuthorList = () => {
  const [authors, setAuthors] = useState([]);

  useEffect(() => {
    const fetchAuthors = async () => {
      try {
        const token = getToken();
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/books/allauthor`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        setAuthors(response.data);
      } catch (error) {
        console.error("There was an error fetching the authors!", error);
      }
    };

    fetchAuthors();
  }, []);

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Authors</h2>
      <ul className="list-disc list-inside">
        {authors.map((author) => (
          <li key={author} className="text-lg text-gray-700">{author}</li>
        ))}
      </ul>
    </div>
  );
};

export default AuthorList;
