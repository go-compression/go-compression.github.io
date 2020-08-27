var stepCount = 0;
var stepCountBtn = document.getElementById("step");

var found = false;
var outputToken = false;
var index = 0;
var scanningChars = "";

var colorDefault = "#320b86";
var colorStep = "#03fcd3";
var colorCurrent = "#fcba03";

var showMouse = false;
var fullscreen = false;

var delay = 500;
var autostep = false;
var autostepElement;

async function stepThrough() {
    stepCountBtn.disabled = true;
    highlight(text, stepCount, colorStep);

    character = text.text[stepCount];

    scan(character);

    var r = await lookForScanningChars();
    found = r[0]
    if (r[1] !== -1) {
        index = r[1];
    }
    if (!found && scanningChars.length > 1) {
        var offset = searchBufferText.text.length - index;
        var length = scanningChars.length - 1;
        output("<" + offset + "," + length + ">")
        outputToken = true;
        index = 0;
    } else if (stepCount == text.text.length - 1) {
        var offset = searchBufferText.text.length - index;
        var length = scanningChars.length;
        output("<" + offset + "," + length + ">")
        outputToken = true;
        index = 0;
    }

    clearHightlights(searchBufferText);

    canvas.renderAll();

    if (!found) {
        output(character);
        addToSearchBuffer(scanningChars);
        resetScanning();
    }

    if (outputToken) {
        addToSearchBuffer(scanningChars);
        resetScanning();
        found = false;
        outputToken = false;
    }

    if (!fullscreen) {
        resizeText();
    }

    stepCount++;

    if (stepCount >= text.text.length) {
        stepCountBtn.disabled = true;
    } else {
        stepCountBtn.disabled = false;
    }

    if (autostep && !stepCountBtn.disabled) {
        stepThrough();
    }
}

async function lookForScanningChars() {
    var offset = 0;

    for (var i = index; i < searchBufferText.text.length; i++) {
        if (scanningChars.length <= offset) {
            // Found all scanning characters
            return [true, i - scanningChars.length]
        }

        highlightRange(searchBufferText, i - offset, i + scanningChars.length - offset, scanningChars, colorDefault);
        highlightNoClear(searchBufferText, i, colorCurrent);
        canvas.renderAll();
        await sleep(delay);

        var searchChar = searchBufferText.text[i];

        if (scanningChars[offset] == searchChar) {
            offset++;
        } else {
            offset = 0;
        }
    }

    return [false, -1]
}

var canvas;
var text;
var searchBufferTitle;
var searchBufferText;

var outputTitle;
var outputText;

var scanningTitle;
var scanningText;

function output(text) {
    outputText.text += text;
    document.getElementById("output-text").innerHTML += text;
}

function addToSearchBuffer(text) {
    searchBufferText.text += text;
    canvas.renderAll();
}

function scan(text) {
    scanningChars += text;
    scanningText.text = scanningChars;
    canvas.renderAll();
}

function resetScanning() {
    scanningChars = "";
    scanningText.text = scanningChars;
}

function clearHightlights(textObj) {
    if (textObj.highlights) {
        for (var i = 0; i < textObj.highlights.length; i++) {
            canvas.remove(textObj.highlights[i])
        }
    }
    textObj.highlights = [];

    if (textObj.chars) {
        for (var i = 0; i < textObj.chars.length; i++) {
            canvas.remove(textObj.chars[i])
        }
    }
    textObj.chars = [];
}

function highlightRange(textObj, start, end, chars, color) {
    clearHightlights(textObj);

    highlightRangeNoClear(textObj, start, end, chars, color)
}

function highlightRangeNoClear(textObj, start, end, chars, color) {
    for (var i = start; i < end; i++) {
        var positions = getCharacterOfText(textObj, i);
        var rect = new fabric.Rect({
            width: textObj.fontSize / 2,
            height: 10,
            fill: color,
            left: positions[0],
            top: positions[1],
        });
        canvas.add(rect);
        textObj.highlights.push(rect);

        if (chars.length > (i - start)) {
            var char = new fabric.Text(chars[i - start], {
                fontFamily: "Roboto Mono",
                fontSize: textObj.fontSize / 2,
                left: positions[0],
                top: positions[1] + textObj.fontSize / 2,
            })
            char.left += char.width / 2 - 3;
            char.setCoords()
            canvas.add(char)
            textObj.chars.push(char)
            canvas.renderAll();
        }
    }
}

