import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';

const RegisterPage = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleRegister = async () => {
        try {
        if (password !== confirmPassword) {
            setError('Passwords do not match.');
            return;
        }
        await api.post('/auth/register', { username, email, password, confirmPassword });
        navigate('/');
        } catch (err) {
        setError('Registration failed. Please try again.');
        }
    };

    return (
        <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
        <div className="bg-white shadow-md rounded p-6 w-80">
            <h1 className="text-2xl font-semibold mb-4 text-center">Register</h1>
            {error && <div className="text-red-500 text-sm mb-4">{error}</div>}
            <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="border p-2 w-full mb-4 rounded"
            />
            <input
            type="text"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border p-2 w-full mb-4 rounded"
            />
            <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border p-2 w-full mb-4 rounded"
            />
            <input
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="border p-2 w-full mb-4 rounded"
            />
            <button
            onClick={handleRegister}
            className="bg-blue-500 text-white p-2 w-full rounded hover:bg-blue-600"
            >
            Register
            </button>
            <p className="text-center text-sm mt-4">
            Already have an account?{' '}
            <Link to="/" className="text-blue-500 hover:underline">
                Login
            </Link>
            </p>
        </div>
        </div>
    );
};

export default RegisterPage;
