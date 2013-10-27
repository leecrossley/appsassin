var appsassin = (function () {
    var appsassin = {},
        currentView;
        
    appsassin.userId = null;
    appsassin.currentGame = null;

    // Called when the app is loaded
    appsassin.init = function () {
        overrideBackButton();
        padiOS7StatusBar();
        appsassin.userId = localStorage.getItem("userId");
        appsassin.currentGame = localStorage.getItem("game");
        if (typeof (appsassin.userId) !== "undefined" && appsassin.userId !== null) {
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
                localStorage.setItem("userId", user._id);
                appsassin.userId = user._id;
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
            if (appsassin.currentGame && appsassin.currentGame.state) {
                otherPlayers(appsassin.currentGame);
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
                appsassin.currentGame = games[0];
                localStorage.setItem("game", appsassin.currentGame);
                server.joinGame(games[0]._id, appsassin.userId, otherPlayers);
            } else {
                navigator.notification.alert("There are no local games available to join", null, "Appsassin");
                $(".wait").hide();
                $(".check").show();
            }
        }

        // Wait for other players
        function otherPlayers(updatedGame) {
            if (appsassin.currentGame && appsassin.currentGame.state) {
                appsassin.currentGame = updatedGame;
                localStorage.setItem("game", appsassin.currentGame);
            }
            if (appsassin.currentGame.state === "inprogress") {
                appsassin.switchView("game");
            } else {
                $(".wait").hide();
                $(".others").show();
                setTimeout(function() {
                    server.getGame(appsassin.currentGame._id, otherPlayers);
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
        var game = {},
            map;

        game.init = function () {
            map = new Tracker.Map();
            // Tracks position on the map
            map.watchPosition();
            trackGame();
            
            $(".shoot").bind("click", function(e) {
                $(".shoot").hide();
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

        // Uses the server data to determine if you're still alive :)
        game.isStillAlive = function () {
            if (appsassin.currentGame.kills && appsassin.currentGame.kills.length > 0) {
                var i = 0;
                while (i < appsassin.currentGame.kills.length) {
                    var kill = appsassin.currentGame.kills[i];
                    if (kill.victim === appsassin.userId) {
                        return false;
                    }
                    i++;
                }
            }
            return true;
        };

        // Polls the server and keeps track of the game status
        function trackGame(game) {
            if (game && game.state) {
                appsassin.currentGame = game;
                localStorage.setItem("game", appsassin.currentGame);
            }
            if (appsassin.currentGame.state === "complete") {
                map.clearWatch();
                appsassin.switchView("complete");
            } else {
                if (appsassin.game.isStillAlive()) {
                    setTimeout(function() {
                        server.getGame(appsassin.currentGame._id, trackGame);
                    }, 5000);
                } else {
                    map.clearWatch();
                    appsassin.switchView("complete");
                }
            }
        }

        // Shot data captured
        function cameraSuccess(imageData) {
            server.shootTarget(appsassin.user, imageData, appsassin.currentGame._id, shotResult);
        }

        // The result of the shot from the server (hit / miss, based on image recognition)
        function shotResult(result) {
            if (result && result.status === "hit") {
                navigator.notification.alert("Direct Hit!", null, "Appsassin");
                if (appsassin.currentGame.state !== "complete") {
                    setTimeout(function() {
                        navigator.notification.alert("You have a new target...", null, "Appsassin");
                    }, 5000);
                }
            } else {
                $(".shoot").show();
            }
        }

        function cameraFail(message) {
            navigator.notification.alert("Unable to validate kill: " + message, null, "Appsassin");
            $(".shoot").show();
        }

        return game;
    })();

    // Game complete (either you have been killed or have won)
    appsassin.complete = (function () {
        var complete = {};

        // Show the end game screen
        complete.init = function () {
            if (appsassin.game.isStillAlive()) {
                $(".winner").show();
            } else {
                $(".loser").show();
            }
            $(".reset").bind("click", function(e) {
                e.preventDefault();
                e.stopPropagation();
                appsassin.init();
            });
            localStorage.setItem("game", null);
            appsassin.currentGame = null;
        };

        return complete;
    })();

    return appsassin;
})();

// Cordova is ready, start appsassin
document.addEventListener("deviceready", appsassin.init, false);