import React, { useEffect, useState } from 'react';
import useContacts from '../hooks/useContacts';
import ContactList from '../components/contacts/ContactList';
import ContactModal from '../components/contacts/ContactModal';
import ConfirmDialog from '../components/ui/ConfirmDialog';
import Button from '../components/ui/Button';

// Heart icon for empty state
const HeartIcon = () => (
  <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
  </svg>
);

const Favorites = ({ showAddModal, setShowAddModal }) => {
  const { 
    favorites, 
    loading, 
    error, 
    fetchFavorites,
    removeContact,
    toggleContactFavorite
  } = useContacts();
  
  const [editContact, setEditContact] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [confirmDialog, setConfirmDialog] = useState({
    isOpen: false,
    contactId: null
  });

  useEffect(() => {
    fetchFavorites();
  }, []);

  const handleEdit = (contact) => {
    setEditContact(contact);
    setShowEditModal(true);
  };

  const handleDelete = (id) => {
    setConfirmDialog({
      isOpen: true,
      contactId: id
    });
  };

  const handleConfirmDelete = async () => {
    await removeContact(confirmDialog.contactId);
    setConfirmDialog({ isOpen: false, contactId: null });
    fetchFavorites();
  };

  const handleCancelDelete = () => {
    setConfirmDialog({ isOpen: false, contactId: null });
  };

  const handleToggleFavorite = async (id) => {
    await toggleContactFavorite(id);
    fetchFavorites();
  };

  const handleCloseEditModal = () => {
    setShowEditModal(false);
    setEditContact(null);
    fetchFavorites();
  };

  return (
    <div className="space-y-4 md:space-y-6">
      {/* Header */}
      <div className="bg-surface rounded-lg border border-border p-4 md:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl md:text-2xl font-semibold text-white mb-2">Favorite Contacts</h1>
            <p className="text-muted text-sm md:text-base">
              {favorites.length} {favorites.length === 1 ? 'contact' : 'contacts'} marked as favorite
            </p>
          </div>
          <Button
            variant="primary"
            onClick={() => setShowAddModal(true)}
            className="w-full sm:w-auto"
          >
            Add New Contact
          </Button>
        </div>
      </div>

      {/* Favorites List */}
      <div className="bg-surface rounded-lg border border-border p-4 md:p-6">
        {error ? (
          <div className="bg-red-500/10 border border-red-500 rounded-lg p-4 text-red-500">
            {error}
          </div>
        ) : (
          <ContactList
            contacts={favorites}
            loading={loading}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onToggleFavorite={handleToggleFavorite}
            emptyMessage="No favorite contacts yet. Mark contacts as favorite to see them here!"
          />
        )}
      </div>

      {/* Add Contact Modal */}
      {showAddModal && (
        <ContactModal
          isOpen={showAddModal}
          onClose={() => setShowAddModal(false)}
          mode="add"
        />
      )}

      {/* Edit Contact Modal */}
      {showEditModal && editContact && (
        <ContactModal
          isOpen={showEditModal}
          onClose={handleCloseEditModal}
          mode="edit"
          contact={editContact}
        />
      )}

      {/* Confirm Delete Dialog */}
      <ConfirmDialog
        isOpen={confirmDialog.isOpen}
        title="Delete Contact"
        message="Are you sure you want to delete this contact? This action cannot be undone."
        confirmText="Delete"
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
        variant="danger"
      />
    </div>
  );
};

export default Favorites;