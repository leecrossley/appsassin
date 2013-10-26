var appsassin = (function () {
    var appsassin = {},
        currentView,
        user;

    appsassin.init = function () {
        overrideBackButton();
        user = localStorage.getItem("number");
        if (typeof (user) !== "undefined" && user !== null) {
            appsassin.switchView("main");
        } else {
            appsassin.switchView("signup");
        }
    };

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

    function overrideBackButton() {
        document.addEventListener("backbutton", function(e) {
            e.preventDefault();
        }, false);
    }

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
        }

        return signup;
    })();

    appsassin.main = (function () {
        var main = {};

        main.init = function () {
            $(".wait").show();
        };

        return main;
    })();

    return appsassin;
})();

document.addEventListener("deviceready", appsassin.init, false);