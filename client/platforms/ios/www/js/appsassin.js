var appsassin = (function () {
    var appsassin = {},
        currentView,
        user;

    // Called when the app is loaded
    appsassin.init = function () {
        overrideBackButton();
        user = localStorage.getItem("number");
        if (typeof (user) !== "undefined" && user !== null) {
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
                    quality: 60,
                    targetWidth: 320,
                    destinationType: Camera.DestinationType.DATA_URL
                });
            });
        }

        function cameraSuccess(imageData) {
            $(".step2").hide();
            $(".wait").show();
            server.signup(number, imageData, function() {
                localStorage.setItem("number", number);
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

        function geolocationSuccess(position) {
            alert("Lat: " + position.coords.latitude);
            alert("Long: " + position.coords.longitude);
        }

        function geolocationError(message) {
            alert("Unable to retrieve location: " + message);
            $(".wait").hide();
            $(".check").show();
        }

        return main;
    })();

    return appsassin;
})();

document.addEventListener("deviceready", appsassin.init, false);