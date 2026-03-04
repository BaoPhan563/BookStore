// // src/api/bookApi.js
// import axios from '../../axiosConfig';

// // Upload một ảnh
// export const uploadSingleImage = async (bookId, imageFile) => {
//   const formData = new FormData();
//   formData.append('image', imageFile);

//   try {
//     const response = await axios.post(`/upload/${bookId}`, formData, {
//       headers: {
//         'Content-Type': 'multipart/form-data',
//       },
//     });
//     return response.data;
//   } catch (error) {
//     throw error;
//   }
// };

// // Upload nhiều ảnh
// export const uploadMultipleImages = async (bookId, imageFiles) => {
//   if (!bookId) {
//     throw new Error('Book ID is required');
//   }

//   const formData = new FormData();
//   imageFiles.forEach((file) => formData.append('image', file));

//   try {
//     const response = await axios.post(`/upload/many/${bookId}`, formData, {
//       headers: {
//         'Content-Type': 'multipart/form-data',
//       },
//     });
//     return response.data;
//   } catch (error) {
//     throw error;
//   }
// };

// // Xóa ảnh
// export const deleteImage = async (bookId, imageId) => {
//   try {
//     const response = await axios.delete(`/upload/${bookId}/${imageId}`);
//     return response.data;
//   } catch (error) {
//     throw error;
//   }
// };
