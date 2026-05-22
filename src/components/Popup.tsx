import React from 'react';
import './Popup.css';

interface PopupProps {
  title: string;
  onClose: () => void;
  children: React.ReactNode;
}

export const Popup: React.FC<PopupProps> = ({ title, onClose, children }) => {
  return (
    <div className="popup-overlay" onClick={onClose}>
      <div className="popup-content" onClick={(e) => e.stopPropagation()}>
        <div className="popup-header">
          <h2>{title}</h2>
          <button onClick={onClose} className="close-button">&times;</button>
        </div>
        <div className="popup-body">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Popup;