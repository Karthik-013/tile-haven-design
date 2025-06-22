import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { 
  Plus, 
  Edit, 
  Trash2, 
  LogOut, 
  Save, 
  X, 
  Database, 
  Grid3X3, 
  TrendingUp, 
  Users, 
  Settings,
  Search,
  Filter,
  BarChart3,
  Shield,
  Zap
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface Tile {
  id: string;
  name: string;
  code: string;
  length_feet: number;
  width_feet: number;
  price_per_tile: number;
  price_per_square_feet: number;
  coverage_per_box: number;
  discount_percent: number;
  created_at: string;
  updated_at: string;
}

const AdminDashboard = () => {
  const [tiles, setTiles] = useState<Tile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingTile, setEditingTile] = useState<Tile | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [newTile, setNewTile] = useState({
    name: '',
    code: '',
    length_feet: 0,
    width_feet: 0,
    price_per_tile: 0,
    price_per_square_feet: 0,
    coverage_per_box: 1,
    discount_percent: 0
  });
  const { toast } = useToast();

  useEffect(() => {
    // Check if admin is authenticated
    const isAuthenticated = localStorage.getItem('adminAuthenticated');
    const userRole = localStorage.getItem('userRole');
    
    if (!isAuthenticated || userRole !== 'admin') {
      // Redirect to admin login if not authenticated
      window.location.href = '/admin-login';
      return;
    }
    
    fetchTiles();
  }, []);

  const fetchTiles = async () => {
    try {
      const { data, error } = await supabase
        .from('tiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setTiles(data || []);
    } catch (error) {
      console.error('Error fetching tiles:', error);
      toast({
        title: "Error",
        description: "Failed to fetch tiles data",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddTile = async () => {
    if (!newTile.name || !newTile.code) {
      toast({
        title: "Validation Error",
        description: "Name and code are required",
        variant: "destructive",
      });
      return;
    }

    try {
      const { error } = await supabase
        .from('tiles')
        .insert([newTile]);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Tile added successfully",
      });

      setIsAddDialogOpen(false);
      setNewTile({
        name: '',
        code: '',
        length_feet: 0,
        width_feet: 0,
        price_per_tile: 0,
        price_per_square_feet: 0,
        coverage_per_box: 1,
        discount_percent: 0
      });
      fetchTiles();
    } catch (error) {
      console.error('Error adding tile:', error);
      toast({
        title: "Error",
        description: "Failed to add tile",
        variant: "destructive",
      });
    }
  };

  const handleUpdateTile = async () => {
    if (!editingTile) return;

    try {
      const { error } = await supabase
        .from('tiles')
        .update({
          name: editingTile.name,
          code: editingTile.code,
          length_feet: editingTile.length_feet,
          width_feet: editingTile.width_feet,
          price_per_tile: editingTile.price_per_tile,
          price_per_square_feet: editingTile.price_per_square_feet,
          coverage_per_box: editingTile.coverage_per_box,
          discount_percent: editingTile.discount_percent,
          updated_at: new Date().toISOString()
        })
        .eq('id', editingTile.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Tile updated successfully",
      });

      setIsEditDialogOpen(false);
      setEditingTile(null);
      fetchTiles();
    } catch (error) {
      console.error('Error updating tile:', error);
      toast({
        title: "Error",
        description: "Failed to update tile",
        variant: "destructive",
      });
    }
  };

  const handleDeleteTile = async (id: string) => {
    if (!confirm('Are you sure you want to delete this tile? This action cannot be undone.')) {
      return;
    }

    try {
      const { error } = await supabase
        .from('tiles')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Tile deleted successfully",
      });

      fetchTiles();
    } catch (error) {
      console.error('Error deleting tile:', error);
      toast({
        title: "Error",
        description: "Failed to delete tile",
        variant: "destructive",
      });
    }
  };

  const handleLogout = () => {
    // Clear admin authentication
    localStorage.removeItem('adminAuthenticated');
    localStorage.removeItem('userRole');
    localStorage.removeItem('currentAdmin');
    window.location.href = '/login';
  };

  const TileForm = ({ tile, onChange, isEdit = false }: { 
    tile: any, 
    onChange: (field: string, value: any) => void, 
    isEdit?: boolean 
  }) => (
    <div className="grid grid-cols-2 gap-6">
      <div className="space-y-3">
        <Label className="text-cyan-300 font-medium">Tile Name</Label>
        <Input
          value={tile.name}
          onChange={(e) => onChange('name', e.target.value)}
          placeholder="Enter tile name"
          className="bg-gray-800/50 border-gray-600 text-white placeholder:text-gray-400 focus:border-cyan-400 focus:ring-cyan-400/20"
        />
      </div>
      <div className="space-y-3">
        <Label className="text-cyan-300 font-medium">Tile Code</Label>
        <Input
          value={tile.code}
          onChange={(e) => onChange('code', e.target.value)}
          placeholder="Enter tile code"
          className="bg-gray-800/50 border-gray-600 text-white placeholder:text-gray-400 focus:border-cyan-400 focus:ring-cyan-400/20"
        />
      </div>
      <div className="space-y-3">
        <Label className="text-cyan-300 font-medium">Length (feet)</Label>
        <Input
          type="number"
          step="0.01"
          value={tile.length_feet}
          onChange={(e) => onChange('length_feet', parseFloat(e.target.value) || 0)}
          className="bg-gray-800/50 border-gray-600 text-white placeholder:text-gray-400 focus:border-cyan-400 focus:ring-cyan-400/20"
        />
      </div>
      <div className="space-y-3">
        <Label className="text-cyan-300 font-medium">Width (feet)</Label>
        <Input
          type="number"
          step="0.01"
          value={tile.width_feet}
          onChange={(e) => onChange('width_feet', parseFloat(e.target.value) || 0)}
          className="bg-gray-800/50 border-gray-600 text-white placeholder:text-gray-400 focus:border-cyan-400 focus:ring-cyan-400/20"
        />
      </div>
      <div className="space-y-3">
        <Label className="text-cyan-300 font-medium">Price per Tile</Label>
        <Input
          type="number"
          step="0.01"
          value={tile.price_per_tile}
          onChange={(e) => onChange('price_per_tile', parseFloat(e.target.value) || 0)}
          className="bg-gray-800/50 border-gray-600 text-white placeholder:text-gray-400 focus:border-cyan-400 focus:ring-cyan-400/20"
        />
      </div>
      <div className="space-y-3">
        <Label className="text-cyan-300 font-medium">Price per Sq Ft</Label>
        <Input
          type="number"
          step="0.01"
          value={tile.price_per_square_feet}
          onChange={(e) => onChange('price_per_square_feet', parseFloat(e.target.value) || 0)}
          className="bg-gray-800/50 border-gray-600 text-white placeholder:text-gray-400 focus:border-cyan-400 focus:ring-cyan-400/20"
        />
      </div>
      <div className="space-y-3">
        <Label className="text-cyan-300 font-medium">Coverage per Box</Label>
        <Input
          type="number"
          value={tile.coverage_per_box}
          onChange={(e) => onChange('coverage_per_box', parseInt(e.target.value) || 1)}
          className="bg-gray-800/50 border-gray-600 text-white placeholder:text-gray-400 focus:border-cyan-400 focus:ring-cyan-400/20"
        />
      </div>
      <div className="space-y-3">
        <Label className="text-cyan-300 font-medium">Discount (%)</Label>
        <Input
          type="number"
          step="0.01"
          value={tile.discount_percent}
          onChange={(e) => onChange('discount_percent', parseFloat(e.target.value) || 0)}
          className="bg-gray-800/50 border-gray-600 text-white placeholder:text-gray-400 focus:border-cyan-400 focus:ring-cyan-400/20"
        />
      </div>
    </div>
  );

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 flex items-center justify-center">
        <div className="relative">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-cyan-400"></div>
          <div className="absolute inset-0 animate-ping rounded-full h-32 w-32 border-cyan-400/20 border-2"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 p-6">
      {/* Animated background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-cyan-400/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-400/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-xl shadow-lg">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                Control Center
              </h1>
              <p className="text-gray-400 mt-1 flex items-center gap-2">
                <Zap className="w-4 h-4 text-cyan-400" />
                Advanced Database Management System
              </p>
            </div>
          </div>
          <Button
            onClick={handleLogout}
            variant="outline"
            className="border-red-500/50 text-red-400 hover:bg-red-500/10 hover:border-red-400 bg-gray-800/50 backdrop-blur-sm transition-all duration-300"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gray-800/50 border-gray-700/50 backdrop-blur-sm hover:bg-gray-800/70 transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-cyan-400 text-sm font-medium">Total Tiles</p>
                  <p className="text-3xl font-bold text-white">{tiles.length}</p>
                </div>
                <div className="p-3 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-lg">
                  <Grid3X3 className="w-6 h-6 text-cyan-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800/50 border-gray-700/50 backdrop-blur-sm hover:bg-gray-800/70 transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-400 text-sm font-medium">Active Products</p>
                  <p className="text-3xl font-bold text-white">{tiles.filter(t => t.discount_percent < 100).length}</p>
                </div>
                <div className="p-3 bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-lg">
                  <TrendingUp className="w-6 h-6 text-green-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800/50 border-gray-700/50 backdrop-blur-sm hover:bg-gray-800/70 transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-400 text-sm font-medium">Avg Price</p>
                  <p className="text-3xl font-bold text-white">
                    ${tiles.length > 0 ? (tiles.reduce((sum, tile) => sum + tile.price_per_tile, 0) / tiles.length).toFixed(2) : '0.00'}
                  </p>
                </div>
                <div className="p-3 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-lg">
                  <BarChart3 className="w-6 h-6 text-purple-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800/50 border-gray-700/50 backdrop-blur-sm hover:bg-gray-800/70 transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-orange-400 text-sm font-medium">Database</p>
                  <p className="text-3xl font-bold text-white">Online</p>
                </div>
                <div className="p-3 bg-gradient-to-r from-orange-500/20 to-red-500/20 rounded-lg">
                  <Database className="w-6 h-6 text-orange-400" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Card className="bg-gray-800/30 border-gray-700/50 backdrop-blur-lg shadow-2xl">
          <CardHeader className="border-b border-gray-700/50">
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-lg">
                  <Database className="w-5 h-5 text-cyan-400" />
                </div>
                <CardTitle className="text-2xl bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                  Tiles Database
                </CardTitle>
              </div>
              <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white shadow-lg hover:shadow-cyan-500/25 transition-all duration-300">
                    <Plus className="w-4 h-4 mr-2" />
                    Add New Tile
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-4xl bg-gray-900/95 border-gray-700/50 backdrop-blur-xl">
                  <DialogHeader>
                    <DialogTitle className="text-2xl text-cyan-400 flex items-center gap-3">
                      <Plus className="w-6 h-6" />
                      Add New Tile
                    </DialogTitle>
                  </DialogHeader>
                  <TileForm
                    tile={newTile}
                    onChange={(field, value) => setNewTile(prev => ({ ...prev, [field]: value }))}
                  />
                  <div className="flex justify-end space-x-3 mt-8 pt-6 border-t border-gray-700/50">
                    <Button 
                      variant="outline" 
                      onClick={() => setIsAddDialogOpen(false)}
                      className="border-gray-600 text-gray-300 hover:bg-gray-800 hover:text-white"
                    >
                      <X className="w-4 h-4 mr-2" />
                      Cancel
                    </Button>
                    <Button 
                      onClick={handleAddTile} 
                      className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white shadow-lg"
                    >
                      <Save className="w-4 h-4 mr-2" />
                      Save Tile
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-gray-700/50 hover:bg-gray-800/50">
                    <TableHead className="text-cyan-400 font-semibold">Name</TableHead>
                    <TableHead className="text-cyan-400 font-semibold">Code</TableHead>
                    <TableHead className="text-cyan-400 font-semibold">Dimensions (ft)</TableHead>
                    <TableHead className="text-cyan-400 font-semibold">Price/Tile</TableHead>
                    <TableHead className="text-cyan-400 font-semibold">Price/Sq Ft</TableHead>
                    <TableHead className="text-cyan-400 font-semibold">Coverage/Box</TableHead>
                    <TableHead className="text-cyan-400 font-semibold">Discount %</TableHead>
                    <TableHead className="text-cyan-400 font-semibold">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {tiles.map((tile) => (
                    <TableRow key={tile.id} className="border-gray-700/30 hover:bg-gray-800/30 transition-colors">
                      <TableCell className="font-medium text-white">{tile.name}</TableCell>
                      <TableCell className="text-gray-300">{tile.code}</TableCell>
                      <TableCell className="text-gray-300">{tile.length_feet} × {tile.width_feet}</TableCell>
                      <TableCell className="text-green-400 font-semibold">${tile.price_per_tile}</TableCell>
                      <TableCell className="text-green-400 font-semibold">${tile.price_per_square_feet}</TableCell>
                      <TableCell className="text-gray-300">{tile.coverage_per_box}</TableCell>
                      <TableCell className="text-orange-400 font-semibold">{tile.discount_percent}%</TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setEditingTile(tile);
                              setIsEditDialogOpen(true);
                            }}
                            className="border-blue-500/50 text-blue-400 hover:bg-blue-500/10 hover:border-blue-400"
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleDeleteTile(tile.id)}
                            className="border-red-500/50 text-red-400 hover:bg-red-500/10 hover:border-red-400"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* Edit Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="max-w-4xl bg-gray-900/95 border-gray-700/50 backdrop-blur-xl">
            <DialogHeader>
              <DialogTitle className="text-2xl text-blue-400 flex items-center gap-3">
                <Edit className="w-6 h-6" />
                Edit Tile
              </DialogTitle>
            </DialogHeader>
            {editingTile && (
              <TileForm
                tile={editingTile}
                onChange={(field, value) => setEditingTile(prev => prev ? { ...prev, [field]: value } : null)}
                isEdit={true}
              />
            )}
            <div className="flex justify-end space-x-3 mt-8 pt-6 border-t border-gray-700/50">
              <Button 
                variant="outline" 
                onClick={() => setIsEditDialogOpen(false)}
                className="border-gray-600 text-gray-300 hover:bg-gray-800 hover:text-white"
              >
                <X className="w-4 h-4 mr-2" />
                Cancel
              </Button>
              <Button 
                onClick={handleUpdateTile} 
                className="bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white shadow-lg"
              >
                <Save className="w-4 h-4 mr-2" />
                Update Tile
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default AdminDashboard;
