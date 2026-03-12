import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import useContacts from '../../hooks/useContacts';
import Button from '../ui/Button';

const MenuIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
  </svg>
);

const SearchIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
  </svg>
);

const PlusIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
  </svg>
);

const CloseIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
  </svg>
);

const PAGE_TITLES = {
  '/':          'Dashboard',
  '/favorites': 'Favorites',
  '/groups':    'Groups',
};

const Navbar = ({ onAddContact, onMenuClick }) => {
  const location = useLocation();
  const { searchQuery, searchContactsQuery, loading } = useContacts();
  const [localSearch,       setLocalSearch]       = useState(searchQuery);
  const [showMobileSearch,  setShowMobileSearch]  = useState(false);

  const pageTitle = PAGE_TITLES[location.pathname] || 'Contact Book';

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (localSearch !== searchQuery) searchContactsQuery(localSearch);
    }, 500);
    return () => clearTimeout(timer);
  }, [localSearch]);

  const handleClearMobileSearch = () => {
    setShowMobileSearch(false);
    setLocalSearch('');
    searchContactsQuery('');
  };

  return (
    <nav className="bg-[#1e293b] border-b border-[#334155] px-4 md:px-6 py-3 md:py-4">
      <div className="flex items-center gap-3">

        {/* Hamburger — mobile only */}
        <button
          onClick={onMenuClick}
          className="text-[#94a3b8] hover:text-white transition-colors md:hidden flex-shrink-0 p-1"
          aria-label="Open menu"
        >
          <MenuIcon />
        </button>

        {/* Page title — hidden on mobile when search is expanded */}
        <h1 className={`text-xl md:text-2xl font-semibold text-white truncate flex-shrink-0
          ${showMobileSearch ? 'hidden' : 'block'} md:block`}>
          {pageTitle}
        </h1>

        {/* Spacer */}
        <div className="flex-1" />

        {/* Desktop search */}
        <div className="hidden md:block relative w-64">
          <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#94a3b8]">
            <SearchIcon />
          </span>
          <input
            type="text"
            placeholder="Search contacts..."
            value={localSearch}
            onChange={(e) => setLocalSearch(e.target.value)}
            disabled={loading}
            className="w-full pl-10 pr-3 py-2 bg-[#0f172a] border border-[#334155] rounded-lg
                       text-white placeholder-[#94a3b8] focus:outline-none focus:ring-2
                       focus:ring-[#6366f1] focus:border-transparent transition-colors"
          />
        </div>

        {/* Mobile search — expands inline */}
        {showMobileSearch ? (
          <div className="flex items-center gap-2 flex-1 md:hidden">
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="Search..."
                value={localSearch}
                onChange={(e) => setLocalSearch(e.target.value)}
                autoFocus
                disabled={loading}
                className="w-full pl-3 pr-8 py-2 bg-[#0f172a] border border-[#334155] rounded-lg
                           text-white placeholder-[#94a3b8] focus:outline-none focus:ring-2
                           focus:ring-[#6366f1] focus:border-transparent transition-colors text-sm"
              />
              <button
                onClick={handleClearMobileSearch}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-[#94a3b8] hover:text-white"
              >
                <CloseIcon />
              </button>
            </div>
          </div>
        ) : (
          /* Mobile search toggle button */
          <button
            onClick={() => setShowMobileSearch(true)}
            className="text-[#94a3b8] hover:text-white p-2 md:hidden"
            aria-label="Search"
          >
            <SearchIcon />
          </button>
        )}

        {/* Add Contact button
            Desktop: full text | Mobile: icon only */}
        <button
          onClick={onAddContact}
          className="flex items-center gap-2 bg-[#6366f1] hover:bg-[#4f46e5] text-white
                     rounded-lg transition-colors duration-200 font-medium flex-shrink-0
                     px-2 py-2 md:px-4 md:py-2 min-w-[40px] min-h-[40px] justify-center"
          aria-label="Add contact"
        >
          <PlusIcon />
          <span className="hidden md:inline text-sm">Add Contact</span>
        </button>

      </div>
    </nav>
  );
};

export default Navbar;