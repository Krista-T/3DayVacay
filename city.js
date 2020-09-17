let params = new URLSearchParams(document.location.search.substring(1));
let cityFromUrl = params.get("city");

fetch("https://spreadsheets.google.com/feeds/list/18QShemZlLoq2j6zasY3bNjFkoqkDb_tP7Tpjujma3mg/od6/public/values?alt=json")
    .then(res => res.json())
    .then(dataReceived);

// THIS 'MIDDLE MAN'-FUNCTION LETS US CONTROL WHAT OTHER FUNCTIONS ARE CALLED
function dataReceived(data) {
    // I HIDE THE STUPID MODAL HERE, BECAUSE I DOESNT HIDE, IF I JUST ADD .hidden TO .modal-box IN HTML
    document.querySelector(".modal-box").classList.add("hidden");
    showActivities(data);
    addFilters();
    addPreferences();
}
// ADD FUNCTIONALITY TO FILTER BUTTONS - WORKING!
function addFilters() {
    document.querySelectorAll(".filters li").forEach(button => {
        button.addEventListener("click", () => {
            // console.log(button.dataset.filter);
            document.querySelectorAll(`article:not(.${button.dataset.filter})`).forEach(article => {
                article.classList.toggle("hidden");
            });
        })
    })
}

// ADD FUNCTIONALITY TO PREFERENCE BUTTONS - NOT WORKING OPTIMALLY!
function addPreferences() {
    document.querySelectorAll(".preferences button").forEach(button => {
        button.addEventListener("click", () => {
            // console.log(button.dataset.filter);
            document.querySelectorAll(`article.${button.dataset.filter})`, `article:not(.hidden)`).forEach(article => {
                article.classList.toggle("hidden");
            });
        })
    })
}

// LOOP THROUGH DATA AND CREATE INDVIDUAL ACTIVITIES FROM TEMPLATE
function showActivities(data) {
    //console.log(data)
    data.feed.entry.forEach(city => {
        // CHECKING IF CITYNAME IN DATA MATCHES CITY IN URL
        if (city.gsx$city.$t == cityFromUrl) {

            // SET HEADER H1 TO CITY NAME
            document.querySelector(".city-name").textContent = city.gsx$city.$t;
            // SET HEADER BACKGROUND IMAGE TO CITY HERO IMAGE
            document.querySelector(".main-img-city ").setAttribute("src", "http://ssays.dk/kea/common_interest_images/headers/" + city.gsx$heroimage.$t + ".jpg")

            // CREATE SINGLE ACTIVTY TEMPLATE
            const template = document.querySelector("template").content;
            const copy = template.cloneNode(true);

            // POPULATE TEMPLATE WITH DATA
            //copy.querySelector('h2').textContent = city.gsx$activitytype.$t;
         copy.querySelector(".activityImg").setAttribute("src", "img/" +city.gsx$activitytype.$t+ ".svg");
            copy.querySelector('h3').textContent = city.gsx$venuename.$t;
            copy.querySelector('.headline').textContent = city.gsx$headline.$t;
            copy.querySelector("img").setAttribute("src", "http://ssays.dk/kea/common_interest_images/" + city.gsx$image.$t + ".jpg");

            // ADDING CLASSES FOR FILTERING - LOOK HERE KRIS!
            const article = copy.querySelector("article");
            //FOR SOME REASON, THE FOLLOWING LINE DOESNT WORK WITH OTHER CITIES THAN COPENHAGEN?:
            //article.classList.add(city.gsx$filtertag.$t);
            article.classList.add(city.gsx$activitytype.$t);

            // ADDING EVENTLISTERNER TO OPEN MODAL
            article.addEventListener("click", () => {
                showModal(city);
            });

            // APPEND TEMPLATE TO MAIN
            document.querySelector("main").appendChild(copy);
        }
    })
}

function showModal(city) {
    console.log("article clicked!");
    console.log(city);
    const modal = document.querySelector(".modal-box");
    modal.querySelector(".modal-name").textContent = city.gsx$venuename.$t;
    modal.querySelector(".modal-image").setAttribute("src", "http://ssays.dk/kea/common_interest_images/" + city.gsx$image.$t + ".jpg");
    modal.querySelector(".modal-description").textContent = city.gsx$description.$t;
    modal.querySelector(".modal-price").textContent = "Price: " + city.gsx$price.$t + " DKK";
    modal.querySelector(".modal-address").textContent = "Address: " + city.gsx$location.$t;
    modal.querySelector(".modal-hours").textContent = "Opening hours: " + city.gsx$workinghours.$t;
    // Un-hide the modal element
    modal.classList.remove("hidden");
    modal.addEventListener("click", () => {
    modal.classList.add("hidden");
    })
}
