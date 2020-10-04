function addObjectsToLayer(layer, objects) {
    for (let i = 0, len = objects.length; i < len; i++) {
        layer.addRenderable(objects[i].placeMark)
    }
}

function updateObjects(objects) {
    for (let i = 0, len = objects.length; i < len; i++) {
        objects[i].update()
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

function altitudeToString(altitude) {
    return (Math.round(altitude / 10) / 100).toString() + "km"
}

function createCatcher(groundObj, targetObj) {
    catcherObjects.push(new Catcher("Catcher", new WorldWind.Position(groundObj.position.latitude, groundObj.position.longitude, 1e3), targetObj))
    addObjectsToLayer(catcherLayer, catcherObjects)
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