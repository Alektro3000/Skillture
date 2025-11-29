
var dragged = null;
var draggedDom = null;

function dragstartFromList(e) {
    const furniture = Furniture.fromJson(e.currentTarget.dataset.furniture);
    dragged = furniture;
    e.dataTransfer.setDragImage(transparentImage, 0, 0)

    setUpMock(dragged)
    setMockPositionFromEvent(e, dragged)
    clearIntersection()
}

function dragFromList(e) {
    e.preventDefault()
    
    setMockPositionFromEvent(e, dragged)
    clearIntersection()
}

function dragcancel(e) {
    mock.replaceChildren()
    clearCanvas()
    clearIntersection()
}

function dragEnter(e) {
    e.preventDefault();
    return true;
}

function clearIntersection() {
    document.querySelectorAll(".view__element--invalid").forEach(element => {
        element.classList.remove("view__element--invalid")
    });
}

function checkLoc(furniture) {
    const interSections = checkIntersection(furniture).filter(x => x.ref != draggedDom);
    if (interSections.length > 0) {
        for (const fur of interSections) {
            fur.ref.classList.add("view__element--invalid")
        }
        return true;
    }
    return false;
}

function adjustLoc(point, furniture, type) {
    const of = new Point(0, 0, 0);
    //console.log(point)
    const min = getMinPoint().add(furniture.getExtentNoZ()).add(of)
    const max = getMaxPoint().sub(furniture.getExtent()).add(of)

    const n = furniture.getGridOffset();

    if(GridSnappingEnabled)
        return furniture.adjustPos(point.sub(n).snapToGrid().add(n).min(max).max(min), type);
    else
        return furniture.adjustPos(point.min(max).max(min), type);
}

function dragOverSimple(e) {
    e.preventDefault();
    clearIntersection();
}

function dropDelete(e) {
    e.preventDefault();
    deleteWorldFurniture(draggedDom)
}

function dropGeneric(e, conversion, type) {
    e.preventDefault();

    const rect = center.getBoundingClientRect()
    const point = new Point(e.clientX - rect.left, e.clientY - rect.top)
    const worldPos = adjustLoc(conversion(point), dragged, type)

    clearIntersection()

    if(worldPos == null)
    {
        dragcancel();
        return;
    }
    const furniture = new WorldFurniture(dragged, worldPos)

    if (checkLoc(furniture))
    {
        dragcancel();
        return;
    }

    addFurnitureToWorld(furniture)
    deleteWorldFurniture(draggedDom)
}

function dragOverGeneric(e, conversion, type) {
    e.preventDefault();

    const rect = center.getBoundingClientRect()
    const point = new Point(e.clientX - rect.left, e.clientY - rect.top)
    const worldPos = adjustLoc(conversion(point), dragged, type)

    if(worldPos == null)
        return;

    const furniture = new WorldFurniture(dragged, worldPos)
    if (checkLoc(furniture))
        return;

    setMockPositionFromWorld(furniture)
    drawFurnitureBox(furniture)
}

function mouseMove(e) {
    {
        const rect = center.getBoundingClientRect()
        const point = new Point(e.clientX - rect.left, e.clientY - rect.top)


        document.querySelectorAll(".view__element--hover").forEach(element => {
            element.classList.remove("view__element--hover")
        });


        let hit = pickBox(point, world)
        if (hit != null)
            hit.ref.classList.add("view__element--hover")
    }
}

function dragstartFromView(e) {
    const rect = center.getBoundingClientRect()
    const point = new Point(e.clientX - rect.left, e.clientY - rect.top)
    let hit = pickBox(point, world)
    if (hit == null)
    {
        e.preventDefault();
        return;
    }
    //console.log("drag start")
    
    e.dataTransfer.setDragImage(transparentImage, 0, 0)
    dragged = hit.data
    draggedDom = hit.ref

    setUpMock(dragged);
    setMockPositionFromEvent(e, dragged)
}

function dragFromView(e) {
    e.preventDefault()
    setMockPositionFromEvent(e, dragged)   
    clearIntersection() 
}