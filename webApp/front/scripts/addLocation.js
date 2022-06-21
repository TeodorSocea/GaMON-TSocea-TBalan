var map = L.map("map");
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
}).addTo(map);

marker = undefined;

map.on('click', function(e) {
    if(marker)
        map.removeLayer(marker);
    marker = L.marker([e.latlng.lat, e.latlng.lng]).addTo(map);
});

function initMap() {
    var coordinates = [47.17, 27.57];
    map.setView(coordinates, 15);
}

async function addLocation(){
    let tags = []
    let inputs = document.getElementsByTagName('input');
    for (let i = 0; i < inputs.length; i++){
        if(inputs[i].type === 'checkbox'){
            if(inputs[i].checked){
                tags.push(inputs[i].name);
            }
        }
    }

    if(!marker || document.getElementById('locationName').value==='' || tags.length === 0){
        openPopupFailed();
        return;
    }

    let body = {
        lat: marker.getLatLng().lat,
        long: marker.getLatLng().lng,
        str: document.getElementById('locationName').value,
        tags: tags
    }
   
    let fetchRequest = {
        method: "POST",
        body: JSON.stringify(body)
    }

    console.log(fetchRequest)

    result = await fetch("http://localhost:8081/api/locations/addLocation", fetchRequest);

    if(result.status === 200){
        openPopupSuccess();
    }else{
        openPopupFailed();
    }
    
}

function closePopupSuccess(){
closePopup();
window.location.assign("/locationsList");
}
function closePopup(){
document.getElementById("popup").classList.remove("openPopup");
}

function openPopupSuccess(){
document.getElementById('statusImg').setAttribute("src", "../checkmark.png"); 
document.getElementById('statusTitle').innerHTML = "Success!";
document.getElementById('statusMessage').innerHTML = "Successfully submitted your ticket!";
document.getElementById('popup').classList.add("openPopup");
document.getElementById('statusButton').setAttribute("onclick", "closePopupSuccess()");
}

function openPopupFailed(){
document.getElementById('statusImg').setAttribute("src", "../crossmark.png"); 
document.getElementById('statusTitle').innerHTML = "Failed!";
document.getElementById('statusMessage').innerHTML = "Failed to add your location!";
document.getElementById('popup').classList.add("openPopup");
document.getElementById('statusButton').setAttribute("onclick", "closePopup()");
}