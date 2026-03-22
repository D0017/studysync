import React, { useState } from 'react';
import { registerUser } from '../services/userService';

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
        if (!formData.universityId) tempErrors.universityId = "University ID is required";
        if (!formData.fullName) tempErrors.fullName = "Full Name is required";
        if (!/\S+@\S+\.\S+/.test(formData.email)) tempErrors.email = "Invalid email format";
        if (formData.password.length < 8) tempErrors.password = "Minimum 8 characters required";
        if (formData.password !== formData.confirmPassword) tempErrors.confirmPassword = "Passwords do not match";
        
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
                setServerMessage({ type: 'error', text: typeof err === 'string' ? err : 'Validation failed on server' });
            }
        }
    };

    const inputClass = (name) => `
        w-full p-2.5 rounded-lg border text-sm transition-all outline-none
        ${errors[name] ? 'border-red-500 bg-red-50 focus:ring-1 focus:ring-red-500' : 'border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500'}
    `;

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
            <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md border border-gray-100">
                <h2 className="text-3xl font-extrabold mb-2 text-gray-900 text-center">Join StudySync</h2>
                <p className="text-gray-500 text-center mb-8 text-sm">Create your account to start collaborating</p>
                
                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label className="block text-xs font-bold text-gray-600 uppercase mb-1">Full Name</label>
                        <input type="text" className={inputClass('fullName')} placeholder="Enter your full name"
                               value={formData.fullName} onChange={(e) => setFormData({...formData, fullName: e.target.value})} />
                        {errors.fullName && <p className="text-red-500 text-xs mt-1">{errors.fullName}</p>}
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-gray-600 uppercase mb-1">University ID</label>
                        <input type="text" className={inputClass('universityId')} placeholder="e.g. IT23774384"
                               value={formData.universityId} onChange={(e) => setFormData({...formData, universityId: e.target.value})} />
                        {errors.universityId && <p className="text-red-500 text-xs mt-1">{errors.universityId}</p>}
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-gray-600 uppercase mb-1">Campus Email</label>
                        <input type="email" className={inputClass('email')} placeholder="name@campus.edu"
                               value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} />
                        {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-bold text-gray-600 uppercase mb-1">Password</label>
                            <input type="password" className={inputClass('password')} placeholder="••••••••"
                                   value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})} />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-600 uppercase mb-1">Confirm</label>
                            <input type="password" className={inputClass('confirmPassword')} placeholder="••••••••"
                                   value={formData.confirmPassword} onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})} />
                        </div>
                    </div>
                    {(errors.password || errors.confirmPassword) && (
                        <p className="text-red-500 text-xs">{errors.password || errors.confirmPassword}</p>
                    )}

                    <div>
                        <label className="block text-xs font-bold text-gray-600 uppercase mb-1">Account Type</label>
                        <select className="w-full p-2.5 border border-gray-300 rounded-lg text-sm bg-white focus:ring-1 focus:ring-blue-500" 
                                value={formData.role} onChange={(e) => setFormData({...formData, role: e.target.value})}>
                            <option value="STUDENT">Student</option>
                            <option value="LECTURER">Lecturer</option>
                        </select>
                    </div>

                    <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition-all shadow-md active:scale-95">
                        Create Account
                    </button>
                </form>

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