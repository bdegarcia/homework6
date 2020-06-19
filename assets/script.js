var APIkey = "cc1cb311d206444f71b5881ecfd1d53c"
var dateToday = moment().format('L');
var lat = ""
var lon = ""
var weatherCards = $("#weatherCards");
var pastSearches = ""
var cards = $(".card")
var pastCitySearch

$(document).ready(function(){

    function getFutureCast(){
        var queryURL = "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lon + "&exclude=minutely,hourly&appid=" + APIkey;

        $.ajax({
            url: queryURL,
            method: "GET"
        }).then(function(response){
            console.log(response);
            var uvDiv = $("#uv")
            uvDiv.text("UV Index: " + response.current.uvi)
            uvDiv.attr('id', 'uvDiv')
            $("#uv").append(uvDiv)
            cards.show()
            
            for( var i = 0; i < 5; i++){
                let add = i + 1
                let thisAjax = response.daily[i]
                let cardDiv = $("#card" + i)
                let futureTemp = $("<div>").text("Temp: " + Math.round(((thisAjax.temp.day - 273.15)*1.8 +32)*10)/10 + "F");
                let futureHumidity = $("<div>").text("Humidity: " + thisAjax.humidity + "%");
                let futureDate = $("<h5>").text(moment().add(add, 'day').format('MM/DD/YYYY'));
                let weatherCode = thisAjax.weather[0].icon
                let weatherImg = "http://openweathermap.org/img/wn/" + weatherCode + "@2x.png";

                console.log(weatherImg)
                let weatherPic = $("<img>");
                weatherPic.attr("src", weatherImg);
                let weatherDesc = $("<div>").text(thisAjax.weather[0].main)
                cardDiv.append(futureDate, futureTemp, futureHumidity, weatherPic);
            }//inside for loop
        })//inside AJAX
    }//inside futureCast

    function updateLocalStorage(city){
        pastSearches = city
        localStorage.setItem('pastSearches', pastSearches)
    }

    function pullLocalStorage(city){
        pastCitySearch = localStorage.getItem('pastSearches')
        let searches = $('<div>');
        searches.attr('class', 'past-searches')
        searches.text(pastCitySearch);
        $('#past-searches').prepend(searches);
        };

    function getCurrentWeather(cityName){
        var queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + cityName + "&appid=" + APIkey;
        let UVdiv = ('<div>')
        $('.card').empty()
        $.ajax({
            url: queryURL,
            method: "GET"
        }).then(function(response){
            console.log(response)
            $("#city-disp").text(response.name + "(" + dateToday + ")" )
            var temp = Math.round(((response.main.temp - 273.15)*1.8 +32)*10)/10
            $("#temp").text("Temperature: " + temp)
            $("#humidity").text("Humidity: " + response.main.humidity + "%")
            $("#wind-speed").text("Wind Speed: " + response.wind.speed + "MPH")
            lon = response.coord.lon
            lat = response.coord.lat
            console.log(cityName)
        })//everything above this is inside the first AJAX
        updateLocalStorage(cityName)
        pullLocalStorage(cityName);
        setTimeout(function(){
            getFutureCast();
        },
            200);
    }

    $(document).on('click', '.btn', function(event){
        event.preventDefault();
        var cityName = $("input").val()
        cityName = cityName.toUpperCase()
        getCurrentWeather(cityName)
    })//everything above this is on click of search button

    $(document).on('click', '.past-searches', function(event){
        event.preventDefault();
        let pastCitySearch = $(".past-searches").text();
        console.log(pastCitySearch)
        getCurrentWeather(pastCitySearch)
    });

    pullLocalStorage();
    cards.hide()
})