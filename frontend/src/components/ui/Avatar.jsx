import React, { useState } from 'react';
import { getInitials, generateAvatarColor } from '../../utils/helpers';

const Avatar = ({ name = '', profilePicture, size = 'md' }) => {
  const [imgError, setImgError] = useState(false);

  const sizeClasses = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-12 h-12 text-base',
    lg: 'w-20 h-20 text-2xl',
  };

  // Split name into parts for initials
  const nameParts  = name.trim().split(' ');
  const firstName  = nameParts[0] || '';
  const lastName   = nameParts[1] || '';
  const initials   = getInitials(firstName, lastName);
  const bgColor    = generateAvatarColor(name);

  const imageUrl = profilePicture
    ? `${import.meta.env.VITE_API_BASE_URL}/contacts/uploads/${profilePicture}`
    : null;

  if (profilePicture && !imgError) {
    return (
      <div className={`${sizeClasses[size]} rounded-full overflow-hidden flex-shrink-0`}>
        <img
          src={imageUrl}
          alt={name}
          className="w-full h-full object-cover"
          onError={() => setImgError(true)}
        />
      </div>
    );
  }

  return (
    <div
      className={`${sizeClasses[size]} rounded-full flex items-center justify-center font-medium text-white flex-shrink-0`}
      style={{ backgroundColor: bgColor }}
    >
      {initials}
    </div>
  );
};

export default Avatar;