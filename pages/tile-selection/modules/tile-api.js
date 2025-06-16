
// Tile API utilities for Supabase integration
export class TileAPI {
    static async fetchTileDetails(tileCode) {
        try {
            console.log('Fetching tile details for code:', tileCode);
            
            // Import Supabase client
            const { supabase } = await import('../../../src/integrations/supabase/client.js');
            
            // Fetch tile details from database
            const { data: tileData, error } = await supabase
                .from('tiles')
                .select('*')
                .eq('code', tileCode)
                .single();
            
            if (error) {
                console.error('Supabase error:', error);
                if (error.code === 'PGRST116') {
                    throw new Error(`Tile code "${tileCode}" not found in our catalog`);
                } else {
                    throw new Error('Error fetching tile details. Please try again.');
                }
            }
            
            console.log('Tile data fetched successfully:', tileData);
            return tileData;
        } catch (error) {
            console.error('API Error:', error);
            throw error;
        }
    }
}
