let params = new URLSearchParams(document.location.search.substring(1));
let cityFromUrl = params.get("city");


fetch("https://spreadsheets.google.com/feeds/list/18QShemZlLoq2j6zasY3bNjFkoqkDb_tP7Tpjujma3mg/od6/public/values?alt=json")
    .then(res => res.json())
    .then(showCities)

function showCities(data) {
    console.log(data)
    data.feed.entry.forEach(city => {
        if (city.gsx$city.$t == cityFromUrl) {
            const template = document.querySelector("template").content;
            const copy = template.cloneNode(true);
            copy.querySelector("h1").textContent = city.gsx$city.$t;

            //CITY NAME
            copy.querySelector("a").href = `city.html?city=${city.gsx$city.$t}`

            //POPULATE TEMPLATE WITH DATA
            copy.querySelector('h2').textContent = city.gsx$activitytype.$t;
            copy.querySelector('h3').textContent = city.gsx$venuename.$t;
            copy.querySelector('.headline').textContent = city.gsx$headline.$t;
            copy.querySelector("img").setAttribute("src", "http://ssays.dk/kea/common_interest_images/" + city.gsx$image.$t + ".jpg");

            //APPEND
            document.querySelector("main").appendChild(copy);
        }
    })

}
