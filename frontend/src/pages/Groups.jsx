import React, { useState } from 'react';
import useContacts from '../hooks/useContacts';
import ContactList from '../components/contacts/ContactList';
import ContactModal from '../components/contacts/ContactModal';
import ConfirmDialog from '../components/ui/ConfirmDialog';
import Button from '../components/ui/Button';
import { getGroupIcon } from '../utils/helpers';

// ── Group Card ─────────────────────────────────────────────
const GroupCard = ({ group, count, onClick }) => (
  <button
    onClick={onClick}
    className="bg-[#1e293b] rounded-lg border border-[#334155] p-4 md:p-6
               hover:border-[#6366f1] transition-colors duration-200 text-left w-full"
  >
    <div className="flex items-center space-x-4">
      <div className="p-3 rounded-lg bg-[#334155]">
        <span className="text-2xl">{getGroupIcon(group)}</span>
      </div>
      <div>
        <h3 className="text-lg font-semibold text-white capitalize mb-1">{group}</h3>
        <p className="text-[#94a3b8] text-sm">
          {count} {count === 1 ? 'contact' : 'contacts'}
        </p>
      </div>
    </div>
  </button>
);

// ── Groups Page ────────────────────────────────────────────
const Groups = () => {
  const {
    contacts, stats, loading,
    fetchContacts, removeContact, toggleContactFavorite,
  } = useContacts();

  const [selectedGroup, setSelectedGroup] = useState(null);
  const [groupContacts, setGroupContacts] = useState([]);
  const [groupLoading,  setGroupLoading]  = useState(false);

  const [showAddModal,  setShowAddModal]  = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editContact,   setEditContact]   = useState(null);
  const [confirmDialog, setConfirmDialog] = useState({ isOpen: false, contactId: null });

  const groups = [
    { name: 'family',  count: stats?.groups?.family  ?? 0 },
    { name: 'friends', count: stats?.groups?.friends ?? 0 },
    { name: 'work',    count: stats?.groups?.work    ?? 0 },
    { name: 'other',   count: stats?.groups?.other   ?? 0 },
  ];

  // ── Load contacts for a specific group ──────────────────
  const loadGroupContacts = async (groupName) => {
    setGroupLoading(true);
    try {
      // Filter from already loaded contacts, or refetch filtered
      await fetchContacts({ group: groupName });
    } finally {
      setGroupLoading(false);
    }
  };

  const handleGroupClick = async (groupName) => {
    setSelectedGroup(groupName);
    await loadGroupContacts(groupName);
  };

  const handleBack = () => {
    setSelectedGroup(null);
    fetchContacts(); // reload all contacts
  };

  const handleEdit = (contact) => {
    setEditContact(contact);
    setShowEditModal(true);
  };

  const handleDelete = (id) => setConfirmDialog({ isOpen: true, contactId: id });

  const handleConfirmDelete = async () => {
    await removeContact(confirmDialog.contactId);
    setConfirmDialog({ isOpen: false, contactId: null });
    if (selectedGroup) await loadGroupContacts(selectedGroup);
  };

  const handleCloseEdit = () => {
    setShowEditModal(false);
    setEditContact(null);
    if (selectedGroup) loadGroupContacts(selectedGroup);
  };

  const handleAddClose = () => {
    setShowAddModal(false);
    if (selectedGroup) loadGroupContacts(selectedGroup);
  };

  // ── Group Detail View ────────────────────────────────────
  if (selectedGroup) {
    return (
      <div className="space-y-4 md:space-y-6">
        {/* Header */}
        <div className="bg-[#1e293b] rounded-lg border border-[#334155] p-4 md:p-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center space-x-3">
              <button
                onClick={handleBack}
                className="text-[#94a3b8] hover:text-white transition-colors
                           min-w-[44px] min-h-[44px] flex items-center justify-center"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <div>
                <h1 className="text-xl md:text-2xl font-semibold text-white capitalize">
                  {selectedGroup} Group
                </h1>
                <p className="text-[#94a3b8] text-sm mt-1">
                  {contacts.length} {contacts.length === 1 ? 'contact' : 'contacts'}
                </p>
              </div>
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

        {/* Contact List */}
        <div className="bg-[#1e293b] rounded-lg border border-[#334155] p-4 md:p-6">
          <ContactList
            contacts={contacts}
            loading={loading || groupLoading}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onToggleFavorite={toggleContactFavorite}
            emptyMessage={`No contacts in the ${selectedGroup} group yet`}
          />
        </div>

        {/* Modals */}
        <ContactModal
          isOpen={showAddModal}
          onClose={handleAddClose}
          mode="add"
          initialGroup={selectedGroup}
        />
        <ContactModal
          isOpen={showEditModal}
          onClose={handleCloseEdit}
          mode="edit"
          contact={editContact}
        />
        <ConfirmDialog
          isOpen={confirmDialog.isOpen}
          title="Delete Contact"
          message="Are you sure you want to delete this contact? This action cannot be undone."
          confirmText="Delete"
          onConfirm={handleConfirmDelete}
          onCancel={() => setConfirmDialog({ isOpen: false, contactId: null })}
          variant="danger"
        />
      </div>
    );
  }

  // ── Groups Overview ──────────────────────────────────────
  return (
    <div className="space-y-4 md:space-y-6">
      <div className="bg-[#1e293b] rounded-lg border border-[#334155] p-4 md:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl md:text-2xl font-semibold text-white mb-1">Contact Groups</h1>
            <p className="text-[#94a3b8] text-sm">Organize your contacts into groups</p>
          </div>
          <Button variant="primary" onClick={() => setShowAddModal(true)} className="w-full sm:w-auto">
            Add New Contact
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {groups.map((g) => (
          <GroupCard
            key={g.name}
            group={g.name}
            count={g.count}
            onClick={() => handleGroupClick(g.name)}
          />
        ))}
      </div>

      <ContactModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        mode="add"
      />
      <ConfirmDialog
        isOpen={confirmDialog.isOpen}
        title="Delete Contact"
        message="Are you sure you want to delete this contact? This action cannot be undone."
        confirmText="Delete"
        onConfirm={handleConfirmDelete}
        onCancel={() => setConfirmDialog({ isOpen: false, contactId: null })}
        variant="danger"
      />
    </div>
  );
};

export default Groups;