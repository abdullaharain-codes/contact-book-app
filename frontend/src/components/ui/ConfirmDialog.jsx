import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import Button from './Button';

const TrashIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
  </svg>
);

const WarningIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
  </svg>
);

const ConfirmDialog = ({
  isOpen, title, message,
  confirmText = 'Confirm', cancelText = 'Cancel',
  onConfirm, onCancel, variant = 'danger'
}) => {
  useEffect(() => {
    const handleEscape = (e) => { if (e.key === 'Escape' && isOpen) onCancel(); };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onCancel]);

  if (!isOpen) return null;

  const isDanger = variant === 'danger';

  return (
    <div
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={(e) => { if (e.target === e.currentTarget) onCancel(); }}
    >
      <div className="bg-[#1e293b] rounded-2xl max-w-sm w-full shadow-2xl overflow-hidden">
        <div className="p-6">
          {/* Icon */}
          <div className={`w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 ${
            isDanger ? 'bg-red-500/10 text-red-500' : 'bg-yellow-500/10 text-yellow-500'
          }`}>
            {isDanger ? <TrashIcon /> : <WarningIcon />}
          </div>

          {/* Title */}
          <h3 className="text-lg font-semibold text-white text-center mb-2">
            {title || (isDanger ? 'Delete Item' : 'Warning')}
          </h3>

          {/* Message */}
          <p className="text-[#94a3b8] text-center text-sm mb-6">{message}</p>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-3">
            <Button variant="ghost" onClick={onCancel} className="flex-1">
              {cancelText}
            </Button>
            <Button variant="danger" onClick={onConfirm} className="flex-1">
              {confirmText}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

ConfirmDialog.propTypes = {
  isOpen:       PropTypes.bool.isRequired,
  title:        PropTypes.string,
  message:      PropTypes.string.isRequired,
  confirmText:  PropTypes.string,
  cancelText:   PropTypes.string,
  onConfirm:    PropTypes.func.isRequired,
  onCancel:     PropTypes.func.isRequired,
  variant:      PropTypes.oneOf(['danger', 'warning']),
};

export default ConfirmDialog;