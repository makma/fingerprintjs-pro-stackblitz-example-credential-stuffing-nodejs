import React, { useState, useEffect } from 'react';
import FingerprintJS from '@fingerprintjs/fingerprintjs-pro';
import './App.css';

function App() {
  const [visitorId, setVisitorId] = useState();
  const [userName, setUserName] = useState();
  const [password, setPassword] = useState();
  const [message, setMessage] = useState();

  useEffect(() => {
    const fpPromise = FingerprintJS.load({ token: 'CdIoNXFUIx6XoWRJYNd9' });
    fpPromise
      .then((fp) => fp.get())
      .then((result) => setVisitorId(result.visitorId));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const loginData = {
      userName,
      password,
      visitorId,
    };

    const response = await fetch('http://localhost:3001/login', {
      method: 'POST',
      body: JSON.stringify(loginData),
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
    });

    const responseJson = await response.json();
    setMessage(responseJson.message);
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        <label>
          <p>Username</p>
          <input type="text" onChange={(e) => setUserName(e.target.value)} />
        </label>
        <label>
          <p>Password</p>
          <input
            type="password"
            onChange={(e) => setPassword(e.target.value)}
          />
        </label>
        <div>
          <button type="submit">Login</button>
        </div>
      </form>
      <h4>{message}</h4>
    </>
  );
}

export default App;
