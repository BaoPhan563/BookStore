import React, { useState } from 'react';

const ContactUs = () => {
    const [form, setForm] = useState({
        name: '',
        email: '',
        message: '',
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prevForm) => ({ ...prevForm, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Xử lý logic gửi form ở đây
        console.log('Form data:', form);
        // Sau khi gửi thành công, reset form
        setForm({ name: '', email: '', message: '' });
    };

    return (
        <div className="container mx-auto p-8 ">
            <h1 className="text-3xl font-bold text-orange-600 text-center mb-8 font-times">Contact Us</h1>
            <div className="bg-white shadow-lg rounded-lg p-6">
                <h2 className="text-2xl font-semibold text-orange-500 mb-4">Our Contact Information</h2>
                <p className="text-gray-700 mb-4">
                    We are always here to help you. Feel free to reach out to us through any of the following methods:
                </p>
                <p className="text-gray-700 mb-2">
                    <strong>Email:</strong> support@fbstores.com
                </p>
                <p className="text-gray-700 mb-2">
                    <strong>Phone:</strong> +123-456-7890
                </p>
                <p className="text-gray-700 mb-4">
                    <strong>Address:</strong> 123 Book St, Reading City, RB 12345
                </p>
                <h2 className="text-2xl font-semibold text-orange-500 mb-4">Send Us a Message</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="name" className="block text-gray-700 font-medium mb-2">
                            Name
                        </label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={form.name}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring focus:ring-orange-200 focus:border-orange-500"
                        />
                    </div>
                    <div>
                        <label htmlFor="email" className="block text-gray-700 font-medium mb-2">
                            Email
                        </label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={form.email}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring focus:ring-orange-200 focus:border-orange-500"
                        />
                    </div>
                    <div>
                        <label htmlFor="message" className="block text-gray-700 font-medium mb-2">
                            Message
                        </label>
                        <textarea
                            id="message"
                            name="message"
                            value={form.message}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring focus:ring-orange-200 focus:border-orange-500"
                            rows={4}
                        ></textarea>
                    </div>
                    <div className="text-center">
                        <button
                            type="submit"
                            className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-9 py-3 hover:from-yellow-500 hover:to-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:ring-offset-2"
                        >
                            Send Message
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ContactUs;
