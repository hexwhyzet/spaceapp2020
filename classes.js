class groundObject {
    position
    placeMark
    name

    constructor(name, position) {
        this.name = name
        this.position = position
        this.initPlaceMark()
    }

    update() {
    }

    distance(object2) {
        let location1 = this.getLocation()
        let location2 = object2.getLocation()
        return WorldWind.Location.greatCircleDistance(location1, location2)
    }

    updateLabel() {
        this.placeMark.label = this.name + "\n" + (Math.round(this.position.altitude / 10) / 100).toString() + "km"
    }

    getLocation() {
        return new WorldWind.Location(this.position.latitude, this.position.longitude)
    }

    initPlaceMark(imageSource = "resources/icons/ground-station.png", imageScale = 0.5, imageColor = WorldWind.Color.WHITE, labelScale = 0.6, labelColor = WorldWind.Color.WHITE) {
        var placemarkAttributes = new WorldWind.PlacemarkAttributes(null);
        placemarkAttributes.imageSource = imageSource;
        placemarkAttributes.imageScale = imageScale;
        placemarkAttributes.imageOffset = new WorldWind.Offset(
            WorldWind.OFFSET_FRACTION, 0.0,
            WorldWind.OFFSET_FRACTION, 0.2);
        placemarkAttributes.imageColor = imageColor;
        placemarkAttributes.labelAttributes.offset = new WorldWind.Offset(
            WorldWind.OFFSET_FRACTION, 0.36,
            WorldWind.OFFSET_FRACTION, 1.0);
        placemarkAttributes.labelAttributes.enableOutline = true;
        placemarkAttributes.labelAttributes.color = labelColor;
        placemarkAttributes.labelAttributes.scale = labelScale;

        let highlightPlacemarkAttributes = new WorldWind.PlacemarkAttributes(placemarkAttributes);
        highlightPlacemarkAttributes.imageScale = imageScale * 1.75;
        highlightPlacemarkAttributes.labelAttributes.scale = labelScale * 1.75;

        this.placeMark = new WorldWind.Placemark(this.position);
        this.placeMark.altitudeMode = WorldWind.RELATIVE_TO_GROUND;
        this.placeMark.label = this.name;
        this.placeMark.attributes = placemarkAttributes;
        this.placeMark.highlightAttributes = highlightPlacemarkAttributes;
    }
}

class SpaceObject extends groundObject {
    satrec
    falling
    fallingStartTime
    json

    constructor(name, position, satrec) {
        super(name, position)
        this.satrec = satrec
        this.falling = false
        this.initPlaceMark("resources/icons/satellite.png", 0.3, WorldWind.Color.WHITE, 0.5, WorldWind.Color.WHITE)
    }

    static fromJson(json) {
        this.json = json
        var satrec = satellite.twoline2satrec(json["TLE_LINE1"], json["TLE_LINE2"])
        return new this(json["OBJECT_NAME"], getPosition(satrec, new Date()), satrec)
    }

    updatePosition() {
        let newPosition = getPosition(this.satrec, new Date())
        this.position.latitude = newPosition.latitude
        this.position.longitude = newPosition.longitude
        if (this.falling) {
            this.position.altitude -= ((new Date() - this.fallingStartTime) / 1000) ** 2 * 9.8;
            if (this.position.altitude < 50000) {
                junkLayer.removeRenderable(this.placeMark)
                let {distance, falling: falling1, fallingStartTime: fallingStartTime1, getLocation, initPlaceMark, lastUpdate, name, placeMark, position, satrec: satrec1, update: update1, updateLabel, updatePosition: updatePosition1} = this;
            }
        } else {
            this.position.altitude = newPosition.altitude
        }
        this.lastUpdate = new Date();
    }

    update() {
        this.updatePosition()
        this.updateLabel()
    }
}

class Catcher extends groundObject {
    target
    lastUpdate
    falling
    fallingStartTime

    constructor(name, position, target) {
        super(name, position)
        this.lastUpdate = new Date()
        this.target = target
        this.falling = false
        this.initPlaceMark("resources/icons/satellite.png", 0.5, WorldWind.Color.RED, 0.5, WorldWind.Color.RED)
    }

    updatePosition() {
        let catcherLocation = this.getLocation()
        let targetLocation = this.target.getLocation()
        let distance = this.distance(this.target)
        let timeDelta = new Date() - this.lastUpdate;
        let frac = Math.min((timeDelta / 1000 * 0.15) / distance, 0.8);
        let resultLocation = new WorldWind.Location()
        WorldWind.Location.interpolateGreatCircle(frac, catcherLocation, targetLocation, resultLocation)
        this.position.latitude = resultLocation.latitude
        this.position.longitude = resultLocation.longitude
        if (this.target.catched) {
            this.position.altitude -= ((new Date() - this.fallingStartTime) / 1000) ** 2 * 9.8;
            if (this.position.altitude < 50000) {
                catcherLayer.removeRenderable(this.placeMark)
                let {distance: distance1, falling: falling1, fallingStartTime: fallingStartTime1, getLocation, initPlaceMark, lastUpdate: lastUpdate1, name, placeMark, position, target: target1, update: update1, updateLabel, updatePosition: updatePosition1} = this;
            }
        } else {
            this.position.altitude = this.target.position.altitude
            if (this.distance(this.target) < 0.0001) {
                this.falling = true
                this.fallingStartTime = new Date()
                this.target.falling = true
                this.target.fallingStartTime = new Date()
                this.target.catched = true;
            }
        }
        this.lastUpdate = new Date();
    }

    update() {
        this.updatePosition()
        this.updateLabel()
    }
}