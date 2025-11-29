var world = [];

function prebuildFurniture(furniture) {
    let furnitureContainer = document.createElement("div")
    furnitureContainer.className = "element"
    furnitureContainer.dataset.furniture = furniture.toJson()

    let furnitureWrapper = document.createElement("div")
    furnitureWrapper.className = "element__img-wrapper"

    let furnitureImg = document.createElement("img")
    furnitureImg.className = "element__img"
    furnitureImg.src = furniture.getImgIsoName()
    furnitureImg.alt = ""

    furnitureWrapper.append(furnitureImg)
    furnitureContainer.append(furnitureWrapper)

    let furnitureName = document.createElement("div")
    furnitureName.className = "element__text"
    furnitureName.textContent = furniture.getName()
    furnitureContainer.append(furnitureName)

    return furnitureContainer;
}

class Furniture {
    constructor(num) {
        this.num = num;
    }
    
    getBoundingBox() {
        return Point.fromObject(furnitureList[this.num].size)
    }
    getGridOffset() {
        const gridOffset = furnitureList[this.num].gridOffset
        if(gridOffset === undefined)
            return new Point();
        return Point.fromObject(gridOffset)
    }
    getExtentNoZ() {
        const a = this.getBoundingBox();
        return new Point(a.x/2, a.y/2)
    }
    getExtent() {
        const a = this.getBoundingBox();
        return new Point(a.x/2, a.y/2, a.z)
    }
    getImgVerName(){
        return "images/SM_"+furnitureList[this.num].id+"_top.webp";
    }
    getImgIsoName(){
        return "images/SM_"+furnitureList[this.num].id+"_iso.webp";
    }
    getIsoWidth() {
        return (furnitureList[this.num].size.x + furnitureList[this.num].size.y) * th 
    }
    getName()
    {
        return furnitureList[this.num].name
    }
    toJson()
    {
        return this.num;
    }
    static fromJson(json)
    {
        return new Furniture(json)
    }
    adjustPos(point, type) {
        //console.log(type)
        if(furnitureList[this.num].type == "ground"){
            return new Point(point.x, point.y, 0)
        }
        
        if(furnitureList[this.num].type == "wall"){
            if(type != "back" && type != "side")
                return null
            return new Point(point.x, point.y, point.z)
        }
        
        if(furnitureList[this.num].type == "back-wall"){
            if(type != "back")
                return null
            return new Point(point.x, point.y, point.z)
        }

        return point
    }

}

class WorldFurniture {
    constructor(data, origin, ref) {
        this.data = data
        this.origin = origin
        this.ref = ref
    }
    getMinPoint() {
        return this.origin.sub(this.data.getExtentNoZ())
    }
    getMaxPoint() {
        return this.origin.add(this.data.getExtent())
    }
    getMidPoint() {
        return this.origin.add(new Point(0, 0, this.data.getBoundingBox().z / 2))
    }
}

function setMockPositionFromWorld(worldFurniture) {
    const pos = currentProjection.convertWorldToPX(worldFurniture.getMidPoint())
    const rect = center.getBoundingClientRect()
    
    setMockPosition(pos.x + rect.left, pos.y + rect.top)
    
    const mx = worldFurniture.getMinPoint();
    mock.style.zIndex = (mx.x) + (mx.y) + mx.z + 100
}
function setMockPositionFromEvent(e, furniture) {
    if(e.clientX != 0 && e.clientY != 0 )
        currentProjection.setMockPosition(e, furniture)
}
function setMockPosition(x, y) {
    const mock = document.querySelector(".mock-element")
    mock.style.top = y + "px";
    mock.style.left = x + "px";
}
function setUpMock(furniture) {

    let furnitureImg = document.createElement("img")
    furnitureImg.className = "element__img"
    currentProjection.setUpImage(furnitureImg, furniture)
    /*
    let mock__bottom = document.createElement("div")
    mock__bottom.className = "mock__bottom"
    mock__bottom.style.setProperty("--X",furniture.getBoundingBox().x * th + "px")
    mock__bottom.style.setProperty("--Y",furniture.getBoundingBox().y * th + "px")
    mock__bottom.style.top = th * dragged.getBoundingBox().z * 1 /2 + "px"
    mock__bottom.style.zIndex = 0
    
    let mock__side = document.createElement("div")
    mock__side.className = "mock__side"
    mock__side.style.setProperty("--Y",furniture.getBoundingBox().y * th + "px")
    mock__side.style.setProperty("--Z",furniture.getBoundingBox().z * th + "px")
    mock__side.style.top = th * dragged.getBoundingBox().z * 1 /2 + "px"
    mock__side.style.zIndex = 0
    
    let mock__back = document.createElement("div")
    mock__back.className = "mock__back"
    mock__back.style.setProperty("--X",furniture.getBoundingBox().x * th + "px")
    mock__back.style.setProperty("--Z",furniture.getBoundingBox().z * th + "px")
    mock__back.style.top = th * dragged.getBoundingBox().z * 1 /2 + "px"
    mock__back.style.zIndex = 0
    */

    mock.replaceChildren(furnitureImg);
}

