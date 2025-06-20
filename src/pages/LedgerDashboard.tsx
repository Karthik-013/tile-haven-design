
import React from 'react';

const LedgerDashboard = () => {
  React.useEffect(() => {
    // Redirect to the HTML version
    window.location.href = '/ledger-dashboard.html';
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="text-center">
        <h2 className="text-2xl font-semibold mb-4">Redirecting to Ledger Dashboard...</h2>
        <p className="text-gray-600">If you're not redirected automatically, <a href="/ledger-dashboard.html" className="text-blue-600 hover:underline">click here</a>.</p>
      </div>
    </div>
  );
};

export default LedgerDashboard;
