class Object {
    position
    placeMark
    name

    constructor(name, position, placeMark) {
        this.position = position
        this.name = name
    }

    distance(object2) {
        let location1 = this.getLocation()
        let location2 = object2.getLocation()
        return WorldWind.Location.greatCircleDistance(location1, location2)
    }

    updateLabel() {
        this.placeMark.label = name + "\n" + (Math.round(this.position.altitude / 10) / 100).toString() + "km"
    }

    getLocation() {
        return new WorldWind.Location(this.position.latitude, this.position.longitude)
    }
}

class SpaceObject extends Object {
    satrec

    constructor(name, position, placeMark, satrec) {
        super(name, position, placeMark)
        this.satrec = satrec
    }

    fromJson(json) {
        var satrec = satellite.twoline2satrec(json["TLE_LINE1"], json["TLE_LINE2"])
        return new this(json["OBJECT_NAME"], getPosition(satrec, new Date()), satrec)
    }

    updatePosition() {
        let newPosition = getPosition(this.satrec, new Date())
        this.position.latitude = newPosition.latitude
        this.position.longitude = newPosition.longitude
        this.position.altitude = newPosition.altitude
    }
}

class Catcher extends Object {
    target
    lastUpdate

    constructor(name, position, placeMark, target) {
        super(name, position, placeMark)
        this.lastUpdate = new Date()
        this.target = target
    }

    updatePosition() {
        let catcherLocation = this.getLocation()
        let targetLocation = this.target.getLocation()
        let distance = this.distance(this.target)
        let timeDelta = new Date() - this.lastUpdate;
        let frac = Math.min((timeDelta / 1000 * 0.05) / distance, 0.8);
        var resultLocation = new WorldWind.Location()
        WorldWind.Location.interpolateGreatCircle(frac, catcherLocation, targetLocation, resultLocation)
        return new WorldWind.Position(resultLocation.latitude, resultLocation.longitude, targetPosition.altitude)
    }
}