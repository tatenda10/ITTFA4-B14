import React, { useContext, useState } from 'react';
import { AuthContext } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import loginImage1 from '../../assets/login-image1.jpg'; // Example image path
import loginImage2 from '../../assets/login-image2.jpg'; // Example image path

const Login = () => {
    const { login } = useContext(AuthContext);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        const result = await login(username, password);

        if (result) {
            switch (result.role) {
                case 'admin':
                    navigate('/admin');
                    break;
                case 'doctor':
                    navigate('/doctor');
                    break;
                case 'pharmacist':
                    navigate('/pharmacist');
                    break;
                case 'patient':
                    navigate('/patient');
                    break;
                default:
                    navigate('/login');
                    break;
            }
        } else {
            alert('Login failed. Please check your username and password.');
        }
    };

    return (
        <div className="flex h-screen ">
            {/* Left Side - Welcome Message */}
            <div className="w-1/2 flex flex-col items-start justify-center pl-20">
                <h1 className="text-5xl font-bold text-indigo-700 mb-4">Welcome to HMS</h1>
                <p className="text-xl text-center  text-gray-600 mb-10">Your Health, Our Priority</p>
                <form onSubmit={handleLogin} className="space-y-4 w-full max-w-sm">
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="Username"
                        className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-indigo-500"
                        required
                    />
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Password"
                        className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-indigo-500"
                        required
                    />
                    <button
                        type="submit"
                        className="w-full p-3 bg-indigo-600 text-white rounded hover:bg-indigo-700 focus:outline-none focus:ring focus:ring-indigo-500"
                    >
                        Login
                    </button>
                </form>
            </div>

            {/* Right Side - Images */}
            <div className="w-1/2 bg-white flex items-center justify-center relative">
                <div className="absolute top-8 right-8 w-72 h-96 bg-gray-300 rounded-lg shadow-lg overflow-hidden">
                    <img src={loginImage1} alt="Login visual 1" className="object-cover w-full h-full" />
                </div>
                <div className="absolute top-36 right-36 w-80 h-80 bg-gray-300 rounded-lg shadow-lg overflow-hidden">
                    <img src={loginImage2} alt="Login visual 2" className="object-cover w-full h-full" />
                </div>
            </div>
        </div>
    );
};

export default Login;
