
import React from 'react';
import { Button } from "@/components/ui/button";
import { User } from "lucide-react";

const Index = () => {
  const handleStartMeasuring = () => {
    window.location.href = 'pages/measuring/measuring.html';
  };

  const handleLogin = () => {
    window.location.href = '/login';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-900">Tile Haven</h1>
            </div>
            <Button 
              onClick={handleLogin}
              variant="outline"
              className="border-green-600 text-green-600 hover:bg-green-50"
            >
              <User className="w-4 h-4 mr-2" />
              Login
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-8 animate-fade-in">
            <h2 className="text-5xl font-bold text-gray-900 leading-tight">
              Transform Your Space with Premium Tiles
            </h2>
            <p className="text-xl text-gray-600 italic bg-yellow-50 p-4 border-l-4 border-yellow-400 rounded">
              "A beautiful home is made of dreams, tiles, and love."
            </p>
            <Button 
              onClick={handleStartMeasuring}
              className="bg-green-600 hover:bg-green-700 text-white text-lg px-8 py-6 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
            >
              Start Measuring Your Space
            </Button>
          </div>
          
          <div className="animate-fade-in">
            <div className="h-96 bg-gradient-to-br from-green-400 to-blue-500 rounded-2xl shadow-2xl relative overflow-hidden">
              <div className="absolute inset-0 bg-pattern opacity-20"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-white text-center">
                  <h3 className="text-3xl font-bold mb-4">Premium Quality</h3>
                  <p className="text-lg">Beautiful tiles for every space</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
