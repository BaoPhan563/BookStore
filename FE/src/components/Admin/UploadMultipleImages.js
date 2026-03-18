import React, { useState } from 'react';
import axios from '../../axiosConfig';
import { useParams } from 'react-router-dom';
import { getToken } from '../Login/app/static'; // Adjust the import path as necessary

const UploadMultipleImages = () => {
  const { bookId } = useParams(); // Lấy bookId từ URL params
  const [images, setImages] = useState([]);
  console.log('bookId:', bookId);

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setImages(files);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    images.forEach((image, index) => {
      formData.append('image', image);
    });

    try {
      const token = getToken();
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/upload/many/${bookId}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`
        },
      });
      console.log('Upload response:', response.data);
      // Handle success (e.g., show success message)
    } catch (error) {
      console.error('Error uploading images:', error);
      // Handle error (e.g., show error message)
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4 text-black">Upload Multiple Images</h2>
      <form onSubmit={handleSubmit}>
        <input name="image" type="file" onChange={handleImageChange} multiple />
        <button type="submit" className="bg-purple-500 hover:bg-purple-700 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 mt-4">
          Upload Images
        </button>
      </form>
    </div>
  );
};

export default UploadMultipleImages;
