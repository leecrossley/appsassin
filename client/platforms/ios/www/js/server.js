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
        console.log("posting...");
    };

    return server;
})();