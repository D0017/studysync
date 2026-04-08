// Color Palette: Primary Dark #0A0A0C, Dark Secondary #1F1F23, Primary Orange #FF6A00, Light Gray #F4F4F6
import React, { useState } from 'react';
import { registerUser } from '../services/userService';
import { Link } from 'react-router-dom';

const Register = () => {
    const [formData, setFormData] = useState({
        universityId: '', 
        fullName: '', 
        email: '', 
        password: '', 
        confirmPassword: '', 
        role: 'STUDENT'
    });
    const [errors, setErrors] = useState({});
    const [serverMessage, setServerMessage] = useState({ type: '', text: '' });

    const validate = () => {
        let tempErrors = {};
        
        if (!formData.universityId) {
            tempErrors.universityId = "University ID is required";
        } else if (formData.universityId.length !== 8) {
            tempErrors.universityId = "University ID must be exactly 8 characters";
        }

        if (!formData.fullName) tempErrors.fullName = "Full Name is required";
        if (!/\S+@\S+\.\S+/.test(formData.email)) tempErrors.email = "Invalid email format";
        
   
        if (formData.password.length < 8) {
            tempErrors.password = "Password must be at least 8 characters";
        }
        if (formData.password !== formData.confirmPassword) {
            tempErrors.confirmPassword = "Passwords do not match";
        }
        
        setErrors(tempErrors);
        return Object.keys(tempErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setServerMessage({ type: '', text: '' });
        
        if (validate()) {
            const { confirmPassword: _, ...dataToSend } = formData; 
            try {
                await registerUser(dataToSend);
                setServerMessage({ type: 'success', text: 'Registration successful!' });
                setFormData({ universityId: '', fullName: '', email: '', password: '', confirmPassword: '', role: 'STUDENT' });
                setErrors({});
            } catch (err) {
                setServerMessage({ type: 'error', text: typeof err === 'string' ? err : 'Server connection failed' });
            }
        }
    };

    const inputClass = (name) => `
        w-full p-2.5 rounded-lg border text-sm transition-all outline-none
        ${errors[name] ? 'border-red-500 bg-red-50 focus:ring-1 focus:ring-red-500' : 'focus:ring-1'}
    `;

    return (
        <div className="min-h-screen flex items-center justify-center p-6" style={{backgroundColor: '#F4F4F6'}}>
            <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md" style={{borderColor: '#FF6A00', borderWidth: '1px'}}>
                <h2 className="text-3xl font-extrabold mb-2 text-center" style={{color: '#0A0A0C'}}>Join StudySync</h2>
                <p className="text-center mb-8 text-sm" style={{color: '#1F1F23'}}>Create your secured account</p>
                
                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label className="block text-xs font-bold uppercase mb-1" style={{color: '#1F1F23'}}>Full Name</label>
                        <input type="text" className={inputClass('fullName')} placeholder="Enter full name"
                               style={{borderColor: errors.fullName ? '#EF4444' : '#FF6A00'}}
                               value={formData.fullName} onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                               onFocus={(e) => !errors.fullName && (e.target.style.boxShadow = '0 0 0 3px rgba(255, 106, 0, 0.1)')}
                               onBlur={(e) => e.target.style.boxShadow = 'none'} />
                        {errors.fullName && <p className="text-red-500 text-xs mt-1">{errors.fullName}</p>}
                    </div>

                    <div>
                        <label className="block text-xs font-bold uppercase mb-1" style={{color: '#1F1F23'}}>University ID (8 Digits)</label>
                        <input type="text" className={inputClass('universityId')} placeholder="e.g. XXXXXXXX"
                               style={{borderColor: errors.universityId ? '#EF4444' : '#FF6A00'}}
                               value={formData.universityId} onChange={(e) => setFormData({...formData, universityId: e.target.value})}
                               onFocus={(e) => !errors.universityId && (e.target.style.boxShadow = '0 0 0 3px rgba(255, 106, 0, 0.1)')}
                               onBlur={(e) => e.target.style.boxShadow = 'none'} />
                        {errors.universityId && <p className="text-red-500 text-xs mt-1">{errors.universityId}</p>}
                    </div>

                    <div>
                        <label className="block text-xs font-bold uppercase mb-1" style={{color: '#1F1F23'}}> Email</label>
                        <input type="email" className={inputClass('email')} placeholder="id@uni.edu"
                               style={{borderColor: errors.email ? '#EF4444' : '#FF6A00'}}
                               value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})}
                               onFocus={(e) => !errors.email && (e.target.style.boxShadow = '0 0 0 3px rgba(255, 106, 0, 0.1)')}
                               onBlur={(e) => e.target.style.boxShadow = 'none'} />
                        {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-bold uppercase mb-1" style={{color: '#1F1F23'}}>Password</label>
                            <input type="password" className={inputClass('password')} placeholder="••••••••"
                                   style={{borderColor: errors.password ? '#EF4444' : '#FF6A00'}}
                                   value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})}
                                   onFocus={(e) => !errors.password && (e.target.style.boxShadow = '0 0 0 3px rgba(255, 106, 0, 0.1)')}
                                   onBlur={(e) => e.target.style.boxShadow = 'none'} />
                        </div>
                        <div>
                            <label className="block text-xs font-bold uppercase mb-1" style={{color: '#1F1F23'}}>Confirm</label>
                            <input type="password" className={inputClass('confirmPassword')} placeholder="••••••••"
                                   style={{borderColor: errors.confirmPassword ? '#EF4444' : '#FF6A00'}}
                                   value={formData.confirmPassword} onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                                   onFocus={(e) => !errors.confirmPassword && (e.target.style.boxShadow = '0 0 0 3px rgba(255, 106, 0, 0.1)')}
                                   onBlur={(e) => e.target.style.boxShadow = 'none'} />
                        </div>
                    </div>
                    {(errors.password || errors.confirmPassword) && (
                        <p className="text-red-500 text-xs mt-1">{errors.password || errors.confirmPassword}</p>
                    )}

                    <div>
                        <label className="block text-xs font-bold uppercase mb-1" style={{color: '#1F1F23'}}>Account Type</label>
                        <select className="w-full p-2.5 rounded-lg text-sm bg-white" 
                                style={{borderColor: '#FF6A00', borderWidth: '1px'}}
                                value={formData.role} onChange={(e) => setFormData({...formData, role: e.target.value})}
                                onFocus={(e) => e.target.style.boxShadow = '0 0 0 3px rgba(255, 106, 0, 0.1)'}
                                onBlur={(e) => e.target.style.boxShadow = 'none'}>
                            <option value="STUDENT">Student</option>
                            <option value="LECTURER">Lecturer</option>
                        </select>
                    </div>

                    <button type="submit" className="w-full text-white font-bold py-3 rounded-lg transition-all shadow-md active:scale-95"
                            style={{backgroundColor: '#FF6A00'}}
                            onMouseEnter={(e) => e.target.style.backgroundColor = '#E55A00'}
                            onMouseLeave={(e) => e.target.style.backgroundColor = '#FF6A00'}>
                        Create Account
                    </button>
                </form>
                    <p className="mt-6 text-center text-sm" style={{color: '#1F1F23'}}>
                        Already have an account? <Link to="/login" className="font-bold hover:underline" style={{color: '#FF6A00'}}>Sign In</Link>
                    </p>

                {serverMessage.text && (
                    <div className={`mt-6 p-4 rounded-lg text-sm font-medium text-center ${serverMessage.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
                        {serverMessage.text}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Register;