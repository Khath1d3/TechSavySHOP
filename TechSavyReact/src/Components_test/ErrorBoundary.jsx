import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px',
          textAlign: 'center',
          backgroundColor: '#f5f5f5'
        }}>
          <h1 style={{ color: '#d32f2f', marginBottom: '20px' }}>
            Oops! Something went wrong
          </h1>
          <p style={{ color: '#666', marginBottom: '30px', maxWidth: '500px' }}>
            We encountered an unexpected error. Please try refreshing the page.
          </p>
          <button 
            onClick={() => window.location.reload()}
            style={{
              padding: '12px 24px',
              backgroundColor: '#1976d2',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              fontSize: '16px',
              cursor: 'pointer'
            }}
          >
            Refresh Page
          </button>
          {process.env.NODE_ENV === 'development' && this.state.error && (
            <details style={{ marginTop: '30px', textAlign: 'left', maxWidth: '600px' }}>
              <summary style={{ cursor: 'pointer', color: '#666' }}>Error Details</summary>
              <pre style={{ 
                backgroundColor: '#fff', 
                padding: '15px', 
                borderRadius: '4px',
                overflow: 'auto',
                fontSize: '12px',
                marginTop: '10px'
              }}>
                {this.state.error.toString()}
              </pre>
            </details>
          )}
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
