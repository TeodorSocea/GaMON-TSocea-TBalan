var map = L.map("map");
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
}).addTo(map);

function initMap(coordinates) {
    map.setView(coordinates, 15);
    var marker = L.marker(coordinates).addTo(map);
}

async function updateLocation(locationid){
    let response = await fetch(`http://localhost:8081/api/locations/updateLocation?locationid=${locationid}`, {method: 'PUT'});
}

async function grabLocation(locationid){
    document.getElementById("title").innerHTML = `Location #${locationid}`;
    let location = await fetch(`http://localhost:8081/api/locations/location?locationid=${locationid}`).then(location => location.json());
    console.log(location);
    let statistics = await fetch(`http://localhost:8081/api/statistics/location?locationid=${locationid}`).then(statistics => statistics.json());
    let chart = document.getElementById('trashChart').getContext('2d');
    let trashChart = new Chart(chart, statistics); 
    var buttonMsg;
    if(location.active === 'true')
        buttonMsg = "Deactivate Location";
    else
        buttonMsg = "Reactivate Location";
    document.getElementById("locationButton").innerHTML = buttonMsg;
    document.getElementById("locationButton").setAttribute('onclick', `updateLocation(${locationid}); openPopupSuccess()`);
    initMap([location.lat, location.long]);
}

function openPopupSuccess(){
    document.getElementById('statusImg').setAttribute("src", "checkmark.png"); 
    document.getElementById('statusTitle').innerHTML = "Success!";
    document.getElementById('statusMessage').innerHTML = "Successfully updated location!";
    document.getElementById('popup').classList.add("openPopup");
    document.getElementById('statusButton').setAttribute("onclick", "closePopupSuccess()");
}

function closePopupSuccess(){
    closePopup();
    window.location.replace("/locationsList");
}

function closePopup(){
    document.getElementById("popup").classList.remove("openPopup");
}