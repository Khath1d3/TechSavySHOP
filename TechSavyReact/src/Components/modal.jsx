import "../componentStyle/modalstyle.css";

function Modal({ isOpen, onClose, children }) {
    if (!isOpen) return null;
  
    return (
        <div className="popup" id="signupPopup">
            <div className="popup-content">
                <span onClick={onClose} className="close-btn" id="signupClose">&times;</span>
                    {children}
            </div>
        </div>
    );
  }
  
  export default Modal;
