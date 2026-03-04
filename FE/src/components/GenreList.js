import React, { useState, useEffect } from "react";
import axios from "../axiosConfig"; // Adjust the import path as necessary
import { getToken } from '../components/Login/app/static'; // Adjust the import path as necessary

const GenreList = () => {
  const [genres, setGenres] = useState([]);

  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const token = getToken();
        const response = await axios.get("http://localhost:5000/books/allgenre", {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        setGenres(response.data);
      } catch (error) {
        console.error("There was an error fetching the genres!", error);
      }
    };

    fetchGenres();
  }, []);

  return (
    <div>
      <h2>Genres</h2>
      <ul>
        {genres.map((genre) => (
          <li key={genre}>{genre}</li>
        ))}
      </ul>
    </div>
  );
};

export default GenreList;
