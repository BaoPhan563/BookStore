import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "../axiosConfig";
import { getToken, getGoogleToken } from "../components/Login/app/static";
import { FaMinus, FaPlus, FaStar, FaUserCircle } from "react-icons/fa";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { format } from "date-fns";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPaypal } from "@fortawesome/free-brands-svg-icons";

const BookDetail = () => {
  const { id } = useParams();
  const [book, setBook] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [commentText, setCommentText] = useState("");
  const [rating, setRating] = useState(0);
  const [showComments, setShowComments] = useState(false);
  const [user, setUser] = useState(null);
  useEffect(() => {
    const fetchBook = async () => {
      try {
        const token = getToken();
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/api/books/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );
        setBook(response.data);
        setSelectedImage(response.data.imageurls[0]);
        setQuantity(1);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    const fetchUserData = async () => {
      try {
        const token = getToken() || getGoogleToken();
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/api/users/profile`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );
        setUser(response.data);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchBook();
    fetchUserData();
  }, [id]);

  const increaseQuantity = () => {
    if (quantity < book.quantity) {
      setQuantity(quantity + 1);
    } else {
      toast.error("Insufficient quantity of goods");
    }
  };

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const addToCart = async () => {
    if (user && user.admin) {
      toast.error("Admin không thể thêm sản phẩm vào giỏ hàng");
      return;
    }
    if (quantity > book.quantity) {
      toast.error("Số lượng sản phẩm không đủ");
      return;
    }
    if (!user) {
      toast.error("Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng");
      return;
    }
    if (book.quantity === 0) {
      toast.error("Sách này đã hết hàng");
      return;
    }
    try {
      const token = getToken();
      await axios.post(
        `${process.env.REACT_APP_API_URL}/api/cart`,
        {
          book: book._id,
          price: book.price,
          quantity: quantity,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      toast.success("Đã thêm vào giỏ hàng");
    } catch (err) {
      console.error("Error adding item to cart:", err.message);
      toast.error("Có lỗi xảy ra khi thêm vào giỏ hàng. Vui lòng thử lại.");
    }
  };

  const buyNow = async () => {
    try {
      const token = getToken();
      const response = await axios.post(
        "/payment/create_payment_paypal",
        {
          quantity: quantity,
          amount: book.price * quantity,
          order_details: [
            {
              book: book._id,
              order_quantity: quantity,
              order_price: book.price,
            },
          ],
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      window.location.href = response.data; // Redirect to PayPal approval URL
    } catch (err) {
      console.error("Error creating PayPal payment:", err.message);
      toast.error("There was an error when making a purchase");
    }
  };

  const handleCommentChange = (event) => {
    setCommentText(event.target.value);
  };

  const handleRatingChange = (newRating) => {
    setRating(newRating);
  };

  const postComment = async () => {
    if (user && user.admin) {
      toast.error("Admin không thể đăng bình luận");
      return;
    }
    if (!user) {
      toast.error("Vui lòng đăng nhập để đăng bình luận");
      return;
    }
    if (commentText.trim() === "") {
      toast.error("Vui lòng nhập nội dung bình luận");
      return;
    }
    if (rating === 0) {
      toast.error("Vui lòng chọn đánh giá sao");
      return;
    }
    try {
      const token = getToken();
      await axios.post(
        `${process.env.REACT_APP_API_URL}/api/books/${id}/comments`,
        {
          comment: commentText,
          rating: rating,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      toast.success("Bình luận của bạn đã được đăng tải thành công");
      // Refresh book data after posting comment
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/books/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      setBook(response.data);
      setCommentText("");
      setRating(0);
    } catch (err) {
      console.error("Error posting comment:", err.message);
      toast.error("Đã xảy ra lỗi khi đăng bình luận. Vui lòng thử lại.");
    }
  };

  if (loading) {
    return (
      <div className="text-center py-8 text-xl text-blue-500">Đang tải...</div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8 text-xl text-red-600">Lỗi: {error}</div>
    );
  }

  const formatPrice = (price) => {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <ToastContainer />
      <div className="bg-white shadow-lg rounded-lg overflow-hidden flex">
        <div className="w-2/5 p-4">
          <div className="mb-4 flex justify-center items-center">
            <img
              src={selectedImage.imageUrl}
              alt="Selected"
              className="h-[400px] max-w-full max-h-screen object-contain rounded-lg shadow-md"
            />
          </div>
          <div className="grid grid-cols-4 gap-4">
            {book.imageurls.map((image, index) => (
              <div
                key={index}
                className="relative group cursor-pointer"
                onClick={() => setSelectedImage(image)}
              >
                <img
                  src={image.imageUrl}
                  alt={`Ảnh ${index}`}
                  className={`w-full h-24 object-cover rounded-lg shadow-md transition-transform duration-300 transform group-hover:scale-105 ${
                    selectedImage === image ? "border-2 border-blue-500" : ""
                  }`}
                />
              </div>
            ))}
          </div>
        </div>
        <div className="w-1/2 p-4 ml-[100px]">
          <div className="mb-4">
            <h2 className="text-3xl mb-2 text-gray-800">{book.title}</h2>
            <p className="text-gray-700 mb-4">{book.description}</p>
            <div className="mb-4">
              <p className="text-gray-900 font-medium">
                Tác giả: <span className="text-gray-600">{book.author}</span>
              </p>
              <p className="text-gray-900 font-medium">
                Nhà xuất bản:{" "}
                <span className="text-gray-600">{book.publisher}</span>
              </p>
              <p className="text-gray-900 font-medium">
                Thể loại: <span className="text-gray-600">{book.genre}</span>
              </p>
            </div>
            <p className="text-gray-900 font-medium text-lg">
              {formatPrice(book.price)}₫
            </p>

            <p className="text-gray-700">Kho: {book.quantity}</p>
          </div>
          <div className="mt-auto">
            <div className="flex items-center mb-4 border border-gray-400 rounded-sm p-2 mr-[620px]">
              <button
                onClick={decreaseQuantity}
                className="mr-2 text-gray-500 focus:outline-none"
              >
                <FaMinus className="cursor-pointer" />
              </button>
              <span className="text-gray-900 font-medium">{quantity}</span>
              <button
                onClick={increaseQuantity}
                className="ml-2 text-gray-500 focus:outline-none"
              >
                <FaPlus className="cursor-pointer" />
              </button>
            </div>

            <button
              onClick={addToCart}
              className={`${
                user && user.admin
                  ? "bg-gray-400 cursor-not-allowed text-gray-600"
                  : "text-orange-500 border-2 border-orange-400 hover:bg-orange-500 hover:text-white"
              }  px-14 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 mr-2`}
              disabled={user && user.admin}
            >
              Thêm vào giỏ hàng
            </button>
            <button
              onClick={buyNow}
              className={`${
                user && user.admin
                  ? "bg-gray-400 cursor-not-allowed text-gray-600"
                  : "bg-gradient-to-r from-yellow-500 to-orange-600 hover:from-yellow-600 hover:to-orange-700"
              } text-white rounded-lg px-6 py-[14px] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2`}
              disabled={user && user.admin}
            >
              <p className="italic font-extralight flex items-center gap-2">
                {" "}
                Mua với{" "}
                <img
                  src={process.env.PUBLIC_URL + "/images/VNPay_Icon.jpg"}
                  alt="VNPay"
                  className="w-10 h-6"
                />
                VNPay{" "}
              </p>
            </button>
          </div>
        </div>
      </div>

      <div className="mt-8 bg-white shadow-lg rounded-lg overflow-hidden p-8">
        {/* Form nhập bình luận */}
        <div className="mt-8">
          <h4 className="text-xl font-semibold mb-8">Đánh giá và bình luận:</h4>
          <div className="mb-4 flex items-center">
            {[1, 2, 3, 4, 5].map((value) => (
              <FaStar
                key={value}
                className={`cursor-pointer text-xl ${
                  value <= rating ? "text-yellow-500" : "text-gray-400"
                }`}
                onClick={() => handleRatingChange(value)}
              />
            ))}
          </div>
          <textarea
            className="w-full border border-gray-300 p-2 rounded-lg mb-4"
            rows="3"
            placeholder="Viết bình luận của bạn ở đây..."
            value={commentText}
            onChange={handleCommentChange}
          />
          <button
            onClick={postComment}
            className={`${
              user?.admin
                ? "bg-gray-400 cursor-not-allowed text-gray-600"
                : "bg-gradient-to-r from-yellow-200 to-orange-300 text-orange-500 px-6 py-3 hover:from-yellow-400 hover:to-orange-500 hover:text-white"
            } px-4 py-2 rounded-lg`}
          >
            Đăng bình luận
          </button>
        </div>
        {/* Toggle Comments Section */}
        <div className="flex items-center justify-center">
          <button
            onClick={() => setShowComments(!showComments)}
            className=" bg-gradient-to-r from-yellow-200 to-orange-300 text-orange-500 px-6 py-3 hover:from-yellow-400 hover:to-orange-500 hover:text-white rounded-lg"
          >
            {showComments ? "Ẩn bình luận" : "Hiển thị bình luận"}
          </button>
        </div>

        {/* Hiển thị các comment */}
        {showComments && (
          <div className="mt-4 p-8 ">
            {/* Hiển thị các bình luận */}
            <div className="mt-8">
              <h4 className="text-xl font-semibold mb-4">Bình luận:</h4>
              {book.comments.map((comment, index) => (
                <div key={index} className="mb-4">
                  <div className="flex items-center mb-2">
                    <FaUserCircle className="mr-2 text-gray-500" />
                    <span className="font-semibold text-gray-700">
                      {comment.author.fullname}
                    </span>
                  </div>
                  <p className="text-gray-700 mb-2">{comment.comment}</p>
                  <div className="flex items-center mb-2">
                    {[1, 2, 3, 4, 5].map((value) => (
                      <FaStar
                        key={value}
                        className={`text-xl ${
                          value <= comment.rating
                            ? "text-yellow-500"
                            : "text-gray-400"
                        }`}
                      />
                    ))}
                  </div>
                  <p className="text-gray-500 text-sm">
                    {format(new Date(comment.createdAt), "dd/MM/yyyy")}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookDetail;
