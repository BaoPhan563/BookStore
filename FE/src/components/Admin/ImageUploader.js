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
      toast.success('Tải ảnh sách lên thành công!');
      // window.location.reload();
    } catch (error) {
      setError(error.message);
      toast.error(error.response?.data?.message || 'Tải ảnh lên thất bại. Vui lòng kiểm tra lại file ảnh!');
    }
  };

  const uploadMultipleImages = async (bookId, imageFiles) => {
    if (!bookId) {
      throw new Error('Cần phải có bookId để tải ảnh lên');
    }

    const formData = new FormData();
    imageFiles.forEach((file) => formData.append('image', file));

    try {
      const token = getToken();
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/upload/many/${bookId}`, formData, {
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
