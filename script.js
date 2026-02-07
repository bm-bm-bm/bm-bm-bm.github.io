function popup(img) {
    let popupWidth = img.naturalWidth
    let popupHeight = img.naturalHeight + 28
    const windowFeatures =
        "width=" + parseInt(popupWidth) +
        ",height=" + parseInt(popupHeight) +
        ",popup,screenx=0,screeny=0,resizable=no,location=no,menubar=no,status=no,titlebar=no,toolbar=no"
    const popup = window.open(img.src, "65:24", windowFeatures);
    if (!popup) {
        window.open(img.src, "_blank");
    }
}

function addZoom() {
    // get img source
    let container = document.querySelector("#zoomObject");
    imgsrc = container.currentStyle || window.getComputedStyle(container, false);
    imgsrc = imgsrc.backgroundImage.slice(4, -1).replace(/"/g, "");

    // load img and attach zoom
    let img = new Image();
    img.src = imgsrc;
    img.onload = () => {
        // calculate zoom ratio
        let ratio = img.naturalHeight / img.naturalWidth,
            percentage = ratio * 100 + "%";

        // attach zoom on move
        container.onmousemove = e => {
            let rect = e.target.getBoundingClientRect(),
                xPos = e.clientX - rect.left,
                yPos = e.clientY - rect.top,
                xPercent = xPos / (container.clientWidth / 100) + "%",
                yPercent = yPos / ((container.clientWidth * ratio) / 100) + "%";

            Object.assign(container.style, {
                backgroundPosition: xPercent + " " + yPercent,
                backgroundSize: img.naturalWidth + "px"
            });
        };

        // reset on leave
        container.onmouseleave = e => {
            Object.assign(container.style, {
                backgroundPosition: "center",
                backgroundSize: "cover"
            });
        };
    }
};

function renderPageMap() {
    html2canvas(document.body, { scale: 0.1, imageTimeout: 0, backgroundColor: null }).then(function (canvas) {
        document.querySelector("nav").appendChild(canvas).setAttribute("id", "render");
    });

    pagemap(document.querySelector("#overlay"), {
        viewport: null,
        styles: {
            "*": "rgba(0, 0, 0, 0)"
        },
        back: "rgba(0, 0, 0, 0)",
        view: "rgba(255, 255, 255, 0.3)",
        drag: "rgba(255, 255, 255, 0.4)",
        interval: null
    });
}

function hidePageMap() {
    console.log("detected")
    clearTimeout(timer);
    if (idle == true) {
        document.querySelector("#overlay").classList.remove("invisible");
        document.querySelector("#render").classList.remove("invisible");
        console.log("shown")
    }

    idle = false;
    timer = setTimeout(function () {
        document.querySelector("#overlay").classList.add("invisible");
        document.querySelector("#render").classList.add("invisible");
        console.log("hidden")
        idle = true;
    }, wait);
}

document.addEventListener("DOMContentLoaded", function () {
    addZoom();
    renderPageMap();
});

timer = null;
idle = false;
wait = 1000;

["keydown", "scroll"].forEach(evt =>
    document.addEventListener(evt, hidePageMap, false)
);