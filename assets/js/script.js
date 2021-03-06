// Open weather URL
OPEN_WEATHER_URL = "https://api.openweathermap.org/data/2.5/";
// API Key for Open weather API
API_KEY = "&appid=43c5e9000139b9bdf38b1549672e1492";
// cityName
let cityName;
// Empty array which will be used to store recent searches from localStorage
let recentSearchesArray = [];

// By default, render most recent search in the recent searches array
function displayDefaultWeatherForecast() {
  getFromLocalStorage();
  // Get last element in the array of recent searches
  const mostRecentSearch = recentSearchesArray.slice(-1);
  getWeatherForecast(mostRecentSearch);
  displayRecentSearches();
}
// Display forecast data for both current and 5 day forecast
function displayWeatherForecast(cityName) {
  // Prevent default submit
  cityName.preventDefault();
  // Target the city name that the user has searched for
  const targetCityName = cityName.target[0].value;
  // Transform the city name to lower case
  const lowerCaseCityName = targetCityName.toLowerCase();
  // Set this item into localStorage by calling the function
  setToLocalStorage(lowerCaseCityName);
  // Make API call to receive data for selected city
  getWeatherForecast(lowerCaseCityName);
  // Display recent weather searches from localStorage beneath the search bar
  displayRecentSearches();
}

// Renders current day weather forecast using data received from API call
function renderCurrentForecast(weatherData) {
  const uvIndex = calculateUvIndex(weatherData);
  $("#currentDayForecast").empty();
  const card = $("<div>").attr({
    class: "card",
    width: "100%",
  });
  const cardBody = $("<div>").addClass("card-body").attr("id", "cardBody");
  const cardTitle = $("<h3>").addClass("card-title").text(weatherData.name);
  const cardTemp = $("<p>").text("Temperature: " + weatherData.main.temp);
  const cardHumidity = $("<p>").text("Humidity: " + weatherData.main.humidity);
  const cardWindTemp = $("<p>").text(
    "Wind Temperature: " + weatherData.wind.deg
  );
  card.append(cardBody);
  cardBody.append(cardTitle, cardTemp, cardHumidity, cardWindTemp);
  $("#currentDayForecast").append(card);
}

// Targets latitude and longitude to make Ajax call for UV Index
function calculateUvIndex(weatherData) {
  const latitude = weatherData.coord.lat;
  const longitude = weatherData.coord.lon;
  const latAndLon = "lat=" + latitude + "&lon=" + longitude;
  getUvIndexForecast(latAndLon);
}

// Targets UV Index value and appends to current day card body
function uvIndexValue(data) {
  const uvIndexValue = data.value;
  const cardUvIndexP = $("<p>").text("UV Index: ");
  const cardUvIndexSpan = $("<span>").text(uvIndexValue);
  if (parseInt(uvIndexValue) <= 2) {
    cardUvIndexSpan.addClass("lowUv");
  } else if (parseInt(uvIndexValue) > 2 && parseInt(uvIndexValue) < 5) {
    cardUvIndexSpan.addClass("moderateUv");
  } else {
    cardUvIndexSpan.addClass("highUv");
  }
  const cardUvIndex = cardUvIndexP.append(cardUvIndexSpan);
  $("#cardBody").append(cardUvIndex);
}

