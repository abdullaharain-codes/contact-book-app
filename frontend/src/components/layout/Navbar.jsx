import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../../context/AuthContext';

const Navbar = ({ onMenuClick }) => {
  const { user, logout }           = useContext(AuthContext);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    setShowUserMenu(false);
    logout();
    navigate('/login');
  };

  return (
    <header className="bg-[#1e293b] border-b border-[#334155] px-4 h-14 flex items-center gap-3 flex-shrink-0">

      {/* Hamburger — mobile only */}
      <button
        onClick={onMenuClick}
        className="md:hidden text-[#94a3b8] hover:text-white w-10 h-10
                   flex items-center justify-center rounded-lg hover:bg-[#0f172a] transition-colors"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      {/* Title — mobile only */}
      <span className="md:hidden text-white font-semibold text-sm flex-1">Contact Book</span>

      {/* Spacer — desktop */}
      <div className="hidden md:flex flex-1" />

      {/* User menu */}
      <div className="relative ml-auto">
        <button
          onClick={() => setShowUserMenu(p => !p)}
          className="flex items-center gap-2 h-10 px-2 rounded-lg
                     hover:bg-[#0f172a] transition-colors"
        >
          <div className="w-8 h-8 rounded-full bg-[#6366f1] flex items-center justify-center
                          text-white text-sm font-semibold flex-shrink-0">
            {user?.name?.charAt(0).toUpperCase() || 'U'}
          </div>
          <span className="hidden md:block text-sm text-white font-medium max-w-[120px] truncate">
            {user?.name || 'User'}
          </span>
          <svg className="hidden md:block w-4 h-4 text-[#94a3b8]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {showUserMenu && (
          <>
            <div className="fixed inset-0 z-10" onClick={() => setShowUserMenu(false)} />
            <div className="absolute right-0 mt-2 w-52 bg-[#1e293b] border border-[#334155]
                            rounded-xl shadow-2xl z-20 overflow-hidden">
              <div className="px-4 py-3 border-b border-[#334155]">
                <p className="text-white text-sm font-medium truncate">{user?.name}</p>
                <p className="text-[#94a3b8] text-xs truncate">{user?.email}</p>
              </div>
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-3 text-red-400
                           hover:bg-red-500/10 transition-colors text-sm"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                Sign Out
              </button>
            </div>
          </>
        )}
      </div>
    </header>
  );
};

export default Navbar;