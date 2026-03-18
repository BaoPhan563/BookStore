import React, { useState } from 'react';
import axios from '../../axiosConfig';
import { getToken } from '../Login/app/static'; // Điều chỉnh đường dẫn nhập theo cần thiết
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AddBook = () => {
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [publisher, setPublisher] = useState('');
  const [genre, setGenre] = useState('');
  const [price, setPrice] = useState('');
  const [quantity, setQuantity] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = getToken();
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/books`, {
        title,
        author,
        publisher,
        genre,
        price: parseFloat(price),
        quantity: parseInt(quantity),
        description,
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      console.log('Book added:', response.data);
      toast.success('Book added successfully!');
      // Reset form fields here if needed
      setTitle('');
      setAuthor('');
      setPublisher('');
      setGenre('');
      setPrice('');
      setQuantity('');
      setDescription('');
    } catch (error) {
      console.error('Error adding book:', error);
      toast.error('Failed to add book. Please try again.');
    }
  };

  return (
    <div className="container mx-auto p-4 font-times">
      <h2 className="text-2xl font-bold mb-4">Add New Book</h2>
      <form onSubmit={handleSubmit} className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-md">
        <div className="mb-4">
          <label className="block text-gray-700 font-bold mb-2">Title:</label>
          <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500" />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 font-bold mb-2">Author:</label>
          <input type="text" value={author} onChange={(e) => setAuthor(e.target.value)} required className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500" />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 font-bold mb-2">Publisher:</label>
          <input type="text" value={publisher} onChange={(e) => setPublisher(e.target.value)} required className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500" />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 font-bold mb-2">Genre:</label>
          <input type="text" value={genre} onChange={(e) => setGenre(e.target.value)} required className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500" />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 font-bold mb-2">Price:</label>
          <input type="number" value={price} onChange={(e) => setPrice(e.target.value)} required className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500" />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 font-bold mb-2">Quantity:</label>
          <input type="number" value={quantity} onChange={(e) => setQuantity(e.target.value)} required className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500" />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 font-bold mb-2">Description:</label>
          <textarea value={description} onChange={(e) => setDescription(e.target.value)} required className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500" />
        </div>

        <div className="text-right">
          <button type="submit" className="bg-gradient-to-r from-orange-400 to-orange-600 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 hover:from-orange-500 hover:to-orange-700">Add Book</button>
        </div>
      </form>

      {/* Toast container for displaying messages */}
      <ToastContainer />

    </div>
  );
};

export default AddBook;
