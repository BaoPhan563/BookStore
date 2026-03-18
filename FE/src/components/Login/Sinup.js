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
                toast.error('Please check the information again !!!');
            } else if (checkEmailUpperCase === true) {
                // Kiểm tra xem email có chứa ký tự viết hoa không
                toast.error('Invalid email !!!');
            } else if (!checkEmailSyntax) {
                // Kiểm tra cú pháp email
                toast.error('Invalid email !!!');
            } else if (!checkPhone) {
                // Kiểm tra tính hợp lệ của số điện thoại
                toast.error('Telephone invalid !!!');
            } else {
                // Nếu đăng ký thành công
                const res = await instance.post(`${process.env.REACT_APP_API_URL}/users/signup`, {
                    fullname,
                    email,
                    password,
                    username,
                    phone,
                    address,
                });

                toast.success('Sign Up Success! Go to login page after 5 seconds.');
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
                    toast.error('Username or email already exists');
                } else {
                    // Other server errors
                    toast.error('An error occurred. Please try again later.');
                }
            } else if (error.request) {
                // The request was made but no response was received
                toast.error('No response from server. Please try again later.');
            } else {
                // Something happened in setting up the request that triggered an error
                toast.error('An error occurred. Please try again later.');
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
                            <span>Sign Up</span>
                            <p>Create your account to get full access</p>
                        </div>
                        <div className={cx('input-box')}>
                            <div className={cx('form-input')}>
                                <label>UserName</label>
                                <input placeholder="Enter User Name" onChange={(e) => setUsername(e.target.value)} />
                            </div>
                            <div className={cx('form-input')}>
                                <label>Full Name</label>
                                <input placeholder="Enter Full Name" onChange={(e) => setFullname(e.target.value)} />
                            </div>

                            <div className={cx('form-input')}>
                                <label>Email Address</label>
                                <input placeholder="Enter Email Address" onChange={(e) => setEmail(e.target.value)} />
                            </div>
                            <div className={cx('form-input')}>
                                <label>Phone</label>
                                <input
                                    placeholder="Enter Telephone Number"
                                    onChange={(e) => setPhone(e.target.value)}
                                />
                            </div>
                            <div className={cx('form-input')}>
                                <label>Address</label>
                                <input placeholder="Enter Your Address" onChange={(e) => setAddress(e.target.value)} />
                            </div>

                            <div className={cx('form-input')}>
                                <label>Password</label>

                                <input
                                    placeholder="Enter Password"
                                    type="password"
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                            </div>
                        </div>
                        <div className={cx('login-footer')}>
                            <p>
                                Already have an account?&nbsp;
                                <Link id={cx('link')} to="/login">
                                    Login
                                </Link>
                                &nbsp;here
                            </p>
                            <button onClick={handleRegister}>Sign Up</button>
                        </div>
                    </div>
                </div>
            </>
        </div>
    );
}

export default RegisterUser;
