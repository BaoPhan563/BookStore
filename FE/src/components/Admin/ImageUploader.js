import React, { useState } from 'react';
import axios from '../../axiosConfig';
import { getToken } from '../Login/app/static';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ImageUploader = ({ bookId }) => {
  const [error, setError] = useState(null);

  const handleImageUpload = async (event) => {
    const files = Array.from(event.target.files);
    try {
      await uploadMultipleImages(bookId, files);
      toast.success('Images uploaded successfully'); // Thông báo khi tải ảnh thành công
      // window.location.reload(); // Tải lại trang sau khi tải ảnh thành công
    } catch (error) {
      setError(error.message);
      toast.error(`Error: ${error.message}`); // Thông báo khi có lỗi xảy ra
    }
  };

  const uploadMultipleImages = async (bookId, imageFiles) => {
    if (!bookId) {
      throw new Error('Book ID is required');
    }

    const formData = new FormData();
    imageFiles.forEach((file) => formData.append('image', file));

    try {
      const token = getToken();
      const response = await axios.post(`/upload/many/${bookId}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  };

  return (
    <div className="mt-4">
      <ToastContainer /> {/* Container để hiển thị các toast */}
      <input type="file" multiple onChange={handleImageUpload} />
      {error && <p className="text-red-500 mt-2">{error}</p>}
    </div>
  );
};

export default ImageUploader;
