var stepCount = 0;
var stepCountBtn = document.getElementById("step");

var found = false;
var outputToken = false;
var index = 0;
var scanningChars = "";

var showMouse = false;

async function stepThrough() {
    stepCountBtn.disabled = true;
    highlight(text, stepCount);

    character = text.text[stepCount];

    scan(character);

    if (found) {
        var r = await lookForScanningChars();
        found = r[0]
        if (r[1] !== -1) {
            index = r[1];
        }
        if (!found) {
            var offset = searchBufferText.text.length - index;
            var length = scanningChars.length - 1;
            output("<" + offset + "," + length + ">")
            outputToken = true;
        } else if (stepCount == text.text.length - 1) {
            var offset = searchBufferText.text.length - index;
            var length = scanningChars.length;
            output("<" + offset + "," + length + ">")
            outputToken = true;
        }
    } else {
        for (var i = searchBufferText.text.length - 1; i >= 0; i--) {
            highlight(searchBufferText, i);
            canvas.renderAll();
            await sleep(500);

            var searchChar = searchBufferText.text[i];
            if (searchChar === character) {
                index = i
                found = true;
                if (stepCount == text.text.length - 1) {
                    var offset = searchBufferText.text.length - i;
                    var length = 1
                    output("<" + offset + "," + length + ">")
                    outputToken = true;
                } else {
                    break;
                }
                // alert("Found")
            }
        }
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

    stepCount++;

    if (stepCount >= text.text.length) {
        stepCountBtn.classList.add("d-none");
    }
    stepCountBtn.disabled = false;
}

async function lookForScanningChars() {
    var offset = 0;

    for (var i = index; i < searchBufferText.text.length; i++) {
        highlightRange(searchBufferText, i - offset, i + scanningChars.length - offset);
        canvas.renderAll();
        await sleep(500);

        var searchChar = searchBufferText.text[i];

        if (scanningChars.length <= offset) {
            // Found all scanning characters
            return [true, i - scanningChars.length]
        }

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
}

function highlightRange(textObj, start, end) {
    clearHightlights(textObj);

    for (var i = start; i < end; i++) {
        var positions = getCharacterOfText(textObj, i);
        var rect = new fabric.Rect({
            width: textObj.fontSize / 2,
            height: 10,
            fill: "#320b86",
            left: positions[0],
            top: positions[1],
        });
        canvas.add(rect);
        canvas.renderAll();
        textObj.highlights.push(rect);
    }
}

function highlight(textObj, index) {
    var upper = index + 1;
    return highlightRange(textObj, index, upper);
}

function process() {
    stepCount = 0;
    stepCountBtn.classList.remove("d-none");
    stepCountBtn.disabled = false;
    canvas.clear();
    found = false;

    input = document.getElementById("input-text").value;

    // create a text object
    text = new fabric.Text(input, {
        fontFamily: "Roboto Mono",
        fontSize: 72,
    });

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

    canvas.add(scanningTitle);
    canvas.add(scanningText);

    // text.set("selecteable", false)
    text.center();
    text.set("top", 20);

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
});

stepCountBtn.addEventListener("click", function () {
    stepThrough();
});

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}