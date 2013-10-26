var appsassin = (function () {
    var appsassin = {},
        currentView;

    appsassin.init = function () {
        overrideBackButton();
        appsassin.switchView("signup");
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
        var signup = {};

        function cameraSuccess(imageData) {
            server.signup("07123456789", imageData, function() {
                alert("success?");
            });
        }

        function cameraFail(message) {
            alert("Unable to retrieve photo: " + message);
        }

        signup.init = function () {
            $(".upload").bind("click", function(e) {
                e.preventDefault();
                e.stopPropagation();
                navigator.camera.getPicture(cameraSuccess, cameraFail, {
                    quality: 50,
                    destinationType: Camera.DestinationType.DATA_URL
                });
            });
        };

        return signup;
    })();

    return appsassin;
})();

document.addEventListener("deviceready", appsassin.init, false);