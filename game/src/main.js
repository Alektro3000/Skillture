const mock = document.querySelector(".mock-element")
const center = document.querySelector(".view__cross")
const viewElements = document.querySelector(".view__elements")

var GridSnappingEnabled = true;

var currentProjection = new IsoProjection();


function checkIntersection(furniture) {
    var ans = [];
    for (const inter of world) {
        const difference = furniture.getMidPoint().sub(inter.getMidPoint())
        const size = furniture.data.getBoundingBox().add(inter.data.getBoundingBox()).scale(0.5)
        
        //console.log(difference, size)
        
        if (difference.isInBoundingBox(size.scale(-1), size) ) {
            ans.push(inter);
        }
    }
    return ans;
}

function prebuildFurnitureFromNum(num) {
    const furniture = new Furniture(furnitureList[num]);
    return prebuildFurniture(furniture)
}

function prebuildFurniture(furniture) {
    let furnitureContainer = document.createElement("div")
    furnitureContainer.className = "element"
    furnitureContainer.dataset.furniture = furniture.toJson()

    let furnitureWrapper = document.createElement("div")
    furnitureWrapper.className = "element__img-wrapper"

    let furnitureImg = document.createElement("img")
    furnitureImg.className = "element__img"
    furnitureImg.src = furniture.getImgIsoName()

    furnitureWrapper.append(furnitureImg)
    furnitureContainer.append(furnitureWrapper)

    let furnitureName = document.createElement("div")
    furnitureName.className = "element__text"
    furnitureName.textContent = furniture.getName()
    furnitureContainer.append(furnitureName)

    return furnitureContainer;
}

function clickDelete() {
    world = [];
    viewElements.replaceChildren();
}

function switchGrid() {
    GridSnappingEnabled = !GridSnappingEnabled;
    document.querySelector(".view__grid").classList.toggle("view__grid--disabled")
}

function setUpFurnitureList() {
    furnitureListContainer = document.querySelector(".elements-view")

    let iter = 0;
    for (const furniture of furnitureList) {
        furnitureContainer = prebuildFurniture(new Furniture(iter));
        furnitureContainer.draggable = true;

        furnitureContainer.addEventListener("dragstart", dragstartFromList)
        furnitureContainer.addEventListener("drag", dragFromList)
        furnitureContainer.addEventListener("dragend", dragcancelFromList)

        furnitureListContainer.append(furnitureContainer);
        iter++;
    }
}

setUpFurnitureList();
currentProjection.setUpWorldGrid();


document.querySelector(".view__cross").addEventListener("dragstart", dragstartFromView)
document.querySelector(".view__cross").addEventListener("drag", dragFromView)
document.querySelector(".view__cross").addEventListener("dragend", dragCancelFromList)

document.querySelector(".view__change").addEventListener("click", setUpWorldView)

document.querySelector(".view__delete").addEventListener("drop", dropDelete)
document.querySelector(".view__delete").addEventListener("dragover", dragOverSimple)

document.querySelector(".elements-view").addEventListener("drop", dropDelete)
document.querySelector(".elements-view").addEventListener("dragover", dragOverSimple)

document.querySelector(".view__delete").addEventListener("click", clickDelete)

document.querySelector(".view__grid").addEventListener("click",switchGrid)

document.addEventListener("mousemove", mouseMove)



/*
setInterval(() => {

    for (const el of document.querySelectorAll(".Ma")) {
        el.classList.add("Ma--fading")
    }

    let k = document.createElement("div")
    k.className = "Ma"

    k.style.setProperty("--x", mouseX + "px")
    k.style.setProperty("--y", mouseY + "px")

    k.style.setProperty("--x-1", (Math.random()-0.5) * 50 + "px")
    k.style.setProperty("--y-1", (Math.random()-0.5) * 50 + "px")

    k.addEventListener('transitionend', () => {
        k.remove();
    },false)


    const cont = document.querySelector(".main-container")
    cont.append(k)
}, 0
)
*/