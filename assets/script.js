var APIkey = "cc1cb311d206444f71b5881ecfd1d53c"
var dateToday = moment().format('L');
var lat = ""
var lon = ""
var weatherCards = $("#weatherCards");

$(document).ready(function(){

    function getFutureCast(){
        var queryURL = "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lon + "&exclude=minutely,hourly&appid=" + APIkey;

        $.ajax({
            url: queryURL,
            method: "GET"
        }).then(function(response){
            console.log(response);
            $("#uv").text("UV Index: ");
            var uvDiv = $('<tr>').text(response.current.uvi)
            uvDiv.attr('id', 'uvDiv')
            $("#uv").append(uvDiv)
            
            for( var i = 0; i < 5; i++){
                let thisAjax = response.daily[i]
                let futureTemp = $("<div>").text("Temp: " + Math.round(((thisAjax.temp.day - 273.15)*1.8 +32)*10)/10 + "F");
                let futureHumidity = $("<div>").text("Humidity: " + thisAjax.humidity + "%");
                $(".card-body" + [i]).append(futureTemp, futureHumidity);
                $(".futureDate" + [i]).text(moment().add([i + 1], 'days').format('L'));
                var weatherImg = thisAjax.weather.icon
                console.log(weatherImg)
             

                
                
                
            }

        })//inside AJAX
    }//inside futureCast




    $(document).on('click', '.btn', function(event){
        event.preventDefault();

        var cityName = $("input").val()
        var queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + cityName + "&appid=" + APIkey;
        let UVdiv = ('<div>')
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
            getFutureCast()
        })//everything above this is inside the first AJAX

    })//everything above this is on click of search button

})