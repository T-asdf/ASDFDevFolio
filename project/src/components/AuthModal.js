'use client'; 

import { useState } from 'react';

export default function SimpleAuthModal({ isVisible, onClose, onAuthSuccess }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  if (!isVisible) return null;

  const handleLogin = (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      
      if (username === process.env.NEXT_PUBLIC_ID && password === process.env.NEXT_PUBLIC_PW) {
        onAuthSuccess(); 
        onClose(); 
        setUsername('');
        setPassword('');
      } 
      
      else {
        setError('아이디 또는 비밀번호가 올바르지 않습니다.');
      }
    }, 500);
  };

  return (
    <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-70 z-50">
      <div className="border-l-8 border-blue-400 bg-white p-8 rounded-lg shadow-xl w-96">
        <h2 className="text-gray-800 text-2xl font-bold mb-6 text-center">인증 확인</h2>
        
        {error && <div className="bg-red-100 text-red-700 p-2 mb-4 rounded text-sm">{error}</div>}

        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-1">아이디</label>
            <input
              type="text"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 outline-none"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              disabled={loading}
            />
          </div>

          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-1">비밀번호</label>
            <input
              type="password"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 outline-none"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <button
              type="submit"
              className={`bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
              disabled={loading}
            >
              {loading ? '확인 중...' : '확인'}
            </button>
            <button
              type="button"
              className="inline-block align-baseline font-bold text-sm text-gray-500 hover:text-gray-800"
              onClick={onClose}
              disabled={loading}
            >
              취소
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}