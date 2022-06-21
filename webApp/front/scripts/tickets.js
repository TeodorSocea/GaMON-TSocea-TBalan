function parseTickets(tickets){
    let output = [];
    for(let i = 0; i<tickets.length; i++){
        output.push({
            ticketID: tickets[i].id,
            submitterID: tickets[i].submitterid,
            locationID: tickets[i].locationid,
            dateSubmitted: tickets[i].datesubmitted,
            dateSolved: tickets[i].datesolved,
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

function makeTag(tag){
    return `<div class=\"tag\">${tag}</div>`;
}

async function load(){
    let html = "<button id=\"exportTickets\" type=\"button\" onclick=\"exportTickets(\'csv\')\">Export Tickets CSV</button>";
    html += "<button id=\"exportTickets\" type=\"button\" onclick=\"exportTickets(\'json\')\">Export Tickets JSON</button>";
    document.getElementById("buttons").innerHTML = html;

    tickets = await fetch(`http://localhost:8081/api/tickets/activeTickets`).then(result => result.json());
    tickets = parseTickets(tickets);

    let ticketshtml = "";

    for(let i=0; i < tickets.length; i++){
        let solved = '';
        if(tickets[i].dateSolved){
            solved = 'solved';
        }
        ticketshtml += `<div onclick=\"viewTicket(${tickets[i].ticketID})\"class=\"ticket ${solved}\" id=\"ticket${tickets[i].ticketID}\"><div class=\"info\"><div class=\"date\" id=\"date${tickets[i].ticketID}\">${tickets[i].dateSubmitted.split('T')[0]}</div><div class=\"date\" id=\"id${tickets[i].ticketID}\">#${tickets[i].ticketID}</div></div><div class=\"tags\">`;
        let keys = Object.keys(tickets[i].tags);
        for(let j=0; j < keys.length; j++){
            if(tickets[i].tags[keys[j]] > 0){
                ticketshtml += makeTag(keys[j]);
                console.log(makeTag(keys[j]));
            }
        }
        ticketshtml += "</div></div>";
    }
    document.getElementById("tickets").innerHTML = ticketshtml;
    console.log(document.cookie.token);

}

function viewTicket(ticketid){
    window.location.assign(`/ticket?ticketid=${ticketid}`);
}

async function exportTickets(format){
    window.location.assign(`/api/tickets/export?format=${format}`);
}