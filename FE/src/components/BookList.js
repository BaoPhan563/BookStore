import React, { useState, useEffect } from 'react';
import axios from '../axiosConfig';
import { Link } from 'react-router-dom';
import { getToken, getGoogleToken } from '../components/Login/app/static';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const BookList = ({ searchTerm }) => {
    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [user, setUser] = useState(null);
    const [minPrice, setMinPrice] = useState('');
    const [maxPrice, setMaxPrice] = useState('');
    const [ratingFilter, setRatingFilter] = useState(''); // State để lưu giá trị rating người dùng nhập

    useEffect(() => {
        const fetchBooks = async () => {
            try {
                const token = getToken();
                const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/books`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setBooks(response.data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        const fetchUserData = async () => {
            try {
                const token = getToken() || getGoogleToken();
                const response = await axios.get(`${process.env.REACT_APP_API_URL}/users/profile`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setUser(response.data);
            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        };

        fetchBooks();
        fetchUserData();
    }, []);

    const addToCart = async (book) => {
        if (user && user.admin) {
            toast.error('Admin users cannot add items to the cart.');
            return;
        }
        if (book.quantity === 0) {
            toast.error('Hết hàng');
            return;
        }
        try {
            const token = getToken();
            const response = await axios.post(
                '/cart',
                {
                    book: book._id,
                    price: book.price,
                    quantity: 1, // or any desired initial quantity
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                },
            );
            console.log('Added to cart:', response.data);
            toast.success('Added to cart');
        } catch (err) {
            console.error('Error adding to cart:', err.message);
            toast.error('An error occurred when adding to cart');
        }
    };

    const fetchBooksByPriceRange = async (min, max) => {
        try {
            const token = getToken();
            const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/books/price/from${min}/to${max}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setBooks(response.data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const fetchBooksByRating = async (minRating) => {
        try {
            const token = getToken();
            const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/books/rating/${minRating}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setBooks(response.data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleFilterByPrice = () => {
        if (!minPrice || !maxPrice) {
            toast.error('Please enter the minimum and maximum price.');
            return;
        }
        fetchBooksByPriceRange(minPrice, maxPrice);
    };

    const handleSortByRating = () => {
        if (ratingFilter < 3 || ratingFilter > 5) {
            toast.error('Please enter the star number from 1 to 5.');
            return;
        }
        fetchBooksByRating(ratingFilter);
    };

    const handleRatingInputChange = (event) => {
        setRatingFilter(Number(event.target.value)); // Chuyển đổi giá trị nhập vào thành số
    };

    const filteredBooks = Array.isArray(books)
        ? books.filter(
              (book) =>
                  (book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                  book.author.toLowerCase().includes(searchTerm.toLowerCase())) &&
                  book.status === true // chỉ bao gồm sách có status là true
          )
        : [];

    if (loading) {
        return <div className="text-center py-8 text-xl text-blue-500">Loading...</div>;
    }

    if (error) {
        return <div className="text-center py-8 text-xl text-red-600">Error: {error}</div>;
    }

    const formatPrice = (price) => {
        return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    };

    return (
        <div className="container mx-auto px-4 py-8 font-times text-center mt-[50px] ">
            <ToastContainer />
            <div className="mb-14 flex justify-start items-start ">
            {/* border-t border-gray-300 my-4 py-4 */}
                <input
                    type="number"
                    placeholder="Minimum price"
                    value={minPrice}
                    onChange={(e) => setMinPrice(e.target.value)}
                    className="border border-gray-300 px-4 py-2 mr-2 text-center text-gray-700 rounded-md"
                />
                <input
                    type="number"
                    placeholder="Maximum price"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(e.target.value)}
                    className="border border-gray-300 px-4 py-2 mr-2 text-center text-gray-700 rounded-md"
                />
                <button
                    onClick={handleFilterByPrice}
                    className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-md mr-2"
                >
                    Sort by Price
                </button>
                <input
                    type="number"
                    
                    placeholder="Rating (1-5)"
                    value={ratingFilter}
                    onChange={handleRatingInputChange}
                    className="border border-gray-300 px-4 py-2 mr-2 text-center text-gray-700 rounded-md"
                />
                <button
                    onClick={handleSortByRating}
                    className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-md"
                >
                    Sort by Rating
                </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {filteredBooks.map((book) => (
                    <div
                        key={book._id}
                        className=""
                        // rounded-lg overflow-hidden transform transition-transform hover:scale-105 hover:shadow-2xl
                    >
                        <Link to={`/book/${book._id}`}>
                            <img
                                src={
                                    book.imageurls.length > 0
                                        ? book.imageurls.find((image) => image.defaultImg)?.imageUrl ||
                                          book.imageurls[0].imageUrl
                                        : 'default-image-url.jpg'
                                }
                                alt={book.title}
                                className="w-[300px] h-[300px] object-cover rounded-lg overflow-hidden transform transition-transform hover:scale-105 hover:shadow-2xl"
                            />
                            <div className="p-4">
                                <h2 className="text-l font-thin mb-2 text-gray-800 hover:underline text-ellipsis text-nowrap max-w-[300px] overflow-hidden">{book.title}</h2>
                                {/* <p className="text-gray-700 mb-2">{book.description}</p> */}
                                <div className="mb-2">
                                    {/* <p className="text-gray-900 font-medium">
                                        Author: <span className="text-gray-600">{book.author}</span>
                                    </p>
                                    <p className="text-gray-900 font-medium">
                                        Genre: <span className="text-gray-600">{book.genre}</span>
                                    </p> */}
                                </div>
                                <div className="">
                                {/* flex items-center justify-between */}
                                    <p className="text-gray-900 font-medium text-lg hover:text-green-500">
                                        {/* $ {formatPrice(book.price)} USD */}
                                        {formatPrice(book.price)}₫
                                    </p>
                                    <button
                                        onClick={(e) => {
                                            e.preventDefault();
                                            addToCart(book);
                                        }}
                                        disabled={user && user.admin}
                                        className={`${
                                            user && user.admin
                                                ? 'border-gray-400 text-gray-400  cursor-not-allowed pr-[85px] pl-[85px]'
                                                : 'text-orange-500  border-orange-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 mt-6 rounded-lg overflow-hidden transform transition-transform hover:scale-105 hover:shadow-2xl'
                                        } px-[85px] py-[10px] border-2 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 mt-6  rounded-lg overflow-hidden transform transition-transform hover:scale-105 hover:shadow-2xl`}
                                    >
                                        Add To Cart
                                    </button>
                                </div>
                            </div>
                        </Link>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default BookList;
