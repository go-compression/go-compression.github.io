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

    resizeText();

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
    });

    text.reposition = function () {
        this.center();
        this.set("top", 20);
    }

    text.reposition();

    canvas.add(text);

    searchBufferTitle = new fabric.Text("Search Buffer:", {
        fontFamily: "Roboto Mono",
        fontSize: 36,
        left: 0,
        top: canvas.height * (1 / 4),
    });
    searchBufferText = new fabric.Text("", {
        fontFamily: "Roboto Mono",
        fontSize: 36,
        left: 0,
        top: canvas.height * (1 / 4) + 36,
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
    });
    outputText = new fabric.Text("", {
        fontFamily: "Roboto Mono",
        fontSize: 36,
        left: 0,
        top: canvas.height * (2 / 4) + 36,
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
    });
    scanningText = new fabric.Text("", {
        fontFamily: "Roboto Mono",
        fontSize: 36,
        left: 0,
        top: canvas.height * (3 / 4) + 36,
    });

    scanningText.reposition = function () {
        this.left = 0;
        this.top = canvas.height * (3 / 4) + 36;
        this.setCoords();
    }

    canvas.add(scanningTitle);
    canvas.add(scanningText);

    // text.set("selecteable", false)

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

    resizeText();
}

function resizeText() {
    var texts = [searchBufferText, scanningText, outputText, text]

    texts.forEach(function (textObj) {
        while (textObj.width > canvas.width) {
            textObj.fontSize--;
            canvas.renderAll();
            // console.log(textObj.fontSize)
        }
        textObj.reposition();
    });
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
    canvas = new fabric.Canvas("canvas");

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
});

stepCountBtn.addEventListener("click", function () {
    stepThrough();
});

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}