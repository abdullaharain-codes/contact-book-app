import React from 'react';
import PropTypes from 'prop-types';
import ContactCard from './ContactCard';

const SkeletonCard = () => (
  <div className="bg-[#1e293b] rounded-xl border border-[#334155] p-5 animate-pulse">
    <div className="flex justify-between items-start">
      <div className="w-12 h-12 bg-[#334155] rounded-full"></div>
      <div className="w-6 h-6 bg-[#334155] rounded"></div>
    </div>
    <div className="mt-3 space-y-2">
      <div className="h-5 bg-[#334155] rounded w-3/4"></div>
      <div className="h-4 bg-[#334155] rounded w-1/2"></div>
    </div>
    <div className="mt-2">
      <div className="h-6 bg-[#334155] rounded w-20"></div>
    </div>
    <div className="mt-4 space-y-2">
      <div className="h-4 bg-[#334155] rounded w-full"></div>
      <div className="h-4 bg-[#334155] rounded w-5/6"></div>
    </div>
    <div className="mt-4 pt-3 border-t border-[#334155] flex gap-2">
      <div className="h-8 bg-[#334155] rounded flex-1"></div>
      <div className="h-8 w-8 bg-[#334155] rounded"></div>
    </div>
  </div>
);

const EmptyState = ({ message }) => (
  <div className="col-span-full flex flex-col items-center justify-center py-16 px-4">
    <svg className="w-16 h-16 text-[#94a3b8] mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
        d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
    </svg>
    <p className="text-[#94a3b8] text-lg text-center">{message}</p>
  </div>
);

const ContactList = ({
  contacts = [],
  onEdit         = () => {},
  onDelete       = () => {},
  onToggleFavorite = () => {},
  loading        = false,
  emptyMessage   = 'No contacts found',
}) => {
  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {[...Array(8)].map((_, i) => <SkeletonCard key={i} />)}
      </div>
    );
  }

  if (!contacts || contacts.length === 0) {
    return <EmptyState message={emptyMessage} />;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {contacts.map((contact) => (
        <ContactCard
          key={contact.id}
          contact={contact}
          onEdit={onEdit}
          onDelete={onDelete}
          onToggleFavorite={onToggleFavorite}
        />
      ))}
    </div>
  );
};

ContactList.propTypes = {
  contacts:         PropTypes.array,
  onEdit:           PropTypes.func,
  onDelete:         PropTypes.func,
  onToggleFavorite: PropTypes.func,
  loading:          PropTypes.bool,
  emptyMessage:     PropTypes.string,
};

export default ContactList;