
-- Create customers table to store customer quotations
CREATE TABLE public.customers (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  mobile TEXT NOT NULL,
  address TEXT NOT NULL,
  attended_by TEXT NOT NULL,
  quotation_pdf_url TEXT,
  status TEXT NOT NULL DEFAULT 'Pending',
  room_data JSONB,
  tile_data JSONB,
  cost_data JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add RLS (Row Level Security) - optional, but good practice
ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;

-- Create policy to allow read access (admins can view all customers)
CREATE POLICY "Allow read access to customers" 
  ON public.customers 
  FOR SELECT 
  USING (true);

-- Create policy to allow insert access (workers can create customer records)
CREATE POLICY "Allow insert access to customers" 
  ON public.customers 
  FOR INSERT 
  WITH CHECK (true);

-- Create policy to allow update access (for status updates and PDF links)
CREATE POLICY "Allow update access to customers" 
  ON public.customers 
  FOR UPDATE 
  USING (true);
