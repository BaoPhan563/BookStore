import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from '../../axiosConfig';
import { getToken } from '../Login/app/static'; // Adjust the import path as necessary
const EditBook = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [book, setBook] = useState({
    title: '',
    author: '',
    publisher: '',
    genre: '',
    price: '',
    quantity: '',
    description: '',
  });

  useEffect(() => {
    const fetchBookDetail = async () => {
      try {
        const token = getToken();
        const response = await axios.get(`/books/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setBook(response.data);
      } catch (error) {
        console.error('Error fetching book details:', error);
        // Handle error (e.g., show error message)
      }
    };

    fetchBookDetail();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setBook({ ...book, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = getToken();
      await axios.put(`/books/${id}`, book, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      navigate(`/books/${id}`);
    } catch (error) {
      console.error('Error updating book:', error);
      // Handle error (e.g., show error message)
    }
  };

  return (
    <div className="container mx-auto p-4 font-times">
      <h2 className="text-2xl font-bold mb-4 text-black">Edit Book</h2>
      <form onSubmit={handleSubmit}>
        <label className="block mb-2">Title:</label>
        <input
          type="text"
          name="title"
          value={book.title}
          onChange={handleChange}
         className="block w-full mb-4 p-2 border border-gray-300 rounded bg-gray-200 cursor-not-allowed"
          readOnly
        />

        <label className="block mb-2">Author:</label>
        <input
          type="text"
          name="author"
          value={book.author}
          onChange={handleChange}
         className="block w-full mb-4 p-2 border border-gray-300 rounded bg-gray-200 cursor-not-allowed"
          readOnly
        />

        <label className="block mb-2">Publisher:</label>
        <input
          type="text"
          name="publisher"
          value={book.publisher}
          onChange={handleChange}
          className="block w-full mb-4 p-2 border border-gray-300 rounded bg-gray-200 cursor-not-allowed"
          readOnly
        />

        <label className="block mb-2">Genre:</label>
        <input
          type="text"
          name="genre"
          value={book.genre}
          onChange={handleChange}
         className="block w-full mb-4 p-2 border border-gray-300 rounded bg-gray-200 cursor-not-allowed"
          readOnly
        />

        <label className="block mb-2">Price:</label>
        <input
          type="number"
          name="price"
          value={book.price}
          onChange={handleChange}
          className="block w-full mb-4 p-2 border border-gray-300 rounded"
        />

        <label className="block mb-2">Quantity:</label>
        <input
          type="number"
          name="quantity"
          value={book.quantity}
          onChange={handleChange}
        className="block w-full mb-4 p-2 border border-gray-300 rounded bg-gray-200 cursor-not-allowed"
          readOnly
        />

        <label className="block mb-2">Description:</label>
        <textarea
          name="description"
          value={book.description}
          onChange={handleChange}
          className="block w-full mb-4 p-2 border border-gray-300 rounded"
        />

        <button type="submit" className="bg-gradient-to-r from-orange-400 to-orange-600 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 hover:from-orange-500 hover:to-orange-700">
          Save
        </button>
      </form>
    </div>
  );
};

export default EditBook;
