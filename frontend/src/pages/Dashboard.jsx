import React, { useEffect, useState } from 'react';
import useContacts from '../hooks/useContacts';
import ContactList from '../components/contacts/ContactList';
import ContactModal from '../components/contacts/ContactModal';
import ContactSearch from '../components/contacts/ContactSearch';
import ConfirmDialog from '../components/ui/ConfirmDialog';
import Button from '../components/ui/Button';

// ── Stat Card ──────────────────────────────────────────────
const StatCard = ({ title, value, icon, color = 'primary' }) => {
  const colorClasses = {
    primary:   'bg-[#6366f1]/10 text-[#6366f1]',
    secondary: 'bg-[#8b5cf6]/10 text-[#8b5cf6]',
    success:   'bg-green-500/10 text-green-500',
    warning:   'bg-yellow-500/10 text-yellow-500',
  };

  return (
    <div className="bg-[#1e293b] rounded-lg p-4 md:p-6 border border-[#334155]">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-[#94a3b8] text-xs md:text-sm mb-1">{title}</p>
          <p className="text-xl md:text-2xl font-semibold text-white">{value ?? 0}</p>
        </div>
        <div className={`p-2 md:p-3 rounded-lg ${colorClasses[color]}`}>
          {icon}
        </div>
      </div>
    </div>
  );
};

// ── Icons ──────────────────────────────────────────────────
const UsersIcon = () => (
  <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
  </svg>
);
const HeartIcon = () => (
  <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
  </svg>
);
const GroupsIcon = () => (
  <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
  </svg>
);
const CalendarIcon = () => (
  <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
  </svg>
);

// ── Dashboard ──────────────────────────────────────────────
const Dashboard = () => {
  const {
    contacts, stats, loading, error, searchQuery,
    fetchContacts, fetchStats, removeContact, toggleContactFavorite
  } = useContacts();

  // ✅ Modal state managed locally — no longer passed as props
  const [showAddModal,  setShowAddModal]  = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editContact,   setEditContact]   = useState(null);
  const [confirmDialog, setConfirmDialog] = useState({ isOpen: false, contactId: null });

  useEffect(() => {
    fetchContacts();
    fetchStats();
  }, []);

  const getRecentCount = () => {
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    return contacts.filter(c => new Date(c.created_at) >= oneWeekAgo).length;
  };

  const handleEdit = (contact) => {
    setEditContact(contact);
    setShowEditModal(true);
  };

  const handleDelete = (id) => {
    setConfirmDialog({ isOpen: true, contactId: id });
  };

  const handleConfirmDelete = async () => {
    await removeContact(confirmDialog.contactId);
    setConfirmDialog({ isOpen: false, contactId: null });
  };

  const handleCloseEditModal = () => {
    setShowEditModal(false);
    setEditContact(null);
  };

  return (
    <div className="space-y-4 md:space-y-6">

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
        <StatCard title="Total"        value={stats?.total ?? stats?.total_contacts ?? 0} icon={<UsersIcon />}   color="primary" />
        <StatCard title="Favorites"    value={stats?.favorites ?? stats?.total_favorites ?? 0} icon={<HeartIcon />}    color="secondary" />
        <StatCard title="Groups"       value={Object.values(stats?.groups || {}).filter(c => c > 0).length} icon={<GroupsIcon />}   color="success" />
        <StatCard title="New This Week" value={stats?.recent ?? getRecentCount()} icon={<CalendarIcon />} color="warning" />
      </div>

      {/* Search Results */}
      {searchQuery && <ContactSearch />}

      {/* Contact List */}
      {!searchQuery && (
        <div className="bg-[#1e293b] rounded-lg border border-[#334155] p-4 md:p-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 md:mb-6">
            <h2 className="text-lg md:text-xl font-semibold text-white">All Contacts</h2>
            <Button
              variant="primary" size="sm"
              onClick={() => setShowAddModal(true)}
              className="w-full sm:w-auto"
            >
              Add New Contact
            </Button>
          </div>

          {error ? (
            <div className="bg-red-500/10 border border-red-500 rounded-lg p-4 text-red-400 text-sm">
              Failed to fetch contacts
            </div>
          ) : (
            <ContactList
              contacts={contacts}
              loading={loading}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onToggleFavorite={toggleContactFavorite}
              emptyMessage="No contacts yet. Click 'Add New Contact' to get started!"
            />
          )}
        </div>
      )}

      {/* Add Modal */}
      <ContactModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        mode="add"
      />

      {/* Edit Modal */}
      <ContactModal
        isOpen={showEditModal}
        onClose={handleCloseEditModal}
        mode="edit"
        contact={editContact}
      />

      {/* Confirm Delete */}
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

export default Dashboard;