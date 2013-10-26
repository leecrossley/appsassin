var server = (function () {
    var server = {},
        serverUrl = "http://appsass.in/api/v1";

    function doPost(route, data, callback) {
        $.ajax({
            type: "POST",
            url: serverUrl + route,
            data: data
        })
        .fail(function(err) {
            throw JSON.stringify(err);
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
        var data = {
            "username": number,
            "defaultImage": photo
        };
        doPost("/user", data, callback);
    };

    return server;
})();