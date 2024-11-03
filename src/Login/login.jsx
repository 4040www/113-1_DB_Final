import React from 'react';
import { useNavigate } from 'react-router-dom';

const login_data = {
    username: 'admin',
    password: 'admin'
};

export default function Login() {
    const navigate = useNavigate();

    const handleSubmit = (event) => {
        event.preventDefault();
        const username = event.target.username.value;
        const password = event.target.password.value;

        if (username === login_data.username && password === login_data.password) {
            navigate('/shop'); 
        } else {
            alert('Invalid credentials');
        }
    };

    return (
        <div className="Login">
            <h2>Login your account</h2>
            <form className="Login-form" onSubmit={handleSubmit}>
                <label>
                    Username : 
                    <input type="text" name="username" />
                </label>
                <label>
                    Password : 
                    <input type="password" name="password" />
                </label>
                <button type="submit">Login</button>
            </form>
        </div>
    );
}