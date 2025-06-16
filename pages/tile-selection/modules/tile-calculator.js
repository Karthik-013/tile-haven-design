
// Tile calculation utilities
export class TileCalculator {
    // Convert different units to feet
    static convertToFeet(value, unit) {
        const numValue = parseFloat(value);
        switch(unit.toLowerCase()) {
            case 'inches':
            case 'in':
                return numValue / 12;
            case 'metres':
            case 'meters':
            case 'm':
                return numValue * 3.28084;
            case 'feet':
            case 'ft':
            case 'foot':
            default:
                return numValue;
        }
    }

    // Calculate room area in square feet
    static calculateRoomAreaInFeet(room) {
        const length = this.convertToFeet(room.length, room.unit);
        const width = this.convertToFeet(room.width, room.unit);
        return length * width;
    }

    // Calculate tile requirements and costs
    static calculateTileRequirements(room, tileData) {
        const roomAreaInFeet = this.calculateRoomAreaInFeet(room);
        const tileAreaInFeet = tileData.length_feet * tileData.width_feet;
        const tilesNeeded = Math.ceil(roomAreaInFeet / tileAreaInFeet);
        const boxesNeeded = Math.ceil(tilesNeeded / tileData.coverage_per_box);
        
        // Calculate costs
        const totalTilesInBoxes = boxesNeeded * tileData.coverage_per_box;
        const subtotal = totalTilesInBoxes * tileData.price_per_tile;
        const discountAmount = subtotal * (tileData.discount_percent / 100);
        const totalCost = subtotal - discountAmount;

        return {
            roomAreaInFeet: roomAreaInFeet.toFixed(2),
            tileAreaInFeet: tileAreaInFeet.toFixed(2),
            tilesNeeded,
            boxesNeeded,
            totalTilesInBoxes,
            subtotal: subtotal.toFixed(2),
            discountAmount: discountAmount.toFixed(2),
            totalCost: totalCost.toFixed(2)
        };
    }
}
