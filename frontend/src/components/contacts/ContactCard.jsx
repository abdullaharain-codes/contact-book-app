import React from 'react';
import PropTypes from 'prop-types';
import Avatar from '../ui/Avatar';
import Button from '../ui/Button';
import {
  truncateText,
  formatPhoneNumber,
  getGroupColor,
  getGroupIcon,
  capitalizeFirst
} from '../../utils/helpers';

// SVG Icons
const PhoneIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
  </svg>
);

const EmailIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
  </svg>
);

const LocationIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

const EditIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
  </svg>
);

const DeleteIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
  </svg>
);

const HeartIcon = ({ filled }) => (
  <svg
    className={`w-6 h-6 ${filled ? 'text-red-500' : 'text-muted hover:text-red-500'}`}
    fill={filled ? 'currentColor' : 'none'}
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
    />
  </svg>
);

const ContactCard = ({ contact, onEdit, onDelete, onToggleFavorite }) => {
  const fullName = `${contact.first_name} ${contact.last_name || ''}`.trim();
  const groupColor = getGroupColor(contact.group);
  const groupIcon = getGroupIcon(contact.group);
  const jobInfo = [contact.job_title, contact.company].filter(Boolean).join(' at ');

  return (
    <div className="bg-surface rounded-xl border border-border hover:border-primary hover:shadow-lg transition-all duration-200 overflow-hidden">
      {/* Header Section */}
      <div className="p-4 md:p-5">
        <div className="flex justify-between items-start">
          <Avatar name={fullName} profilePicture={contact.profile_picture} size="md" />
          <button
            onClick={() => onToggleFavorite(contact.id)}
            className="focus:outline-none transition-transform hover:scale-110 min-w-[44px] min-h-[44px] flex items-center justify-center"
            aria-label={contact.is_favorite ? 'Remove from favorites' : 'Add to favorites'}
          >
            <HeartIcon filled={contact.is_favorite} />
          </button>
        </div>

        {/* Name and Job Info */}
        <div className="mt-3">
          <h3 className="text-white font-semibold text-base md:text-lg truncate">{fullName}</h3>
          {jobInfo && (
            <p className="text-muted text-xs md:text-sm truncate">{jobInfo}</p>
          )}
        </div>

        {/* Group Badge */}
        <div className="mt-2">
          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${groupColor} bg-opacity-20`}>
            <span className="mr-1">{groupIcon}</span>
            {capitalizeFirst(contact.group)}
          </span>
        </div>

        {/* Contact Details */}
        <div className="mt-4 space-y-2">
          {contact.phone && (
            <div className="flex items-center text-muted text-xs md:text-sm">
              <span className="mr-2">
                <PhoneIcon />
              </span>
              <span className="truncate">{formatPhoneNumber(contact.phone)}</span>
            </div>
          )}
          
          {contact.email && (
            <div className="flex items-center text-muted text-xs md:text-sm">
              <span className="mr-2">
                <EmailIcon />
              </span>
              <span className="truncate">{truncateText(contact.email, 20)}</span>
            </div>
          )}
          
          {contact.address && (
            <div className="flex items-center text-muted text-xs md:text-sm">
              <span className="mr-2">
                <LocationIcon />
              </span>
              <span className="truncate">{truncateText(contact.address, 25)}</span>
            </div>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="border-t border-border p-3 flex justify-between items-center">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onEdit(contact)}
          className="flex-1 mr-2 min-h-[44px]"
        >
          <EditIcon />
          <span className="ml-2 hidden xs:inline">Edit</span>
        </Button>
        <Button
          variant="danger"
          size="sm"
          onClick={() => onDelete(contact.id)}
          className="min-w-[44px] min-h-[44px] flex items-center justify-center"
          aria-label="Delete contact"
        >
          <DeleteIcon />
        </Button>
      </div>
    </div>
  );
};

ContactCard.propTypes = {
  contact: PropTypes.shape({
    id: PropTypes.number.isRequired,
    first_name: PropTypes.string.isRequired,
    last_name: PropTypes.string,
    email: PropTypes.string,
    phone: PropTypes.string,
    address: PropTypes.string,
    company: PropTypes.string,
    job_title: PropTypes.string,
    profile_picture: PropTypes.string,
    is_favorite: PropTypes.bool,
    group: PropTypes.string,
    notes: PropTypes.string,
    created_at: PropTypes.string,
    updated_at: PropTypes.string,
  }).isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  onToggleFavorite: PropTypes.func.isRequired,
};

export default ContactCard;