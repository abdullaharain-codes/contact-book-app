/**
 * Format date string to readable format
 * @param {string} dateString - ISO date string
 * @returns {string} Formatted date (e.g., "Mar 10, 2026")
 */
export const formatDate = (dateString) => {
  if (!dateString) return '';
  
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
};

/**
 * Get initials from first and last name
 * @param {string} firstName 
 * @param {string} lastName 
 * @returns {string} Initials (max 2 characters)
 */
export const getInitials = (firstName, lastName) => {
  if (!firstName) return '?';
  
  const first = firstName.charAt(0).toUpperCase();
  const last = lastName ? lastName.charAt(0).toUpperCase() : '';
  
  return first + last;
};

/**
 * Generate consistent color for avatar based on name
 * @param {string} name 
 * @returns {string} Hex color code
 */
export const generateAvatarColor = (name) => {
  if (!name) return '#6366f1';
  
  // Simple hash function
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  
  // Predefined color palette
  const colors = [
    '#6366f1', // primary
    '#8b5cf6', // secondary
    '#ec4899', // pink
    '#14b8a6', // teal
    '#f59e0b', // amber
    '#ef4444', // red
    '#10b981', // emerald
    '#3b82f6', // blue
  ];
  
  const index = Math.abs(hash) % colors.length;
  return colors[index];
};

/**
 * Validate email format
 * @param {string} email 
 * @returns {boolean}
 */
export const validateEmail = (email) => {
  if (!email) return true; // Optional field
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

/**
 * Validate phone number (basic validation)
 * @param {string} phone 
 * @returns {boolean}
 */
export const validatePhone = (phone) => {
  if (!phone) return true; // Optional field
  // Allow digits, spaces, +, -, (, )
  const re = /^[0-9+\-\s()]+$/;
  return re.test(phone) && phone.length <= 20;
};

/**
 * Truncate text to specified length
 * @param {string} text 
 * @param {number} maxLength 
 * @returns {string}
 */
export const truncateText = (text, maxLength = 50) => {
  if (!text || text.length <= maxLength) return text || '';
  return text.substring(0, maxLength) + '...';
};

/**
 * Format phone number to (123) 456-7890
 * @param {string} phone 
 * @returns {string}
 */
export const formatPhoneNumber = (phone) => {
  if (!phone) return '';
  
  // Remove all non-digits
  const cleaned = phone.replace(/\D/g, '');
  
  // Check if it's a 10-digit US number
  if (cleaned.length === 10) {
    return `(${cleaned.slice(0,3)}) ${cleaned.slice(3,6)}-${cleaned.slice(6,10)}`;
  }
  
  // Return original if not 10 digits
  return phone;
};

/**
 * Capitalize first letter of string
 * @param {string} string 
 * @returns {string}
 */
export const capitalizeFirst = (string) => {
  if (!string) return '';
  return string.charAt(0).toUpperCase() + string.slice(1);
};

/**
 * Get emoji icon for group
 * @param {string} group 
 * @returns {string} Emoji
 */
export const getGroupIcon = (group) => {
  const icons = {
    family: '👨‍👩‍👧‍👦',
    friends: '👥',
    work: '💼',
    other: '📌'
  };
  return icons[group] || '📌';
};

/**
 * Get Tailwind color class for group
 * @param {string} group 
 * @returns {string} Tailwind color class
 */
export const getGroupColor = (group) => {
  const colors = {
    family: 'text-green-500',
    friends: 'text-blue-500',
    work: 'text-purple-500',
    other: 'text-gray-500'
  };
  return colors[group] || 'text-gray-500';
};

/**
 * Get group display name
 * @param {string} group 
 * @returns {string} Capitalized group name
 */
export const getGroupDisplayName = (group) => {
  return capitalizeFirst(group);
};

/**
 * Debounce function for search inputs
 * @param {Function} func 
 * @param {number} wait 
 * @returns {Function}
 */
export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};