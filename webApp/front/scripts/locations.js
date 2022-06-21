async function load(){
    let html = "<button id=\"addLocation\" type=\"button\" onclick=\"addLocation()\">Add Location</button>";
    html += "<button id=\"exportLocations\" type=\"button\" onclick=\"exportLocations()\">Export Locations</button>";
    document.getElementById("buttons").innerHTML = html;

    locations = await fetch(`http://localhost:8081/api/locations/allLocations`).then(result => result.json());
    console.log(locations);
    
    let locationshtml = "";

    for(let i=0; i < locations.length; i++){
        let disabled = "";
        if(locations[i].active !== 'true'){
            disabled = "disabled";
        }
        locationshtml += `<div onclick=\"viewLocation(${locations[i].id})\"class=\"location ${disabled}\" id=\"location${locations[i].id}\"><div class=\"name\" id=\"name${locations[i].id}\">${locations[i].str}</div><div class=\"tags\">`;
        for(let j = 0; j < locations[i].tags.length; j++){
            locationshtml += `<div class=\"tag\">${locations[i].tags[j]}</div>`
        }
        locationshtml += "</div></div>";
    }
    document.getElementById("locations").innerHTML = locationshtml;
    console.log(document.cookie.token);

}

function addLocation(){
    window.location.assign("/locationsList/addLocation");
}

function viewLocation(locationid){
    window.location.assign(`/locationsList/location?locationid=${locationid}`);
}

async function exportLocations(){
    window.location.assign(`/api/locations/export`);
}