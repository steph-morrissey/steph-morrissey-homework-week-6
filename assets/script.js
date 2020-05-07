// API mock data for ajax call
const mockCityData = [
  {
    coord: { lon: 139, lat: 35 },
    weather: [
      {
        id: 800,
        main: "Clear",
        description: "clear sky",
        icon: "01n",
      },
    ],
    base: "stations",
    main: {
      temp: 281.52,
      feels_like: 278.99,
      temp_min: 280.15,
      temp_max: 283.71,
      pressure: 1016,
      humidity: 93,
    },
    wind: {
      speed: 0.47,
      deg: 107.538,
    },
    clouds: {
      all: 2,
    },
    dt: 1560350192,
    sys: {
      type: 3,
      id: 2019346,
      message: 0.0065,
      country: "JP",
      sunrise: 1560281377,
      sunset: 1560333478,
    },
    timezone: 32400,
    id: 1851632,
    name: "Shuzenji",
    cod: 200,
  },
];
// Declare ajax querySearch
let cityName;

let recentCitySearches = [];
// Function that takes in response from form submission
function citySearch(city) {
  city.preventDefault();
  const citySearch = city.target[0].value;
  const cityName = citySearch.toLowerCase();
  const apiKey = "43c5e9000139b9bdf38b1549672e1492";
  const queryURL =
    "https://api.openweathermap.org/data/2.5/weather?q=" +
    cityName +
    "&appid=" +
    apiKey;

  $.ajax({
    url: queryURL,
    method: "GET",
  }).then(example);

  function example(response) {
    console.log(response);
  }
}
// Add recent searches to localStorage
function saveCitySearches() {
  localStorage.setItem(
    "recentCitySearches",
    JSON.stringify(recentCitySearches)
  );
}
function displayCitySearches() {
  recentCitySearches.forEach(function (city) {
    console.log(city);
  });
}
function addCitySearchesToLocal() {
  let storedRecentCitySearch = JSON.parse(
    localStorage.getItem("recentCitySearch")
  );

  if (storedRecentCitySearch) {
    recentCitySearch = storedRecentCitySearch;
  }

  saveCitySearches();
  displayCitySearches();
}

// Execute set and get to localStorage for recentCitySearch array
addCitySearchesToLocal();
// Form event listener
$("form").submit(citySearch);