function highlightNoClear(textObj, index, color) {
    var upper = index + 1;
    return highlightRangeNoClear(textObj, index, upper, "", color);
}

function highlight(textObj, index, color) {
    var upper = index + 1;
    return highlightRange(textObj, index, upper, "", color);
}

function process() {
    stepCount = 0;
    stepCountBtn.disabled = false;
    canvas.clear();
    found = false;

    input = document.getElementById("input-text").value;

    // create a text object
    text = new fabric.Text(input, {
        fontFamily: "Roboto Mono",
        fontSize: 72,
        selectable: false,
        originX: "left",
        originY: "top"
    });

    text.reposition = function () {
        this.center();
        this.set("top", 20);
        if (this.width > canvas.width && fullscreen) {
            searchBufferText.left = this.left;
            searchBufferTitle.left = this.left;
            outputTitle.left = this.left;
            outputText.left = this.left;
            scanningTitle.left = this.left;
            scanningText.left = this.left;
        }
    }

    canvas.add(text);

    searchBufferTitle = new fabric.Text("Search Buffer:", {
        fontFamily: "Roboto Mono",
        fontSize: 36,
        left: 0,
        top: canvas.height * (1 / 4),
        selectable: false,
    });
    searchBufferText = new fabric.Text("", {
        fontFamily: "Roboto Mono",
        fontSize: 36,
        left: 0,
        top: canvas.height * (1 / 4) + 36,
        selectable: false,
    });

    searchBufferText.reposition = function () {
        this.left = 0;
        this.top = canvas.height * (1 / 4) + 36;
        this.setCoords();
    }

    canvas.add(searchBufferText);
    canvas.add(searchBufferTitle);


    outputTitle = new fabric.Text("Output:", {
        fontFamily: "Roboto Mono",
        fontSize: 36,
        left: 0,
        top: canvas.height * (2 / 4),
        selectable: false,
    });
    outputText = new fabric.Text("", {
        fontFamily: "Roboto Mono",
        fontSize: 36,
        left: 0,
        top: canvas.height * (2 / 4) + 36,
        selectable: false,
    });

    outputText.reposition = function () {
        this.left = 0;
        this.top = canvas.height * (2 / 4) + 36;
        this.setCoords();
    }

    canvas.add(outputTitle);
    canvas.add(outputText);

    scanningTitle = new fabric.Text("Scanning:", {
        fontFamily: "Roboto Mono",
        fontSize: 36,
        left: 0,
        top: canvas.height * (3 / 4),
        selectable: false,
    });
    scanningText = new fabric.Text("", {
        fontFamily: "Roboto Mono",
        fontSize: 36,
        left: 0,
        top: canvas.height * (3 / 4) + 36,
        selectable: false,
    });

    scanningText.reposition = function () {
        this.left = 0;
        this.top = canvas.height * (3 / 4) + 36;
        this.setCoords();
    }

    canvas.add(scanningTitle);
    canvas.add(scanningText);

    // text.set("selecteable", false)

    texts = [searchBufferTitle, scanningTitle, outputTitle, searchBufferText, scanningText, outputText, text]
    resizeTexts = [searchBufferText, scanningText, outputText, text]

    if (showMouse) {
        var coords = new fabric.Text(" , ", {
            fontFamily: "Roboto Mono",
        });
        canvas.add(coords);
        coords.adjustPosition("left");
        coords.top = canvas.height - 80;

        console.log(text.left + ", " + text.top);

        canvas.on("mouse:move", function (options) {
            var pointer = canvas.getPointer(event.e);
            var posX = pointer.x;
            var posY = pointer.y;
            coords.text = posX + ", " + posY;
            canvas.renderAll();
        });
    }

    if (!fullscreen) {
        resizeText();
    }

    text.reposition();
    if (text.width > canvas.width && fullscreen) {
        canvas.zoomToPoint(new fabric.Point(text.left + (text.width / 2), text.top + (text.height / 2)), (canvas.width / (text.width)));
    }
    canvas.renderAll();
}

