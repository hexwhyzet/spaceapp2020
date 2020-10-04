var latitudePlaceholder = document.getElementById('latitude');
var longitudePlaceholder = document.getElementById('longitude');
var altitudePlaceholder = document.getElementById('altitude');

function updateLatitudeLongitudeAltitude(position) {
    latitudePlaceholder.textContent = degreesToText(position.latitude, 'NS');
    longitudePlaceholder.textContent = degreesToText(position.longitude, 'EW');
    altitudePlaceholder.textContent = (Math.round(position.altitude / 10) / 100) + "km";
}

var bmngOneImageLayer = new WorldWind.BMNGOneImageLayer();
var bmngLayer = new WorldWind.BMNGLayer();
var atmosphereLayer = new WorldWind.AtmosphereLayer();
var starfieldLayer = new WorldWind.StarFieldLayer();
var groundStationsLayer = new WorldWind.RenderableLayer("Ground Stations");
var junkLayer = new WorldWind.RenderableLayer("Junk");
var catcherLayer = new WorldWind.RenderableLayer("Catcher");

groundObjects = [
    new groundObject('Matera, Italy', new WorldWind.Position(40.65, 16.7)),
    new groundObject('Svalbard, Norway', new WorldWind.Position(78.2306, 15.3894)),
    new groundObject('Maspalomas, Spain', new WorldWind.Position(27.7629, -15.6338)),
]
junkObjects = []
catcherObjects = []

