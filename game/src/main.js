const mock = document.querySelector(".mock-element")
const center = document.querySelector(".view__cross")
const viewElements = document.querySelector(".view__elements")


const MIN_ROOM_SIZE = furnitureList.reduce(
    (acc, item) =>
        new Point(
            Math.max(acc.x, item.size.x),
            Math.max(acc.y, item.size.y),
            Math.max(acc.z, item.size.z)
        ),
    new Point(0, 0, 0)
);

let roomSizeIndex = ROOM_SIZE_PRESETS.findIndex(
    (preset) =>
        preset.x === 40 &&
        preset.y === 40 &&
        preset.z === 25
);
if (roomSizeIndex === -1) roomSizeIndex = 0;

let roomSize = Point.fromObject(ROOM_SIZE_PRESETS[roomSizeIndex]);

var GridSnappingEnabled = true;

var currentProjection = new IsoProjection();

function clickDelete() {
    world = [];
    viewElements.replaceChildren();
}

function onRoomSizeButtonClick(e) {
    e.preventDefault();
    const step = e.shiftKey ? -1 : 1;
    cycleRoomSize(step);
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
        furnitureContainer.addEventListener("dragend", dragcancel)

        furnitureListContainer.append(furnitureContainer);
        iter++;
    }
}
function onLogin() {
    document.querySelector(".login-popup").classList.add("login-popup--fading");
    
    const newWorld = onLoad("FurnitureSaving|" + document.querySelector("#login").value);
    if(newWorld != null)
        world = newWorld

    redrawWorldElements();
    world.sort(currentProjection.ZComparator)
    world.forEach((elem, id) => elem.ref.style.zIndex = 1 + 2*id);
}
setUpFurnitureList();

currentProjection.setUpWorldGrid();


document.querySelector(".view__cross").addEventListener("dragstart", dragstartFromView)
document.querySelector(".view__cross").addEventListener("drag", dragFromView)
document.querySelector(".view__cross").addEventListener("dragend", dragcancel)

document.querySelector(".view__change").addEventListener("click", setUpWorldView)

document.querySelector(".view__delete").addEventListener("drop", dropDelete)
document.querySelector(".view__delete").addEventListener("dragover", dragOverSimple)

document.querySelector(".elements-view").addEventListener("drop", dropDelete)
document.querySelector(".elements-view").addEventListener("dragover", dragOverSimple)

document.querySelector(".view__delete").addEventListener("click", clickDelete)
document.querySelector(".view__save").addEventListener("click", () => onSave("FurnitureSaving|" + document.querySelector("#login").value, world))
document.querySelector(".view__change-room").addEventListener("click", onRoomSizeButtonClick)

document.querySelector(".view__grid").addEventListener("click",switchGrid)

document.addEventListener("mousemove", mouseMove)

document.getElementById("button").addEventListener("click", onLogin)

document.addEventListener('keydown', (e) => {
  if (e.key.toLowerCase() === 'd') {
    debugEnabled = !debugEnabled;
  }
});

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