function setUpWorldFurniture(worldFurniture) {
    let furnitureImg = document.createElement("img")
    worldFurniture.ref = furnitureImg

    furnitureImg.className = "view__element"
    currentProjection.setUpImage(furnitureImg, worldFurniture.data)
    
    const pos = currentProjection.convertWorldToPX(worldFurniture.getMidPoint())
    furnitureImg.style.left = pos.x + "px"
    furnitureImg.style.top = pos.y + "px"
    furnitureImg.style.position = "absolute"
    

    viewElements.append(furnitureImg)
}

function addFurnitureToWorld(worldFurniture) {

    setUpWorldFurniture(worldFurniture);
    /* Efforts to be efficient:
    const index = world.findIndex((elem) => currentProjection.ZComparator(worldFurniture, elem) < 0);
    world.splice(index,0,worldFurniture)
    world.slice(index).forEach((elem, id) => elem.ref.style.zIndex = 1 + 2*id);
    */
    world.push(worldFurniture)
    world.sort(currentProjection.ZComparator)
    world.forEach((elem, id) => elem.ref.style.zIndex = 1 + 2*id);
}

function deleteWorldFurniture(furnitureRef) {
    if(furnitureRef != null)
    {
        console.log("deleting")
        world = world.filter(furniture => furniture.ref != furnitureRef);
        furnitureRef.remove();
    }
}

function changeProjection(newProjection) {
    currentProjection.removeWorldGrid();
    currentProjection = newProjection;
    currentProjection.setUpWorldGrid();
}

function updateWorldElementsPositions() {
    world.forEach(worldFurniture => {
        const furnitureImg = worldFurniture.ref
        const pos = currentProjection.convertWorldToPX(worldFurniture.getMidPoint())
        furnitureImg.style.left = pos.x + "px"
        furnitureImg.style.top = pos.y + "px"
        currentProjection.setUpImage(furnitureImg, worldFurniture.data)
    });
}

function redrawWorldElements() {

    world.forEach(worldFurniture => {
        worldFurniture.ref?.remove();
        setUpWorldFurniture(worldFurniture)
    });
}

function setUpWorldView() {
    if(currentProjection.getName() == "iso") {
        changeProjection(new TopProjection());
    }
    else {
        changeProjection(new IsoProjection());
    }
    redrawWorldElements();
    world.sort(currentProjection.ZComparator)
    world.forEach((elem, id) => elem.ref.style.zIndex = 1 + 2*id);
}

function clampWorldToRoom() {
    const min = getMinPoint();
    const max = getMaxPoint();

    world.forEach((worldFurniture) => {
        const extentNoZ = worldFurniture.data.getExtentNoZ();
        const extent = worldFurniture.data.getExtent();

        const minX = min.x + extentNoZ.x;
        const minY = min.y + extentNoZ.y;
        const minZ = min.z;

        const maxX = Math.max(minX, max.x - extentNoZ.x);
        const maxY = Math.max(minY, max.y - extentNoZ.y);
        const maxZ = Math.max(minZ, max.z - extent.z);

        const newOrigin = new Point(
            Math.min(Math.max(worldFurniture.origin.x, minX), maxX),
            Math.min(Math.max(worldFurniture.origin.y, minY), maxY),
            Math.min(Math.max(worldFurniture.origin.z, minZ), maxZ)
        );
        if(worldFurniture.origin.sub(newOrigin).lengthSquared() > 0.01)
            deleteWorldFurniture(worldFurniture.ref);
    });
}
