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

async function updateTicket(ticketid){
    let response = await fetch(`http://localhost:8081/api/tickets/updateTicket?ticketid=${ticketid}`, {method: 'PUT'});
}

async function grabTicket(ticketid){
    document.getElementById("title").innerHTML = `Ticket #${ticketid}`;
    let statistics = await fetch(`http://localhost:8081/api/statistics/ticket?ticketid=${ticketid}`).then(statistics => statistics.json());
    let ticket = await fetch(`http://localhost:8081/api/tickets/ticket?ticketid=${ticketid}`).then(ticket => ticket.json());
    let location = await fetch(`http://localhost:8081/api/locations/location?locationid=${ticket.locationid}`).then(location => location.json());
    let chart = document.getElementById('trashChart').getContext('2d');
    let trashChart = new Chart(chart, statistics);
    document.getElementById("commentText").innerHTML = `${ticket.comment}`;
    var buttonMsg;
    if(!ticket.datesolved)
        buttonMsg = "Mark as Solved";
    else
        buttonMsg = "Deactivate Ticket";
    
    document.getElementById("ticketButton").innerHTML =buttonMsg;
    document.getElementById("ticketButton").setAttribute('onclick', `updateTicket(${ticketid}); openPopupSuccess()`);
    initMap([location.lat, location.long]);
}

function openPopupSuccess(){
    document.getElementById('statusImg').setAttribute("src", "checkmark.png"); 
    document.getElementById('statusTitle').innerHTML = "Success!";
    document.getElementById('statusMessage').innerHTML = "Successfully solved ticket!";
    document.getElementById('popup').classList.add("openPopup");
    document.getElementById('statusButton').setAttribute("onclick", "closePopupSuccess()");
}

function closePopupSuccess(){
    closePopup();
    window.location.assign("/adminDashboard");
}

function closePopup(){
    document.getElementById("popup").classList.remove("openPopup");
}