
-- Create a table for tile details
CREATE TABLE public.tiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  code TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  length_feet DECIMAL(8,4) NOT NULL,
  width_feet DECIMAL(8,4) NOT NULL,
  price_per_tile DECIMAL(10,2) NOT NULL,
  coverage_per_box INTEGER NOT NULL DEFAULT 1,
  price_per_square_feet DECIMAL(10,2) NOT NULL,
  discount_percent DECIMAL(5,2) DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Insert sample tile data
INSERT INTO public.tiles (code, name, length_feet, width_feet, price_per_tile, coverage_per_box, price_per_square_feet, discount_percent) VALUES
('TH-NAT-001', 'Natural Stone Classic', 1.0, 1.0, 15.50, 10, 15.50, 5.0),
('MAR-WHT-24X24', 'White Marble Premium', 2.0, 2.0, 45.00, 6, 11.25, 10.0),
('CER-BLU-12X12', 'Blue Ceramic Standard', 1.0, 1.0, 8.75, 12, 8.75, 0.0),
('TH-WOD-006', 'Wood Effect Luxury', 3.0, 0.5, 22.00, 8, 14.67, 15.0);

-- Enable Row Level Security (RLS)
ALTER TABLE public.tiles ENABLE ROW LEVEL SECURITY;

-- Create policy to allow everyone to read tiles (public catalog)
CREATE POLICY "Everyone can view tiles" 
  ON public.tiles 
  FOR SELECT 
  USING (true);

-- Only authenticated users can modify tiles (for admin purposes)
CREATE POLICY "Only authenticated users can modify tiles" 
  ON public.tiles 
  FOR ALL 
  USING (auth.uid() IS NOT NULL);