const big_json = [
    {
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
}, {
    "CCSDS_OMM_VERS": "2.0",
    "COMMENT": "GENERATED VIA SPACE-TRACK.ORG API",
    "CREATION_DATE": "2020-10-03T04:36:52",
    "ORIGINATOR": "18 SPCS",
    "OBJECT_NAME": "STARLINK-1295",
    "OBJECT_ID": "2020-019P",
    "CENTER_NAME": "EARTH",
    "REF_FRAME": "TEME",
    "TIME_SYSTEM": "UTC",
    "MEAN_ELEMENT_THEORY": "SGP4",
    "EPOCH": "2020-10-02T22:00:00.999936",
    "MEAN_MOTION": "15.05586517",
    "ECCENTRICITY": "0.00013900",
    "INCLINATION": "53.0000",
    "RA_OF_ASC_NODE": "72.1211",
    "ARG_OF_PERICENTER": "86.5710",
    "MEAN_ANOMALY": "173.8265",
    "EPHEMERIS_TYPE": "0",
    "CLASSIFICATION_TYPE": "U",
    "NORAD_CAT_ID": "45373",
    "ELEMENT_SET_NO": "999",
    "REV_AT_EPOCH": "175",
    "BSTAR": "0.00236530000000",
    "MEAN_MOTION_DOT": "0.00034357",
    "MEAN_MOTION_DDOT": "0.0000000000000",
    "SEMIMAJOR_AXIS": "6927.842",
    "PERIOD": "95.643",
    "APOAPSIS": "550.670",
    "PERIAPSIS": "548.744",
    "OBJECT_TYPE": "PAYLOAD",
    "RCS_SIZE": "LARGE",
    "COUNTRY_CODE": "US",
    "LAUNCH_DATE": "2020-03-18",
    "SITE": "AFETR",
    "DECAY_DATE": null,
    "FILE": "2840435",
    "GP_ID": "162646684",
    "TLE_LINE0": "0 STARLINK-1295",
    "TLE_LINE1": "1 45373U 20019P   20276.91667824 +.00034357 +00000-0 +23653-2 0  9997",
    "TLE_LINE2": "2 45373 053.0000 072.1211 0001390 086.5710 173.8265 15.05586517001754"
}, {
    "CCSDS_OMM_VERS": "2.0",
    "COMMENT": "GENERATED VIA SPACE-TRACK.ORG API",
    "CREATION_DATE": "2020-10-03T04:36:52",
    "ORIGINATOR": "18 SPCS",
    "OBJECT_NAME": "STARLINK-1300",
    "OBJECT_ID": "2020-019Q",
    "CENTER_NAME": "EARTH",
    "REF_FRAME": "TEME",
    "TIME_SYSTEM": "UTC",
    "MEAN_ELEMENT_THEORY": "SGP4",
    "EPOCH": "2020-10-02T22:00:00.999936",
    "MEAN_MOTION": "15.05568367",
    "ECCENTRICITY": "0.00013940",
    "INCLINATION": "53.0003",
    "RA_OF_ASC_NODE": "72.1244",
    "ARG_OF_PERICENTER": "91.6697",
    "MEAN_ANOMALY": "186.7565",
    "EPHEMERIS_TYPE": "0",
    "CLASSIFICATION_TYPE": "U",
    "NORAD_CAT_ID": "45374",
    "ELEMENT_SET_NO": "999",
    "REV_AT_EPOCH": "175",
    "BSTAR": "0.00235380000000",
    "MEAN_MOTION_DOT": "0.00034171",
    "MEAN_MOTION_DDOT": "0.0000000000000",
    "SEMIMAJOR_AXIS": "6927.898",
    "PERIOD": "95.644",
    "APOAPSIS": "550.729",
    "PERIAPSIS": "548.797",
    "OBJECT_TYPE": "PAYLOAD",
    "RCS_SIZE": "LARGE",
    "COUNTRY_CODE": "US",
    "LAUNCH_DATE": "2020-03-18",
    "SITE": "AFETR",
    "DECAY_DATE": null,
    "FILE": "2840435",
    "GP_ID": "162646761",
    "TLE_LINE0": "0 STARLINK-1300",
    "TLE_LINE1": "1 45374U 20019Q   20276.91667824 +.00034171 +00000-0 +23538-2 0  9994",
    "TLE_LINE2": "2 45374 053.0003 072.1244 0001394 091.6697 186.7565 15.05568367001758"
}, {
    "CCSDS_OMM_VERS": "2.0",
    "COMMENT": "GENERATED VIA SPACE-TRACK.ORG API",
    "CREATION_DATE": "2020-10-03T06:56:10",
    "ORIGINATOR": "18 SPCS",
    "OBJECT_NAME": "STARLINK-1302",
    "OBJECT_ID": "2020-019R",
    "CENTER_NAME": "EARTH",
    "REF_FRAME": "TEME",
    "TIME_SYSTEM": "UTC",
    "MEAN_ELEMENT_THEORY": "SGP4",
    "EPOCH": "2020-10-03T06:00:02.000160",
    "MEAN_MOTION": "15.05558265",
    "ECCENTRICITY": "0.00013370",
    "INCLINATION": "52.9996",
    "RA_OF_ASC_NODE": "70.6222",
    "ARG_OF_PERICENTER": "101.1688",
    "MEAN_ANOMALY": "113.0352",
    "EPHEMERIS_TYPE": "0",
    "CLASSIFICATION_TYPE": "U",
    "NORAD_CAT_ID": "45375",
    "ELEMENT_SET_NO": "999",
    "REV_AT_EPOCH": "3078",
    "BSTAR": "0.00185290000000",
    "MEAN_MOTION_DOT": "0.00026804",
    "MEAN_MOTION_DDOT": "0.0000000000000",
    "SEMIMAJOR_AXIS": "6927.929",
    "PERIOD": "95.645",
    "APOAPSIS": "550.720",
    "PERIAPSIS": "548.868",
    "OBJECT_TYPE": "PAYLOAD",
    "RCS_SIZE": "LARGE",
    "COUNTRY_CODE": "US",
    "LAUNCH_DATE": "2020-03-18",
    "SITE": "AFETR",
    "DECAY_DATE": null,
    "FILE": "2840879",
    "GP_ID": "162658339",
    "TLE_LINE0": "0 STARLINK-1302",
    "TLE_LINE1": "1 45375U 20019R   20277.25002315  .00026804  00000-0  18529-2 0  9999",
    "TLE_LINE2": "2 45375  52.9996  70.6222 0001337 101.1688 113.0352 15.05558265 30789"
}, {
    "CCSDS_OMM_VERS": "2.0",
    "COMMENT": "GENERATED VIA SPACE-TRACK.ORG API",
    "CREATION_DATE": "2020-10-03T06:56:10",
    "ORIGINATOR": "18 SPCS",
    "OBJECT_NAME": "STARLINK-1304",
    "OBJECT_ID": "2020-019S",
    "CENTER_NAME": "EARTH",
    "REF_FRAME": "TEME",
    "TIME_SYSTEM": "UTC",
    "MEAN_ELEMENT_THEORY": "SGP4",
    "EPOCH": "2020-10-03T06:00:02.000160",
    "MEAN_MOTION": "15.05594431",
    "ECCENTRICITY": "0.00012640",
    "INCLINATION": "52.9984",
    "RA_OF_ASC_NODE": "70.6231",
    "ARG_OF_PERICENTER": "105.5537",
    "MEAN_ANOMALY": "18.6666",
    "EPHEMERIS_TYPE": "0",
    "CLASSIFICATION_TYPE": "U",
    "NORAD_CAT_ID": "45376",
    "ELEMENT_SET_NO": "999",
    "REV_AT_EPOCH": "3078",
    "BSTAR": "0.00014061000000",
    "MEAN_MOTION_DOT": "0.00001771",
    "MEAN_MOTION_DDOT": "0.0000000000000",
    "SEMIMAJOR_AXIS": "6927.818",
    "PERIOD": "95.643",
    "APOAPSIS": "550.559",
    "PERIAPSIS": "548.807",
    "OBJECT_TYPE": "PAYLOAD",
    "RCS_SIZE": "LARGE",
    "COUNTRY_CODE": "US",
    "LAUNCH_DATE": "2020-03-18",
    "SITE": "AFETR",
    "DECAY_DATE": null,
    "FILE": "2840889",
    "GP_ID": "162658874",
    "TLE_LINE0": "0 STARLINK-1304",
    "TLE_LINE1": "1 45376U 20019S   20277.25002315  .00001771  00000-0  14061-3 0  9994",
    "TLE_LINE2": "2 45376  52.9984  70.6231 0001264 105.5537  18.6666 15.05594431 30780"
}
]

