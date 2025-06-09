
import React, { useEffect } from 'react';

const Index = () => {
  useEffect(() => {
    // Redirect to the HTML version of the site
    window.location.href = '/index.html';
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">Redirecting to Tile Haven...</h1>
        <p className="text-xl text-muted-foreground">
          If you're not redirected automatically, 
          <a href="/index.html" className="text-primary underline ml-2">click here</a>
        </p>
      </div>
    </div>
  );
};

export default Index;
