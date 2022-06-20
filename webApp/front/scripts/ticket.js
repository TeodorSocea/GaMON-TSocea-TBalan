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

async function grabTicket(ticketid){
    document.getElementById("title").innerHTML = `Ticket #${ticketid}`;
    let statistics = await fetch(`http://localhost:8081/api/statistics/ticket?ticketid=${ticketid}`).then(statistics => statistics.json());
    let ticket = await fetch(`http://localhost:8081/api/tickets/ticket?ticketid=${ticketid}`).then(ticket => ticket.json());
    let chart = document.getElementById('trashChart').getContext('2d');
    let trashChart = new Chart(chart, statistics);
    document.getElementById("commentText").innerHTML = `${ticket.comment}`;
    initMap([47.17, 27.57]);
}