for (var i = 0; i < big_json.length; i++) {
    var json = big_json[i];
    junkObjects.push(SpaceObject.fromJson(json))
}

addObjectsToLayer(groundStationsLayer, groundObjects)
addObjectsToLayer(junkLayer, junkObjects)
addObjectsToLayer(catcherLayer, catcherObjects)

function createCatcher(groundObj, targetObj) {
    catcherObjects.push(new Catcher("Catcher", new WorldWind.Position(groundObj.position.latitude, groundObj.position.longitude, 1e3), targetObj))
    addObjectsToLayer(catcherLayer, catcherObjects)
}

var wwd = new WorldWind.WorldWindow("wwd");
wwd.drawContext.clearColor = WorldWind.Color.colorFromBytes(0, 0, 0, 0);
wwd.addLayer(bmngOneImageLayer);
wwd.addLayer(bmngLayer);
wwd.addLayer(atmosphereLayer);
wwd.addLayer(starfieldLayer);
wwd.addLayer(groundStationsLayer);
wwd.addLayer(junkLayer);
wwd.addLayer(catcherLayer);

wwd.deepPicking = true;
var highlightedItems = [];

var handlePick = function (o) {
    var x = o.clientX,
        y = o.clientY;
    var redrawRequired = highlightedItems.length > 0; // must redraw if we de-highlight previously picked itemsS
    for (var h = 0; h < highlightedItems.length; h++) {
        highlightedItems[h].highlighted = false;
    }
    highlightedItems = [];
    var t = wwd.canvasCoordinates(x, y)
    var rect = new WorldWind.Rectangle(x - 20, y + 20, 40, 40);
    var pickList = wwd.pickShapesInRegion(rect);
    if (pickList.objects.length > 0) {
        redrawRequired = true;
    }
    if (pickList.objects.length > 0) {
        for (var p = 0; p < pickList.objects.length; p++) {
            pickList.objects[p].userObject.highlighted = true;
            highlightedItems.push(pickList.objects[p].userObject);
        }
    }
    if (redrawRequired) {
        wwd.redraw();
    }
};

wwd.addEventListener("mousemove", handlePick);
var tapRecognizer = new WorldWind.TapRecognizer(wwd, handlePick);

if (screen.width > 900) {
    wwd.navigator.range = 4e7;
} else {
    wwd.navigator.range = 1e7;
}
var globe = wwd.globe;
var map = new WorldWind.Globe2D();
map.projection = new WorldWind.ProjectionEquirectangular();

// Navigation
// wwd.navigator.lookAtLocation = new WorldWind.Location(currentPosition.latitude,
//     currentPosition.longitude);

wwd.redraw();
var follow = false;

createCatcher(groundObjects[0], junkObjects[0]);

window.setInterval(function () {
    updateObjects(groundObjects)
    updateObjects(junkObjects)
    updateObjects(catcherObjects)
    wwd.redraw();
}, 100);

// function toCurrentPosition() {
//     wwd.navigator.lookAtLocation.latitude = currentPosition.latitude;
//     wwd.navigator.lookAtLocation.longitude = currentPosition.longitude;
// }

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
