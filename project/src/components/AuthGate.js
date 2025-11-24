'use client';

import { useState } from 'react';
import AuthModal from './AuthModal';

export default function AuthGate({ children, onAction }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const handleWrapperClick = (e) => {
    e.preventDefault(); 
    setIsModalOpen(true);
  };

  const handleAuthSuccess = () => {
    onAction();
  };

  return (
    <>
      <div onClick={handleWrapperClick} className="inline-block cursor-pointer">
        {children}
      </div>

      <AuthModal
        isVisible={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAuthSuccess={handleAuthSuccess}
      />
    </>
  );
}