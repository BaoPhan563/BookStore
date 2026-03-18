import React, { useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { Analytics } from "@vercel/analytics/react";
import Navbar from "./components/Navbar";
import BookList from "./components/BookList";
import About from "./components/About";
import Contact from "./components/Contact";
import Footer from "./components/Footer";
import AddBook from "./components/Admin/AddBook";
import BookListAdmin from "./components/Admin/BookListAdmin";
import AdminDashboard from "./components/Admin/AdminDashboard";
import Revenue from "./components/Admin/Revenue";
import BookDetail from "./components/Admin/BookDetail";
import EditBook from "./components/Admin/EditBook";
import UploadMultipleImages from "./components/Admin/UploadMultipleImages";

import Login from "./components/Login/Login";
import SignUp from "./components/Login/Sinup";
import ResetPassword from "./components/Login/ForgotPassword";
import ProfilePage from "./components/Users/profile";
import BookDetailUser from "./components/BookDetailUser";
import ChangePassword from "./components/Users/ChangePassword";
import PrivateRoute from "./components/PrivateRouter";
import NotFound from "./components/PageNotFound";

import Cart from "./components/Cart";
import Payment from "./components/Payment";

import HistoryPayment from "./components/Users/HistoryPayment";
import PaymentSuccess from "./components/PaymentSuccessful";
import PaymentFail from "./components/PaymentFail";
import HistoryOrdersAdmin from "./components/Admin/HistoryOrdersAdmin";

import "../src/index.css";
import PaymentReturn from "./components/PaymentReturn";
const App = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearch = (term) => {
    setSearchTerm(term);
  };

  return (
    <Router>
      <Navbar onSearch={handleSearch} />
      <Routes>
        <Route path="/" element={<BookList searchTerm={searchTerm} />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        {/* //<Route path="/dashboard" element={<AdminDashboard />} /> */}
        <Route
          path="/dashboard"
          element={<PrivateRoute element={<AdminDashboard />} adminOnly />}
        />
        <Route exact path="/booklistadmin" element={<BookListAdmin />} />
        <Route path="/addbook" element={<AddBook />} />
        <Route path="/revenue" element={<Revenue />} />
        <Route path="/books/:id" element={<BookDetail />} />
        <Route path="/edit/:id" element={<EditBook />} />
        <Route
          path="/books/:id/upload/many"
          element={<UploadMultipleImages />}
        />
        <Route path="/book/:id" element={<BookDetailUser />} />
        <Route path="/history" element={<HistoryOrdersAdmin />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/resetpassword" element={<ResetPassword />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route
          path="/change-password"
          element={<PrivateRoute element={<ChangePassword />} googleBlock />}
        />
        <Route path="/not-found" element={<NotFound />} />
        <Route path="/transaction" element={<HistoryPayment />} />
        <Route path="/payment/vnpay_return" element={<PaymentReturn />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/payment" element={<Payment />} />
        <Route path="/payment/success" element={<PaymentSuccess />} />
        <Route path="/payment/cancel" element={<PaymentFail />} />
      </Routes>
      <Footer />
      <Analytics />
    </Router>
  );
};

export default App;
