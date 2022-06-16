function initMap() {
  var cod = [];
  navigator.geolocation.getCurrentPosition((pos) => {
    document.getElementById("coords").innerHTML =
      pos.coords.latitude + " " + pos.coords.longitude;
    cod = [pos.coords.latitude, pos.coords.longitude];
    console.log(cod);
    var map = L.map("map").setView(cod, 15);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    }).addTo(map);
    var marker = L.marker(cod).addTo(map);
  });
}
