import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { loginUser } from '../services/userService';

const getDashboardRoute = (role) => {
    switch (role) {
        case 'ADMIN':
            return '/admin-dashboard';
        case 'STUDENT':
            return '/student-dashboard';
        case 'LECTURER':
            return '/lecturer-dashboard';
        default:
            return '/login';
    }
};

const Login = () => {
    const [credentials, setCredentials] = useState({ email: '', password: '' });
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        try {
            const user = await loginUser(credentials);
            navigate(getDashboardRoute(user.role));
        } catch (err) {
            setError(err);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
            <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
                <h2 className="text-3xl font-bold text-center text-gray-900 mb-6">Welcome Back</h2>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-xs font-bold text-gray-600 uppercase mb-1">Email</label>
                        <input
                            type="email"
                            required
                            className="w-full p-2.5 border rounded-lg outline-none focus:ring-1 focus:ring-blue-500"
                            value={credentials.email}
                            onChange={(e) => setCredentials({ ...credentials, email: e.target.value })}
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-gray-600 uppercase mb-1">Password</label>
                        <input
                            type="password"
                            required
                            className="w-full p-2.5 border rounded-lg outline-none focus:ring-1 focus:ring-blue-500"
                            value={credentials.password}
                            onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
                        />
                    </div>

                    {error && <p className="text-red-500 text-xs">{error}</p>}

                    <button
                        type="submit"
                        className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700 transition-all"
                    >
                        Sign In
                    </button>
                </form>

                <p className="mt-6 text-center text-sm text-gray-600">
                    Don't have an account?{' '}
                    <Link to="/register" className="text-blue-600 font-bold hover:underline">
                        Register
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default Login;