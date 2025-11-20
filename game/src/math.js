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
    static fromObject(a) {
      return new Point(a.x,a.y,a.z);
    }
}



function rayBoxIntersect(origin, dir, worldFurniture) {
    const ox = origin.x;
    const oy = origin.y;
    const oz = origin.z;

    const dx = dir.x;
    const dy = dir.y;
    const dz = dir.z;


    const min = worldFurniture.getMinPoint()
    const max = worldFurniture.getMaxPoint()



    let tMin = -Infinity;
    let tMax =  Infinity;

    
    // X slab
    if (dx !== 0) {
        const tx1 = (min.x - ox) / dx;
        const tx2 = (max.x - ox) / dx;
        tMin = Math.max(tMin, Math.min(tx1, tx2));
        tMax = Math.min(tMax, Math.max(tx1, tx2));
    } else if (ox < min.x || ox > max.x) {
        return null;
    }

    // Y slab
    if (dy !== 0) {
        const ty1 = (min.y - oy) / dy;
        const ty2 = (max.y - oy) / dy;
        tMin = Math.max(tMin, Math.min(ty1, ty2));
        tMax = Math.min(tMax, Math.max(ty1, ty2));
    } else if (oy < min.y || oy > max.y) {
        return null;
    }

    // Z slab
    if (dz !== 0) {
        const tz1 = (min.z - oz) / dz;
        const tz2 = (max.z - oz) / dz;
        tMin = Math.max(tMin, Math.min(tz1, tz2));
        tMax = Math.min(tMax, Math.max(tz1, tz2));
    } else if (oz < min.z || oz > max.z) {
        return null;
    }

    if (tMax >= tMin && tMax >= 0) {
        return tMin >= 0 ? tMin : tMax; // return closest positive intersection
    }

    return null;
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

