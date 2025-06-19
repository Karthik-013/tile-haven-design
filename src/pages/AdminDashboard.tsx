
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Edit, Trash2, LogOut, Save, X } from "lucide-react";
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
    window.location.href = '/login';
  };

  const TileForm = ({ tile, onChange, isEdit = false }: { 
    tile: any, 
    onChange: (field: string, value: any) => void, 
    isEdit?: boolean 
  }) => (
    <div className="grid grid-cols-2 gap-4">
      <div className="space-y-2">
        <Label>Tile Name</Label>
        <Input
          value={tile.name}
          onChange={(e) => onChange('name', e.target.value)}
          placeholder="Enter tile name"
        />
      </div>
      <div className="space-y-2">
        <Label>Tile Code</Label>
        <Input
          value={tile.code}
          onChange={(e) => onChange('code', e.target.value)}
          placeholder="Enter tile code"
        />
      </div>
      <div className="space-y-2">
        <Label>Length (feet)</Label>
        <Input
          type="number"
          step="0.01"
          value={tile.length_feet}
          onChange={(e) => onChange('length_feet', parseFloat(e.target.value) || 0)}
        />
      </div>
      <div className="space-y-2">
        <Label>Width (feet)</Label>
        <Input
          type="number"
          step="0.01"
          value={tile.width_feet}
          onChange={(e) => onChange('width_feet', parseFloat(e.target.value) || 0)}
        />
      </div>
      <div className="space-y-2">
        <Label>Price per Tile</Label>
        <Input
          type="number"
          step="0.01"
          value={tile.price_per_tile}
          onChange={(e) => onChange('price_per_tile', parseFloat(e.target.value) || 0)}
        />
      </div>
      <div className="space-y-2">
        <Label>Price per Sq Ft</Label>
        <Input
          type="number"
          step="0.01"
          value={tile.price_per_square_feet}
          onChange={(e) => onChange('price_per_square_feet', parseFloat(e.target.value) || 0)}
        />
      </div>
      <div className="space-y-2">
        <Label>Coverage per Box</Label>
        <Input
          type="number"
          value={tile.coverage_per_box}
          onChange={(e) => onChange('coverage_per_box', parseInt(e.target.value) || 1)}
        />
      </div>
      <div className="space-y-2">
        <Label>Discount (%)</Label>
        <Input
          type="number"
          step="0.01"
          value={tile.discount_percent}
          onChange={(e) => onChange('discount_percent', parseFloat(e.target.value) || 0)}
        />
      </div>
    </div>
  );

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-red-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
            <p className="text-gray-600 mt-1">Manage tiles and database operations</p>
          </div>
          <Button
            onClick={handleLogout}
            variant="outline"
            className="border-red-600 text-red-600 hover:bg-red-50"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>

        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Tiles Database</CardTitle>
              <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-green-600 hover:bg-green-700">
                    <Plus className="w-4 h-4 mr-2" />
                    Add New Tile
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Add New Tile</DialogTitle>
                  </DialogHeader>
                  <TileForm
                    tile={newTile}
                    onChange={(field, value) => setNewTile(prev => ({ ...prev, [field]: value }))}
                  />
                  <div className="flex justify-end space-x-2 mt-6">
                    <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                      <X className="w-4 h-4 mr-2" />
                      Cancel
                    </Button>
                    <Button onClick={handleAddTile} className="bg-green-600 hover:bg-green-700">
                      <Save className="w-4 h-4 mr-2" />
                      Save Tile
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Code</TableHead>
                    <TableHead>Dimensions (ft)</TableHead>
                    <TableHead>Price/Tile</TableHead>
                    <TableHead>Price/Sq Ft</TableHead>
                    <TableHead>Coverage/Box</TableHead>
                    <TableHead>Discount %</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {tiles.map((tile) => (
                    <TableRow key={tile.id} className="hover:bg-gray-50">
                      <TableCell className="font-medium">{tile.name}</TableCell>
                      <TableCell>{tile.code}</TableCell>
                      <TableCell>{tile.length_feet} × {tile.width_feet}</TableCell>
                      <TableCell>${tile.price_per_tile}</TableCell>
                      <TableCell>${tile.price_per_square_feet}</TableCell>
                      <TableCell>{tile.coverage_per_box}</TableCell>
                      <TableCell>{tile.discount_percent}%</TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setEditingTile(tile);
                              setIsEditDialogOpen(true);
                            }}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleDeleteTile(tile.id)}
                            className="border-red-600 text-red-600 hover:bg-red-50"
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
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Edit Tile</DialogTitle>
            </DialogHeader>
            {editingTile && (
              <TileForm
                tile={editingTile}
                onChange={(field, value) => setEditingTile(prev => prev ? { ...prev, [field]: value } : null)}
                isEdit={true}
              />
            )}
            <div className="flex justify-end space-x-2 mt-6">
              <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                <X className="w-4 h-4 mr-2" />
                Cancel
              </Button>
              <Button onClick={handleUpdateTile} className="bg-blue-600 hover:bg-blue-700">
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
