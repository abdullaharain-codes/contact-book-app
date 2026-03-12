import React from 'react';
import { NavLink } from 'react-router-dom';
import useContacts from '../../hooks/useContacts';

const HomeIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
  </svg>
);

const HeartIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
  </svg>
);

const UsersIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
  </svg>
);

const CloseIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
  </svg>
);

const Sidebar = ({ isOpen, onClose }) => {
  const { stats } = useContacts();

  const navItems = [
    { path: '/',         label: 'Dashboard', icon: HomeIcon  },
    { path: '/favorites', label: 'Favorites', icon: HeartIcon },
    { path: '/groups',   label: 'Groups',    icon: UsersIcon },
  ];

  const getNavLinkClass = ({ isActive }) =>
    `flex items-center px-4 py-3 mb-1 rounded-lg transition-colors duration-200 ${
      isActive
        ? 'bg-[#6366f1] text-white'
        : 'text-[#94a3b8] hover:bg-[#334155] hover:text-white'
    }`;

  const handleNavClick = () => {
    if (window.innerWidth < 768) onClose();
  };

  return (
    <>
      {/* Mobile overlay — sits behind sidebar */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar panel */}
      <aside className={`
        fixed left-0 top-0 h-full w-[260px] bg-[#1e293b] z-50
        flex flex-col
        transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        md:translate-x-0
      `}>

        {/* Logo */}
        <div className="flex items-center justify-between px-4 py-6 border-b border-[#334155]">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-[#6366f1] rounded-lg flex items-center justify-center mr-3">
              <span className="text-white font-bold text-sm">C</span>
            </div>
            <h1 className="text-white font-semibold text-lg">Contact Book</h1>
          </div>
          {/* Close button — mobile only */}
          <button
            onClick={onClose}
            className="text-[#94a3b8] hover:text-white transition-colors md:hidden p-1"
            aria-label="Close sidebar"
          >
            <CloseIcon />
          </button>
        </div>

        {/* Nav links */}
        <nav className="flex-1 px-3 py-6 overflow-y-auto">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={getNavLinkClass}
              end={item.path === '/'}
              onClick={handleNavClick}
            >
              <item.icon />
              <span className="ml-3">{item.label}</span>
            </NavLink>
          ))}
        </nav>

        {/* Quick Stats */}
        <div className="px-4 py-6 border-t border-[#334155]">
          <div className="bg-[#0f172a] rounded-lg p-4">
            <h3 className="text-sm font-medium text-[#94a3b8] mb-3">Quick Stats</h3>
            <div className="space-y-2">
              {[
                { label: 'Total Contacts', value: stats.total_contacts },
                { label: 'Favorites',      value: stats.total_favorites },
                { label: 'Groups',         value: Object.values(stats.groups || {}).filter(c => c > 0).length },
              ].map(({ label, value }) => (
                <div key={label} className="flex justify-between items-center">
                  <span className="text-sm text-[#94a3b8]">{label}</span>
                  <span className="text-white font-semibold">{value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

      </aside>
    </>
  );
};

export default Sidebar;