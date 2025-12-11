import { useContext, useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { AuthContext } from './AuthContext';
import Modal from '../Components/modal';
import Login from '../Components/login';

export default function ProtectedRoute({ children }) {
  const { isLoggedIn } = useContext(AuthContext);
  const location = useLocation();
  const [showLogin, setShowLogin] = useState(false);
  const [shouldRedirect, setShouldRedirect] = useState(false);

  useEffect(() => {
    if (!isLoggedIn) {
      setShowLogin(true);
    }
  }, [isLoggedIn]);

  const handleLoginSuccess = () => {
    setShowLogin(false);
  };

  const handleModalClose = () => {
    setShowLogin(false);
    setShouldRedirect(true);
  };

  // If user closes modal without logging in, redirect to home
  if (shouldRedirect && !isLoggedIn) {
    return <Navigate to="/" replace />;
  }

  // If logged in, render the protected page
  if (isLoggedIn) {
    return children;
  }

  // Show login modal while waiting for authentication
  return (
    <>
      {children}
      {showLogin && (
        <Modal isOpen={showLogin} onClose={handleModalClose}>
          <Login onSuccess={handleLoginSuccess} />
        </Modal>
      )}
    </>
  );
}
