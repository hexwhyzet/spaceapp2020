// This is a minimal satellite tracker web app built around Web WorldWind and Satellite.js
// based around Yann Voumard's work: https://github.com/AkeluX

// import data from "./data/junk_elem_example.json"

// Update latitude, longitude and altitude in the DOM
var latitudePlaceholder = document.getElementById('latitude');
var longitudePlaceholder = document.getElementById('longitude');
var altitudePlaceholder = document.getElementById('altitude');

function updateLatitudeLongitudeAltitude(position) {
    latitudePlaceholder.textContent = degreesToText(position.latitude, 'NS');
    longitudePlaceholder.textContent = degreesToText(position.longitude, 'EW');
    altitudePlaceholder.textContent = (Math.round(position.altitude / 10) / 100) + "km";
}

// WorldWind's base Layers
var bmngOneImageLayer = new WorldWind.BMNGOneImageLayer();
var bmngLayer = new WorldWind.BMNGLayer();
var atmosphereLayer = new WorldWind.AtmosphereLayer();
var starfieldLayer = new WorldWind.StarFieldLayer();

// Ground Stations Layer
var groundStations = [
    {name: 'Matera, Italy', latitude: 40.65, longitude: 16.7},
    {name: 'Svalbard, Norway', latitude: 78.2306, longitude: 15.3894},
    {name: 'Maspalomas, Spain', latitude: 27.7629, longitude: -15.6338},
];

var groundStationsLayer = new WorldWind.RenderableLayer("Ground Stations");

addStationsToLayer(groundStationsLayer, groundStations)

// Orbit Propagation (MIT License, see https://github.com/shashwatak/satellite-js)

var tle_line_1 = '1 39634U 14016A   15092.10425777 -.00000062  00000-0 -35354-5 0  9992'
var tle_line_2 = '2 39634  98.1809 100.2577 0001271  80.6097 279.5256 14.59197994 52994'
var satrec = satellite.twoline2satrec(tle_line_1, tle_line_2);

var orbitLayer = new WorldWind.RenderableLayer("Orbit");

addTracesToLayer(orbitLayer, satrec)

var time = new Date();
var position = getPosition(satrec, time)
currentPosition = new WorldWind.Position(position.latitude,
    position.longitude,
    position.altitude);

var satelliteLayer = new WorldWind.RenderableLayer("Satellite");

addOrbitObjectToLayer(satelliteLayer, currentPosition, "Santinel 1A")

const big_json = [{
    "CCSDS_OMM_VERS": "2.0",
    "COMMENT": "GENERATED VIA SPACE-TRACK.ORG API",
    "CREATION_DATE": "2020-10-03T04:36:52",
    "ORIGINATOR": "18 SPCS",
    "OBJECT_NAME": "STARLINK-1288",
    "OBJECT_ID": "2020-019N",
    "CENTER_NAME": "EARTH",
    "REF_FRAME": "TEME",
    "TIME_SYSTEM": "UTC",
    "MEAN_ELEMENT_THEORY": "SGP4",
    "EPOCH": "2020-10-02T22:00:00.999936",
    "MEAN_MOTION": "15.05559606",
    "ECCENTRICITY": "0.00014390",
    "INCLINATION": "53.0007",
    "RA_OF_ASC_NODE": "72.1220",
    "ARG_OF_PERICENTER": "90.3945",
    "MEAN_ANOMALY": "80.0162",
    "EPHEMERIS_TYPE": "0",
    "CLASSIFICATION_TYPE": "U",
    "NORAD_CAT_ID": "45372",
    "ELEMENT_SET_NO": "999",
    "REV_AT_EPOCH": "175",
    "BSTAR": "0.00253380000000",
    "MEAN_MOTION_DOT": "0.00036811",
    "MEAN_MOTION_DDOT": "0.0000000000000",
    "SEMIMAJOR_AXIS": "6927.925",
    "PERIOD": "95.645",
    "APOAPSIS": "550.787",
    "PERIAPSIS": "548.793",
    "OBJECT_TYPE": "PAYLOAD",
    "RCS_SIZE": "LARGE",
    "COUNTRY_CODE": "US",
    "LAUNCH_DATE": "2020-03-18",
    "SITE": "AFETR",
    "DECAY_DATE": null,
    "FILE": "2840435",
    "GP_ID": "162646467",
    "TLE_LINE0": "0 STARLINK-1288",
    "TLE_LINE1": "1 45372U 20019N   20276.91667824 +.00036811 +00000-0 +25338-2 0  9995",
    "TLE_LINE2": "2 45372 053.0007 072.1220 0001439 090.3945 080.0162 15.05559606001751"
}]

