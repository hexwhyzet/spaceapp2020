function addStationsToLayer(layer, groundStations) {
    var placemarkAttributes = new WorldWind.PlacemarkAttributes(null);
    placemarkAttributes.imageSource = "resources/icons/ground-station.png";
    placemarkAttributes.imageScale = 0.5;
    placemarkAttributes.imageOffset = new WorldWind.Offset(
        WorldWind.OFFSET_FRACTION, 0.3,
        WorldWind.OFFSET_FRACTION, 0.0);
    placemarkAttributes.imageColor = WorldWind.Color.WHITE;
    placemarkAttributes.labelAttributes.offset = new WorldWind.Offset(
        WorldWind.OFFSET_FRACTION, 0.5,
        WorldWind.OFFSET_FRACTION, 1.0);
    placemarkAttributes.labelAttributes.color = WorldWind.Color.WHITE;

    for (var i = 0, len = groundStations.length; i < len; i++) {
        var groundStation = groundStations[i];

        var placemark = new WorldWind.Placemark(new WorldWind.Position(groundStation.latitude,
            groundStation.longitude,
            1e3));

        placemark.altitudeMode = WorldWind.RELATIVE_TO_GROUND;
        placemark.label = groundStation.name;
        placemark.attributes = placemarkAttributes;

        layer.addRenderable(placemark);
    }
}

function addTracesToLayer(layer, satrec) {
    var now = new Date();
    var pastOrbit = [];
    var futureOrbit = [];
    var currentPosition = null;
    for (var i = -98; i <= 98; i++) {
        var time = new Date(now.getTime() + i * 60000);

        var position = getPosition(satrec, time)

        if (i < 0) {
            pastOrbit.push(position);
        } else if (i > 0) {
            futureOrbit.push(position);
        } else {
            currentPosition = new WorldWind.Position(position.latitude,
                position.longitude,
                position.altitude);
            pastOrbit.push(position);
            futureOrbit.push(position);
        }
    }

// Orbit Path
    var pathAttributes = new WorldWind.ShapeAttributes(null);
    pathAttributes.outlineColor = WorldWind.Color.RED;
    pathAttributes.interiorColor = new WorldWind.Color(1, 0, 0, 0.5);

    var pastOrbitPath = new WorldWind.Path(pastOrbit);
    pastOrbitPath.altitudeMode = WorldWind.RELATIVE_TO_GROUND;
    pastOrbitPath.attributes = pathAttributes;

    var pathAttributes = new WorldWind.ShapeAttributes(pathAttributes);
    pathAttributes.outlineColor = WorldWind.Color.GREEN;
    pathAttributes.interiorColor = new WorldWind.Color(0, 1, 0, 0.5);

    var futureOrbitPath = new WorldWind.Path(futureOrbit);
    futureOrbitPath.altitudeMode = WorldWind.RELATIVE_TO_GROUND;
    futureOrbitPath.attributes = pathAttributes;

    layer.addRenderable(pastOrbitPath);
    layer.addRenderable(futureOrbitPath);
}

function addOrbitObjectToLayer(layer, objectPosition, label, color=WorldWind.Color.WHITE, imageScale=0.2, labelScale=0.65) {
    var placemarkAttributes = new WorldWind.PlacemarkAttributes(null);
    placemarkAttributes.imageSource = "resources/icons/satellite.png";
    placemarkAttributes.imageScale = imageScale;
    placemarkAttributes.imageOffset = new WorldWind.Offset(
        WorldWind.OFFSET_FRACTION, 0.5,
        WorldWind.OFFSET_FRACTION, 0.5);
    placemarkAttributes.imageColor = color;
    placemarkAttributes.labelAttributes.offset = new WorldWind.Offset(
        WorldWind.OFFSET_FRACTION, 0.5,
        WorldWind.OFFSET_FRACTION, 1.0);
    placemarkAttributes.labelAttributes.color = color;
    placemarkAttributes.labelAttributes.scale = labelScale

    var highlightPlacemarkAttributes = new WorldWind.PlacemarkAttributes(placemarkAttributes);
    highlightPlacemarkAttributes.imageScale = 1.2;

    var placemark = new WorldWind.Placemark(objectPosition);
    updateLatitudeLongitudeAltitude(objectPosition);

    placemark.altitudeMode = WorldWind.RELATIVE_TO_GROUND;
    placemark.label = label + "\n" + altitudeToString(objectPosition.altitude);
    placemark.attributes = placemarkAttributes;
    placemark.highlightAttributes = highlightPlacemarkAttributes;

    layer.addRenderable(placemark);

    return placemark
}

function altitudeToString(altitude) {
    return (Math.round(altitude / 10) / 100).toString() + "km"
}

function getPosition(satrec, time) {
    var position_and_velocity = satellite.propagate(satrec,
        time.getUTCFullYear(),
        time.getUTCMonth() + 1,
        time.getUTCDate(),
        time.getUTCHours(),
        time.getUTCMinutes(),
        time.getUTCSeconds());
    var position_eci = position_and_velocity["position"];

    var gmst = satellite.gstime(time.getUTCFullYear(),
        time.getUTCMonth() + 1,
        time.getUTCDate(),
        time.getUTCHours(),
        time.getUTCMinutes(),
        time.getUTCSeconds());

    var position_gd = satellite.eciToGeodetic(position_eci, gmst);
    var latitude = satellite.degreesLat(position_gd["latitude"]);
    var longitude = satellite.degreesLong(position_gd["longitude"]);
    var altitude = position_gd["height"] * 1000;

    return new WorldWind.Position(latitude, longitude, altitude);
}