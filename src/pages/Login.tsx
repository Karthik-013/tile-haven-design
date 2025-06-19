
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Shield, HardHat } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [isAnimating, setIsAnimating] = useState(false);
  const navigate = useNavigate();

  const handleCustomerLogin = () => {
    setIsAnimating(true);
    setTimeout(() => {
      navigate('/home');
    }, 300);
  };

  const handleWorkerLogin = () => {
    setIsAnimating(true);
    setTimeout(() => {
      navigate('/worker-login');
    }, 300);
  };

  const handleAdminLogin = () => {
    setIsAnimating(true);
    setTimeout(() => {
      navigate('/admin-login');
    }, 300);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6 animate-fade-in">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Tile Haven</h1>
          <p className="text-gray-600">Choose your login type</p>
        </div>
        
        <div className="space-y-4">
          <Card className="hover:shadow-lg transition-all duration-300 hover:scale-105 cursor-pointer" 
                onClick={handleCustomerLogin}>
            <CardHeader className="text-center pb-4">
              <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                <Users className="w-8 h-8 text-blue-600" />
              </div>
              <CardTitle className="text-xl text-gray-900">Customer Login</CardTitle>
              <CardDescription>Access our tile catalog and start measuring</CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                onClick={handleCustomerLogin}
                disabled={isAnimating}
              >
                Continue as Customer
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-all duration-300 hover:scale-105 cursor-pointer"
                onClick={handleWorkerLogin}>
            <CardHeader className="text-center pb-4">
              <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <HardHat className="w-8 h-8 text-green-600" />
              </div>
              <CardTitle className="text-xl text-gray-900">Worker Login</CardTitle>
              <CardDescription>Access measurement tools and customer data</CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                className="w-full bg-green-600 hover:bg-green-700 text-white"
                onClick={handleWorkerLogin}
                disabled={isAnimating}
              >
                Worker Access
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-all duration-300 hover:scale-105 cursor-pointer"
                onClick={handleAdminLogin}>
            <CardHeader className="text-center pb-4">
              <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
                <Shield className="w-8 h-8 text-red-600" />
              </div>
              <CardTitle className="text-xl text-gray-900">Admin Login</CardTitle>
              <CardDescription>Manage tiles and database operations</CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                className="w-full bg-red-600 hover:bg-red-700 text-white"
                onClick={handleAdminLogin}
                disabled={isAnimating}
              >
                Admin Access
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Login;
