import React, { createContext, useContext, useState, useCallback } from 'react';
import * as contactsApi from '../api/contactsApi';

const ContactContext = createContext();

export const useContact = () => {
  const context = useContext(ContactContext);
  if (!context) {
    throw new Error('useContact must be used within a ContactProvider');
  }
  return context;
};

export const ContactProvider = ({ children }) => {
  const [contacts, setContacts] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [stats, setStats] = useState({
    total_contacts: 0,
    total_favorites: 0,
    groups: { family: 0, friends: 0, work: 0, other: 0 }
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGroup, setSelectedGroup] = useState('all');
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

  const fetchStats = useCallback(async () => {
    try {
      const data = await contactsApi.getStats();
      setStats(data);
    } catch (err) {
      console.error('Failed to fetch stats:', err);
    }
  }, []);

  // ✅ FIXED: now handles group filtering via correct endpoint
  const fetchContacts = useCallback(async (params = {}) => {
    setLoading(true);
    setError(null);
    try {
      let data;

      if (params.group && params.group !== 'all') {
        // Use the /contacts/groups/<name> endpoint
        data = await contactsApi.getContactsByGroup(params.group);
        // This endpoint returns { contacts: [], pagination: {} }
        setContacts(data.contacts || []);
        if (data.pagination) setPagination(data.pagination);
      } else {
        data = await contactsApi.getAllContacts({
          page: 1,
          per_page: 100,
          sort_by: params.sort_by,
          order: params.order,
        });
        setContacts(data.contacts || []);
        if (data.pagination) setPagination(data.pagination);
      }

      if (params.updateStats !== false) {
        await fetchStats();
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to fetch contacts');
      showToast('Failed to fetch contacts', 'error');
    } finally {
      setLoading(false);
    }
  }, [fetchStats, showToast]);

  const fetchFavorites = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await contactsApi.getFavorites({ page: 1, per_page: 100 });
      setFavorites(data.contacts || []);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to fetch favorites');
      showToast('Failed to fetch favorites', 'error');
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  const addContact = useCallback(async (formData) => {
    setLoading(true);
    setError(null);
    try {
      const data = await contactsApi.createContact(formData);
      showToast('Contact added successfully', 'success');
      await fetchContacts({ updateStats: true });
      return data;
    } catch (err) {
      const msg = err.response?.data?.error || 'Failed to add contact';
      setError(msg);
      showToast(msg, 'error');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [fetchContacts, showToast]);

  const editContact = useCallback(async (id, formData) => {
    setLoading(true);
    setError(null);
    try {
      const data = await contactsApi.updateContact(id, formData);
      showToast('Contact updated successfully', 'success');
      await fetchContacts({ updateStats: true });
      return data;
    } catch (err) {
      const msg = err.response?.data?.error || 'Failed to update contact';
      setError(msg);
      showToast(msg, 'error');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [fetchContacts, showToast]);

  const removeContact = useCallback(async (id) => {
    setLoading(true);
    setError(null);
    try {
      await contactsApi.deleteContact(id);
      showToast('Contact deleted successfully', 'success');
      await fetchContacts({ updateStats: true });
    } catch (err) {
      const msg = err.response?.data?.error || 'Failed to delete contact';
      setError(msg);
      showToast(msg, 'error');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [fetchContacts, showToast]);

  const toggleContactFavorite = useCallback(async (id) => {
    try {
      const data = await contactsApi.toggleFavorite(id);
      showToast(
        data.contact.is_favorite ? 'Added to favorites' : 'Removed from favorites',
        'success'
      );
      await fetchContacts({ updateStats: true });
      await fetchFavorites();
      return data;
    } catch (err) {
      const msg = err.response?.data?.error || 'Failed to toggle favorite';
      showToast(msg, 'error');
      throw err;
    }
  }, [fetchContacts, fetchFavorites, showToast]);

  const searchContactsQuery = useCallback(async (query, params = {}) => {
    setSearchQuery(query);
    if (!query.trim()) {
      await fetchContacts();
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const data = await contactsApi.searchContacts(query, {
        page: 1, per_page: 100, ...params
      });
      setContacts(data.contacts || []);
      if (data.pagination) setPagination(data.pagination);
    } catch (err) {
      setError(err.response?.data?.error || 'Search failed');
      showToast('Search failed', 'error');
    } finally {
      setLoading(false);
    }
  }, [fetchContacts, showToast]);

  const handleSetSelectedGroup = useCallback((group) => {
    setSelectedGroup(group);
  }, []);

  const value = {
    contacts, favorites, stats, loading, error,
    searchQuery, selectedGroup, pagination, toast,
    fetchContacts, fetchFavorites, fetchStats,
    addContact, editContact, removeContact,
    toggleContactFavorite, searchContactsQuery,
    setSelectedGroup: handleSetSelectedGroup,
    showToast, hideToast,
  };

  return (
    <ContactContext.Provider value={value}>
      {children}
    </ContactContext.Provider>
  );
};