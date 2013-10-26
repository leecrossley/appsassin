var Tracker = Tracker || {};
(function () {
    Tracker.Map = function (opt) {
        var resize, options, self;

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

            self.drawMarker(point);

            self.map.zoomToExtent(self.vector.getDataExtent());
        };
    }

    Tracker.Map.prototype.watchPosition = function () {
        var options = {
            maximumAge: 3000,
            timeout: 5000,
            enableHighAccuracy: true
        };
        this.watchId = navigator.geolocation.watchPosition(this.watchedPosition, function(e) {
            console.log(e) }, options);
    }

    Tracker.Map.prototype.clearWatch = function () {
        navigator.geolocation.clearWatch(this.watchId);
    }

    Tracker.Map.prototype.drawMarker = function (point) {
        this.vector.addFeatures(
            new OpenLayers.Feature.Vector(
                point,
                {},
                {
                    strokeColor: "#4A777A",
                    strokeWidth: 1,
                    fillOpacity: 1,
                    pointRadius: 9,
                    fillColor: "#008B8B"
                }
            )
        );
    }
}());