import React, { useEffect, useState } from 'react'
import './Login.css'
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { zodResolver } from "@hookform/resolvers/zod";
import { FaCoins } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { authenticationSelector, clearState, loginUser, setIsLogin } from '../../store/features/authenticationSlice';
import { notification } from 'antd';
import authService from '../../services/auth.service';
const validationSchema = z
    .object({
        email: z.string().min(1, { message: "Trường này là bắt buộc" }).email("Email không hợp lệ!"),

        password: z
            .string()
            .min(6, { message: "Mật khẩu phải ít nhất 6 chữ số" }),
    })
    ;

const Login = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [hiddenPwd, setHiddenPwd] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(validationSchema),
    });


    const {
        isSuccess,
        isError,
        message,
    } = useSelector(authenticationSelector);

    const [api, contextHolder] = notification.useNotification();


    // useEffect(() => {
    //     if (isSuccess) {
    //         navigate('/tong-quan');
    //         dispatch(clearState());
    //     }
    //     else if (isError) {
    //         api.error({
    //             message: message,
    //             placement: "bottomLeft",
    //             duration: 2,
    //         });

    //         dispatch(clearState());
    //     }
    // }, [isSuccess,
    //     isError,
    //     message,]);
    const onSubmit = async (data) => {
        console.log(data);
        const { email, password } = data;
    
        try {
            // Gọi API để đăng nhập
            await dispatch(loginUser({ email, password }));
    
            // Lấy thông tin profile người dùng sau khi đăng nhập
            const profile = await authService.getProfile();
            console.log('Profile', profile.data.result.data);
    
            // Kiểm tra dữ liệu profile và lưu vào localStorage
            if (profile?.data?.result?.data) {
                const isAdmin = profile.data.result.data.isAdmin;
                console.log('Is Admin Value:', isAdmin);
                localStorage.setItem("admin", JSON.stringify(isAdmin));
                console.log('Admin value stored in localStorage:', localStorage.getItem("admin"));
                if (profile) {
                    navigate('/tong-quan');
                    dispatch(clearState());
                } else if (isError) {
                    api.error({
                        message: message,
                        placement: "bottomLeft",
                        duration: 2,
                    });
                    dispatch(clearState());
                }
            }
    
            // Kiểm tra trạng thái của việc đăng nhập và điều hướng
        
        } catch (error) {
            console.error('Error during login or profile fetching:', error);
            api.error({
                message: 'Có lỗi xảy ra, vui lòng thử lại!',
                placement: "bottomLeft",
                duration: 2,
            });
        }
    };
    
    
    return (
        <div className="login-container">
            {contextHolder}

            <div className="backgr">
                <div className="container">
                    <div className="container_left active-left">
                        {/* <div className="flex items-center justify-center gap-5 text-8xl text-[#FFCD29] font-bold">
                            <FaCoins /> Big Ledger
                        </div> */}
                        <img src="/assets/logo-no-background.png" alt="" className='w-[35vw] m-auto' />
                    </div>
                    <div className="container_right">
                        <form className="form" onSubmit={handleSubmit(onSubmit)}>
                            <div className="form-inner">
                                <div className="welcome">
                                    <h1 className="text-[32px]">Đăng nhập</h1>
                                </div>

                                <div className="form-groupS">
                                    <div className="form-group">
                                        <input
                                            // autoComplete="off"
                                            type="email"
                                            name="email"
                                            placeholder=" "
                                            {...register("email")}
                                        />
                                        <label>Email</label>
                                    </div>
                                    {errors.email && (
                                        <p className="textDanger">
                                            {errors.email?.message}
                                        </p>
                                    )}
                                </div>
                                <div className="form-groupP">
                                    <div className="form-group2">
                                        <div className="pass-box">
                                            <input placeholder=" "
                                                type={hiddenPwd ? "text" : "password"}
                                                id="password"
                                                name="password"

                                                {...register("password")}
                                            />
                                            <label>Mật khẩu</label>
                                            <div className="eye" onClick={() => setHiddenPwd(!hiddenPwd)}>
                                                <i className={hiddenPwd ? "fa fa-eye" : "fa fa-eye-slash"}></i>
                                            </div>
                                        </div>

                                    </div>
                                    {errors.password && (
                                        <p className="textDanger">
                                            {errors.password?.message}
                                        </p>
                                    )}
                                </div>
                            </div>
                            {/* {message &&
                <p className="textDanger" style={{ textAlign: "center" }}>
                  {message}
                </p>} */}

                            <button className="submit-btn" type="submit">
                                Đăng nhập
                            </button>
                            <div className="line">
                            </div>

                            {/* <div className="navigator">
                                Chưa có tài khoản? <Link to="/dang-ky">Đăng ký</Link>
                            </div> */}

                        </form>
                    </div>
                </div>
            </div>
        </div>)
}

export default Login