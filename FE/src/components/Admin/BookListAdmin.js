import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from '../../axiosConfig';
import { getToken } from '../Login/app/static';
import ConfirmationModal from './ConfirmationModal';

const BookListAdmin = () => {
  const [books, setBooks] = useState([]);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [bookToDelete, setBookToDelete] = useState(null);
  const [deleteMessage, setDeleteMessage] = useState('');

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      const token = getToken();
      const response = await axios.get('/books', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setBooks(response.data);
    } catch (error) {
      console.error('Error fetching books:', error);
      setBooks([]);
    }
  };

  const handleDeleteAllBooks = async () => {
    setShowDeleteConfirmation(true);
    setDeleteMessage('Are you sure you want to delete all books?');
  };

  const handleDeleteBook = async (bookId, bookTitle) => {
    setShowDeleteConfirmation(true);
    setBookToDelete(bookId);
    setDeleteMessage(`Are you sure you want to delete book "${bookTitle}"?`);
  };

  const confirmDeleteAllBooks = async () => {
    try {
      const token = getToken();
      await axios.delete('/books', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      fetchBooks();
    } catch (error) {
      console.error('Error deleting all books:', error);
    } finally {
      setShowDeleteConfirmation(false);
      setDeleteMessage('');
    }
  };

  const confirmDeleteBook = async () => {
    try {
      const token = getToken();
      await axios.delete(`/books/${bookToDelete}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      fetchBooks();
    } catch (error) {
      console.error(`Error deleting book ${bookToDelete}:`, error);
    } finally {
      setShowDeleteConfirmation(false);
      setDeleteMessage('');
    }
  };

  const closeModal = () => {
    setShowDeleteConfirmation(false);
    setBookToDelete(null);
    setDeleteMessage('');
  };

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Book List</h2>
      <div className="mb-4 flex items-center">
        <Link
          to="/addbook"
          className="bg-green-500 border-[1px] border-green-500 text-white rounded-sm px-4 py-[12px] hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Add New Book
        </Link>
        {books.length === 0 && (
          <p className="text-gray-500 ml-4">No books found. Add new books using the button above.</p>
        )}
        {books.length > 0 && (
          <button
            onClick={handleDeleteAllBooks}
            className="border-red-500 text-red-500 border-2 px-4 py-2 rounded-sm hover:bg-red-500 hover:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ml-4"
          >
            Delete All Books
          </button>
        )}
      </div>
      {books.length > 0 ? (
        <ul className="divide-y divide-gray-200">
          {books.map((book) => (
            <Link key={book._id} to={`/books/${book._id}`}>
              <li className="py-4 hover:shadow-md p-6 flex items-center justify-between">
                <div className="flex items-center">
                <img
                                src={
                                    book.imageurls.length > 0
                                        ? book.imageurls.find((image) => image.defaultImg)?.imageUrl ||
                                          book.imageurls[0].imageUrl
                                        : 'default-image-url.jpg'
                                }
                                alt={book.title}
                                className="w-[130px] h-[130px] max-h-screen object-cover rounded-lg mr-4"
                            />
                  <div>
                    <h3 className="text-xl font-semibold">{book.title}</h3>
                    <p className="text-gray-600">Price: ${book.price}</p>
                    <p className="text-gray-600">Quantity: {book.quantity}</p>
                  </div>
                </div>
                <div className="ml-4">
                  <button
                    onClick={() => handleDeleteBook(book._id, book.title)}
                    className="text-red-600 border-2 border-red-500 hover:bg-red-500 hover:text-white rounded-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 px-4 py-2 ml-2"
                  >
                    Delete
                  </button>
                </div>
              </li>
            </Link>
          ))}
        </ul>
      ) : null}

      <ConfirmationModal
        isOpen={showDeleteConfirmation}
        message={deleteMessage}
        onCancel={closeModal}
        onConfirm={bookToDelete ? confirmDeleteBook : confirmDeleteAllBooks}
      />
    </div>
  );
};

export default BookListAdmin;
