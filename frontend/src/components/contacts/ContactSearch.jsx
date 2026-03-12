import React, { useState } from 'react';
import useContacts from '../../hooks/useContacts';
import ContactList from './ContactList';
import ContactModal from './ContactModal';

const ClearIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
  </svg>
);

const ContactSearch = () => {
  const {
    searchQuery,
    contacts,
    loading,
    toggleContactFavorite,
    removeContact,
    searchContactsQuery,
  } = useContacts();

  const [editContact,    setEditContact]    = useState(null);
  const [showEditModal,  setShowEditModal]  = useState(false);

  if (!searchQuery) return null;

  const handleClearSearch = () => searchContactsQuery('');

  const handleEdit = (contact) => {
    setEditContact(contact);
    setShowEditModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this contact?')) {
      await removeContact(id);
    }
  };

  return (
    <div className="space-y-4">
      {/* Search Header */}
      <div className="bg-[#1e293b] rounded-lg border border-[#334155] p-4 flex items-center justify-between">
        <div>
          <span className="text-[#94a3b8]">Results for: </span>
          <span className="text-white font-medium">"{searchQuery}"</span>
          <span className="ml-2 text-sm text-[#94a3b8]">
            ({contacts.length} {contacts.length === 1 ? 'result' : 'results'})
          </span>
        </div>
        <button
          onClick={handleClearSearch}
          className="flex items-center text-[#94a3b8] hover:text-white transition-colors"
        >
          <ClearIcon />
          <span className="ml-1 text-sm">Clear</span>
        </button>
      </div>

      {/* Results */}
      <ContactList
        contacts={contacts}
        loading={loading}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onToggleFavorite={toggleContactFavorite}
        emptyMessage={`No results found for "${searchQuery}"`}
      />

      {/* Edit Modal */}
      {showEditModal && editContact && (
        <ContactModal
          isOpen={showEditModal}
          onClose={() => { setShowEditModal(false); setEditContact(null); }}
          mode="edit"
          contact={editContact}
        />
      )}
    </div>
  );
};

export default ContactSearch;