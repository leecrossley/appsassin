var appsassin = (function () {
    var appsassin = {},
        currentView,
        userId,
        game;

    // Called when the app is loaded
    appsassin.init = function () {
        overrideBackButton();
        userId = localStorage.getItem("userId");
        if (typeof (userId) !== "undefined" && userId !== null) {
            appsassin.switchView("main");
        } else {
            appsassin.switchView("signup");
        }
    };

    // Switches the HTML view
    appsassin.switchView = function (viewName, elementId, additionalCallback) {
        var fileName = viewName + ".html";
        if (!elementId) {
            if (viewName === currentView) {
                if (typeof (additionalCallback) == "function") {
                    additionalCallback();
                }
                return;
            }
            currentView = viewName;
            $("body").load(fileName, function() {
                appsassin[viewName].init();
                if (typeof (additionalCallback) == "function") {
                    additionalCallback();
                }
            });
        } else {
            $("#" + elementId).load(fileName, function() {
                appsassin[viewName].init(elementId);
                if (typeof (additionalCallback) == "function") {
                    additionalCallback();
                }
            });
        }
    };

    // Stop the Android back button being problematic
    function overrideBackButton() {
        document.addEventListener("backbutton", function(e) {
            e.preventDefault();
        }, false);
    }

    // Signup functionality
    appsassin.signup = (function () {
        var signup = {},
            number;

        signup.init = function () {
            $(".step1").show();
            $(".submit").bind("click", function(e) {
                e.preventDefault();
                e.stopPropagation();
                number = $(".number").val();
                if (number.length === 11) {
                    step2();
                } else {
                    alert("Please ensure your phone number is correct")
                }
            });
        };

        function step2() {
            $(".step1").hide();
            $(".step2").show();
            $(".upload").bind("click", function(e) {
                e.preventDefault();
                e.stopPropagation();
                navigator.camera.getPicture(cameraSuccess, cameraFail, {
                    quality: 49,
                    targetWidth: 320,
                    targetHeight: 320,
                    encodingType: Camera.EncodingType.JPEG,
                    cameraDirection: Camera.Direction.FRONT,
                    destinationType: Camera.DestinationType.DATA_URL
                });
            });
        }

        function cameraSuccess(imageData) {
            $(".step2").hide();
            $(".wait").show();
            server.signup(number, imageData, function(user) {
                console.log(user);
                localStorage.setItem("userId", user._id);
                appsassin.switchView("main");
            });
        }

        function cameraFail(message) {
            alert("Unable to retrieve photo: " + message);
            $(".wait").hide();
            $(".step2").show();
        }

        return signup;
    })();

    // Main screen - checking for active games in location
    appsassin.main = (function () {
        var main = {};

        main.init = function () {
            $(".wait").show();
            $(".submit").bind("click", function(e) {
                e.preventDefault();
                e.stopPropagation();
                main.init();
            });
            var options = {
                maximumAge: 3000,
                timeout: 5000,
                enableHighAccuracy: true
            };
            navigator.geolocation.getCurrentPosition(geolocationSuccess, geolocationError, options);
        };

        // Checks for games in the current location
        function geolocationSuccess(position) {
            server.getLocalGames(position.coords.latitude, position.coords.longitude, handleGames);
        }

        // Assigns any local games returned from the server
        function handleGames(games) {
            if (games && games.length > 0) {
                server.joinGame(games[0]._id, userId, otherPlayers);
            } else {
                alert("There are no local games available to join");
                $(".wait").hide();
                $(".check").show();
            }
        }

        // Waiting for other players
        function otherPlayers(game) {
            console.log(game);
            $(".wait").hide();
            $(".others").show();
        }

        function geolocationError(message) {
            alert("Unable to retrieve location: " + message);
            $(".wait").hide();
            $(".check").show();
        }

        return main;
    })();

    // Game screen - handles game play
    appsassin.game = (function () {
        var game = {};

        game.init = function () {
            var map = new Tracker.Map();
            // Tracks my position on the map
            map.watchPosition();
        };

        return game;
    })();

    return appsassin;
})();

// Cordova is ready, start appsassin
document.addEventListener("deviceready", appsassin.init, false);