function randomColorHex() {
    return `rgb(${Math.random() * 128 + 127},${Math.random() * 128 + 127},${Math.random() * 128 + 127})`
}

function prebuildDragWord(element, key) {
    const dragContainer = document.createElement('div')
    dragContainer.className = 'drag__word-container'

    const dragKey = document.createElement('div')
    dragKey.className = 'drag__key'
    dragKey.textContent = key


    const dragWord = document.createElement('div')
    dragWord.className = 'drag__word'
    dragWord.textContent = element

    dragContainer.append(dragKey, dragWord)
    return dragContainer;
}
function comparator(a_e, b_e) {
    const a = testString(a_e);
    const b = testString(b_e);

    //Lower case first
    if (a.isLower && !b.isLower) return -1;
    if (!a.isLower && b.isLower) return 1;

    //Upper case first
    if (a.isUpper && !b.isUpper) return -1;
    if (!a.isUpper && b.isUpper) return 1;

    //Numbers
    if (a.isNum && b.isNum) return Number(a_e) - Number(b_e);

    //Strings
    return a_e.localeCompare(b_e);
}
function dragStart(e) {
    e.currentTarget.id = "dragged-container"

    const payload = {
        x: e.offsetX,
        y: e.offsetY
    };
    e.dataTransfer.effectAllowed = "move"
    e.dataTransfer.setData("application/json", JSON.stringify(payload))
}
function dragEnd(e) {
    e.target.removeAttribute("id");
}
function onClick(e) {
    if (e.target.closest(".drag__intermediate-container") !== null) {
        const container = e.target.closest(".drag__word-container")
        const word = container.querySelector(".drag__word")

        const newWord = document.createElement('div')

        newWord.textContent = word.textContent
        newWord.className = "drag__out-word"
        newWord.style.setProperty("--color", container.style.getPropertyValue("--color"))
        output.append(newWord)
    }
}

function buildDragWord(element, key, id) {
    let dragContainer = prebuildDragWord(element, key)

    dragContainer.draggable = true
    dragContainer.style.setProperty("--color", randomColorHex())

    dragContainer.addEventListener("dragstart", dragStart)
    dragContainer.addEventListener("dragend", dragEnd)

    dragContainer.addEventListener("click", onClick)
    
    dragContainer.style.opacity = "0.0"
    dragContainer.style.transition = `opacity 0.2s ${id * 0.1}s`
    requestAnimationFrame( () => {
        dragContainer.style.opacity = "1"
    })

    root.append(dragContainer)
}

function dragEnter(e) {
    e.preventDefault();
    return true;
}
function dragDrop(e) {
    e.preventDefault();
    const payload = JSON.parse(e.dataTransfer.getData("application/json"))

    drag = document.getElementById("dragged-container")

    const coords = e.currentTarget.getBoundingClientRect()

    let x = e.clientX - coords.left - payload.x
    x = Math.max(0, Math.min(x, e.currentTarget.clientWidth-drag.clientWidth));
    let y = e.clientY - coords.top - payload.y
    y = Math.max(0, Math.min(y, e.currentTarget.clientHeight-drag.clientHeight));
    

    drag.style.left = x + "px"
    drag.style.top = y + "px"

    if(drag.parentElement != container)
        container.append(drag);

}
function dragDropDefault(e) {
    e.preventDefault();
    const payload = JSON.parse(e.dataTransfer.getData("application/json"))

    drag = document.getElementById("dragged-container")
    
    drag.style.opacity = "0.3"
    drag.style.transition = `opacity 0.2s`
    requestAnimationFrame( () => {
        drag.style.opacity = "1"
    })

    const key = drag.querySelector(".drag__key").textContent.charAt(0)
    const index = Number(drag.querySelector(".drag__key").textContent.substring(1))

    for (const child of e.currentTarget.children) {

        const key1 = child.querySelector(".drag__key").textContent.charAt(0)
        const index1 = Number(child.querySelector(".drag__key").textContent.substring(1))

        if (key > key1)
        {
            continue
        }
        if(key < key1 || index < index1)
        {
            e.currentTarget.insertBefore(drag, child);
            return;
        }
    }


    e.currentTarget.append(drag);
}
function dragOver(e) {
    e.preventDefault();
}
function dragOverDefault(e) {
    e.preventDefault();
}

function testString(element) {
    return {
        isNum: !isNaN(element),
        isUpper: /\p{Lu}.*/u.test(element),
        isLower: /\p{Ll}.*/u.test(element),
    }
}

function onButtonClick() {
    document.querySelectorAll(".drag__word-container").forEach(el => el.remove());
    document.querySelectorAll(".drag__out-word").forEach(el => el.remove());

    let array = []
    for (const q of input.value.split("-")) {
        array.push(q.trim())
    }
    array.sort(comparator)
    let a = 1
    let b = 1
    let n = 1
    let id = 0;
    for (const element of array) {
        let data = testString(element)
        if (data.isNum) {
            buildDragWord(element, "n" + (n++), id++)
        }
        else if (data.isUpper) {
            buildDragWord(element, "b" + (b++), id++)
        }
        else if (data.isLower) {
            buildDragWord(element, "a" + (a++), id++)
        }

    }

}

root = document.getElementById("drag__default-container")
container = document.getElementById("drag__intermediate-container")

input = document.getElementById("drag__input")
button = document.getElementById("drag__submit")

output = document.querySelector(".drag__out-container")

button.addEventListener("click", onButtonClick)