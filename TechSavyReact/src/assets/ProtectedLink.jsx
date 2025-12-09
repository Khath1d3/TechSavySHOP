// ProtectedLink.js
import { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from './AuthContext';
import Login from '../Components/login';
import Modal from '../Components/modal';

export default function ProtectedLink({ 
    to, 
    children,
    className = "",
 }) {
  const { isLoggedIn, requireAuth, setRedirectPath } = useContext(AuthContext);
  const [showLogin, setShowLogin] = useState(false);
  return (
    <>
      <Link
            className={className}
            to={isLoggedIn ? to : "#"}
            onClick={(e) => {
                if (!isLoggedIn) {
                e.preventDefault();
                setRedirectPath(to);   // store destination
                setShowLogin(true);    // open modal
                }
            }}
            >
            {children}
        </Link>

      {showLogin && (
        <Modal isOpen={showLogin} onClose={() => setShowLogin(false)}>
             <Login onSuccess={() => setShowLogin(false)} />
        </Modal>
      )}      
    </>
  );
}