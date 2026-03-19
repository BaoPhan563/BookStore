import React from 'react';

const About = () => {
    return (
        <div id="about" className="bg-gray-100 min-h-screen flex items-center justify-center">
            <div className="container mx-auto px-4 py-16">
                <div className="bg-white shadow-lg rounded-lg p-8">
                    <h1 className="text-4xl font-bold mb-6 text-orange-600">Về FBstore</h1>
                    <p className="text-gray-700 text-lg mb-6">
                        Chào mừng bạn đến với <span className="font-semibold text-gray-900">FBstore</span>, điểm đến hàng đầu cho bộ sưu tập sách đa dạng phục vụ mọi độc giả. Tại FBstore, chúng tôi đam mê sách và cam kết cung cấp các sản phẩm chất lượng cao cùng dịch vụ khách hàng xuất sắc.
                    </p>
                    <h2 className="text-3xl font-semibold mt-8 mb-4 text-orange-600">Sứ mệnh của chúng tôi</h2>
                    <p className="text-gray-700 text-lg mb-6">
                        Sứ mệnh của chúng tôi là nuôi dưỡng tình yêu đọc sách bằng cách cung cấp lựa chọn toàn diện các cuốn sách từ nhiều thể loại khác nhau, bao gồm tiểu thuyết, phiêu lưu, học thuật và nhiều hơn nữa. Chúng tôi tin rằng việc đọc làm phong phú cuộc sống, và mục tiêu của chúng tôi là làm cho sách trở nên tiếp cận và thú vị cho tất cả mọi người.
                    </p>
                    <h2 className="text-3xl font-semibold mt-8 mb-4 text-orange-600">Dịch vụ chúng tôi cung cấp</h2>
                    <ul className="list-disc list-inside text-gray-700 text-lg mb-6">
                        <li>Một bộ sưu tập sách khổng lồ trong nhiều thể loại.</li>
                        <li>Trải nghiệm mua sắm trực tuyến thân thiện.</li>
                        <li>Đề xuất cá nhân hóa và đánh giá sách.</li>
                        <li>Giảm giá và chương trình khuyến mãi thường xuyên.</li>
                        <li>Đội ngũ hỗ trợ khách hàng chuyên nghiệp.</li>
                    </ul>
                    <h2 className="text-3xl font-semibold mt-8 mb-4 text-orange-600">Cam kết của chúng tôi</h2>
                    <p className="text-gray-700 text-lg mb-6">
                        Tại FBstore, chúng tôi cam kết đảm bảo sự hài lòng của khách hàng. Chúng tôi liên tục nỗ lực để cải thiện dịch vụ và mở rộng bộ sưu tập nhằm đáp ứng các nhu cầu đa dạng của người đọc. Cho dù bạn là người đọc casual hay một nhà sưu tập sách đam mê, FBstore đều có điều gì đó dành cho bạn.
                    </p>
       
                    <p className="text-gray-700 text-lg mb-6">
                        Nếu bạn có bất kỳ câu hỏi, đề xuất hoặc phản hồi nào, vui lòng liên hệ với chúng tôi. Chúng tôi đánh giá cao sự đóng góp của bạn và luôn sẵn sàng hỗ trợ bạn.
                    </p>
                    <p className="text-gray-700 text-lg">
                        Cảm ơn bạn đã chọn <span className="font-semibold text-gray-900">FBstore</span>. Chúc bạn đọc sách vui vẻ!
                    </p>
                </div>
            </div>
        </div>
    );
};

export default About;
