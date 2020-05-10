// API mock data for ajax call
const mockCityData = [
  {
    coord: { lon: -122.08, lat: 37.39 },
    weather: [
      {
        id: 800,
        main: "Clear",
        description: "clear sky",
        icon: "01d",
      },
    ],
    base: "stations",
    main: {
      temp: 282.55,
      feels_like: 281.86,
      temp_min: 280.37,
      temp_max: 284.26,
      pressure: 1023,
      humidity: 100,
    },
    visibility: 16093,
    wind: {
      speed: 1.5,
      deg: 350,
    },
    clouds: {
      all: 1,
    },
    dt: 1560350645,
    sys: {
      type: 1,
      id: 5122,
      message: 0.0139,
      country: "US",
      sunrise: 1560343627,
      sunset: 1560396563,
    },
    timezone: -25200,
    id: 420006353,
    name: "Mountain View",
    cod: 200,
  },
];
// API mock data for uv index value
const uvIndexData = [
  {
    lat: 38.75,
    lon: 40.25,
    date_iso: "2017-06-23T12:00:00Z",
    date: 1498219200,
    value: 10.16,
  },
];
// Variable for current day weather date
const currentDate = moment().format("(DD/MM/YYYY)");
// Variable for ajax uvIndex query property
const uvQueryURL =
  "http://api.openweathermap.org/data/2.5/uvi?appid={appid}&lat={lat}&lon={lon}";
// Empty array for storing recent searches
let recentCitySearches = [];

function displayForecastData(city) {
  city.preventDefault();
  // Target users city input and transform to lower case
  const selectedCity = city.target[0].value;
  // Parameters for query search
  const cityName = selectedCity.toLowerCase();
  const apiKey = "43c5e9000139b9bdf38b1549672e1492";

  function currentForecast() {
    const weatherType = "weather";
    // Query URL which will be used to make ajax call
    const queryURL =
      "https://api.openweathermap.org/data/2.5/" +
      weatherType +
      "?q=" +
      cityName +
      "&appid=" +
      apiKey;
    // Ajax call
    $.ajax({
      url: queryURL,
      method: "GET",
    }).then(renderCurrentForecast);
  }

  function fiveDayForecast() {
    const weatherType = "forecast";
    const queryURL =
      "https://api.openweathermap.org/data/2.5/" +
      weatherType +
      "?q=" +
      cityName +
      "&appid=" +
      apiKey;
    // Ajax call
    $.ajax({
      url: queryURL,
      method: "GET",
    }).then(renderFiveDayForecast);
  }

  // Function that is executed once data has been received
  function renderCurrentForecast(response) {
    $("#cityName").text(response.name + " " + currentDate);
    $("#temperature").text(response.main.temp);
    $("#humidity").text(response.main.humidity);
    $("#windTemp").text(response.wind.deg);
    $("#uvIndex").text(uvIndexData[0].value);
  }

  function renderFiveDayForecast(response) {
    console.log(response);
    for (i = 0; i < response.list.length; i += 8) {
      const temp = response.list[i].main.temp;
      const iconName = response.list[i].weather[0].icon;
      const humidity = response.list[i].main.humidity;

      console.log(response.list[i].dt_txt);
      const card = $("<div>").addClass("card");
      const cardBody = $("<div>").addClass("card-body");
      const cardTitle = $("<h5>")
        .addClass("card-title")
        .text(response.list[i].dt_txt);
      const iconDiv = $("<img>").attr({
        src: "http://openweathermap.org/img/w/" + iconName + ".png",
        alt: "Weather icon",
        height: "auto",
        width: "40px",
      });
      const secondCardText = $("<p>")
        .addClass("card-text")
        .text("Temp: " + temp);
      const thirdCardText = $("<p>")
        .addClass("card-text")
        .text("Humidity: " + humidity);
      const cardColumn = $("<div>").addClass("col-md-2");

      card
        .append(cardBody)
        .append(cardTitle)
        .append(iconDiv)
        .append(secondCardText, thirdCardText);
      cardColumn.append(card);
      $("#fiveDayForecast").append(cardColumn);
    }
  }

  //uvIndexForecast();
  currentForecast();
  fiveDayForecast();
  addCitySearch(cityName);
}
// Add recent searches to localStorage

function addCitySearch(cityName) {
  console.log(cityName);
  recentCitySearches.push(cityName);
  saveCitySearches();
  displayCitySearches();
}

function setCitySearchesToLocal() {
  let storedRecentCitySearch = JSON.parse(
    localStorage.getItem("recentCitySearch")
  );

  if (storedRecentCitySearch) {
    recentCitySearch = storedRecentCitySearch;
  }

  saveCitySearches();
  displayCitySearches();
}

function saveCitySearches() {
  localStorage.setItem(
    "recentCitySearches",
    JSON.stringify(recentCitySearches)
  );
}

function displayCitySearches() {
  $("#recentSearches").empty();
  $("#recentSearches").append("<h4>").text("Your recent searches...");
  recentCitySearches.forEach(function (city) {
    $("#recentSearches").append($("<p>").text(city));
    console.log(city + "yellow");
  });
}

// Execute set and get to localStorage for recentCitySearch array
setCitySearchesToLocal();
// Form event listener
$("form").submit(displayForecastData);
