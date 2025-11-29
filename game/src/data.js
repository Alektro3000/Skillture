furnitureList = [
    {
        id: "Bath_Tub",
        size: {
            x: 14,
            y: 8,
            z: 4.5
        },
        type: "ground", 
        name: "Ванна"
    },
    {
        id: "Bench",
        size: {
            x: 10,
            y: 4.25,
            z: 5.662
        },
        gridOffset: {
            x: 0,
            y: 0.5,
            z: 0
        },
        type: "ground",
        name: "Скамья"
    },
    {
        id: "Couch_1A",
        size: {
            x: 19,
            y: 9.8, 
            z: 8.8
        },
        gridOffset: {
            x: 0.5,
            y: 0,
            z: 0
        },
        type: "ground",
        name: "Диван"
    },
    {
        id: "Cube",
        size: {
            x: 10,
            y: 10,
            z: 10
        },
        type: "ground",
        name: "Куб"
    },
    {
        id: "Cube4-8-2",
        size: {
            x: 4,
            y: 8,
            z: 2
        },
        type: "wall",
        name: "Полка"
    },
    {
        
        id: "Drawer_1A",
        size: {
            x: 9,
            y: 3.925,
            z: 7.7
        },
        gridOffset: {
            x: 0.5,
            y: 0,
            z: 0
        },
        type: "ground",
        name: "Комод"
        
    },
    {
        id: "Mirror",
        size: {
            x: 8,
            y: 0.1,
            z: 10
        },
        type: "back-wall",
        name: "Зеркало"
    },
    {
        id: "Mirror",
        size: {
            x: 4,
            y: 0.1,
            z: 5
        },
        type: "back-wall",
        name: "Зеркальце"
    },
    {
        id: "Table_1A",
        size: {
            x: 10,
            y: 6,
            z: 4.4
        },
        type: "ground",
        name: "Стол"
    },
    {
        id: "Kitchen_Cabinet_1A",
        size: {
            x: 4,
            y: 4.4, 
            z: 6.855
        }, 
        type: "back-wall",
        name: "Шкафчик"
    }

]
//1,02662

var transparentImage = document.createElement("img");   
transparentImage.src = "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7";

function onSave(key, items) {
    localStorage.setItem(key, JSON.stringify(items));
}
function onLoad(key) {
    var array = JSON.parse(localStorage.getItem(key));
    if(array == null)
        return;
    return array.map((obs) => new WorldFurniture(new Furniture(obs.data.num), Point.fromObject(obs.origin)))
}

const ROOM_SIZE_PRESETS = [
    new Point(20, 20, 14),
    new Point(30, 30, 18),
    new Point(40, 40, 25),
    new Point(50, 50, 30),
    new Point(60, 60, 35),
];