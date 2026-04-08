// Color Palette: Primary Dark #0A0A0C, Dark Secondary #1F1F23, Primary Orange #FF6A00, Light Gray #F4F4F6
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { loginUser } from '../services/userService';

const Login = () => {
    const [credentials, setCredentials] = useState({ email: '', password: '' });
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            const user = await loginUser(credentials);
            
            // Role based redirection
            if (user.role === 'ADMIN') navigate('/admin-dashboard');
            else if (user.role === 'LECTURER') navigate('/lecturer-dashboard');
            else navigate('/student-dashboard');
        } catch (err) {
            setError(err);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-6" style={{backgroundColor: '#F4F4F6'}}>
            <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
                <h2 className="text-3xl font-bold text-center mb-6" style={{color: '#0A0A0C'}}>Welcome Back</h2>
                
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-xs font-bold uppercase mb-1" style={{color: '#1F1F23'}}>Email</label>
                        <input type="email" required className="w-full p-2.5 border rounded-lg outline-none" style={{borderColor: '#FF6A00'}}
                            onChange={(e) => setCredentials({...credentials, email: e.target.value})} 
                            onFocus={(e) => e.target.style.boxShadow = '0 0 0 3px rgba(255, 106, 0, 0.1)'}
                            onBlur={(e) => e.target.style.boxShadow = 'none'} />
                    </div>
                    <div>
                        <label className="block text-xs font-bold uppercase mb-1" style={{color: '#1F1F23'}}>Password</label>
                        <input type="password" required className="w-full p-2.5 border rounded-lg outline-none" style={{borderColor: '#FF6A00'}}
                            onChange={(e) => setCredentials({...credentials, password: e.target.value})}
                            onFocus={(e) => e.target.style.boxShadow = '0 0 0 3px rgba(255, 106, 0, 0.1)'}
                            onBlur={(e) => e.target.style.boxShadow = 'none'} />
                    </div>

                    {error && <p className="text-xs" style={{color: '#FF6A00'}}>{error}</p>}

                    <button type="submit" className="w-full text-white py-3 rounded-lg font-bold transition-all" style={{backgroundColor: '#FF6A00'}} 
                        onMouseEnter={(e) => e.target.style.backgroundColor = '#E55A00'}
                        onMouseLeave={(e) => e.target.style.backgroundColor = '#FF6A00'}>
                        Sign In
                    </button>
                </form>
                
                <p className="mt-6 text-center text-sm" style={{color: '#1F1F23'}}>
                    Don't have an account? <Link to="/register" className="font-bold hover:underline" style={{color: '#FF6A00'}}>Register</Link>
                </p>
            </div>
        </div>
    );
};

export default Login;