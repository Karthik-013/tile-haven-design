
-- Create the master ledger table
CREATE TABLE public.ledger (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  mobile TEXT NOT NULL UNIQUE,
  address TEXT NOT NULL,
  attended_by TEXT NOT NULL,
  quotation_pdf_url TEXT,
  status TEXT NOT NULL DEFAULT 'Pending',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add Row Level Security to the ledger table
ALTER TABLE public.ledger ENABLE ROW LEVEL SECURITY;

-- Create policies for the ledger table (accessible to authenticated users)
CREATE POLICY "Allow authenticated users to view ledger" 
  ON public.ledger 
  FOR SELECT 
  TO authenticated 
  USING (true);

CREATE POLICY "Allow authenticated users to insert ledger" 
  ON public.ledger 
  FOR INSERT 
  TO authenticated 
  WITH CHECK (true);

CREATE POLICY "Allow authenticated users to update ledger" 
  ON public.ledger 
  FOR UPDATE 
  TO authenticated 
  USING (true);

CREATE POLICY "Allow authenticated users to delete ledger" 
  ON public.ledger 
  FOR DELETE 
  TO authenticated 
  USING (true);

-- Create a function to dynamically create customer quotation tables
CREATE OR REPLACE FUNCTION public.create_customer_table(customer_id UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  table_name TEXT;
BEGIN
  -- Generate table name based on customer ID
  table_name := 'cust_' || replace(customer_id::text, '-', '_');
  
  -- Create the customer-specific quotation table
  EXECUTE format('
    CREATE TABLE public.%I (
      id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
      quotation_pdf_url TEXT,
      created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
      attended_by TEXT NOT NULL,
      room_data JSONB,
      tile_data JSONB,
      cost_data JSONB
    )', table_name);
  
  -- Enable RLS on the new table
  EXECUTE format('ALTER TABLE public.%I ENABLE ROW LEVEL SECURITY', table_name);
  
  -- Create policies for the new table
  EXECUTE format('
    CREATE POLICY "Allow authenticated users full access" 
    ON public.%I 
    FOR ALL 
    TO authenticated 
    USING (true) 
    WITH CHECK (true)', table_name);
  
  RETURN TRUE;
EXCEPTION
  WHEN duplicate_table THEN
    -- Table already exists, return true
    RETURN TRUE;
  WHEN OTHERS THEN
    -- Log the error and return false
    RAISE LOG 'Error creating table %: %', table_name, SQLERRM;
    RETURN FALSE;
END;
$$;

-- Create a function to insert quotation data into customer table
CREATE OR REPLACE FUNCTION public.insert_customer_quotation(
  customer_id UUID,
  p_quotation_pdf_url TEXT,
  p_attended_by TEXT,
  p_room_data JSONB,
  p_tile_data JSONB,
  p_cost_data JSONB
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  table_name TEXT;
BEGIN
  -- Generate table name based on customer ID
  table_name := 'cust_' || replace(customer_id::text, '-', '_');
  
  -- Insert quotation data into the customer table
  EXECUTE format('
    INSERT INTO public.%I (quotation_pdf_url, attended_by, room_data, tile_data, cost_data)
    VALUES ($1, $2, $3, $4, $5)', table_name)
  USING p_quotation_pdf_url, p_attended_by, p_room_data, p_tile_data, p_cost_data;
  
  RETURN TRUE;
EXCEPTION
  WHEN OTHERS THEN
    RAISE LOG 'Error inserting into table %: %', table_name, SQLERRM;
    RETURN FALSE;
END;
$$;

-- Create a function to get customer quotations
CREATE OR REPLACE FUNCTION public.get_customer_quotations(customer_id UUID)
RETURNS TABLE (
  id UUID,
  quotation_pdf_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE,
  attended_by TEXT,
  room_data JSONB,
  tile_data JSONB,
  cost_data JSONB
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  table_name TEXT;
BEGIN
  -- Generate table name based on customer ID
  table_name := 'cust_' || replace(customer_id::text, '-', '_');
  
  -- Return quotations from the customer table
  RETURN QUERY EXECUTE format('
    SELECT id, quotation_pdf_url, created_at, attended_by, room_data, tile_data, cost_data
    FROM public.%I 
    ORDER BY created_at DESC', table_name);
EXCEPTION
  WHEN undefined_table THEN
    -- Table doesn't exist, return empty result
    RETURN;
  WHEN OTHERS THEN
    RAISE LOG 'Error fetching from table %: %', table_name, SQLERRM;
    RETURN;
END;
$$;

-- Create storage bucket for PDFs
INSERT INTO storage.buckets (id, name, public)
VALUES ('quotation-pdfs', 'quotation-pdfs', true)
ON CONFLICT (id) DO NOTHING;

-- Create storage policies for the PDF bucket
CREATE POLICY "Allow authenticated users to upload PDFs"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'quotation-pdfs');

CREATE POLICY "Allow authenticated users to view PDFs"
ON storage.objects FOR SELECT
TO authenticated
USING (bucket_id = 'quotation-pdfs');

CREATE POLICY "Allow authenticated users to update PDFs"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'quotation-pdfs');

CREATE POLICY "Allow authenticated users to delete PDFs"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'quotation-pdfs');
