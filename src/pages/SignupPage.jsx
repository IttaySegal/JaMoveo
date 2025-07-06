import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from '../firebase';
import { ALLOWED_INSTRUMENTS, isValidEmail, isStrongPassword } from '../utils/validation';

export default function SignupPage() {
  const location = useLocation();
  const initialRole = location.pathname.includes('admin') ? 'admin' : 'player';

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    instrument: '',
    role: initialRole,
  });

  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.fullName.trim()) return setError('Please enter your full name');
    if (!isValidEmail(formData.email)) return setError('Enter a valid email address');
    if (!isStrongPassword(formData.password)) {
      return setError('Password must be 8+ chars, 1 uppercase, 1 lowercase, and 1 number');
    }
    if (formData.password !== formData.confirmPassword) return setError('Passwords do not match');
    if (formData.role === 'player' && !formData.instrument)
      return setError('Please select your instrument');

    try {
      setIsSubmitting(true);
      const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
      const user = userCredential.user;

      await setDoc(doc(db, 'users', user.uid), {
        name: formData.fullName,
        email: formData.email,
        role: formData.role,
        instrument: formData.instrument,
      });

      navigate('/login');
    } catch (err) {
      console.error('Signup error:', err);
      setError('Signup failed: ' + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 px-4">
      <div className="bg-white p-8 rounded-2xl shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold text-center text-indigo-700 mb-2">Sign Up</h2>
        <h3 className="text-center text-sm text-gray-600 mb-6">
          You're signing up as <strong>{formData.role}</strong>
        </h3>

        {error && (
          <div className="bg-red-100 text-red-700 text-sm px-4 py-2 rounded mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Full Name"
            className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-indigo-500"
            value={formData.fullName}
            onChange={(e) => handleChange('fullName', e.target.value)}
          />

          <input
            type="email"
            placeholder="Email Address"
            className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-indigo-500"
            value={formData.email}
            onChange={(e) => handleChange('email', e.target.value)}
          />

          <input
            type="password"
            placeholder="Password"
            className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-indigo-500"
            value={formData.password}
            onChange={(e) => handleChange('password', e.target.value)}
          />

          <input
            type="password"
            placeholder="Confirm Password"
            className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-indigo-500"
            value={formData.confirmPassword}
            onChange={(e) => handleChange('confirmPassword', e.target.value)}
          />

          {formData.role === 'player' && (
            <select
              className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-indigo-500"
              value={formData.instrument}
              onChange={(e) => handleChange('instrument', e.target.value)}
            >
              <option value="">Select your instrument</option>
              {ALLOWED_INSTRUMENTS.map((instrument) => (
                <option key={instrument} value={instrument}>
                  {instrument.charAt(0).toUpperCase() + instrument.slice(1)}
                </option>
              ))}
            </select>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700 transition-colors disabled:opacity-70"
          >
            {isSubmitting ? 'Signing Up...' : 'Sign Up'}
          </button>
        </form>

        <div className="text-sm text-center mt-6 text-gray-600">
          Already have an account?{' '}
          <a href="/login" className="text-indigo-600 hover:underline">
            Log In
          </a>
        </div>
      </div>
    </div>
  );
}
