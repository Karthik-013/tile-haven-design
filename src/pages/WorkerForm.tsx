
import React from 'react';

const WorkerForm = () => {
  React.useEffect(() => {
    // Redirect to the HTML version
    window.location.href = '/worker-form.html';
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="text-center">
        <h2 className="text-2xl font-semibold mb-4">Redirecting to Worker Form...</h2>
        <p className="text-gray-600">If you're not redirected automatically, <a href="/worker-form.html" className="text-blue-600 hover:underline">click here</a>.</p>
      </div>
    </div>
  );
};

export default WorkerForm;
