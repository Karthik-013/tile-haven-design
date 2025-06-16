
// Tile API utilities for Supabase integration
export class TileAPI {
    static async fetchTileDetails(tileCode) {
        try {
            // Import Supabase client
            const { supabase } = await import('../../../src/integrations/supabase/client.ts');
            
            // Fetch tile details from database
            const { data: tileData, error } = await supabase
                .from('tiles')
                .select('*')
                .eq('code', tileCode)
                .single();
            
            if (error) {
                if (error.code === 'PGRST116') {
                    throw new Error(`Tile code "${tileCode}" not found in our catalog`);
                } else {
                    console.error('Supabase error:', error);
                    throw new Error('Error fetching tile details. Please try again.');
                }
            }
            
            return tileData;
        } catch (error) {
            console.error('API Error:', error);
            throw error;
        }
    }
}
