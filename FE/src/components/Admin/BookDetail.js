import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from '../../axiosConfig'; // Ensure correct import path
import ImageUploader from './ImageUploader'; // Ensure correct import path
import { getToken } from '../Login/app/static'; // Ensure correct import path
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const BookDetail = ({ books }) => {
    const { id } = useParams();
    const [book, setBook] = useState(null);
    const [defaultImageId, setDefaultImageId] = useState(null); // State for default image ID

    useEffect(() => {
        const fetchBookDetail = async () => {
            try {
                const token = getToken();
                const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/books/${id}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setBook(response.data);
                // Set default image ID from fetched data
                const defaultImage = response.data.imageurls?.find((image) => image.defaultImg);
                if (defaultImage) {
                    setDefaultImageId(defaultImage._id);
                }
            } catch (error) {
                console.error('Error fetching book details:', error);
            }
        };

        if (books && books.length > 0) {
            const selectedBook = books.find((book) => book._id === id);
            if (selectedBook) {
                setBook(selectedBook);
                // Set default image ID from selected book
                const defaultImage = selectedBook.imageurls?.find((image) => image.defaultImg);
                if (defaultImage) {
                    setDefaultImageId(defaultImage._id);
                }
            } else {
                fetchBookDetail();
            }
        } else {
            fetchBookDetail();
        }
    }, [id, books]);

    const handleUploadSuccess = (updatedImages) => {
        setBook((prevBook) => ({
            ...prevBook,
            imageurls: updatedImages,
        }));
    };

    const setDefaultImage = async (imageId) => {
        try {
            const token = getToken();
            const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/upload/${book._id}/setDefault/${imageId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setDefaultImageId(imageId);
            if (response.data) {
                setBook((prevBook) => ({
                    ...prevBook,
                    imageurls: response.data,
                }));
            }
            toast.success('Đã đặt làm ảnh đại diện chính!');
        } catch (error) {
            console.error('Error setting default image:', error);
            toast.error('Không thể đặt ảnh đại diện. Vui lòng thử lại!');
        }
    };

    const deleteImage = async (bookId, imageId) => {
        try {
            const token = getToken();
            await axios.delete(`${process.env.REACT_APP_API_URL}/api/upload/${bookId}/${imageId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            // After deletion, update the book state to reflect the removed image
            const updatedImages = book.imageurls.filter((image) => image._id !== imageId);
            setBook((prevBook) => ({
                ...prevBook,
                imageurls: updatedImages,
            }));
            if (defaultImageId === imageId) {
                setDefaultImageId(updatedImages[0]?._id || null);
            }
            toast.success('Đã xóa ảnh thành công!');
        } catch (error) {
            console.error('Error deleting image:', error);
            toast.error('Không thể xóa ảnh. Vui lòng thử lại!');
        }
    };

    const setBookStatus = async (status) => {
        try {
            const token = getToken();
            const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/books/${book._id}/set?query=${status}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setBook(response.data);
            console.log(`Book status set to ${status}`);
            toast.success(`Đã cập nhật trạng thái sách thành "${status}" thành công!`);
        } catch (error) {
            console.error(`Error setting book status to ${status}:`, error);
            toast.error('Không thể cập nhật trạng thái sách. Vui lòng thử lại!');
        }
    };

    if (!book) {
        return <div>Loading...</div>;
    }

    return (
        <div className="container mx-auto p-4 font-times">
            {/* <ToastContainer /> */}
            <div className="flex items-center justify-between mb-4 font-times">
                <h2 className="text-2xl font-bold text-black">{book.title}</h2>
                <div className="ml-6">
                    <Link
                        to={`/edit/${book._id}`}
                        className="bg-gradient-to-r from-orange-400 to-orange-600 text-white px-4 py-[11px] rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 hover:from-orange-500 hover:to-orange-700"
                    >
                        Chỉnh sửa
                    </Link>
                    <button
                        onClick={() => setBookStatus('true')}
                        className="ml-2 bg-green-500 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 hover:bg-green-600"
                    >
                        Kích hoạt
                    </button>
                    <button
                        onClick={() => setBookStatus('false')}
                        className="ml-2 border-red-500 border-2 text-red-500 px-4 py-[6px] hover:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 hover:bg-red-600"
                    >
                        Vô hiệu hóa
                    </button>
                </div>
            </div>
            <div className="bg-white shadow-md rounded-lg overflow-hidden font-times">
                <table className="min-w-full divide-y divide-gray-200">
                    <tbody className="bg-gray-50 divide-y divide-gray-200">
                        {/* Display book details */}
                        <tr className="bg-orange-100">
                            <td className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Thuộc tính
                            </td>
                            <td className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Chi tiết
                            </td>
                        </tr>
                        <tr className="bg-white">
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Tác giả</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{book.author}</td>
                        </tr>
                        <tr className="bg-orange-50">
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Nhà xuất bản</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{book.publisher}</td>
                        </tr>
                        <tr className="bg-white">
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Thể loại</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{book.genre}</td>
                        </tr>
                        <tr className="bg-orange-50">
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Giá</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{book.price.toLocaleString('vi-VN')}₫</td>
                        </tr>
                        <tr className="bg-white">
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Số lượng</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{book.quantity}</td>
                        </tr>
                        <tr className="bg-orange-50">
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                Mô tả
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{book.description}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <ImageUploader bookId={book._id} onUploadSuccess={handleUploadSuccess} />
            {book.imageurls && book.imageurls.length > 0 && (
                <div className="mt-6">
                    <h3 className="text-xl font-bold mb-3 text-gray-800">Hình ảnh sản phẩm ({book.imageurls.length}/4):</h3>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                        {book.imageurls.map((image, index) => {
                            const isDefault = defaultImageId === image._id || image.defaultImg;
                            return (
                                <div
                                    key={image._id || index}
                                    className={`relative group rounded-xl overflow-hidden border-2 transition-all ${
                                        isDefault ? 'border-orange-500 shadow-md ring-2 ring-orange-400/20' : 'border-gray-200'
                                    }`}
                                >
                                    <div className="w-full h-56 bg-gray-100 flex items-center justify-center overflow-hidden">
                                        <img
                                            src={image.imageUrl}
                                            alt={`Ảnh ${index + 1} của ${book.title}`}
                                            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                                            onError={(e) => {
                                                e.target.src =
                                                    "https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&q=80&w=600";
                                            }}
                                        />
                                    </div>

                                    {/* Default Badge */}
                                    {isDefault && (
                                        <span className="absolute top-2 left-2 bg-orange-600 text-white text-xs font-bold px-2 py-0.5 rounded shadow">
                                            Ảnh chính
                                        </span>
                                    )}

                                    {/* Action Overlay */}
                                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity p-2">
                                        {!isDefault && (
                                            <button
                                                type="button"
                                                onClick={() => setDefaultImage(image._id)}
                                                className="bg-orange-500 hover:bg-orange-600 text-white px-2.5 py-1.5 rounded-lg text-xs font-semibold shadow transition"
                                            >
                                                Đặt làm ảnh chính
                                            </button>
                                        )}
                                        <button
                                            type="button"
                                            onClick={() => deleteImage(book._id, image._id)}
                                            className="bg-red-600 hover:bg-red-700 text-white px-2.5 py-1.5 rounded-lg text-xs font-semibold shadow transition"
                                        >
                                            Xóa
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
};

export default BookDetail;
