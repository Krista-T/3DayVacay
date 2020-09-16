let params = new URLSearchParams(document.location.search.substring(1));
let cityFromUrl = params.get("city");

fetch("https://spreadsheets.google.com/feeds/list/18QShemZlLoq2j6zasY3bNjFkoqkDb_tP7Tpjujma3mg/od6/public/values?alt=json")
    .then(res => res.json())
    .then(dataReceived);

// THIS 'MIDDLE MAN'-FUNCTION LETS US CONTROL WHAT OTHER FUNCTIONS ARE CALLED
function dataReceived(data) {
    showActivities(data);
    addFilters();
    // addPreferences();
}
// ADD FUNCTIONALITY TO FILTER BUTTONS - WORKING!
function addFilters() {
    document.querySelectorAll(".filters button").forEach(button => {
        button.addEventListener("click", () => {
           
            document.querySelectorAll(`article:not(.${button.dataset.filter})`).forEach(article => {


                article.classList.toggle("hidden");
                console.log(article);
            });
        })
    })
}

// ADD FUNCTIONALITY TO PREFERENCE BUTTONS - NOT WORKING OPTIMALLY!


// function addPreferences() {
//     document.querySelectorAll(".preferences button").forEach(button => {
//         button.addEventListener("click", () => {
//             console.log(button.dataset.filter);
//             document.querySelectorAll(`article.${button.dataset.filter})`, `article:not(.hidden)`).forEach(article => {
//                 article.classList.toggle("hidden2");
//             });

           

//         })
//     })
// }

// LOOP THROUGH DATA AND CREATE INDVIDUAL ACTIVITIES FROM TEMPLATE
function showActivities(data) {
    console.log(data)
    data.feed.entry.forEach(city => {
        // CHECKING IF CITYNAME IN DATA MATCHES CITY IN URL
        if (city.gsx$city.$t == cityFromUrl) {

            // SET HEADER H1 TO CITY NAME
            document.querySelector(".city-name").textContent = city.gsx$city.$t;
            // SET HEADER BACKGROUND IMAGE TO CITY HERO IMAGE
            document.querySelector("header").setAttribute("style", "background-image: url(http://ssays.dk/kea/common_interest_images/" + city.gsx$heroimage.$t + ".jpg);")

            // CREATE SINGLE ACTIVTY TEMPLATE
            const template = document.querySelector("template").content;
            const copy = template.cloneNode(true);

            // POPULATE TEMPLATE WITH DATA
            copy.querySelector('h2').textContent = city.gsx$activitytype.$t;
            copy.querySelector('h3').textContent = city.gsx$venuename.$t;
            copy.querySelector('.headline').textContent = city.gsx$headline.$t;
            copy.querySelector("img").setAttribute("src", "http://ssays.dk/kea/common_interest_images/" + city.gsx$image.$t + ".jpg");

            // // ADDING CLASSES FOR FILTERING - LOOK HERE KRIS!
            // const article = copy.querySelector("article");
            // article.classList.add(city.gsx$filtertag.$t);
            // article.classList.add(city.gsx$activitytype.$t);

           


            // APPEND TEMPLATE TO MAIN
            document.querySelector("main").appendChild(copy);
        }
    })
}

