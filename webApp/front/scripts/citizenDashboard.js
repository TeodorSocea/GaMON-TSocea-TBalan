var globalCoords = [];
var closeLocations = [];
var trashTags = [];

var map = L.map("map");
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
}).addTo(map);

async function load(){
  await initMap();
  await getCloseLocations();
}

function initMap() {
  return new Promise( (resolve, reject)  => {
    navigator.geolocation.getCurrentPosition((pos) => {
      document.getElementById("coords").innerHTML =
        pos.coords.latitude + " " + pos.coords.longitude;
      var coordinates = [pos.coords.latitude, pos.coords.longitude];
      globalCoords[0] = coordinates[0];
      globalCoords[1] = coordinates[1];
      console.log(globalCoords);
      map.setView(coordinates, 15);
      var marker = L.marker(coordinates).addTo(map);
      resolve(1);
    }, (error) => {
      console.log(error);
      var coordinates = [47.17, 27.57];
      globalCoords[0] = coordinates[0];
      globalCoords[1] = coordinates[1];
      map.setView(coordinates, 15);
      var marker = L.marker(coordinates).addTo(map);
      resolve(1);
    });
  });
}

async function getCloseLocations(){
  console.log("Getting closest loactions", globalCoords);
  let lat = globalCoords[0];
  let long = globalCoords[1];
  console.log(lat, long);
  let result = await fetch(`http://localhost:8081/locations?lat=${lat}&long=${long}`).then((res) => res.json()).catch((err) => console.log(err));
  console.log(result);
  closeLocations = result;
  let html = "<select title=\"locations\" id=\"locations\" onchange=\"getSpecificLocation()\">";
  for(let i = 0; i < result.length; i++)
  {
    let res = result[i];
    console.log(res)
    html += `\n<option value=${i}>${res.str}</option>`;
  }
  html+="</select>";
  document.getElementById("locationSelector").innerHTML = html;
}

async function getSpecificLocation(){
  let i = document.getElementById("locations").value;
  let id = closeLocations[i].id;
  if(id === -1){
    document.getElementById("trashTagSelector").innerHTML = "";
    return;
  }
  let result = await fetch(`http://localhost:8081/location?id=${id}`).then(res => res.json()).catch(err => console.log(err));
  let html = "";
  for(let j = 0; j < result.length; j++){
    let res = result[j];
    html += `<label for=\"${res}\">${res}</label>\n<input type=\"number\" id=\"${res}\" name=\"${res}\" min=\"0\">\n`;
  }
  document.getElementById("trashTagSelector").innerHTML = html;
  console.log(result);
}
