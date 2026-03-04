import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { getGoogleToken, getToken } from './Login/app/static';

export default function Payment({ deleteCart }) {
    const location = useLocation();
    const { cart } = location.state;
    const [dataUser, setDataUser] = useState({});
    const navigate = useNavigate();

    useEffect(() => {
        const token = getToken() || getGoogleToken();
        // Fetch user profile data when component mounts
        axios
            .get(
                'http://localhost:3000/api/users/profile',
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                },
                {
                    withCredentials: true, // Ensure credentials are sent
                },
            )
            .then((response) => {
                setDataUser(response.data);
            })
            .catch((error) => {
                console.error('Error fetching user profile:', error);
            });
    }, []);

    const handlePayment = () => {
        const token = getToken() || getGoogleToken();
        const orderDetails = cart.map((item) => ({
            book: item.book._id,
            order_quantity: item.quantity,
            order_price: item.price,
        }));

        const totalQuantity = cart.reduce((total, item) => total + item.quantity, 0);
        const totalPrice = cart.reduce((total, item) => total + item.total_price, 0);
        console.log(totalPrice);

        axios
            .post(
                'http://localhost:3000/api/payment/create_payment_paypal',
                {
                    quantity: totalQuantity,
                    amount: totalPrice,
                    order_details: orderDetails,
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                },
            )
            .then((response) => {
                // Redirect to the PayPal approval URL
                window.location.href = response.data;
            })
            .catch((error) => {
                console.error('Error creating PayPal payment:', error);
            });
    };

    const handleCancelPayment = () => {
        navigate('/cart');
    };

    const fixNumber = (number) => {
        return Number(number.toFixed(2));
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="pb-5 font-medium text-lg">CHECK OUT</h1>
            <div className="flex">
                <div className="leftCart w-3/4 pr-6">
                    <div className="cartTitle">
                        <div className="container grid grid-cols-12 gap-4 p-4 h-30 shadow-2xl rounded-lg">
                            <div className="bookItem col-span-5 flex">Product</div>
                            <div className="price col-span-2 flex items-center justify-center">Price</div>
                            <div className="amount col-span-2 flex items-center justify-center">Quantity</div>
                            <div className="totalPrice col-span-2 flex items-center justify-center">Subtotal</div>
                            <div className="remove col-span-1 flex items-center justify-center"></div>
                        </div>
                    </div>
                    {cart.map((item) => (
                        <div
                            key={item.book._id}
                            className="container grid grid-cols-12 gap-4 mt-6 p-4 h-30 shadow-2xl rounded-lg"
                        >
                            <div className="bookItem col-span-5 flex items-center justify-center">
                                <div className="bookImg w-1/2 mr-10">
                                    <img
                                        src={
                                            item.book.imageurls.length > 0
                                                ? item.book.imageurls[0].imageUrl
                                                : 'default-image-url.jpg'
                                        }
                                        alt={item.book.title}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                <div className="bookDesc w-3/4 break-all text-ellipsis overflow-hidden whitespace-nowrap">
                                    {item.book.title}
                                </div>
                            </div>

                            <div className="price col-span-2 flex items-center justify-center">
                                ${fixNumber(item.price)}
                            </div>

                            <div className="amount col-span-2 flex items-center justify-center">{item.quantity}</div>
                            <div className="totalPrice col-span-2 flex items-center justify-center">
                                ${fixNumber(item.total_price)}
                            </div>
                        </div>
                    ))}
                </div>
                <div className="rightCart w-1/4 pl-6">
                    <div className="shadow-2xl p-4 mb-5 h-30 rounded-lg">
                        <div className="total justify-between ">
                            <div className="provisionalInvoice text-lg pb-3">User Information</div>
                            <div className="upperInfo flex pb-3 grid grid-cols-12">
                                <div className="name pr-2 border-r-2 col-span-6">{dataUser.fullname}</div>
                                <div className="phone pl-2 col-span-6">{dataUser.phone}</div>
                            </div>
                            <div className="address">{dataUser.address}</div>
                        </div>
                    </div>
                    <button className="bg-red-500 w-full p-4 h-30 rounded-lg text-white" onClick={handlePayment}>
                        CHECKOUT
                    </button>
                    <div className="pt-4">
                        <button
                            onClick={handleCancelPayment}
                            className="bg-slate-300 w-full p-4 h-30 rounded-lg text-black"
                            deleteCart={deleteCart}
                        >
                            CANCEL
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
