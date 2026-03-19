import classNames from 'classnames/bind';
import styles from '../../styles/Login.module.scss';
import { Link, useNavigate } from 'react-router-dom';
import instance from '../../axiosConfig';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useState } from 'react';

const cx = classNames.bind(styles);

function RegisterUser() {
    const [fullname, setFullname] = useState(''); // Tạo state để lưu fullname
    const [email, setEmail] = useState(''); // Tạo state để lưu email
    const [password, setPassword] = useState(''); // Tạo state để lưu password
    const [phone, setPhone] = useState(''); // Tạo state để lưu phone
    const [address, setAddress] = useState(''); // Tạo state để lưu address
    const [username, setUsername] = useState(''); // Tạo state để lưu username
    const navigate = useNavigate(); // Sử dụng useNavigate để điều hướng

    const handleRegister = async () => {
        // Hàm xử lý đăng ký
        try {
            // Thực hiện đăng ký
            const phonePattern = /^0\d{9,10}$/;
            const patternUpperCase = /[A-Z]/;
            const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            const checkPhone = phonePattern.test(phone);
            const checkEmailUpperCase = patternUpperCase.test(email);
            const checkEmailSyntax = emailPattern.test(email);

            if (fullname === '' || email === '' || password === '' || phone === '') {
                // Kiểm tra xem fullname, email, password, confirmPassword
                toast.error('Vui lòng nhập đầy đủ thông tin !!!');
            } else if (checkEmailUpperCase === true) {
                // Kiểm tra xem email có chứa ký tự viết hoa không
                toast.error('Email không hợp lệ !!!');
            } else if (!checkEmailSyntax) {
                // Kiểm tra cú pháp email
                toast.error('Định dạng email không hợp lệ !!!');
            } else if (!checkPhone) {
                // Kiểm tra tính hợp lệ của số điện thoại
                toast.error('Số điện thoại không hợp lệ !!!');
            } else {
                // Nếu đăng ký thành công
                const res = await instance.post(`${process.env.REACT_APP_API_URL}/api/users/signup`, {
                    fullname,
                    email,
                    password,
                    username,
                    phone,
                    address,
                });

                toast.success('Đăng ký thành công! Chuyển đến trang đăng nhập sau 5 giây.');
                setTimeout(() => {
                    navigate('/login');
                }, 5000);
            }
        } catch (error) {
            if (error.response) {
                if (error.response.status === 409) {
                    toast.error(error.response.data.message);
                }
                if (error.response.status === 500) {
                    toast.error('Tên người dùng hoặc email đã tồn tại');
                } else {
                    // Other server errors
                    toast.error('Đã xảy ra lỗi. Vui lòng thử lại sau.');
                }
            } else if (error.request) {
                // The request was made but no response was received
                toast.error('Không nhận được phản hồi từ máy chủ. Vui lòng thử lại sau.');
            } else {
                // Something happened in setting up the request that triggered an error
                toast.error('Đã xảy ra lỗi. Vui lòng thử lại sau.');
            }
        }
    };

    return (
        <div className="h-[850px] font-times">
            <>
                <ToastContainer />
                <div className={cx('wrapper-signup')}>
                    <div className={cx('inner')}>
                        <div className={cx('header-form-login')}>
                            <span>Đăng ký</span>
                            <p>Tạo tài khoản để có quyền truy cập đầy đủ</p>
                        </div>
                        <div className={cx('input-box')}>
                            <div className={cx('form-input')}>
                                <label>Tên đăng nhập</label>
                                <input placeholder="Nhập tên đăng nhập" onChange={(e) => setUsername(e.target.value)} />
                            </div>
                            <div className={cx('form-input')}>
                                <label>Họ và tên</label>
                                <input placeholder="Nhập họ và tên" onChange={(e) => setFullname(e.target.value)} />
                            </div>

                            <div className={cx('form-input')}>
                                <label>Địa chỉ email</label>
                                <input placeholder="Nhập địa chỉ email" onChange={(e) => setEmail(e.target.value)} />
                            </div>
                            <div className={cx('form-input')}>
                                <label>Số điện thoại</label>
                                <input
                                    placeholder="Nhập số điện thoại"
                                    onChange={(e) => setPhone(e.target.value)}
                                />
                            </div>
                            <div className={cx('form-input')}>
                                <label>Địa chỉ</label>
                                <input placeholder="Nhập địa chỉ" onChange={(e) => setAddress(e.target.value)} />
                            </div>

                            <div className={cx('form-input')}>
                                <label>Mật khẩu</label>

                                <input
                                    placeholder="Nhập mật khẩu"
                                    type="password"
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                            </div>
                        </div>
                        <div className={cx('login-footer')}>
                            <p>
                                Đã có tài khoản?&nbsp;
                                <Link id={cx('link')} to="/login">
                                    Đăng nhập
                                </Link>
                                &nbsp;ở đây
                            </p>
                            <button onClick={handleRegister}>Đăng ký</button>
                        </div>
                    </div>
                </div>
            </>
        </div>
    );
}

export default RegisterUser;
