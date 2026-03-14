import React, { createContext, useContext, useState, useCallback } from 'react';
import {
  getContacts,
  getContactsByGroup,
  getFavorites,
  createContact,
  updateContact,
  deleteContact,
  toggleFavorite,
  searchContacts,
  getStats,
} from '../api/contactsApi';

const ContactContext = createContext();

export const useContact = () => {
  const context = useContext(ContactContext);
  if (!context) throw new Error('useContact must be used within a ContactProvider');
  return context;
};

export const ContactProvider = ({ children }) => {
  const [contacts,   setContacts]   = useState([]);
  const [favorites,  setFavorites]  = useState([]);
  const [stats,      setStats]      = useState({
    total: 0, total_contacts: 0,
    favorites: 0, total_favorites: 0,
    recent: 0,
    groups: { family: 0, friends: 0, work: 0, other: 0 }
  });
  const [loading,    setLoading]    = useState(false);
  const [error,      setError]      = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [pagination, setPagination] = useState({
    total: 0, pages: 0, current_page: 1,
    per_page: 100, has_next: false, has_prev: false
  });
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

  const showToast = useCallback((message, type = 'success') => {
    setToast({ show: true, message, type });
  }, []);

  const hideToast = useCallback(() => {
    setToast(prev => ({ ...prev, show: false }));
  }, []);

  // ── Fetch Stats ────────────────────────────────────────
  const fetchStats = useCallback(async () => {
    try {
      const data = await getStats();
      setStats(data);
    } catch (err) {
      console.error('Failed to fetch stats:', err);
    }
  }, []);

  // ── Fetch Contacts ─────────────────────────────────────
  const fetchContacts = useCallback(async (params = {}) => {
    setLoading(true);
    setError(null);
    try {
      let data;
      if (params.group && params.group !== 'all') {
        data = await getContactsByGroup(params.group);
      } else {
        data = await getContacts({
          page: 1, per_page: 100,
          sort_by: params.sort_by,
          order:   params.order,
        });
      }
      setContacts(data.contacts || []);
      if (data.pagination) setPagination(data.pagination);

      if (params.updateStats !== false) await fetchStats();
    } catch (err) {
      const msg = err?.response?.data?.error || 'Failed to fetch contacts';
      setError(msg);
      showToast(msg, 'error');
    } finally {
      setLoading(false);
    }
  }, [fetchStats, showToast]);

  // ── Fetch Favorites ────────────────────────────────────
  const fetchFavorites = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getFavorites({ page: 1, per_page: 100 });
      setFavorites(data.contacts || []);
    } catch (err) {
      const msg = err?.response?.data?.error || 'Failed to fetch favorites';
      setError(msg);
      showToast(msg, 'error');
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  // ── Add Contact ────────────────────────────────────────
  const addContact = useCallback(async (formData) => {
    setLoading(true);
    setError(null);
    try {
      const data = await createContact(formData);
      showToast('Contact added successfully', 'success');
      await fetchContacts({ updateStats: true });
      return data;
    } catch (err) {
      const msg = err?.response?.data?.error || 'Failed to add contact';
      setError(msg);
      showToast(msg, 'error');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [fetchContacts, showToast]);

  // ── Edit Contact ───────────────────────────────────────
  const editContact = useCallback(async (id, formData) => {
    setLoading(true);
    setError(null);
    try {
      const data = await updateContact(id, formData);
      showToast('Contact updated successfully', 'success');
      await fetchContacts({ updateStats: true });
      return data;
    } catch (err) {
      const msg = err?.response?.data?.error || 'Failed to update contact';
      setError(msg);
      showToast(msg, 'error');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [fetchContacts, showToast]);

  // ── Remove Contact ─────────────────────────────────────
  const removeContact = useCallback(async (id) => {
    setLoading(true);
    setError(null);
    try {
      await deleteContact(id);
      showToast('Contact deleted successfully', 'success');
      await fetchContacts({ updateStats: true });
    } catch (err) {
      const msg = err?.response?.data?.error || 'Failed to delete contact';
      setError(msg);
      showToast(msg, 'error');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [fetchContacts, showToast]);

  // ── Toggle Favorite ────────────────────────────────────
  const toggleContactFavorite = useCallback(async (id) => {
    try {
      const data = await toggleFavorite(id);
      showToast(
        data.contact?.is_favorite ? 'Added to favorites' : 'Removed from favorites',
        'success'
      );
      await fetchContacts({ updateStats: true });
      await fetchFavorites();
      return data;
    } catch (err) {
      const msg = err?.response?.data?.error || 'Failed to toggle favorite';
      showToast(msg, 'error');
      throw err;
    }
  }, [fetchContacts, fetchFavorites, showToast]);

  // ── Search ─────────────────────────────────────────────
  const searchContactsQuery = useCallback(async (query, params = {}) => {
    setSearchQuery(query);
    if (!query.trim()) {
      await fetchContacts();
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const data = await searchContacts({ q: query, page: 1, per_page: 100, ...params });
      setContacts(data.contacts || []);
      if (data.pagination) setPagination(data.pagination);
    } catch (err) {
      const msg = err?.response?.data?.error || 'Search failed';
      setError(msg);
      showToast(msg, 'error');
    } finally {
      setLoading(false);
    }
  }, [fetchContacts, showToast]);

  const value = {
    contacts, favorites, stats, loading, error,
    searchQuery, setSearchQuery, pagination, toast,
    fetchContacts, fetchFavorites, fetchStats,
    addContact, editContact, removeContact,
    toggleContactFavorite, searchContactsQuery,
    showToast, hideToast,
  };

  return (
    <ContactContext.Provider value={value}>
      {children}
    </ContactContext.Provider>
  );
};