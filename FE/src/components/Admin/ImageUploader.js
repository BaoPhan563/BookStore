import React, { useState, useRef } from 'react';
import axios from '../../axiosConfig';
import { getToken } from '../Login/app/static';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ImageUploader = ({ bookId, onUploadSuccess }) => {
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef(null);

  const handleImageUpload = async (event) => {
    const files = Array.from(event.target.files);
    if (!files || files.length === 0) return;

    setLoading(true);
    try {
      const updatedImages = await uploadMultipleImages(bookId, files);
      toast.success('Tải ảnh sách lên Cloudinary thành công!');
      if (onUploadSuccess) {
        onUploadSuccess(updatedImages);
      }
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Tải ảnh lên thất bại. Vui lòng kiểm tra lại file ảnh!');
    } finally {
      setLoading(false);
    }
  };

  const uploadMultipleImages = async (bookId, imageFiles) => {
    if (!bookId) {
      throw new Error('Cần phải có bookId để tải ảnh lên');
    }

    const formData = new FormData();
    imageFiles.forEach((file) => formData.append('image', file));

    const token = getToken();
    const response = await axios.post(
      `${process.env.REACT_APP_API_URL}/api/upload/many/${bookId}`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  };

  return (
    <div className="mt-4 p-4 border border-dashed border-gray-300 rounded-lg bg-gray-50">
      <ToastContainer />
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            Tải thêm ảnh cho sách (Tối đa 4 ảnh):
          </label>
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/*"
            disabled={loading}
            onChange={handleImageUpload}
            className="text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-orange-50 file:text-orange-700 hover:file:bg-orange-100 cursor-pointer disabled:opacity-50"
          />
        </div>
        {loading && (
          <div className="flex items-center text-sm text-orange-600 font-medium">
            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-orange-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
            </svg>
            Đang tải lên Cloudinary...
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageUploader;
