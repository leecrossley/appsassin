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
            var point, circle;

            point = new OpenLayers.Geometry.Point(position.coords.longitude, position.coords.latitude)
                .transform(
                    new OpenLayers.Projection("EPSG:4326"),
                    self.map.getProjectionObject()
                );

            self.drawMarker(point);

            if (options.accuracy) {
                circle = new OpenLayers.Feature.Vector(
                    OpenLayers.Geometry.Polygon.createRegularPolygon(
                        point,
                        position.coords.accuracy / 2,
                        40,
                        0
                    ),
                    {},
                    {
                        fillColor: "#AFEEEE",
                        fillOpacity: 0.3,
                        strokeWidth: 2,
                        strokeColor: "#0EE"
                    }
                );

                self.vector.addFeatures(circle);
            }

            if (options.radius) {
                self.drawGeoFence(options.origin, options.radius, options.sides);
            }

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
                    strokeColor: '#4A777A',
                    strokeWidth: 1,
                    fillOpacity: 1,
                    pointRadius: 9,
                    fillColor: '#008B8B'
                }
            )
        );
    }

    Tracker.Map.prototype.drawGeoFence = function (origin, radius, sides) {
        var circle, modifyControl, point, center, layer;

        center = origin || this.vector.features[0].geometry.getBounds().getCenterLonLat();
        point = new OpenLayers.Geometry.Point(center.lon, center.lat);
        circle = new OpenLayers.Feature.Vector(
            OpenLayers.Geometry.Polygon.createRegularPolygon(point, radius || 10, sides || 40, 0),
            {},
            {
                fillColor: '#F87431',
                fillOpacity: 0.2,
                strokeWidth: 2,
                strokeColor: '#C35817'
            }
        );


        layer = new OpenLayers.Layer.Vector('fence');
        this.map.addLayer(layer);
        layer.addFeatures(circle);

        modifyControl = new OpenLayers.Control.ModifyFeature(layer);
        modifyControl.mode = OpenLayers.Control.ModifyFeature.RESIZE;

        layer.events.register('featuremodified', circle, function (event) {
            var bounds = event.feature.geometry.bounds;
            console.log(bounds);
        });

        this.map.addControls([modifyControl]);
        modifyControl.activate();

        this.map.zoomToExtent(layer.getDataExtent());
    };

    Tracker.Map.prototype.getProjectionObject = function() {
        return this.map.getProjectionObject();
    }
}());