function test(){
    console.log("envoi au serv")
    fetch('/test',{
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ data:"42" })
    })
        .then(res=>res.json())
        .then(data => {
            console.log(data)
        })
        .catch(e => console.error(e))
}

function toggleHeader(){
    document.querySelector(".header").classList.toggle("toggle");
}

function disableHeader(){
    document.querySelector(".header").classList.remove("toggle");
}

function toggleChooseName(){
    document.querySelector(".chooseName").classList.add("toggle");
}

function disableChooseName(){
    document.querySelector(".chooseName").classList.remove("toggle");
}