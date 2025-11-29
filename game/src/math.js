//Iso tile size
var th = 10
var tw = th*2

//TopDown tile size
var tileHeight = 10

class Point {
    constructor(x = 0, y = 0, z = 0) {
        this.x = x;
        this.y = y;
        this.z = z;
    }
    PxToXY() {
        //console.log("screen:", this.x, this.y)
        const wx = (this.x / tw + this.y / th) 
        const wy = (this.y / th - this.x / tw) 
        //console.log("world:", wx, wy)
        return new Point(wx,  wy)
    }
    PxToXZ() {
        
        const wx = this.x * 2 / tw
        const wz = this.x / tw - this.y / th
        //console.log("world:", wx, wz)
        return new Point(wx, 0, wz);
    }
    PxToYZ() {
        const wy = -this.x * 2 / tw
        const wz = -this.x / tw - this.y / th
        //console.log("world:", wx, wy)
        return new Point(0, wy, wz);
    }
    PxToTop() {
        //console.log("world:", wx, wy)
        return this.scale(1/tileHeight);
    }
    snapToGrid() {
        //console.log("round:", this.x, this.y)
        return new Point(Math.round(this.x), Math.round(this.y), Math.round(this.z) )
    }
    scale(a) {
        return new Point(this.x * a, this.y * a, this.z * a)
    }
    scaleByVector(a) {
        return new Point(this.x * a.x, this.y * a.y, this.z * a.z)
    }
    isInBoundingBox(min, max) {
        return min.x < this.x && this.x < max.x && 
            min.y < this.y && this.y < max.y && 
            min.z < this.z && this.z < max.z 
    }
    isInBoundingBoxExcluding(min, max) {
        return min.x <= this.x && this.x <= max.x && 
            min.y <= this.y && this.y <= max.y && 
            min.z <= this.z && this.z <= max.z 
    }
    add(a) {
        return new Point(this.x + a.x, this.y + a.y, this.z + a.z)
    }
    sub(a) {
        return new Point(this.x - a.x, this.y - a.y, this.z - a.z)
    }
    max(a) {
        return new Point(Math.max(a.x,this.x),Math.max(a.y,this.y),Math.max(a.z,this.z))
    }
    min(a) {
        return new Point(Math.min(a.x,this.x),Math.min(a.y,this.y),Math.min(a.z,this.z))
    }
    lengthSquared() {
        return this.x*this.x + this.y*this.y + this.z*this.z;
    }
    static fromObject(a) {
      return new Point(a.x,a.y,a.z);
    }
}

function rayBoxIntersect(origin, dir, worldFurniture) {
    const invRayDir = new Point(1/dir.x,1/dir.y,1/dir.z);
    
    const tLower = invRayDir.scaleByVector(worldFurniture.getMinPoint().sub(origin));
    const tUpper = invRayDir.scaleByVector(worldFurniture.getMaxPoint().sub(origin));

    const tMin = tLower.min(tUpper);
    const tMax = tLower.max(tUpper);

    const tBoxMin = Math.min(...Object.values(tMax));
    const tBoxMax = Math.max(...Object.values(tMin));

    if(tBoxMin < tBoxMax)
        return null;
    return tBoxMin;
}

function pickBox(point, furnitureList) {
    const { origin, dir } = currentProjection.buildRayFromScreen(point);

    let best = null;
    let bestT = -Infinity;

    for (const furniture of furnitureList) {
        const t = rayBoxIntersect(origin, dir, furniture);
        if (t !== null && t > bestT) {
            bestT = t;
            best = furniture;
        }
    }

    return best;
}

function checkIntersection(furniture) {
    var ans = [];
    for (const inter of world) {
        const difference = furniture.getMidPoint().sub(inter.getMidPoint())
        const size = furniture.data.getBoundingBox().add(inter.data.getBoundingBox()).scale(0.5)
                
        if (difference.isInBoundingBox(size.scale(-1), size) ) {
            ans.push(inter);
        }
    }
    return ans;
}
