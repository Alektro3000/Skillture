
function getMinPoint() {
    return new Point(0, 0, 0)
}
function getMaxPoint() {
    return new Point(30, 20, 25)
}

const Projections = {
    Isometric: Symbol('Isometric'),
    TopDown: Symbol('TopDown'),
};

class Projection {
}


function setUpCSS(gridSize) {
    const view = document.querySelector(".view__cross");
    const p = getMaxPoint()
    view.style.setProperty("--X", p.x * gridSize + "px")
    view.style.setProperty("--Y", p.y * gridSize + "px")
    view.style.setProperty("--Z", p.z * gridSize + "px")
    view.style.setProperty("--grid-size-1", gridSize + "px")
}


const ISO_RAY_DIR = new Point (
    0.57,
    0.57,
    0.57
);

function genericAdd(type, conversion) {
    const el = document.createElement("div")
    el.className = "view__" + type;
    el.draggable = true
    el.addEventListener("dragenter", dragEnter)
    el.addEventListener("drop", (e) => dropGeneric(e, conversion, type))
    el.addEventListener("dragover", (e) => dragOverGeneric(e, conversion, type))
    document.querySelector(".view__cross").append(el)
}

class IsoProjection {
    
    getName() {
        return "iso";
    }
    setUpImage(furnitureImg, furniture) {
        furnitureImg.src = furniture.getImgIsoName()
        furnitureImg.style.width = furniture.getIsoWidth() + "px"
    };
    convertWorldToPX(pos) {
        //console.log("world:", this.x, this.y)
        const screenX = (pos.x - pos.y) * tw / 2
        const screenY = (pos.x + pos.y) * th / 2 - pos.z * th
        //console.log("screen:", screenX, screenY)
        return new Point(screenX,  screenY)
    }
    ZComparator(a,b) {
        const mx = a.getMidPoint().sub(b.getMidPoint())
        const size = a.data.getBoundingBox().add(b.data.getBoundingBox()).scale(0.5)
        return (mx.x/size.x + mx.y/size.y + mx.z/size.z);
    }
    
    setUpWorldGrid() {
        genericAdd("bottom", point => point.PxToXY())
        genericAdd("side", point => point.PxToYZ())
        genericAdd("back", point => point.PxToXZ())
        
        this.resizeObserver = new ResizeObserver((entries, observer) => {
            for(let entry of entries)
            {
                const height = entry.contentRect.height
                const width = entry.contentRect.width
                
                let sz = getMaxPoint()
                sz = new Point(width/ (sz.x+sz.y), height / (sz.z + (sz.x+sz.y)/2 ))

                th = Math.min(sz.x, sz.y)
                tw = th * 2
                setUpCSS(th)
                
                updateWorldElementsPositions();
            }
        
        });
        document.querySelector(".view__cross").style.translate = `
        calc( (var(--X) - var(--Y)) * -0.5 ) 
        calc( (var(--Z) - (var(--X) + var(--Y)) * 0.5 ) * 0.5 )  `;
        this.resizeObserver.observe(document.querySelector(".view__wrapper"));
    }
    removeWorldGrid() {
        this.resizeObserver.disconnect();

        document.querySelector(".view__bottom")?.remove()
        document.querySelector(".view__side")?.remove()
        document.querySelector(".view__back")?.remove()
    }
    buildRayFromScreen(point) {
        const p = point.PxToXY();

        const dir = ISO_RAY_DIR;   
        const origin = new Point(p.x, p.y, 0).sub(dir.scale(200));

        return { origin, dir };
    }
    setMockPosition(e, furniture){
        setMockPosition(e.clientX, e.clientY - th * furniture.getBoundingBox().z / 2);
    }
}


class TopProjection {
    getName() {
        return "top";
    }
    setUpImage(furnitureImg, furniture) {
        furnitureImg.src = furniture.getImgVerName()
        furnitureImg.style.width = furniture.getBoundingBox().x * tileHeight + "px"
    };
    convertWorldToPX(pos) {
        return new Point( pos.x * tileHeight,  pos.y * tileHeight)
    }
    ZComparator(a,b) {
        const mx = a.getMinPoint()
        const mxb = b.getMinPoint()
        return (mx.z) - (mxb.z);
    }
    setUpWorldGrid() {
        document.querySelector(".view__cross").style.translate = "calc(var(--X) * -0.5) calc(var(--Y) * -0.5)"
        
        this.resizeObserver = new ResizeObserver((entries, observer) => {
            for(let entry of entries)
            {
                const height = entry.contentRect.height
                const width = entry.contentRect.width
                
                let sz = getMaxPoint()
                sz = new Point(width/ (sz.x), height / (sz.y))

                tileHeight = Math.min(sz.x, sz.y)
                setUpCSS(tileHeight)
                
                updateWorldElementsPositions();
            }
        
        });

        this.resizeObserver.observe(document.querySelector(".view__wrapper"));

        genericAdd("top", point => point.PxToTop())
    }
    removeWorldGrid() {
        document.querySelector(".view__top")?.remove()
        document.querySelector(".view__cross").style.translate = ""
    }
    buildRayFromScreen(point) {
        const p = point.PxToTop();

        const dir = new Point(0,0,1);   
        const origin = new Point(p.x, p.y, 0).sub(dir.scale(200));

        return { origin, dir };
    }
    setMockPosition(e, furniture){
        setMockPosition(e.clientX, e.clientY);
    }
}