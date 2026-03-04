import React from 'react';

const About = () => {
    return (
        <div id="about" className="bg-gray-100 min-h-screen flex items-center justify-center">
            <div className="container mx-auto px-4 py-16">
                <div className="bg-white shadow-lg rounded-lg p-8">
                    <h1 className="text-4xl font-bold mb-6 text-orange-600">About FBstore</h1>
                    <p className="text-gray-700 text-lg mb-6">
                        Welcome to <span className="font-semibold text-gray-900">FBstore</span>, your premier destination for a diverse collection of books catering to all readers. At FBstore, we are passionate about books and committed to providing high-quality products along with exceptional customer service.
                    </p>
                    <h2 className="text-3xl font-semibold mt-8 mb-4 text-orange-600">Our Mission</h2>
                    <p className="text-gray-700 text-lg mb-6">
                        Our mission is to foster a love for reading by offering a comprehensive selection of books from various genres, including fiction, non-fiction, academic, and more. We believe that reading enriches lives, and our goal is to make books accessible and enjoyable for everyone.
                    </p>
                    <h2 className="text-3xl font-semibold mt-8 mb-4 text-orange-600">What We Offer</h2>
                    <ul className="list-disc list-inside text-gray-700 text-lg mb-6">
                        <li>A vast collection of books across multiple genres.</li>
                        <li>User-friendly online shopping experience.</li>
                        <li>Personalized recommendations and book reviews.</li>
                        <li>Frequent discounts and promotions.</li>
                        <li>Dedicated customer support team.</li>
                    </ul>
                    <h2 className="text-3xl font-semibold mt-8 mb-4 text-orange-600">Our Commitment</h2>
                    <p className="text-gray-700 text-lg mb-6">
                        At FBstore, we are committed to ensuring customer satisfaction. We continuously strive to improve our services and expand our collection to meet the diverse needs of our readers. Whether you are a casual reader or a passionate bibliophile, FBstore has something for everyone.
                    </p>
       
                    <p className="text-gray-700 text-lg mb-6">
                        If you have any questions, suggestions, or feedback, please feel free to contact us. We value your input and are always here to assist you.
                    </p>
                    <p className="text-gray-700 text-lg">
                        Thank you for choosing <span className="font-semibold text-gray-900">FBstore</span>. Happy reading!
                    </p>
                </div>
            </div>
        </div>
    );
};

export default About;
