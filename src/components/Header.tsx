import React from 'react';
import { useNavigate } from 'react-router-dom';
import { HomeIcon } from '@heroicons/react/solid';

const Header = () => {
  const navigate = useNavigate();

  return (
    <header className="bg-[#1E3A5F] text-white px-6 py-4 flex justify-between items-center shadow">
      <h1 className="text-lg font-medium">Welcome, User!</h1>
      <button
        onClick={() => navigate('/')}
        title="Home"
        className="bg-vdx-blue p-2 rounded-full hover:brightness-95 transition"
      >
        <HomeIcon className="w-6 h-6 text-white" />
      </button>
    </header>
  );
};

export default Header;