var junkLayer = new WorldWind.RenderableLayer("Junk");

junkPositions = []

for (var i = 0; i < big_json.length; i++) {
    var json = big_json[i];

    var junk_tle_line_1 = json["TLE_LINE1"]
    var junk_tle_line_2 = json["TLE_LINE2"]
    var junk_satrec = satellite.twoline2satrec(junk_tle_line_1, junk_tle_line_2);

    var junk_position = getPosition(junk_satrec, time)

    junkPositions.push([junk_position, junk_satrec]);

    addOrbitObjectToLayer(junkLayer, junk_position, json["OBJECT_NAME"])
}

var catcherLayer = new WorldWind.RenderableLayer("Catcher");

catchersPositions = []

function createCatcher(groundStation, targetSatrec) {
    var newCatcherPosition = new WorldWind.Position(groundStation.latitude, groundStation.longitude, 1e3)
    catchersPositions.push([newCatcherPosition, targetSatrec])
    addOrbitObjectToLayer(catcherLayer, newCatcherPosition, "Catcher", WorldWind.Color.RED, 0.8, 0.8)
}

function getNewCatcherPosition(catcherPosition, targetPosition) {
    var catcherLocation = new WorldWind.Location(catcherPosition.latitude, catcherPosition.longitude)
    var targetLocation = new WorldWind.Location(targetPosition.latitude, targetPosition.longitude)
    var resultLocation = new WorldWind.Location()
    WorldWind.Location.interpolateGreatCircle(0.01, catcherLocation, targetLocation, resultLocation)
    var newPosition = new WorldWind.Position(resultLocation.latitude, resultLocation.longitude, targetPosition.altitude)
    return newPosition
}


// Update WorldWindow
var wwd = new WorldWind.WorldWindow("wwd");
wwd.drawContext.clearColor = WorldWind.Color.colorFromBytes(0, 0, 0, 0);
wwd.addLayer(bmngOneImageLayer);
wwd.addLayer(bmngLayer);
wwd.addLayer(atmosphereLayer);
wwd.addLayer(starfieldLayer);
wwd.addLayer(groundStationsLayer);
wwd.addLayer(junkLayer);
wwd.addLayer(catcherLayer);
// wwd.addLayer(orbitLayer);
wwd.addLayer(satelliteLayer);


wwd.deepPicking = true;
var highlightedItems = [];

var handlePick = function (o) {

    var x = o.clientX,
        y = o.clientY;

    var redrawRequired = highlightedItems.length > 0; // must redraw if we de-highlight previously picked items


    for (var h = 0; h < highlightedItems.length; h++) {
        highlightedItems[h].highlighted = false;
    }
    highlightedItems = [];


    var pickList = wwd.pick(wwd.canvasCoordinates(x, y));
    if (pickList.objects.length > 0) {
        redrawRequired = true;
    }

    if (pickList.objects.length > 0) {
        var numShapesPicked = 0;
        for (var p = 0; p < pickList.objects.length; p++) {
            pickList.objects[p].userObject.highlighted = true;


            highlightedItems.push(pickList.objects[p].userObject);

            if (pickList.objects[p].labelPicked) {
                
            }

console.log(pickList.objects[p])
            if (!pickList.objects[p].isTerrain) {
                ++numShapesPicked;
            }
        }

        // if (numShapesPicked > 0) {
        //     console.log(numShapesPicked + " shapes picked");
        // }
    }


    if (redrawRequired) {
        wwd.redraw();
    }
};

wwd.addEventListener("mousemove", handlePick);
var tapRecognizer = new WorldWind.TapRecognizer(wwd, handlePick);



