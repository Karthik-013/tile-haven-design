
// Measuring Page JavaScript
document.addEventListener('DOMContentLoaded', function() {
    const standardRoom = document.getElementById('standardRoom');
    const customRoom = document.getElementById('customRoom');
    
    if (standardRoom) {
        standardRoom.addEventListener('click', function() {
            app.navigateTo('../room-details/room-details.html');
        });
    }
    
    if (customRoom) {
        customRoom.addEventListener('click', function() {
            alert('Advanced measuring tools coming soon! Please use Standard Room for now.');
        });
    }
});
