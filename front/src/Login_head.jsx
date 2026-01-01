// LoginButton.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import config from './config.json';

function LoginButton() {
  const [user, setUser] = useState(null);

  useEffect(() => {
   
    axios.get(`${config.api}api/user`, { withCredentials: true })
      .then(res => {
        setUser(res.data);
      })
      .catch(err => console.log(err));
  }, []);

  const handleLogin = () => {
    window.location.href = `${config.api}auth/discord`;
  };

  const handleLogout = () => {
    window.location.href = `${config.api}logout`;
  };

  return (
    <div>
      {user ? (
        <div>
          <p>مرحبًا، {user.username}</p>
          <button onClick={handleLogout}>تسجيل الخروج</button>
        </div>
      ) : (
        <button onClick={handleLogin}>تسجيل الدخول عبر Discord</button>
      )}
    </div>
  );
}

export default LoginButton;