//Responsive altitude on devices
if (screen.width > 900) {
    wwd.navigator.range = 4e7;
} else {
    wwd.navigator.range = 1e7;
}

// Globe
var globe = wwd.globe;

// Map
var map = new WorldWind.Globe2D();
map.projection = new WorldWind.ProjectionEquirectangular();

// Navigation
wwd.navigator.lookAtLocation = new WorldWind.Location(currentPosition.latitude,
    currentPosition.longitude);

// Draw
wwd.redraw();

// Update Satellite Position
var follow = false;

createCatcher(groundStations[0], junkPositions[0][1])

window.setInterval(function () {
    var position = getPosition(satrec, new Date());
    currentPosition.latitude = position.latitude;
    currentPosition.longitude = position.longitude;
    currentPosition.altitude = position.altitude;

    for (var i = 0; i < junkPositions.length; i++) {
        var newPosition = getPosition(junkPositions[i][1], new Date());
        junkPositions[i][0].latitude = newPosition.latitude;
        junkPositions[i][0].longitude = newPosition.longitude;
        junkPositions[i][0].altitude = newPosition.altitude;
    }

    for (var i = 0; i < catchersPositions.length; i++) {
        var targetPosition = getPosition(catchersPositions[i][1], new Date());
        var oldCatcherPosition = catchersPositions[i][0];
        var newPosition = getNewCatcherPosition(oldCatcherPosition, targetPosition);
        oldCatcherPosition.latitude = newPosition.latitude;
        oldCatcherPosition.longitude = newPosition.longitude;
        oldCatcherPosition.altitude = newPosition.altitude;
    }

    updateLatitudeLongitudeAltitude(currentPosition);

    if (follow) {
        toCurrentPosition();
    }

    wwd.redraw();
}, 100);

function toCurrentPosition() {
    wwd.navigator.lookAtLocation.latitude = currentPosition.latitude;
    wwd.navigator.lookAtLocation.longitude = currentPosition.longitude;
}

// Follow Satellite
var emptyFunction = function (e) {
};
var regularHandlePanOrDrag = wwd.navigator.handlePanOrDrag;
var regularHandleSecondaryDrag = wwd.navigator.handleSecondaryDrag;
var regularHandleTilt = wwd.navigator.handleTilt;
var followPlaceholder = document.getElementById('follow');

function toggleFollow() {
    follow = !follow;
    if (follow) {
        followPlaceholder.textContent = 'On';
        wwd.navigator.handlePanOrDrag = emptyFunction;
        wwd.navigator.handleSecondaryDrag = emptyFunction;
        wwd.navigator.handleTilt = emptyFunction;
    } else {
        followPlaceholder.textContent = 'Off';
        wwd.navigator.handlePanOrDrag = regularHandlePanOrDrag;
        wwd.navigator.handleSecondaryDrag = regularHandleSecondaryDrag;
        wwd.navigator.handleTilt = regularHandleTilt;
    }
    toCurrentPosition();
    wwd.redraw();
}

// Update Globe Representation
var representationPlaceholder = document.getElementById('representation');

function toggleRepresentation() {
    if (wwd.globe instanceof WorldWind.Globe2D) {
        wwd.globe = globe;
        representationPlaceholder.textContent = '3D';
    } else {
        wwd.globe = map;
        representationPlaceholder.textContent = '2D';
    }

    wwd.redraw();
}

// Help
function openHelp() {
    alert("This tool shows the current location of Sentinel 1A and its ground stations. An orbit in the past (red) and one in the future (green) are also displayed.\n\nRepresentation: 3D or 2D\nFollow: On or Off. When on, the position is locked on the satellite, but zooming in and out is still possible.");
}

// Convert degrees to text
function degreesToText(deg, letters) {
    var letter;
    if (deg < 0) {
        letter = letters[1]
    } else {
        letter = letters[0]
    }

    var position = Math.abs(deg);

    var degrees = Math.floor(position);

    position -= degrees;
    position *= 60;

    var minutes = Math.floor(position);

    position -= minutes;
    position *= 60;

    var seconds = Math.floor(position * 100) / 100;

    return degrees + "° " + minutes + "' " + seconds + "\" " + letter;
}
