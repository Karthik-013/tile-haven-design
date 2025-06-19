
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ShoppingCart, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const navigate = useNavigate();
  const [customerDetails, setCustomerDetails] = useState({
    name: '',
    phone: '',
    address: ''
  });
  const [isFormSubmitted, setIsFormSubmitted] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setCustomerDetails(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const isFormValid = customerDetails.name.trim() && customerDetails.phone.trim() && customerDetails.address.trim();

  const handleConfirmDetails = () => {
    if (isFormValid) {
      setIsAnimating(true);
      // Store details in localStorage for later use
      localStorage.setItem('customerDetails', JSON.stringify(customerDetails));
      setTimeout(() => {
        setIsFormSubmitted(true);
        setIsAnimating(false);
      }, 500);
    }
  };

  const handleStartMeasuring = () => {
    window.location.href = 'pages/measuring/measuring.html';
  };

  const handleGoToCart = () => {
    navigate('/cart');
  };

  const handleLogout = () => {
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-900">Tile Haven</h1>
            </div>
            <div className="flex items-center space-x-4">
              <Button 
                onClick={handleGoToCart}
                variant="outline"
                className="border-green-600 text-green-600 hover:bg-green-50"
              >
                <ShoppingCart className="w-4 h-4 mr-2" />
                Cart
              </Button>
              <Button 
                onClick={handleLogout}
                variant="outline"
                className="border-gray-600 text-gray-600 hover:bg-gray-50"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
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
            
            {isFormSubmitted ? (
              <Button 
                onClick={handleStartMeasuring}
                className="bg-green-600 hover:bg-green-700 text-white text-lg px-8 py-6 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
              >
                Start Measuring Your Space
              </Button>
            ) : (
              <Button 
                disabled
                className="bg-gray-400 text-white text-lg px-8 py-6 rounded-lg cursor-not-allowed opacity-50"
              >
                Complete Form to Continue
              </Button>
            )}
          </div>
          
          <div className="animate-fade-in">
            {!isFormSubmitted ? (
              <Card className="p-6 shadow-2xl">
                <CardHeader className="text-center">
                  <CardTitle className="text-2xl text-gray-900 mb-4">Customer Details</CardTitle>
                  <p className="text-gray-600">Please fill in your details to continue</p>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name *</Label>
                    <Input
                      id="name"
                      type="text"
                      placeholder="Enter your full name"
                      value={customerDetails.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      className="focus:ring-2 focus:ring-green-500"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number *</Label>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="Enter your phone number"
                      value={customerDetails.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      className="focus:ring-2 focus:ring-green-500"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="address">Address *</Label>
                    <Textarea
                      id="address"
                      placeholder="Enter your complete address"
                      value={customerDetails.address}
                      onChange={(e) => handleInputChange('address', e.target.value)}
                      className="focus:ring-2 focus:ring-green-500 min-h-[100px]"
                    />
                  </div>
                  
                  <Button 
                    onClick={handleConfirmDetails}
                    disabled={!isFormValid || isAnimating}
                    className="w-full bg-green-600 hover:bg-green-700 text-white py-3 text-lg"
                  >
                    {isAnimating ? 'Confirming...' : 'Confirm Details'}
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="h-96 bg-gradient-to-br from-green-400 to-blue-500 rounded-2xl shadow-2xl relative overflow-hidden animate-fade-in">
                <div className="absolute inset-0 bg-pattern opacity-20"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-white text-center">
                    <h3 className="text-3xl font-bold mb-4">Welcome, {customerDetails.name}!</h3>
                    <p className="text-lg">Ready to find beautiful tiles for your space</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
