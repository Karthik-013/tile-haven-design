
// Measuring Page JavaScript
document.addEventListener('DOMContentLoaded', function() {
    const standardRoom = document.getElementById('standardRoom');
    const customRoom = document.getElementById('customRoom');
    const viewRoomList = document.getElementById('viewRoomList');
    
    if (standardRoom) {
        standardRoom.addEventListener('click', function() {
            console.log('Standard room button clicked');
            app.navigateTo('../room-details/room-details.html');
        });
    }
    
    if (customRoom) {
        customRoom.addEventListener('click', function() {
            console.log('Custom room button clicked');
            alert('Advanced measuring tools coming soon! Please use Standard Room for now.');
        });
    }
    
    if (viewRoomList) {
        viewRoomList.addEventListener('click', function() {
            console.log('View room list button clicked');
            app.navigateTo('../room-list/room-list.html');
        });
    }
});
