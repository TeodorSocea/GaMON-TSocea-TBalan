var cod = [];
var map = L.map("map");
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
}).addTo(map);

function initMap() {
  navigator.geolocation.getCurrentPosition((pos) => {
    document.getElementById("coords").innerHTML =
      pos.coords.latitude + " " + pos.coords.longitude;
    cod = [pos.coords.latitude, pos.coords.longitude];
    map.setView(cod, 15);

    
    var marker = L.marker(cod).addTo(map);
  }, (error) => {
    console.log(error);
    cod = [47.17, 27.57];
    map.setView(cod, 15);
    var marker = L.marker(cod).addTo(map);
  });
  console.log(cod);
  
}

async function getCloseLocations(){
  let result = await fetch(`http://localhost:8081/locations?lat=${cod[0]}&long=${cod[1]}`).then((res) => res.json()).catch((err) => console.log(err));
  console.log(result);
  let html = "<select name=\"pubele\" id=\"pubele\">";
  for(let i = 0; i < result.length; i++)
  {
    let res = result[i];
    console.log(res)
    html += `\n<option value=${res.str}>${res.str}</option>`;
  }
  html+="</select>";
  document.getElementById("pubeleSelector").innerHTML = html;
}

async function getSpecificLocation(id){
  let result = await fetch(`http://localhost:8081/location?id=${id}`).then(res => res.json()).catch(err => console.log(err));
  console.log(result);
}
