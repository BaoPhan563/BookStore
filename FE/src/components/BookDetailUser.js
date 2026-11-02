import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import axios from "../axiosConfig";
import { getToken, getGoogleToken } from "../components/Login/app/static";
import { FaMinus, FaPlus, FaStar, FaUserCircle } from "react-icons/fa";
import {
  AiOutlineShoppingCart,
  AiOutlineThunderbolt,
  AiOutlineArrowLeft,
  AiOutlineCheck,
} from "react-icons/ai";
import { FiBookOpen, FiTruck, FiShield, FiRotateCcw } from "react-icons/fi";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { format } from "date-fns";

const BookDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [book, setBook] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [commentText, setCommentText] = useState("");
  const [rating, setRating] = useState(5);
  const [user, setUser] = useState(null);
  const [submittingComment, setSubmittingComment] = useState(false);
  const [addingToCart, setAddingToCart] = useState(false);

  useEffect(() => {
    fetchBook();
    fetchUserData();
  }, [id]);

  const fetchBook = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`/books/${id}`);
      setBook(response.data);
      if (response.data.imageurls && response.data.imageurls.length > 0) {
        const defaultImg = response.data.imageurls.find((img) => img.defaultImg);
        setSelectedImage(defaultImg || response.data.imageurls[0]);
      }
      setQuantity(1);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserData = async () => {
    try {
      const token = getToken() || getGoogleToken();
      if (!token) return;
      const response = await axios.get(`/users/profile`);
      setUser(response.data);
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  const increaseQuantity = () => {
    if (!book) return;
    if (quantity < book.quantity) {
      setQuantity(quantity + 1);
    } else {
      toast.warning(`Rất tiếc, kho chỉ còn tối đa ${book.quantity} cuốn sách này.`);
    }
  };

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const addToCart = async () => {
    if (user && user.admin) {
      toast.error("Tài khoản Quản trị viên không thể mua hàng.");
      return;
    }
    const token = getToken() || getGoogleToken();
    if (!token) {
      toast.warning("Bạn chưa đăng nhập! Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng.");
      setTimeout(() => {
        navigate("/login", {
          state: {
            from: `/book/${id}`,
            message: "Vui lòng đăng nhập để tiếp tục thêm sản phẩm vào giỏ hàng!",
          },
        });
      }, 1000);
      return;
    }
    if (book.quantity <= 0) {
      toast.error("Sách này hiện đã tạm hết hàng trong kho!");
      return;
    }
    if (quantity > book.quantity) {
      toast.warning(`Số lượng chọn vượt quá số lượng trong kho (còn ${book.quantity} cuốn).`);
      return;
    }

    setAddingToCart(true);
    try {
      await axios.post(`/cart`, {
        book: book._id,
        price: book.price,
        quantity: quantity,
      });
      toast.success(`Đã thêm ${quantity} cuốn "${book.title}" vào giỏ hàng thành công!`);
    } catch (err) {
      console.error("Error adding item to cart:", err.message);
      if (err.response?.status === 401) {
        toast.warning("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại để tiếp tục!");
      } else if (err.response?.data?.message) {
        toast.error(err.response.data.message);
      } else {
        toast.error("Không thể thêm vào giỏ hàng lúc này. Vui lòng thử lại sau!");
      }
    } finally {
      setAddingToCart(false);
    }
  };

  const buyNow = () => {
    if (user && user.admin) {
      toast.error("Tài khoản Quản trị viên không thể mua hàng.");
      return;
    }
    const token = getToken() || getGoogleToken();
    if (!token) {
      toast.warning("Bạn chưa đăng nhập! Vui lòng đăng nhập để tiến hành mua sách.");
      setTimeout(() => {
        navigate("/login", {
          state: {
            from: `/book/${id}`,
            message: "Vui lòng đăng nhập để tiếp tục mua hàng!",
          },
        });
      }, 1000);
      return;
    }
    if (book.quantity <= 0) {
      toast.error("Sách này hiện đã tạm hết hàng trong kho!");
      return;
    }
    if (quantity > book.quantity) {
      toast.warning(`Số lượng chọn vượt quá số lượng trong kho (còn ${book.quantity} cuốn).`);
      return;
    }

    // Direct checkout with this item
    const checkoutCart = [
      {
        _id: "instant_" + Date.now(),
        book: book,
        quantity: quantity,
        price: book.price,
        total_price: book.price * quantity,
      },
    ];

    navigate("/payment", { state: { cart: checkoutCart } });
  };

  const postComment = async (e) => {
    e.preventDefault();
    if (user && user.admin) {
      toast.error("Tài khoản Quản trị viên không thể đăng bình luận.");
      return;
    }
    const token = getToken() || getGoogleToken();
    if (!token) {
      toast.warning("Bạn chưa đăng nhập! Vui lòng đăng nhập để gửi đánh giá.");
      setTimeout(() => {
        navigate("/login", {
          state: {
            from: `/book/${id}`,
            message: "Vui lòng đăng nhập để viết nhận xét và đánh giá sách!",
          },
        });
      }, 1000);
      return;
    }
    if (!commentText.trim()) {
      toast.warning("Vui lòng nhập nội dung đánh giá của bạn trước khi gửi.");
      return;
    }

    setSubmittingComment(true);
    try {
      await axios.post(`/books/${id}/comments`, {
        comment: commentText.trim(),
        rating: rating,
      });
      toast.success("Cảm ơn bạn! Đánh giá đã được ghi nhận.");
      setCommentText("");
      setRating(5);
      fetchBook();
    } catch (err) {
      console.error("Error posting comment:", err);
      if (err.response?.status === 401) {
        toast.warning("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại!");
      } else {
        const msg = err.response?.data?.message || "Không thể gửi bình luận lúc này. Vui lòng thử lại sau!";
        toast.error(msg);
      }
    } finally {
      setSubmittingComment(false);
    }
  };

  const formatPrice = (price) => {
    if (price === undefined || price === null) return "0";
    return Number(price).toLocaleString("vi-VN");
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-16 max-w-5xl">
        <div className="animate-pulse grid grid-cols-1 md:grid-cols-12 gap-8 bg-white p-8 rounded-3xl border border-slate-100">
          <div className="md:col-span-5 aspect-[3/4] bg-slate-200 rounded-2xl"></div>
          <div className="md:col-span-7 space-y-4">
            <div className="h-8 bg-slate-200 rounded w-3/4"></div>
            <div className="h-4 bg-slate-200 rounded w-1/3"></div>
            <div className="h-10 bg-slate-200 rounded w-1/2"></div>
            <div className="h-24 bg-slate-200 rounded"></div>
            <div className="h-12 bg-slate-200 rounded w-2/3"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !book) {
    return (
      <div className="container mx-auto px-4 py-20 text-center max-w-md">
        <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-xs">
          <p className="text-red-500 font-bold mb-2">Không tìm thấy thông tin sách</p>
          <p className="text-xs text-slate-500 mb-6">{error || "Sách không tồn tại hoặc đã bị xóa."}</p>
          <Link
            to="/"
            className="inline-flex items-center space-x-2 px-5 py-2.5 bg-orange-600 text-white rounded-xl text-xs font-bold hover:bg-orange-700 transition-all"
          >
            <AiOutlineArrowLeft className="w-4 h-4" />
            <span>Quay lại trang chủ</span>
          </Link>
        </div>
      </div>
    );
  }

  const isOutOfStock = book.quantity <= 0;
  const currentRating = Number(book.total_rating) || 5;
  const defaultImgUrl =
    selectedImage?.imageUrl ||
    (book.imageurls && book.imageurls[0]?.imageUrl) ||
    "https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&q=80&w=800";

  return (
    <div className="min-h-screen bg-slate-50/60 py-8 lg:py-12">
      <ToastContainer position="top-right" autoClose={3000} />

      <div className="container mx-auto px-4 lg:px-8 max-w-6xl">
        {/* Breadcrumb / Back Link */}
        <div className="mb-6">
          <Link
            to="/"
            className="inline-flex items-center space-x-2 text-sm font-semibold text-slate-500 hover:text-orange-600 transition-colors"
          >
            <AiOutlineArrowLeft className="w-4 h-4" />
            <span>Về danh sách sách</span>
          </Link>
        </div>

        {/* Main Product Card */}
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden p-6 lg:p-10 mb-10">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12">
            
            {/* Left: Gallery */}
            <div className="md:col-span-5 flex flex-col items-center">
              {/* Main Photo */}
              <div className="w-full max-w-sm aspect-[3/4] rounded-2xl overflow-hidden bg-slate-100 border border-slate-100 shadow-md mb-4 flex items-center justify-center relative group">
                <img
                  src={defaultImgUrl}
                  alt={book.title}
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                  onError={(e) => {
                    e.target.src =
                      "https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&q=80&w=800";
                  }}
                />
                {isOutOfStock && (
                  <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center">
                    <span className="px-4 py-2 bg-red-600 text-white text-xs font-bold uppercase tracking-wider rounded-xl shadow-lg">
                      Tạm hết hàng
                    </span>
                  </div>
                )}
              </div>

              {/* Thumbnail Strip */}
              {book.imageurls && book.imageurls.length > 1 && (
                <div className="flex space-x-3 overflow-x-auto pb-2 w-full justify-center">
                  {book.imageurls.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImage(image)}
                      className={`w-16 h-20 rounded-xl overflow-hidden border-2 transition-all shrink-0 ${
                        selectedImage?.imageUrl === image.imageUrl
                          ? "border-orange-500 ring-2 ring-orange-500/20 shadow-xs scale-105"
                          : "border-slate-200 opacity-70 hover:opacity-100"
                      }`}
                    >
                      <img
                        src={image.imageUrl}
                        alt={`Ảnh ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Right: Info & Actions */}
            <div className="md:col-span-7 flex flex-col justify-between">
              <div>
                
                {/* Genre & Stock Badge */}
                <div className="flex items-center space-x-3 mb-3">
                  {book.genre && (
                    <span className="px-3 py-1 rounded-full text-xs font-semibold bg-orange-100/70 text-orange-700">
                      {book.genre}
                    </span>
                  )}
                  {isOutOfStock ? (
                    <span className="inline-flex items-center text-xs font-semibold text-red-600">
                      <span className="w-2 h-2 rounded-full bg-red-500 mr-1.5"></span>
                      Hết hàng
                    </span>
                  ) : (
                    <span className="inline-flex items-center text-xs font-semibold text-emerald-600">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 mr-1.5"></span>
                      Còn hàng ({book.quantity} cuốn)
                    </span>
                  )}
                </div>

                {/* Title */}
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 font-serif leading-tight mb-3">
                  {book.title}
                </h1>

                {/* Ratings and Stats */}
                <div className="flex items-center space-x-4 mb-6 text-sm">
                  <div className="flex items-center space-x-1.5 text-amber-500">
                    <div className="flex">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <FaStar
                          key={s}
                          className={`w-4 h-4 ${
                            s <= Math.round(currentRating) ? "text-amber-400" : "text-slate-200"
                          }`}
                        />
                      ))}
                    </div>
                    <span className="font-bold text-slate-800 ml-1">
                      {currentRating > 0 ? currentRating.toFixed(1) : "5.0"}
                    </span>
                  </div>
                  <span className="text-slate-300">|</span>
                  <span className="text-slate-500">
                    {book.comments?.length || 0} lượt đánh giá
                  </span>
                </div>

                {/* Price Box */}
                <div className="bg-orange-50/50 rounded-2xl p-4 sm:p-5 border border-orange-100/80 mb-6 flex items-baseline space-x-3">
                  <span className="text-3xl sm:text-4xl font-extrabold text-orange-600 tracking-tight">
                    {formatPrice(book.price)}₫
                  </span>
                  <span className="text-xs font-medium text-slate-400">Đã bao gồm VAT</span>
                </div>

                {/* Metadata Table */}
                <div className="space-y-2.5 text-sm mb-6 border-y border-slate-100 py-4">
                  <div className="flex">
                    <span className="w-32 text-slate-400 font-medium">Tác giả:</span>
                    <span className="font-semibold text-slate-800">{book.author || "Đang cập nhật"}</span>
                  </div>
                  <div className="flex">
                    <span className="w-32 text-slate-400 font-medium">Nhà xuất bản:</span>
                    <span className="font-semibold text-slate-800">{book.publisher || "NXB Tổng Hợp"}</span>
                  </div>
                  <div className="flex">
                    <span className="w-32 text-slate-400 font-medium">Thể loại:</span>
                    <span className="font-semibold text-slate-800">{book.genre || "Sách hay"}</span>
                  </div>
                </div>

                {/* Quantity Selector */}
                {!isOutOfStock && (
                  <div className="flex items-center space-x-4 mb-8">
                    <span className="text-sm font-semibold text-slate-700">Số lượng:</span>
                    <div className="flex items-center border border-slate-200 rounded-xl bg-slate-50 p-1">
                      <button
                        onClick={decreaseQuantity}
                        disabled={quantity <= 1}
                        className="w-8 h-8 rounded-lg bg-white flex items-center justify-center text-slate-600 hover:text-orange-600 shadow-2xs disabled:opacity-40 disabled:hover:text-slate-600 transition-colors"
                      >
                        <FaMinus className="w-3 h-3" />
                      </button>
                      <span className="w-12 text-center font-bold text-slate-800 text-sm">
                        {quantity}
                      </span>
                      <button
                        onClick={increaseQuantity}
                        disabled={quantity >= book.quantity}
                        className="w-8 h-8 rounded-lg bg-white flex items-center justify-center text-slate-600 hover:text-orange-600 shadow-2xs disabled:opacity-40 disabled:hover:text-slate-600 transition-colors"
                      >
                        <FaPlus className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="space-y-3 pt-2">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <button
                    onClick={addToCart}
                    disabled={isOutOfStock || (user && user.admin) || addingToCart}
                    className={`py-3.5 px-6 rounded-xl font-bold text-sm flex items-center justify-center space-x-2 transition-all ${
                      isOutOfStock || (user && user.admin)
                        ? "bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200"
                        : "bg-orange-50 text-orange-600 border border-orange-200 hover:bg-orange-100 hover:border-orange-300 active:scale-98"
                    }`}
                  >
                    <AiOutlineShoppingCart className="w-5 h-5" />
                    <span>Thêm vào giỏ</span>
                  </button>

                  <button
                    onClick={buyNow}
                    disabled={isOutOfStock || (user && user.admin)}
                    className={`py-3.5 px-6 rounded-xl font-bold text-sm text-white flex items-center justify-center space-x-2 transition-all ${
                      isOutOfStock || (user && user.admin)
                        ? "bg-slate-300 cursor-not-allowed"
                        : "bg-gradient-to-r from-orange-600 to-amber-500 hover:from-orange-700 hover:to-amber-600 shadow-md shadow-orange-500/25 active:scale-98"
                    }`}
                  >
                    <AiOutlineThunderbolt className="w-5 h-5" />
                    <span>Mua ngay</span>
                  </button>
                </div>

                {/* Guarantee Badges */}
                <div className="grid grid-cols-3 gap-2 pt-3 text-[11px] text-slate-500 text-center">
                  <div className="flex items-center justify-center space-x-1 p-2 rounded-lg bg-slate-50">
                    <FiTruck className="w-3.5 h-3.5 text-orange-500" />
                    <span>Giao hàng toàn quốc</span>
                  </div>
                  <div className="flex items-center justify-center space-x-1 p-2 rounded-lg bg-slate-50">
                    <FiRotateCcw className="w-3.5 h-3.5 text-orange-500" />
                    <span>Đổi trả 7 ngày</span>
                  </div>
                  <div className="flex items-center justify-center space-x-1 p-2 rounded-lg bg-slate-50">
                    <FiShield className="w-3.5 h-3.5 text-orange-500" />
                    <span>Chính hãng 100%</span>
                  </div>
                </div>
              </div>

            </div>

          </div>
        </div>

        {/* Description Section */}
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs p-6 lg:p-10 mb-10">
          <h2 className="text-xl font-bold text-slate-900 font-serif mb-4 flex items-center space-x-2">
            <FiBookOpen className="w-5 h-5 text-orange-600" />
            <span>Mô tả cuốn sách</span>
          </h2>
          <div className="prose max-w-none text-slate-600 text-sm sm:text-base leading-relaxed whitespace-pre-line">
            {book.description || "Cuốn sách chưa có phần mô tả chi tiết từ ban biên tập."}
          </div>
        </div>

        {/* Reviews & Comments Section */}
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs p-6 lg:p-10">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-xl font-bold text-slate-900 font-serif">
              Đánh giá từ độc giả ({book.comments?.length || 0})
            </h2>
          </div>

          {/* New Review Form */}
          <form onSubmit={postComment} className="bg-slate-50/80 rounded-2xl p-6 border border-slate-200/80 mb-10">
            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-4">
              Gửi nhận xét của bạn
            </h3>

            {/* Rating Stars Input */}
            <div className="flex items-center space-x-2 mb-4">
              <span className="text-xs font-semibold text-slate-600">Đánh giá sao:</span>
              <div className="flex space-x-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    className="p-1 focus:outline-none transition-transform hover:scale-110"
                  >
                    <FaStar
                      className={`w-6 h-6 ${
                        star <= rating ? "text-amber-400" : "text-slate-200"
                      }`}
                    />
                  </button>
                ))}
              </div>
              <span className="text-xs font-bold text-amber-600 ml-2">
                {rating === 5
                  ? "Tuyệt vời"
                  : rating === 4
                  ? "Hài lòng"
                  : rating === 3
                  ? "Bình thường"
                  : rating === 2
                  ? "Chưa hài lòng"
                  : "Kém"}
              </span>
            </div>

            {/* Comment Textarea */}
            <textarea
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              rows="3"
              placeholder="Chia sẻ cảm nghĩ của bạn về nội dung, chất lượng in ấn cuốn sách..."
              className="w-full p-4 rounded-xl border border-slate-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 mb-4"
              required
            ></textarea>

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={submittingComment || (user && user.admin)}
                className="px-6 py-2.5 bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold rounded-xl shadow-xs transition-all disabled:opacity-50"
              >
                {submittingComment ? "Đang gửi..." : "Gửi đánh giá"}
              </button>
            </div>
          </form>

          {/* Comment List */}
          {book.comments && book.comments.length > 0 ? (
            <div className="space-y-6 divide-y divide-slate-100">
              {book.comments.map((comment, index) => {
                const commentDate = comment.createdAt
                  ? format(new Date(comment.createdAt), "dd/MM/yyyy HH:mm")
                  : "Gần đây";
                const authorName =
                  (comment.author && (comment.author.fullname || comment.author.username)) ||
                  "Độc giả";

                return (
                  <div key={index} className={index > 0 ? "pt-6" : ""}>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-3">
                        <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-slate-200 to-slate-100 flex items-center justify-center font-bold text-slate-700 text-xs">
                          {authorName.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-slate-800">{authorName}</p>
                          <div className="flex text-amber-400 text-xs">
                            {[1, 2, 3, 4, 5].map((s) => (
                              <FaStar
                                key={s}
                                className={s <= (comment.rating || 5) ? "text-amber-400" : "text-slate-200"}
                              />
                            ))}
                          </div>
                        </div>
                      </div>
                      <span className="text-xs text-slate-400">{commentDate}</span>
                    </div>
                    <p className="text-sm text-slate-700 pl-12 leading-relaxed">
                      {comment.comment}
                    </p>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-10 text-slate-400 text-sm">
              Chưa có bình luận nào cho cuốn sách này. Hãy là người đầu tiên chia sẻ cảm nhận!
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default BookDetail;
