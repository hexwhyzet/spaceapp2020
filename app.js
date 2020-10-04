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

function ConstructPage(number) {
    switch (number) {
        case 0: {
            groundObjects = [
                new groundObject('Matera, Italy', new WorldWind.Position(40.65, 16.7)),
                new groundObject('Svalbard, Norway', new WorldWind.Position(78.2306, 15.3894)),
                new groundObject('Maspalomas, Spain', new WorldWind.Position(27.7629, -15.6338)),
            ]
            junkObjects = []
            catcherObjects = []

            const json = vanguard

            for (var i = 0; i < json.length; i++) {
                var json_elem = json[i];
                junkObjects.push(SpaceObject.fromJson(json_elem))
            }
            break;
        }
        case 1: {
            groundObjects = [
                new groundObject('Matera, Italy', new WorldWind.Position(40.65, 16.7)),
                new groundObject('Svalbard, Norway', new WorldWind.Position(78.2306, 15.3894)),
                new groundObject('Maspalomas, Spain', new WorldWind.Position(27.7629, -15.6338)),
            ]
            junkObjects = []
            catcherObjects = []

            const json = fengyun

            for (var i = 0; i < json.length; i++) {
                var json_elem = json[i];
                junkObjects.push(SpaceObject.fromJson(json_elem))
            }
            break;
        }
        case 2: {
            groundObjects = [
                new groundObject('Matera, Italy', new WorldWind.Position(40.65, 16.7)),
                new groundObject('Svalbard, Norway', new WorldWind.Position(78.2306, 15.3894)),
                new groundObject('Maspalomas, Spain', new WorldWind.Position(27.7629, -15.6338)),
            ]
            junkObjects = []
            catcherObjects = []

            const json = westford

            for (var i = 0; i < json.length; i++) {
                var json_elem = json[i];
                junkObjects.push(SpaceObject.fromJson(json_elem))
            }
            break;
        }
        case 3: {
            groundObjects = [
                new groundObject('Matera, Italy', new WorldWind.Position(40.65, 16.7)),
                new groundObject('Svalbard, Norway', new WorldWind.Position(78.2306, 15.3894)),
                new groundObject('Maspalomas, Spain', new WorldWind.Position(27.7629, -15.6338)),
            ]
            junkObjects = []
            catcherObjects = []

            const json = cosmos_iridium

            for (var i = 0; i < json.length; i++) {
                var json_elem = json[i];
                junkObjects.push(SpaceObject.fromJson(json_elem))
            }
            break;
        }
        case 4: {
            groundObjects = [
                new groundObject('Matera, Italy', new WorldWind.Position(40.65, 16.7)),
                new groundObject('Svalbard, Norway', new WorldWind.Position(78.2306, 15.3894)),
                new groundObject('Maspalomas, Spain', new WorldWind.Position(27.7629, -15.6338)),
            ]
            junkObjects = []
            catcherObjects = []

            const json = starlink

            for (var i = 0; i < json.length; i++) {
                var json_elem = json[i];
                junkObjects.push(SpaceObject.fromJson(json_elem))
            }
            break;
        }
    }
}

ConstructPage(0)

addObjectsToLayer(groundStationsLayer, groundObjects)
addObjectsToLayer(junkLayer, junkObjects)
addObjectsToLayer(catcherLayer, catcherObjects)


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
