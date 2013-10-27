var Tracker = Tracker || {};
(function () {
    Tracker.Map = function (opt) {
        var resize, options, self, poll = true;

        if (!(this instanceof Tracker.Map)) {
            return new Tracker.Map(opt);
        }

        options = opt || {};

        this.map = new OpenLayers.Map({
            div: options.element || "map",
            projection: options.projection || new OpenLayers.Projection("EPSG:4326"),
            numZoomLevels: options.numZoomLevels || 18,
            controls: [
                new OpenLayers.Control.TouchNavigation({
                    dragPanOptions: {
                        enableKinetic: true
                    }
                }),
                new OpenLayers.Control.Zoom()
            ],
            layers: [
                new OpenLayers.Layer.OSM("OpenStreetMap", null, {
                    transitionEffect: "resize"
                })
            ]
        });

        this.vector = new OpenLayers.Layer.Vector("vector");
        this.map.addLayer(this.vector);

        self = this;

        this.watchedPosition = function (position) {
            var point = new OpenLayers.Geometry.Point(position.coords.longitude, position.coords.latitude)
                .transform(new OpenLayers.Projection("EPSG:4326"), self.map.getProjectionObject());

            self.drawMyMarker(point);
            self.map.zoomToExtent(self.vector.getDataExtent());
        };
    };

    Tracker.Map.prototype.watchPosition = function () {
        var options = {
            maximumAge: 3000,
            timeout: 30000,
            enableHighAccuracy: true
        };
        this.watchId = navigator.geolocation.watchPosition(this.watchedPosition, function(e) {
            console.log(e);
        }, options);
    };

    Tracker.Map.prototype.clearWatch = function () {
        navigator.geolocation.clearWatch(this.watchId);
    };

    Tracker.Map.prototype.drawMyMarker = function (point) {
        if (this.myCurrentVector) {
            this.vector.removeFeatures(this.myCurrentVector);
            this.myCurrentVector.destroy();
        }
        this.myCurrentVector = new OpenLayers.Feature.Vector(
            point,
            {},
            {
                strokeColor: "#4A777A",
                strokeWidth: 1,
                fillOpacity: 1,
                pointRadius: 9,
                fillColor: "#008B8B"
            }
        );
        this.vector.addFeatures(this.myCurrentVector);
    };

    Tracker.Map.prototype.drawTargetMarker = function (point) {
        if (this.myTargetVector) {
            this.vector.removeFeatures(this.myTargetVector);
            this.myTargetVector.destroy();
        }
        this.myTargetVector = new OpenLayers.Feature.Vector(
            point,
            {},
            {
                strokeColor: "#9F000F",
                strokeWidth: 1,
                fillOpacity: 1,
                pointRadius: 9,
                fillColor: "#E41B17"
            }
        );
        this.vector.addFeatures(this.myTargetVector);
    };

}());