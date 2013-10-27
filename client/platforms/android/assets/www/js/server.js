var server = (function () {
    var server = {},
        serverUrl = "http://appsass.in/api/v1";

    function doPost(route, data, callback) {
        $.ajax({
            type: "POST",
            url: serverUrl + route,
            dataType: "json",
            contentType: "application/json",
            data: JSON.stringify(data)
        })
        .fail(function(err) {
            console.log(err);
        })
        .always(callback);
    }

    function doGet(route, callback) {
        $.ajax({
            type: "GET",
            url: serverUrl + route
        })
        .always(callback);
    }

    server.signup = function (number, photo, callback) {
        console.log("signing up...");
        var data = {
            "username": number,
            "defaultImage": photo
        };
        doPost("/Users", data, callback);
    };

    server.getLocalGames = function (lat, lng, callback) {
        console.log("getting games...");
        /*var data = {
            "lat": lat,
            "long": lng
        };*/
        doGet("/opengames", callback);
    };

    server.joinGame = function (gameId, userId, callback) {
        console.log("joining game " + gameId + "...");
        var data = {
            "id": userId
        };
        doPost("/joingame/" + gameId, data, callback);
    };

    server.getGame = function (gameId, callback) {
        console.log("getting game " + gameId + "...");
        doGet("/games/" + gameId, callback);
    };

    server.sendLocation = function (gameId, userId, lng, lat, callback) {
        console.log("sending location...");
        var data = {
            "gameId": gameId,
            "userId": userId,
            "lng": lng,
            "lat": lat
        };
        doPost("/location/track", data, callback);
    };

    server.eliminateTarget = function (user, photo, callback) {
        console.log("killing...");
        var data = {
            "username": user,
            "image": photo
        };
        doPost("/eliminate", data, callback);
    };

    return server;
})();