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

addSatelliteToLayer(satelliteLayer, currentPosition, "Santinel 1A")

const json = {
    "CCSDS_OMM_VERS": "2.0",
    "COMMENT": "GENERATED VIA SPACE-TRACK.ORG API",
    "CREATION_DATE": "2020-10-03T06:46:10",
    "ORIGINATOR": "18 SPCS",
    "OBJECT_NAME": "VANGUARD 1",
    "OBJECT_ID": "1958-002B",
    "CENTER_NAME": "EARTH",
    "REF_FRAME": "TEME",
    "TIME_SYSTEM": "UTC",
    "MEAN_ELEMENT_THEORY": "SGP4",
    "EPOCH": "2020-10-03T01:53:25.899936",
    "MEAN_MOTION": "10.84868857",
    "ECCENTRICITY": "0.18457170",
    "INCLINATION": "34.2436",
    "RA_OF_ASC_NODE": "256.7240",
    "ARG_OF_PERICENTER": "116.6654",
    "MEAN_ANOMALY": "263.4500",
    "EPHEMERIS_TYPE": "0",
    "CLASSIFICATION_TYPE": "U",
    "NORAD_CAT_ID": "5",
    "ELEMENT_SET_NO": "999",
    "REV_AT_EPOCH": "21704",
    "BSTAR": "0.00002332900000",
    "MEAN_MOTION_DOT": "0.00000005",
    "MEAN_MOTION_DDOT": "0.0000000000000",
    "SEMIMAJOR_AXIS": "8619.531",
    "PERIOD": "132.734",
    "APOAPSIS": "3832.318",
    "PERIAPSIS": "650.475",
    "OBJECT_TYPE": "PAYLOAD",
    "RCS_SIZE": "MEDIUM",
    "COUNTRY_CODE": "US",
    "LAUNCH_DATE": "1958-03-17",
    "SITE": "AFETR",
    "DECAY_DATE": null,
    "FILE": "2840663",
    "GP_ID": "162653092",
    "TLE_LINE0": "0 VANGUARD 1",
    "TLE_LINE1": "1     5U 58002B   20277.07877199  .00000005  00000-0  23329-4 0  9994",
    "TLE_LINE2": "2     5  34.2436 256.7240 1845717 116.6654 263.4500 10.84868857217046"
}
var junk_tle_line_1 = json["TLE_LINE1"]
var junk_tle_line_2 = json["TLE_LINE2"]
var junk_satrec = satellite.twoline2satrec(junk_tle_line_1, junk_tle_line_2);

var junk_position = getPosition(junk_satrec, time)
currentPosition = new WorldWind.Position(junk_position.latitude,
    junk_position.longitude,
    junk_position.altitude);

var junkLayer = new WorldWind.RenderableLayer("Junk");

addSatelliteToLayer(junkLayer, junk_position, "VANGUARD 1")

// Update WorldWindow
var wwd = new WorldWind.WorldWindow("wwd");
wwd.drawContext.clearColor = WorldWind.Color.colorFromBytes(0, 0, 0, 0);
wwd.addLayer(bmngOneImageLayer);
wwd.addLayer(bmngLayer);
wwd.addLayer(atmosphereLayer);
wwd.addLayer(starfieldLayer);
wwd.addLayer(groundStationsLayer);
wwd.addLayer(junkLayer);
// wwd.addLayer(orbitLayer);
wwd.addLayer(satelliteLayer);

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
window.setInterval(function () {
    var position = getPosition(satrec, new Date());
    currentPosition.latitude = position.latitude;
    currentPosition.longitude = position.longitude;
    currentPosition.altitude = position.altitude;

    updateLatitudeLongitudeAltitude(currentPosition);

    if (follow) {
        toCurrentPosition();
    }

    wwd.redraw();
}, 5000);

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
