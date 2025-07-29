let formSubmitted = false;

//handle session storage clearing on reload
if (performance.getEntriesByType("navigation")[0].type === "reload") {
    sessionStorage.clear();
}

function submitForm(){
    const form = document.getElementById("ticket_form");
    if (!form){
        console.error("Form Not Found");
        return;
    }

    const formData = new FormData(form);
    const data = new URLSearchParams(formData).toString();

    
    const formStatus = sessionStorage.getItem('ticketSubmitted'|| "false");
    if (formStatus){
        alert("ERROR: Oompa Loompas already have your ticket.");
        return;
    }

    //fetch
    fetch('http://127.0.0.1:5000/tickets', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: data,
        credentials: 'include'
    })
    .then(response => {
        if (response.status == 201){
            alert("(status: 201) Ticket Created Successfully");
            sessionStorage.setItem('ticketSubmitted', JSON.stringify(true))
            form.reset();
            getTickets();
        } else if (response.status == 403){
            alert(`${response}`);
            //alert ("(status: 403) The Oompa Loompas already have your ticket.");
        } else {
            alert(`${response}`);
            //alert("(status: 400) Ticket Not Created ");
        }
    })
    .then(data => {
        console.log(data);
    })
    .catch(error => {
        alert(`Error: ${error}`);
    });
}

function getTickets(){
     //fetch
     fetch('http://127.0.0.1:5000/tickets', {
        method: 'GET'
    })
    .then(response => {
        if (response.status == 200){
            console.log("(status: 200) Successfully Retrieved Data'");
            return response.json();
        } else {
            alert("(status: 404) Resource Not Found")
            return Promise.reject('Failed to Fetch Tickets');
        }
    })
    .then(data => {
        console.log("Success: " + JSON.stringify(data));

        let dayOfWeek = new Date().getDay();
        const signupCard = document.querySelector('.ticket_lost');
        const ticketList = document.querySelector(".ticket_list");
        console.log(data)
        ticketList.innerHTML = '<div id="ticket"><h2 id="eName"></h2><h2 id="eAge"></h2><h2 id="gName"></h2></div>';
        data.forEach(ticket => {
            //get data
            const id = ticket.id;
            const entrantName = ticket.entrant_name;
            const entrantAge = ticket.entrant_age;
            const guestName = ticket.guest_name;
            const randomToken = ticket.random_token;

            //create html elements
            const Ticket = document.createElement("div");
            const eName = document.createElement("h4");
            const eAge = document.createElement("h4");
            const gName = document.createElement("h4");
            const cStatus = document.createElement("p");

            //assign data to html elements
            eName.textContent = `Entrant Name: ${entrantName}`;
            eAge.textContent = `Entrant Age: ${entrantAge}`;
            gName.textContent = `Guest Name: ${guestName}`;

            //check date
            if (randomToken == dayOfWeek){
                signupCard.classList.remove('ticket_lost');
                signupCard.classList.add('ticket_won');
                Ticket.classList.add('list_won');
                Ticket.classList.remove('list_lost');
                cStatus.textContent = "You got A Golden Ticket!";
            } else {
                signupCard.classList.remove('ticket_won');
                signupCard.classList.add('ticket_lost');
                Ticket.classList.add('list_lost');
                Ticket.classList.remove('list_won');
                cStatus.textContent = "Try Again";

            }
            
            //create ticket
            Ticket.appendChild(eName);
            Ticket.appendChild(eAge);
            Ticket.appendChild(gName);
            Ticket.appendChild(cStatus);
            ticketList.appendChild(Ticket);

        });
    })
    .catch(error => {
        alert(`Error: ${error}`);
    });
}