var appsassin = (function () {
    var appsassin = {},
        currentView;

    appsassin.init = function () {
        overrideBackButton();
        appsassin.switchView("signup");
    };

    appsassin.switchView = function (viewName, elementId, additionalCallback) {
        var fileName = appsassin.filePath + viewName + ".html";
        if (!elementId) {
            if (viewName === currentView) {
                if (typeof (additionalCallback) == "function") {
                    additionalCallback();
                }
                return;
            }
            currentView = viewName;
            $("body").load(fileName, function() {
                appsassin[viewName].init(elementId);
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

        signup.init = function () {

        };

        return signup;
    })();

    return appsassin;
})();

document.addEventListener("deviceready", appsassin.init, false);