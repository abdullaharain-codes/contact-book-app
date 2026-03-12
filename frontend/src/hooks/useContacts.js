import { useContact } from '../context/ContactContext';
import { useMemo } from 'react';

/**
 * Custom hook for contact management
 * Provides derived values and convenient access to contact context
 */
export const useContacts = () => {
  const context = useContact();
  
  // Derived values
  const isLoading = context.loading;
  const hasContacts = context.contacts.length > 0;
  const hasFavorites = context.favorites.length > 0;
  
  // Filter contacts based on selected group
  const filteredContacts = useMemo(() => {
    if (context.selectedGroup === 'all') {
      return context.contacts;
    }
    return context.contacts.filter(
      contact => contact.group === context.selectedGroup
    );
  }, [context.contacts, context.selectedGroup]);
  
  // Group statistics derived from contacts
  const groupStats = useMemo(() => {
    return context.stats.groups || {
      family: 0,
      friends: 0,
      work: 0,
      other: 0
    };
  }, [context.stats.groups]);
  
  // Return everything from context plus derived values
  return {
    // Original context values
    ...context,
    
    // Derived values (overrides if needed)
    isLoading,
    hasContacts,
    hasFavorites,
    filteredContacts,
    groupStats,
    
    // Alias for backward compatibility
    loading: isLoading,
  };
};

export default useContacts;