var texts = []
var resizeTexts = [];

function resizeText() {
    resizeTexts.forEach(function (textObj) {
        while (textObj.width > canvas.width) {
            textObj.fontSize--;
            canvas.renderAll();
            // console.log(textObj.fontSize)
        }
        if (textObj.reposition) {
            textObj.reposition();
        }
    });
    canvas.renderAll();
}

function getCharacterOfText(text, characterIndex) {
    var x = text.left;
    var y = text.top;

    y = y + text.fontSize;

    characterWidth = text.width / text.text.length;
    x = x + characterWidth * characterIndex;

    return [x, y];
}

document.getElementById("action-form").onsubmit = function () {
    process();
    return false;
};

window.addEventListener("load", function () {
    canvas = document.getElementById("canvas");
    if (!canvas.getContext) {
        alert("Please use a browser that supports an HTML5 canvas");
    }

    // create a wrapper around native canvas element (with id="canvas")
    canvas = new fabric.Canvas("canvas", {
        selection: false,
        evented: false,
        enableRetinaScaling: true
    });

    if (fullscreen) {
        canvas.defaultCursor = "all-scroll";
        canvas.hoverCursor = "all-scroll";
    } else {
        canvas.defaultCursor = "default";
        canvas.hoverCursor = "default";
    }

    canvas.setDimensions({
        width: document.getElementById("canvas-container-jtd").offsetWidth,
        height: document.getElementById("canvas-container-jtd").offsetHeight,
    });

    var slider = document.getElementById('speed-slider');

    noUiSlider.create(slider, {
        start: [500],
        range: {
            'min': [0],
            'max': [5000]
        },
        step: 250,
        connect: true,
    });



    var sliderValueElement = document.getElementById('slider-range-value');

    slider.noUiSlider.on('update', function (values, handle) {
        delay = values[handle];
        sliderValueElement.innerHTML = values[handle];
    });

    autostepElement = document.getElementById("autostep");
    autostepElement.addEventListener('change', (event) => {
        if (event.target.checked) {
            autostep = true;
            stepThrough();
        } else {
            autoste = false;
        }
    });

    document.getElementById("input-text").addEventListener("change", function () {
        process();
    })

    if (fullscreen) {
        canvas.on('mouse:down', function (opt) {
            var evt = opt.e;
            this.isDragging = true;
            this.selection = false;
            this.lastPosX = evt.clientX;
            this.lastPosY = evt.clientY;
        });
        canvas.on('mouse:move', function (opt) {
            if (this.isDragging) {
                var e = opt.e;
                var vpt = this.viewportTransform;
                vpt[4] += e.clientX - this.lastPosX;
                vpt[5] += e.clientY - this.lastPosY;
                this.requestRenderAll();
                this.lastPosX = e.clientX;
                this.lastPosY = e.clientY;
            }
        });
        canvas.on('mouse:up', function (opt) {
            // on mouse up we want to recalculate new interaction
            // for all objects, so we call setViewportTransform
            this.setViewportTransform(this.viewportTransform);
            this.isDragging = false;
            this.selection = true;
        });
        canvas.on('mouse:wheel', function (opt) {
            var delta = opt.e.deltaY;
            var zoom = canvas.getZoom();
            zoom *= 0.990 ** delta;
            if (zoom > 20) zoom = 20;
            if (zoom < 0.01) zoom = 0.01;
            canvas.zoomToPoint({ x: opt.e.offsetX, y: opt.e.offsetY }, zoom);
            opt.e.preventDefault();
            opt.e.stopPropagation();
            texts.forEach(function (textObj) {
                console.log(textObj);
                canvas.remove(textObj);
                canvas.add(textObj);
            });
        })
    }
    process();
});

stepCountBtn.addEventListener("click", function () {
    stepThrough();
});

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}