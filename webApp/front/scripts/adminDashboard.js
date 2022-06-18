var tickets= [];

async function logout(){
    let result = await fetch("http://localhost:8081/logout", {method : "DELETE"});
    window.location.replace("/");
}

function makeTag(tag){
    return `<div class=\"tag\">${tag}</div>`;
}

function parseTickets(tickets){
    let output = [];
    for(let i = 0; i<tickets.length; i++){
        output.push({
            submitterID: tickets[i].submitterID,
            locationID: tickets[i].locationID,
            dateSubmitted: tickets[i].dateSubmitted,
            dateSolved: tickets[i].dateSolved,
            tags :{
                paper: tickets[i].paper,
                plastic: tickets[i].plastic,
                metal: tickets[i].metal,
                glass: tickets[i].glass,
                organic: tickets[i].organic
            },
            comment: tickets[i].comment,
            active: tickets[i].active
        });
    }
    return output;
}

async function getTopTickets(top){
    tickets = await fetch(`http://localhost:8081/topTickets?top=${top}`).then(result => result.json());
    tickets = parseTickets(tickets);
    console.log(tickets);
    var html = "<h2>Latest tickets</h2>";
    for(let i=0; i < tickets.length; i++){
        html += `<div class=\"ticket\" id=\"ticket${i}\"><div class=\"date\" id=\"date${i}\">${tickets[i].dateSubmitted}</div><div class=\"tags\">`;
        let keys = Object.keys(tickets[i].tags);
        for(let j=0; j < keys.length; j++){
            if(tickets[i].tags[keys[j]] > 0){
                html += makeTag(keys[j]);
                console.log(makeTag(keys[j]));
            }
        }
        html += "</div></div>";
    }
    document.getElementById("tickets").innerHTML = html;
}