var selectedObject = null;

function updateInfoObject(object) {
    selectedObject = object
    // document.getElementById('info').style.display = "visible"
    document.getElementById('name').textContent = object.name.toString()
    document.getElementById('country').textContent = object.json["COUNTRY_CODE"]
    document.getElementById('date').textContent = object.json["LAUNCH_DATE"]
    document.getElementById('motion').textContent = object.json["MEAN_MOTION"]
    document.getElementById('inclination').textContent = object.json["INCLINATION"]
    document.getElementById('period').textContent = object.json["PERIOD"]
    document.getElementById('button').style.visibility = "visible"
}

document.getElementById("button").addEventListener("click", function() {
    createCatcher(groundObjects[0], selectedObject)
});

var bmngOneImageLayer = new WorldWind.BMNGOneImageLayer();
var bmngLayer = new WorldWind.BMNGLayer();
var atmosphereLayer = new WorldWind.AtmosphereLayer();
var starfieldLayer = new WorldWind.StarFieldLayer();
var groundStationsLayer = new WorldWind.RenderableLayer("Ground Stations");
var junkLayer = new WorldWind.RenderableLayer("Junk");
var catcherLayer = new WorldWind.RenderableLayer("Catcher");

groundObjects = [
    new groundObject('Baikonur, Kazakhstan', new WorldWind.Position(45.57, 63.18, 1e3)),
    new groundObject('Plesetsk, Russia', new WorldWind.Position(62.7, 40.29, 1e3)),
    new groundObject('San Marco, Italy', new WorldWind.Position(41.42, 15.48, 1e3)),
    new groundObject('Kodiak Island, USA', new WorldWind.Position(57.47, -152.24, 1e3)),
    new groundObject('Woomera, Australia', new WorldWind.Position(-31.11, 136.49, 1e3)),
    new groundObject('Taiyuan, China', new WorldWind.Position(37.86, 112.56, 1e3)),
    new groundObject('Hammaguir, Algeria', new WorldWind.Position(30.88, -3.03, 1e3)),
    new groundObject('Kourou, French Guiana', new WorldWind.Position(5.16, -52.64, 1e3)),
    new groundObject('Sriharikota, India', new WorldWind.Position(13.72, 80.23, 1e3)),
    new groundObject('Svobodny, Russia', new WorldWind.Position(51.37, 128.14, 1e3)),

]

function ConstructPage(number) {
    switch (number) {
        case 0: {
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
            junkObjects = []
            catcherObjects = []

            const json = westford

            for (var i = 0; i < json.length; i++) {
                var json_elem = json[i];
                junkObjects.push(SpaceObject.fromJson(json_elem))
            }
            break;
        }
        case 2: {
            junkObjects = []
            catcherObjects = []

            const json = fengyun

            for (var i = 0; i < json.length; i++) {
                var json_elem = json[i];
                junkObjects.push(SpaceObject.fromJson(json_elem))
            }
            break;
        }
        case 3: {
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
            junkObjects = []
            catcherObjects = []

            const json = starlink

            for (var i = 0; i < json.length; i++) {
                var json_elem = json[i];
                junkObjects.push(SpaceObject.fromJson(json_elem))
            }
            break;
        }
        case 5: {
            junkObjects = []
            catcherObjects = []

            const json = cesler

            for (var i = 0; i < json.length; i++) {
                var json_elem = json[i];
                junkObjects.push(SpaceObject.fromJson(json_elem))
            }
            break;
        }
    }
}

function clearPage() {
    for (let i = 0; i < groundObjects.length; i++) {
        groundStationsLayer.removeRenderable(groundObjects[i].placeMark)
        groundObjects = []
    }
    for (let i = 0; i < junkObjects.length; i++) {
        junkLayer.removeRenderable(junkObjects[i].placeMark)
        junkObjects = []
    }
    for (let i = 0; i < catcherObjects.length; i++) {
        catcherLayer.removeRenderable(catcherObjects[i].placeMark)
        catcherObjects = []
    }
}

number = parseInt(document.getElementById('page').value)
console.log(number)
ConstructPage(number)

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

if (number == 0) {
    pointToObject(junkObjects[0])
}

wwd.deepPicking = true;
var highlightedItems = [];

let flag = 0

var handlePick = function (o) {
    var x = o.clientX,
        y = o.clientY;
    var redrawRequired = highlightedItems.length > 0; // must redraw if we de-highlight previously picked itemsS
    for (var h = 0; h < highlightedItems.length; h++) {
        highlightedItems[h].highlighted = false;
    }
    highlightedItems = [];
    var rect = new WorldWind.Rectangle(x - 20, y + 20, 40, 40);
    var pickList = wwd.pickShapesInRegion(rect);
    if (pickList.objects.length > 0) {
        redrawRequired = true;
    }
    if (pickList.objects.length > 0) {
        for (var p = 0; p < pickList.objects.length; p++) {
            findObjectAndUpdate(pickList.objects[p].userObject)
            pickList.objects[p].userObject.highlighted = true;
            highlightedItems.push(pickList.objects[p].userObject);
        }
    }
    if (redrawRequired) {
        wwd.redraw();
    }
};

function findObjectAndUpdate(placeMark) {
    for (let i = 0; i < junkObjects.length; i++) {
        if (Object.is(junkObjects[i].placeMark, placeMark)) {
            updateInfoObject(junkObjects[i])
        }
    }
}

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

window.setInterval(function () {
    updateObjects(groundObjects)
    updateObjects(junkObjects)
    updateObjects(catcherObjects)
    wwd.redraw();
}, 100);

function pointToObject(object) {
    wwd.navigator.lookAtLocation.latitude = object.position.latitude;
    wwd.navigator.lookAtLocation.longitude = object.position.longitude;
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
