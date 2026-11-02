import React, { useState, useEffect } from "react";
import axios from "../axiosConfig";
import { Link, useNavigate } from "react-router-dom";
import { getToken, getGoogleToken } from "../components/Login/app/static";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  AiOutlineShoppingCart,
  AiFillStar,
  AiOutlineStar,
  AiOutlineFilter,
  AiOutlineReload,
  AiOutlineCheckCircle,
} from "react-icons/ai";
import { FiBookOpen, FiTruck, FiShield, FiCreditCard } from "react-icons/fi";

const BookList = ({ searchTerm = "" }) => {
  const navigate = useNavigate();
  const [books, setBooks] = useState([]);
  const [genres, setGenres] = useState([]);
  const [selectedGenre, setSelectedGenre] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [ratingFilter, setRatingFilter] = useState(0);
  const [sortBy, setSortBy] = useState("default");
  const [addingBookId, setAddingBookId] = useState(null);

  useEffect(() => {
    fetchBooks();
    fetchUserData();
    fetchGenres();
  }, []);

  const fetchBooks = async () => {
    setLoading(true);
    try {
      const response = await axios.get("/books");
      if (Array.isArray(response.data)) {
        setBooks(response.data);
      } else {
        setBooks([]);
      }
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchGenres = async () => {
    try {
      const response = await axios.get("/books/allgenre");
      if (Array.isArray(response.data)) {
        setGenres(response.data.filter(Boolean));
      }
    } catch (err) {
      console.error("Error fetching genres:", err);
    }
  };

  const fetchUserData = async () => {
    try {
      const token = getToken() || getGoogleToken();
      if (!token) return;
      const response = await axios.get("/users/profile");
      setUser(response.data);
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  const addToCart = async (book) => {
    if (user && user.admin) {
      toast.error("Tài khoản Quản trị viên không thể mua hàng.");
      return;
    }
    const token = getToken() || getGoogleToken();
    if (!token) {
      toast.warning("Bạn chưa đăng nhập! Vui lòng đăng nhập để thêm sách vào giỏ hàng.");
      setTimeout(() => {
        navigate("/login", {
          state: {
            from: "/",
            message: "Vui lòng đăng nhập để tiếp tục thêm sách vào giỏ hàng!",
          },
        });
      }, 1000);
      return;
    }
    if (book.quantity <= 0) {
      toast.error("Sách này hiện đã tạm hết hàng trong kho!");
      return;
    }

    setAddingBookId(book._id);
    try {
      await axios.post("/cart", {
        book: book._id,
        price: book.price,
        quantity: 1,
      });
      toast.success(`Đã thêm "${book.title}" vào giỏ hàng thành công!`);
    } catch (err) {
      console.error("Error adding to cart:", err.message);
      if (err.response?.status === 401) {
        toast.warning("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại để tiếp tục!");
      } else if (err.response?.data?.message) {
        toast.error(err.response.data.message);
      } else {
        toast.error("Không thể thêm sách vào giỏ hàng lúc này. Vui lòng thử lại sau!");
      }
    } finally {
      setAddingBookId(null);
    }
  };

  const handlePriceQuickFilter = (min, max) => {
    setMinPrice(min);
    setMaxPrice(max);
  };

  const resetFilters = () => {
    setMinPrice("");
    setMaxPrice("");
    setRatingFilter(0);
    setSelectedGenre("all");
    setSortBy("default");
    fetchBooks();
  };

  const formatPrice = (price) => {
    if (price === undefined || price === null) return "0";
    return Number(price).toLocaleString("vi-VN");
  };

  // Filter & Sort Logic
  const filteredAndSortedBooks = books
    .filter((book) => {
      if (!book || book.status === false) return false;

      // Text search
      if (searchTerm) {
        const query = searchTerm.toLowerCase();
        const titleMatch = book.title && book.title.toLowerCase().includes(query);
        const authorMatch = book.author && book.author.toLowerCase().includes(query);
        if (!titleMatch && !authorMatch) return false;
      }

      // Genre filter
      if (selectedGenre !== "all" && book.genre !== selectedGenre) {
        return false;
      }

      // Price filter
      const price = Number(book.price) || 0;
      if (minPrice !== "" && price < Number(minPrice)) return false;
      if (maxPrice !== "" && price > Number(maxPrice)) return false;

      // Rating filter
      if (ratingFilter > 0) {
        const rating = Number(book.total_rating) || 0;
        if (rating < ratingFilter) return false;
      }

      return true;
    })
    .sort((a, b) => {
      if (sortBy === "price-asc") {
        return (a.price || 0) - (b.price || 0);
      }
      if (sortBy === "price-desc") {
        return (b.price || 0) - (a.price || 0);
      }
      if (sortBy === "rating") {
        return (b.total_rating || 0) - (a.total_rating || 0);
      }
      if (sortBy === "name") {
        return (a.title || "").localeCompare(b.title || "");
      }
      return 0; // Default
    });

  const hasActiveFilters =
    minPrice !== "" ||
    maxPrice !== "" ||
    ratingFilter > 0 ||
    selectedGenre !== "all" ||
    sortBy !== "default" ||
    searchTerm !== "";

  return (
    <div className="min-h-screen bg-slate-50/60 pb-16">
      <ToastContainer position="top-right" autoClose={3000} />

      {/* Hero Banner Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-orange-950 text-white pt-12 pb-16 lg:py-20 mb-8">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none"></div>
        <div className="container mx-auto px-4 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            <div className="lg:col-span-7 space-y-5 text-center lg:text-left">
              <span className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-orange-500/20 text-orange-400 text-xs font-semibold tracking-wide uppercase border border-orange-500/30">
                <FiBookOpen className="w-4 h-4" />
                <span>Nhà sách trực tuyến thế hệ mới</span>
              </span>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight font-serif leading-tight">
                Nuôi dưỡng tâm hồn <br />
                <span className="bg-gradient-to-r from-orange-400 via-amber-300 to-amber-200 bg-clip-text text-transparent">
                  qua từng trang sách hay
                </span>
              </h1>
              <p className="text-slate-300 text-base sm:text-lg max-w-xl mx-auto lg:mx-0 font-normal">
                Hàng ngàn tựa sách kinh điển, văn học, kỹ năng và phát triển bản thân được tuyển chọn kĩ lưỡng với mức giá tốt nhất cùng giao hàng hỏa tốc.
              </p>
              
              {/* Trust Badges */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 max-w-2xl mx-auto lg:mx-0 text-xs text-slate-300">
                <div className="flex items-center space-x-2 bg-white/5 backdrop-blur-xs p-2.5 rounded-xl border border-white/10">
                  <FiTruck className="w-4 h-4 text-orange-400 shrink-0" />
                  <span>Freeship từ 250k</span>
                </div>
                <div className="flex items-center space-x-2 bg-white/5 backdrop-blur-xs p-2.5 rounded-xl border border-white/10">
                  <FiShield className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>100% Chính hãng</span>
                </div>
                <div className="flex items-center space-x-2 bg-white/5 backdrop-blur-xs p-2.5 rounded-xl border border-white/10">
                  <AiOutlineCheckCircle className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>Đổi trả 7 ngày</span>
                </div>
                <div className="flex items-center space-x-2 bg-white/5 backdrop-blur-xs p-2.5 rounded-xl border border-white/10">
                  <FiCreditCard className="w-4 h-4 text-cyan-400 shrink-0" />
                  <span>VNPay & PayPal</span>
                </div>
              </div>
            </div>

            {/* Hero Visual Mockup */}
            <div className="lg:col-span-5 hidden lg:flex justify-center">
              <div className="relative group">
                <div className="w-72 h-96 bg-gradient-to-tr from-orange-500/20 to-amber-400/20 rounded-3xl blur-2xl absolute -inset-4 transform -rotate-6"></div>
                <div className="relative w-64 h-88 bg-gradient-to-br from-amber-700 via-orange-800 to-slate-900 rounded-2xl shadow-2xl p-6 text-white border border-white/10 flex flex-col justify-between transform rotate-2 hover:rotate-0 transition-transform duration-300">
                  <div className="space-y-2">
                    <span className="text-[10px] tracking-widest uppercase text-amber-300/80 font-bold">Best Seller</span>
                    <h3 className="text-2xl font-bold font-serif leading-snug">Hành Trình Khám Phá Tri Thức Mới</h3>
                    <p className="text-xs text-slate-300">Cập nhật mỗi tuần với những ấn bản bán chạy nhất toàn quốc.</p>
                  </div>
                  <div className="pt-4 border-t border-white/10 flex justify-between items-center text-xs">
                    <span className="text-amber-300 font-semibold">Ưu đãi đến -40%</span>
                    <span className="px-3 py-1 bg-white/10 rounded-full font-medium">Khám phá ngay</span>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <div className="container mx-auto px-4 lg:px-8">
        
        {/* Genre Pill Selector */}
        {genres.length > 0 && (
          <div className="mb-6 flex items-center space-x-2 overflow-x-auto pb-2 scrollbar-none">
            <button
              onClick={() => setSelectedGenre("all")}
              className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                selectedGenre === "all"
                  ? "bg-slate-900 text-white shadow-sm"
                  : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
              }`}
            >
              Tất cả thể loại
            </button>
            {genres.map((genre) => (
              <button
                key={genre}
                onClick={() => setSelectedGenre(genre)}
                className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                  selectedGenre === genre
                    ? "bg-orange-600 text-white shadow-sm shadow-orange-600/30"
                    : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
                }`}
              >
                {genre}
              </button>
            ))}
          </div>
        )}

        {/* Filters & Sorting Bar */}
        <div className="bg-white rounded-2xl p-4 lg:p-5 shadow-xs border border-slate-200/80 mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            
            {/* Quick Price Ranges */}
            <div className="flex flex-wrap items-center gap-2 text-xs">
              <span className="font-semibold text-slate-700 flex items-center mr-1">
                <AiOutlineFilter className="w-4 h-4 mr-1 text-slate-500" />
                Lọc giá:
              </span>
              <button
                onClick={() => handlePriceQuickFilter("", "100000")}
                className={`px-3 py-1.5 rounded-lg border transition-all ${
                  maxPrice === "100000" && minPrice === ""
                    ? "bg-orange-50 border-orange-400 text-orange-700 font-medium"
                    : "border-slate-200 text-slate-600 hover:bg-slate-50"
                }`}
              >
                Dưới 100k
              </button>
              <button
                onClick={() => handlePriceQuickFilter("100000", "250000")}
                className={`px-3 py-1.5 rounded-lg border transition-all ${
                  minPrice === "100000" && maxPrice === "250000"
                    ? "bg-orange-50 border-orange-400 text-orange-700 font-medium"
                    : "border-slate-200 text-slate-600 hover:bg-slate-50"
                }`}
              >
                100k - 250k
              </button>
              <button
                onClick={() => handlePriceQuickFilter("250000", "500000")}
                className={`px-3 py-1.5 rounded-lg border transition-all ${
                  minPrice === "250000" && maxPrice === "500000"
                    ? "bg-orange-50 border-orange-400 text-orange-700 font-medium"
                    : "border-slate-200 text-slate-600 hover:bg-slate-50"
                }`}
              >
                250k - 500k
              </button>
              <button
                onClick={() => handlePriceQuickFilter("500000", "")}
                className={`px-3 py-1.5 rounded-lg border transition-all ${
                  minPrice === "500000" && maxPrice === ""
                    ? "bg-orange-50 border-orange-400 text-orange-700 font-medium"
                    : "border-slate-200 text-slate-600 hover:bg-slate-50"
                }`}
              >
                Trên 500k
              </button>
            </div>

            {/* Rating Filter & Sort Selector */}
            <div className="flex flex-wrap items-center gap-3">
              {/* Rating Selector */}
              <div className="flex items-center space-x-1 text-xs">
                <span className="font-semibold text-slate-700 mr-1">Đánh giá:</span>
                {[0, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() => setRatingFilter(star)}
                    className={`px-2.5 py-1.5 rounded-lg border flex items-center space-x-1 ${
                      ratingFilter === star
                        ? "bg-amber-50 border-amber-400 text-amber-800 font-medium"
                        : "border-slate-200 text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    {star === 0 ? (
                      <span>Tất cả</span>
                    ) : (
                      <>
                        <span>{star}</span>
                        <AiFillStar className="w-3.5 h-3.5 text-amber-400" />
                        <span>+</span>
                      </>
                    )}
                  </button>
                ))}
              </div>

              {/* Sort Dropdown */}
              <div className="flex items-center space-x-2 text-xs">
                <span className="font-semibold text-slate-700">Sắp xếp:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="bg-slate-50 border border-slate-200 text-slate-800 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-orange-500 font-medium"
                >
                  <option value="default">Mới nhất / Mặc định</option>
                  <option value="price-asc">Giá: Thấp đến Cao</option>
                  <option value="price-desc">Giá: Cao đến Thấp</option>
                  <option value="rating">Đánh giá cao nhất</option>
                  <option value="name">Tên: A-Z</option>
                </select>
              </div>

              {/* Reset Filters button */}
              {hasActiveFilters && (
                <button
                  onClick={resetFilters}
                  className="flex items-center space-x-1 px-3 py-1.5 rounded-lg text-xs font-semibold text-red-600 hover:bg-red-50 transition-colors"
                  title="Đặt lại bộ lọc"
                >
                  <AiOutlineReload className="w-3.5 h-3.5" />
                  <span>Xóa lọc</span>
                </button>
              )}
            </div>

          </div>
        </div>

        {/* Results Counter */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-sm text-slate-500">
            Hiển thị <span className="font-bold text-slate-800">{filteredAndSortedBooks.length}</span> cuốn sách
            {searchTerm && <span> cho từ khóa "{searchTerm}"</span>}
          </p>
        </div>

        {/* Loading State Skeleton */}
        {loading && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 lg:gap-6">
            {[...Array(10)].map((_, i) => (
              <div key={i} className="bg-white rounded-2xl p-4 border border-slate-100 animate-pulse">
                <div className="w-full aspect-[3/4] bg-slate-200 rounded-xl mb-3"></div>
                <div className="h-4 bg-slate-200 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-slate-200 rounded w-1/2 mb-3"></div>
                <div className="h-5 bg-slate-200 rounded w-1/3 mb-4"></div>
                <div className="h-9 bg-slate-200 rounded-xl w-full"></div>
              </div>
            ))}
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-8 rounded-2xl text-center max-w-md mx-auto my-12">
            <p className="font-semibold mb-2">Không thể tải danh sách sách</p>
            <p className="text-xs text-red-600 mb-4">{error}</p>
            <button
              onClick={fetchBooks}
              className="px-4 py-2 bg-red-600 text-white rounded-xl text-xs font-semibold hover:bg-red-700"
            >
              Thử lại
            </button>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && filteredAndSortedBooks.length === 0 && (
          <div className="bg-white rounded-3xl p-12 text-center max-w-lg mx-auto my-12 border border-slate-200/80 shadow-xs">
            <div className="w-16 h-16 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center mx-auto mb-4">
              <FiBookOpen className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-slate-800 mb-1">Không tìm thấy sách phù hợp</h3>
            <p className="text-sm text-slate-500 mb-6">
              Hãy thử thay đổi từ khóa tìm kiếm hoặc bỏ các tiêu chí lọc giá và đánh giá.
            </p>
            <button
              onClick={resetFilters}
              className="px-5 py-2.5 bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold rounded-xl shadow-sm transition-all"
            >
              Xem tất cả sách
            </button>
          </div>
        )}

        {/* Book Grid */}
        {!loading && !error && filteredAndSortedBooks.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 lg:gap-6">
            {filteredAndSortedBooks.map((book) => {
              const coverImg =
                book.imageurls && book.imageurls.length > 0
                  ? book.imageurls.find((img) => img.defaultImg)?.imageUrl ||
                    book.imageurls[0].imageUrl
                  : "https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&q=80&w=600";

              const rating = Number(book.total_rating) || 5;
              const isOutOfStock = book.quantity <= 0;

              return (
                <div
                  key={book._id}
                  className="group bg-white rounded-2xl overflow-hidden border border-slate-150 shadow-xs hover:shadow-xl hover:shadow-orange-500/10 hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between"
                >
                  {/* Top Cover Image Area */}
                  <Link to={`/book/${book._id}`} className="block relative overflow-hidden bg-slate-100">
                    <div className="aspect-[3/4] w-full overflow-hidden">
                      <img
                        src={coverImg}
                        alt={book.title}
                        loading="lazy"
                        className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                        onError={(e) => {
                          e.target.src =
                            "https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&q=80&w=600";
                        }}
                      />
                    </div>

                    {/* Stock Status Pill */}
                    <div className="absolute top-2.5 left-2.5">
                      {isOutOfStock ? (
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-red-600/90 text-white backdrop-blur-xs">
                          Hết hàng
                        </span>
                      ) : (
                        book.genre && (
                          <span className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-slate-900/70 text-white backdrop-blur-xs">
                            {book.genre}
                          </span>
                        )
                      )}
                    </div>
                  </Link>

                  {/* Book Info Area */}
                  <div className="p-4 flex-1 flex flex-col justify-between">
                    <div>
                      {/* Author */}
                      <p className="text-[11px] font-medium text-slate-400 uppercase tracking-wider line-clamp-1 mb-1">
                        {book.author || "Tác giả"}
                      </p>

                      {/* Title */}
                      <Link
                        to={`/book/${book._id}`}
                        className="text-sm font-bold text-slate-800 hover:text-orange-600 transition-colors line-clamp-2 leading-snug mb-2 font-serif"
                        title={book.title}
                      >
                        {book.title}
                      </Link>

                      {/* Rating Stars */}
                      <div className="flex items-center space-x-1 mb-3">
                        <div className="flex text-amber-400">
                          {[1, 2, 3, 4, 5].map((i) => (
                            <AiFillStar
                              key={i}
                              className={`w-3.5 h-3.5 ${
                                i <= Math.round(rating) ? "text-amber-400" : "text-slate-200"
                              }`}
                            />
                          ))}
                        </div>
                        <span className="text-[11px] font-semibold text-slate-500">
                          {rating > 0 ? rating.toFixed(1) : "5.0"}
                        </span>
                      </div>
                    </div>

                    {/* Price and Add to Cart Button */}
                    <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                      <div>
                        <span className="text-base sm:text-lg font-bold text-orange-600 tracking-tight">
                          {formatPrice(book.price)}₫
                        </span>
                      </div>

                      <button
                        onClick={() => addToCart(book)}
                        disabled={isOutOfStock || (user && user.admin) || addingBookId === book._id}
                        className={`p-2.5 rounded-xl flex items-center justify-center transition-all ${
                          isOutOfStock
                            ? "bg-slate-100 text-slate-400 cursor-not-allowed"
                            : user && user.admin
                            ? "bg-slate-100 text-slate-400 cursor-not-allowed"
                            : "bg-orange-50 text-orange-600 hover:bg-orange-600 hover:text-white hover:shadow-md hover:shadow-orange-600/30 active:scale-95"
                        }`}
                        title={isOutOfStock ? "Hết hàng" : "Thêm vào giỏ hàng"}
                      >
                        <AiOutlineShoppingCart className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                </div>
              );
            })}
          </div>
        )}

      </div>
    </div>
  );
};

export default BookList;
