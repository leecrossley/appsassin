var appsassin = (function () {
    var appsassin = {},
        currentView,
        userId,
        game;

    // Called when the app is loaded
    appsassin.init = function () {
        overrideBackButton();
        padiOS7StatusBar();
        userId = localStorage.getItem("userId");
        game = localStorage.getItem("game");
        if (typeof (userId) !== "undefined" && userId !== null) {
            appsassin.switchView("main");
        } else {
            appsassin.switchView("signup");
        }
    };

    // Add extra padding to the header for iOS 7
    function padiOS7StatusBar() {
        if (window.device && parseFloat(window.device.version) >= 7) {
            $("html").addClass("ios7");
        }
    }

    // Switches the HTML view
    appsassin.switchView = function (viewName, elementId) {
        var fileName = viewName + ".html";
        if (!elementId) {
            if (viewName === currentView) {
                return;
            }
            currentView = viewName;
            $("body").load(fileName, function() {
                appsassin[viewName].init();
            });
        } else {
            $("#" + elementId).load(fileName, function() {
                appsassin[viewName].init(elementId);
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
                    navigator.notification.alert("Please ensure your phone number is correct", null, "Appsassin");
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
            navigator.notification.alert("Unable to retrieve photo: " + message, null, "Appsassin");
            $(".wait").hide();
            $(".step2").show();
        }

        return signup;
    })();

    // Main screen - checking for active games in location
    appsassin.main = (function () {
        var main = {};

        main.init = function () {
            $(".submit").bind("click", function(e) {
                e.preventDefault();
                e.stopPropagation();
                checkForGame();
            });
            checkForGame();
        };

        // Checks to see if there is an active game or gets the current location
        function checkForGame() {
            $(".wait").show();
            $(".check").hide();
            if (game && game.status) {
                otherPlayers(game);
                return;
            }
            var options = {
                maximumAge: 3000,
                timeout: 30000,
                enableHighAccuracy: true
            };
            navigator.geolocation.getCurrentPosition(geolocationSuccess, geolocationError, options);
        }

        // Checks for games in the current location
        function geolocationSuccess(position) {
            server.getLocalGames(position.coords.latitude, position.coords.longitude, handleGames);
        }

        // Assigns any local games returned from the server
        function handleGames(games) {
            if (games && games.length > 0) {
                game = games[0];
                server.joinGame(games[0]._id, userId, otherPlayers);
            } else {
                navigator.notification.alert("There are no local games available to join", null, "Appsassin");
                $(".wait").hide();
                $(".check").show();
            }
        }

        // Wait for other players
        function otherPlayers(updatedGame) {
            if (game && game.state) {
                game = updatedGame;
            }
            if (game.state === "inprogress") {
                appsassin.switchView("game");
            } else {
                $(".wait").hide();
                $(".others").show();
                setTimeout(function() {
                    server.getGame(game._id, otherPlayers);
                }, 5000);
            }
        }

        function geolocationError(error) {
            navigator.notification.alert("Unable to retrieve location: " + error.message, null, "Appsassin");
            $(".wait").hide();
            $(".check").show();
        }

        return main;
    })();

    // Game screen - handles game play
    appsassin.game = (function () {
        var game = {};

        game.init = function () {
            var options = {
                "user": userId,
                "game": game._id
            };
            var map = new Tracker.Map(options);
            // Tracks my position on the map
            map.watchPosition();
            
            $(".shoot").bind("click", function(e) {
                e.preventDefault();
                e.stopPropagation();
                navigator.camera.getPicture(cameraSuccess, cameraFail, {
                    quality: 49,
                    targetWidth: 320,
                    targetHeight: 320,
                    encodingType: Camera.EncodingType.JPEG,
                    cameraDirection: Camera.Direction.BACK,
                    destinationType: Camera.DestinationType.DATA_URL
                });
            });
        };

        function cameraSuccess(result) {
            alert("TODO validate kill");
        }

        function cameraFail(message) {
            navigator.notification.alert("Unable to validate kill: " + message, null, "Appsassin");
        }

        return game;
    })();

    return appsassin;
})();

// Cordova is ready, start appsassin
document.addEventListener("deviceready", appsassin.init, false);