// Renders 5 day weather forecast using data received from API call
function renderFiveDayWeatherForecast(weatherData) {
  $("#fiveDayForecast").empty();
  // Find first item in weatherData array to get current date
  const currentDate = weatherData.list[0].dt_txt.slice(8, 10);
  // Iterates through each item in the weatherData.list array
  for (i = 0; i < weatherData.list.length; i++) {
    // Target date in the weatherData.list array for each item
    const forecastDate = weatherData.list[i].dt_txt.slice(8, 10);
    // Target timestamp of that dacste in the weatherData.list array for each item
    const dateTimestamp = weatherData.list[i].dt_txt.slice(11, 19);
    // Evaluates whether each item in array is not the current date and if the timestamp is equal to 12:00:00
    if (forecastDate !== currentDate && dateTimestamp === "09:00:00") {
      // Target date without the timestamp
      const date = weatherData.list[i].dt_txt;
      const cardDate = date.slice(0, 10);
      // Target temperature
      const temp = weatherData.list[i].main.temp;
      // Target weather icon
      const iconName = weatherData.list[i].weather[0].icon;
      // Target humidity
      const humidity = weatherData.list[i].main.humidity;
      // Create card element with title and body
      const card = $("<div>").addClass("card bg-warning");
      const cardBody = $("<div>").addClass("card-body");
      const cardWeatherDate = $("<h5>").addClass("card-title").text(cardDate);
      const weatherIconDiv = $("<img>").attr({
        src: "http://openweathermap.org/img/w/" + iconName + ".png",
        alt: "Weather icon",
        height: "auto",
        width: "40px",
      });
      const cardTemperature = $("<p>")
        .addClass("card-text")
        .text("Temp: " + temp);
      const cardHumidity = $("<p>")
        .addClass("card-text")
        .text("Humidity: " + humidity);
      const cardColumn = $("<div>").addClass("col-md-2");
      // Append card title and body to the card element
      card.append(
        cardBody.append(
          cardWeatherDate.append(weatherIconDiv, cardTemperature, cardHumidity)
        )
      );
      // Append the card element to the card column
      cardColumn.append(card);
      // Append the card column to the card body
      $("#fiveDayForecast").append(cardColumn);
    }
  }
}

// Sets city name search to localStorage
function setToLocalStorage(citySearch) {
  // Transform lowercase city name to camel case
  const camelCaseCitySearch = citySearch.replace(/\b[a-z]/g, function (letter) {
    return letter.toUpperCase();
  });
  // Add this item to the recent search array
  recentSearchesArray.push(camelCaseCitySearch);
  localStorage.setItem(
    "recentSearchesArray",
    JSON.stringify(recentSearchesArray)
  );
}

// Get items within the recent searches array from localStorage
function getFromLocalStorage() {
  let storedRecentSearchesArray = JSON.parse(
    localStorage.getItem("recentSearchesArray")
  );

  if (storedRecentSearchesArray) {
    recentSearchesArray = storedRecentSearchesArray;
  }
}

// Display most recent searches beneath search bar
function displayRecentSearches() {
  $("#recentSearches").empty();
  $("#recentSearches").append("<h4>").text("Your recent searches...");
  const ulElement = $("<div>").addClass("list-group");
  recentSearchesArray.forEach((city, index) => {
    const searchItem = $("<a>")
      .attr({
        class: "list-group-item searchItems",
        id: "list" + index,
      })
      .text(city);
    ulElement.append(searchItem);
  });
  $("#recentSearches").append(ulElement);
  $(".searchItems").on("click", renderRecentSearchSelection);
}

// Renders weather for recent search items if any of them are clicked
function renderRecentSearchSelection(data) {
  // Targets the city name of the city that has been clicked
  getWeatherForecast(data.target.text);
}

// Ajax call options
function generateAjaxOptions(forecastType, weatherType) {
  const ajaxOptions = {
    url: OPEN_WEATHER_URL + forecastType + weatherType + API_KEY,
    method: "GET",
  };
  //Returns the ajax call options
  return ajaxOptions;
}

// Renders forecasts for both current day and five day
function getWeatherForecast(lowerCaseCityName) {
  // Variables for weather types for current and 5 day forecast
  const currentDayWeatherType = "weather?q=";
  const fiveDayWeatherType = "forecast?q=";
  // Ajax call for current day forecast
  $.ajax(generateAjaxOptions(currentDayWeatherType, lowerCaseCityName)).then(
    renderCurrentForecast
  );
  // Ajax call for 5 day forecast
  $.ajax(generateAjaxOptions(fiveDayWeatherType, lowerCaseCityName)).then(
    renderFiveDayWeatherForecast
  );
}

function getUvIndexForecast(latAndLon) {
  const uvIndex = "uvi?";
  // Ajax call for uv index
  $.ajax(generateAjaxOptions(uvIndex, latAndLon)).then(uvIndexValue);
}

// Display the most recent weather search
displayDefaultWeatherForecast();
// Listens for any city name searches
$("form").submit(displayWeatherForecast);
