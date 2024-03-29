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
      var coordinates = [pos.coords.latitude, pos.coords.longitude];
      globalCoords[0] = coordinates[0];
      globalCoords[1] = coordinates[1];
      console.log(globalCoords);
      map.setView(coordinates, 15);
      resolve(1);
    }, (error) => {
      console.log(error);
      var coordinates = [47.17, 27.57];
      globalCoords[0] = coordinates[0];
      globalCoords[1] = coordinates[1];
      map.setView(coordinates, 15);
      resolve(1);
    });
  });
}

async function getCloseLocations(){
  console.log("Getting closest loactions", globalCoords);
  let lat = globalCoords[0];
  let long = globalCoords[1];
  console.log(lat, long);
  let result = await fetch(`http://localhost:8081/api/locations/closeLocations?lat=${lat}&long=${long}`).then((res) => res.json()).catch((err) => console.log(err));
  console.log(result);
  closeLocations = result;
  let html = "<label for=\"locations\">Close locations</label><br><select title=\"locations\" id=\"locations\" onchange=\"getSpecificLocation()\">";
  for(let i = 0; i < result.length; i++)
  {
    let res = result[i];
    console.log(res)
    html += `\n<option value=${i}>${res.str}</option>`;
    if(res.str === "select a location")
      continue;
    var marker = L.marker([res.lat, res.long]).addTo(map).bindPopup(res.str);
  }
  html+="</select>";
  document.getElementById("locationSelector").innerHTML = html;
}

async function getSpecificLocation(){
  let i = document.getElementById("locations").value;
  let id = closeLocations[i].id;
  if(id === -1){
    document.getElementById("trashTagSelector").innerHTML = "";
    document.getElementById("commentField").innerHTML = "";
    return;
  }
  let result = closeLocations[i].tags;
  trashTags = result;
  console.log(trashTags);
  let html = "";
  for(let j = 0; j < result.length; j++){
    let res = result[j];
    html += `<div class=\"tag\"><label for=\"${res}\">${res}</label><input type=\"number\" id=\"${res}\" name=\"${res}\" min=\"0\"></div>`;
  }
  document.getElementById("trashTagSelector").innerHTML = html;
  document.getElementById("commentField").innerHTML = "<label for=\"textArea\">Comments</label><textarea title=\"textArea\" id=\"textArea\"></textarea>";
  map.setView([closeLocations[i].lat, closeLocations[i].long], 15);
  console.log(result);
}

async function submitTicket(){
  
  let i = document.getElementById("locations").value;
  let id = closeLocations[i].id;
  if(id === -1){
    openPopupFailed();
    return;
  }
  let comment = document.getElementById("textArea").value;
  let quantities = {};
  for(let i = 0; i < trashTags.length; i++){
    quantities[trashTags[i]] = document.getElementById(trashTags[i]).value;
  }
  
  
  request = {
    method: "POST",
    body: JSON.stringify({
      id: id,
      quantities: quantities,
      comment: comment
    })
  };

  console.log(request);

  let result = await fetch(`http://localhost:8081/ticketSubmit`, request);
  if(result.status === 200){
    openPopupSuccess();
  }else{
    openPopupFailed();
  }
}

function closePopupSuccess(){
  closePopup();
  window.location.assign("/citizenDashboard");
}
function closePopup(){
  document.getElementById("popup").classList.remove("openPopup");
}

function openPopupSuccess(){
  document.getElementById('statusImg').setAttribute("src", "checkmark.png"); 
  document.getElementById('statusTitle').innerHTML = "Success!";
  document.getElementById('statusMessage').innerHTML = "Successfully submitted your ticket!";
  document.getElementById('popup').classList.add("openPopup");
  document.getElementById('statusButton').setAttribute("onclick", "closePopupSuccess()");
}

function openPopupFailed(){
  document.getElementById('statusImg').setAttribute("src", "crossmark.png"); 
  document.getElementById('statusTitle').innerHTML = "Failed!";
  document.getElementById('statusMessage').innerHTML = "Failed to submit your ticket!";
  document.getElementById('popup').classList.add("openPopup");
  document.getElementById('statusButton').setAttribute("onclick", "closePopup()");
}

async function logout(){
  let result = await fetch("http://localhost:8081/logout", {method : "DELETE"});
  window.location.assign("/");
}

