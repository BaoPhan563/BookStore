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
            await axios.get(`${process.env.REACT_APP_API_URL}/upload/${book._id}/setDefault/${imageId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setDefaultImageId(imageId);
            console.log('Default image set successfully');
        } catch (error) {
            console.error('Error setting default image:', error);
        }
    };

    const deleteImage = async (bookId, imageId) => {
        try {
            const token = getToken();
            await axios.delete(`${process.env.REACT_APP_API_URL}/upload/${bookId}/${imageId}`, {
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
            console.log('Image deleted successfully');
        } catch (error) {
            console.error('Error deleting image:', error);
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
            toast.success(`Book status set to ${status}`);
        } catch (error) {
            console.error(`Error setting book status to ${status}:`, error);
            toast.error('Error setting book status');
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
                        Edit Book
                    </Link>
                    <button
                        onClick={() => setBookStatus('true')}
                        className="ml-2 bg-green-500 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 hover:bg-green-600"
                    >
                        Set Active
                    </button>
                    <button
                        onClick={() => setBookStatus('false')}
                        className="ml-2 border-red-500 border-2 text-red-500 px-4 py-[6px] hover:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 hover:bg-red-600"
                    >
                        Set Inactive
                    </button>
                </div>
            </div>
            <div className="bg-white shadow-md rounded-lg overflow-hidden font-times">
                <table className="min-w-full divide-y divide-gray-200">
                    <tbody className="bg-gray-50 divide-y divide-gray-200">
                        {/* Display book details */}
                        <tr className="bg-orange-100">
                            <td className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Attribute
                            </td>
                            <td className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Value
                            </td>
                        </tr>
                        <tr className="bg-white">
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Author</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{book.author}</td>
                        </tr>
                        <tr className="bg-orange-50">
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Publisher</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{book.publisher}</td>
                        </tr>
                        <tr className="bg-white">
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Genre</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{book.genre}</td>
                        </tr>
                        <tr className="bg-orange-50">
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Price</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${book.price}</td>
                        </tr>
                        <tr className="bg-white">
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Quantity</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{book.quantity}</td>
                        </tr>
                        <tr className="bg-orange-50">
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                Description
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{book.description}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <ImageUploader bookId={book._id} onUploadSuccess={handleUploadSuccess} />
            {book.imageurls && book.imageurls.length > 0 && (
                <div className="mt-4">
                    <h3 className="text-xl font-bold mb-2">Images:</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {book.imageurls.map((image, index) => (
                            <div key={image._id} className="relative group">
                                <img
                                    src={image.imageUrl}
                                    alt={`Image ${index}`}
                                    className="w-full max-h-screen object-cover rounded-md"
                                />
                                {defaultImageId === image._id && (
                                    <div className="absolute inset-0 bg-black opacity-25 rounded-md"></div>
                                )}
                                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button
                                        onClick={() => setDefaultImage(image._id)}
                                        className="bg-gray-800 text-white px-2 py-1 rounded-full text-xs mr-2 hover:bg-gray-700"
                                    >
                                        Set as Default
                                    </button>
                                    <button
                                        onClick={() => deleteImage(book._id, image._id)}
                                        className="bg-red-600 text-white px-2 py-1 rounded-full text-xs hover:bg-red-700"
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default BookDetail;
