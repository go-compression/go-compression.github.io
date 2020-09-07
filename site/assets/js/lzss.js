'use strict';

class LZ {
    stepCount = 0;
    stepCountBtn;

    found = false;
    outputToken = false;
    index = 0;
    scanningChars = "";

    colorDefault = "#320b86";
    colorStep = "#03fcd3";
    colorCurrent = "#fcba03";

    showMouse = false;
    fullscreen = false;

    delay = 500;
    autostep = false;
    autostepElement;
    lzss = false;
    lzssElement;

    canvas;
    text;
    searchBufferTitle;
    searchBufferText;

    outputTitle;
    outputText;

    scanningTitle;
    scanningText;

    texts = []
    resizeTexts = [];

    idNamespace = "";

    async stepThrough() {
        this.stepCountBtn.disabled = true;
        this.highlight(this.text, this.stepCount, this.colorStep);

        var character = this.text.text[this.stepCount];

        this.scan(character);

        await this.sleep(this.delay);
        var r = await this.lookForScanningChars();
        this.found = r[0]
        if (r[1] !== -1) {
            this.index = r[1];
        }
        if (!this.found && this.scanningChars.length > 1) {
            var offset = this.searchBufferText.text.length - this.index;
            var length = this.scanningChars.length - 1;
            var tok = "<" + offset + "," + length + ">";
            if ((length > tok.length) || !this.lzss)
                this.output(tok)
            else
                this.output(this.scanningChars.substring(0, this.scanningChars.length - 1))
            this.outputToken = true;
            this.index = 0;
            this.addToSearchBuffer(this.scanningChars.substring(0, this.scanningChars.length - 1));
            this.scanningChars = [this.scanningChars.substring(this.scanningChars.length - 1, this.scanningChars.length)];
            var r = await this.lookForScanningChars();
            this.found = r[0]
            if (r[1] !== -1) {
                this.index = r[1];
            }
        } else if (this.found && this.stepCount == this.text.text.length - 1) {
            var offset = this.searchBufferText.text.length - this.index;
            var length = this.scanningChars.length;
            var tok = "<" + offset + "," + length + ">";
            if ((length > tok.length) || !this.lzss)
                this.output(tok)
            else
                this.output(this.scanningChars.substring(0, this.scanningChars.length))
            this.outputToken = true;
            this.found = false;
            this.index = 0;
            this.addToSearchBuffer(this.scanningChars);
            this.resetScanning();
        }

        this.clearHightlights(this.searchBufferText);

        this.canvas.renderAll();

        if (!this.found && !this.outputToken) {
            this.output(character);
            this.addToSearchBuffer(this.scanningChars);
            this.resetScanning();
        }

        if (this.outputToken) {
            this.outputToken = false;
        }

        if (!this.fullscreen) {
            this.resizeText();
        }

        this.stepCount++;

        if (this.stepCount >= this.text.text.length) {
            this.stepCountBtn.disabled = true;
            if (this.idNamespace === "encode-" && document.getElementById("decode-input-text")) {
                document.getElementById("decode-input-text").dispatchEvent(new Event("change"));
            }
        } else {
            this.stepCountBtn.disabled = false;
        }

        if (this.autostep && !this.stepCountBtn.disabled) {
            this.stepThrough();
        }
    }

    async lookForScanningChars() {
        var offset = 0;

        for (var i = this.index; i < this.searchBufferText.text.length; i++) {
            if (this.scanningChars.length <= offset) {
                // this.found all scanning characters
                return [true, i - this.scanningChars.length]
            }

            this.highlightRange(this.searchBufferText, i - offset, i + this.scanningChars.length - offset, this.scanningChars, this.colorDefault);
            this.highlightNoClear(this.searchBufferText, i, this.colorCurrent);
            this.canvas.renderAll();
            await this.sleep(this.delay);

            var searchChar = this.searchBufferText.text[i];

            if (this.scanningChars[offset] == searchChar) {
                offset++;
            } else {
                offset = 0;
            }
        }

        return [false, -1]
    }


    output(text) {
        this.outputText.text += text;
        document.getElementById(this.idNamespace + "output-text").innerHTML += text;

        if (this.idNamespace === "encode-" && document.getElementById("decode-input-text")) {
            document.getElementById("decode-input-text").value += text;
        }
    }

    addToSearchBuffer(text) {
        this.searchBufferText.text += text;
        this.canvas.renderAll();
    }

    scan(text) {
        this.scanningChars += text;
        this.scanningText.text = this.scanningChars;
        this.canvas.renderAll();
    }

    resetScanning() {
        this.scanningChars = "";
        this.scanningText.text = this.scanningChars;
    }

    clearHightlights(textObj) {
        if (textObj.highlights) {
            for (var i = 0; i < textObj.highlights.length; i++) {
                this.canvas.remove(textObj.highlights[i])
            }
        }
        textObj.highlights = [];

        if (textObj.chars) {
            for (var i = 0; i < textObj.chars.length; i++) {
                this.canvas.remove(textObj.chars[i])
            }
        }
        textObj.chars = [];
    }

    highlightRange(textObj, start, end, chars, color) {
        this.clearHightlights(textObj);

        this.highlightRangeNoClear(textObj, start, end, chars, color)
    }

    highlightRangeNoClear(textObj, start, end, chars, color) {
        for (var i = start; i < end; i++) {
            var positions = this.getCharacterOfText(textObj, i);
            var rect = new fabric.Rect({
                width: textObj.fontSize / 2,
                height: 10,
                fill: color,
                left: positions[0],
                top: positions[1],
            });
            this.canvas.add(rect);
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
                this.canvas.add(char)
                textObj.chars.push(char)
                this.canvas.renderAll();
            }
        }
    }

    highlightNoClear(textObj, index, color) {
        var upper = index + 1;
        return this.highlightRangeNoClear(textObj, index, upper, "", color);
    }

    highlight(textObj, index, color) {
        var upper = index + 1;
        return this.highlightRange(textObj, index, upper, "", color);
    }

    process() {
        this.stepCount = 0;
        this.stepCountBtn.disabled = false;
        this.canvas.clear();
        this.found = false;
        document.getElementById(this.idNamespace + "output-text").innerHTML = "";

        if (this.idNamespace === "encode-" && document.getElementById("decode-input-text")) {
            document.getElementById("decode-input-text").value = "";
        }

        var input = document.getElementById(this.idNamespace + "input-text").value;

        // create a this.text object
        this.text = new fabric.Text(input, {
            fontFamily: "Roboto Mono",
            fontSize: 72,
            selectable: false,
            originX: "left",
            originY: "top"
        });

        this.text.reposition = function () {
            this.center();
            this.set("top", 20);
            if (this.width > this.canvas.width && this.fullscreen) {
                this.searchBufferText.left = this.left;
                this.searchBufferTitle.left = this.left;
                this.outputTitle.left = this.left;
                this.outputText.left = this.left;
                this.scanningTitle.left = this.left;
                this.scanningText.left = this.left;
            }
        }

        this.canvas.add(this.text);

        this.searchBufferTitle = new fabric.Text("Search Buffer:", {
            fontFamily: "Roboto Mono",
            fontSize: 36,
            left: 0,
            top: this.canvas.height * (2 / 4),
            selectable: false,
        });
        this.searchBufferText = new fabric.Text("", {
            fontFamily: "Roboto Mono",
            fontSize: 36,
            left: 0,
            top: this.canvas.height * (2 / 4) + 36,
            selectable: false,
        });

        this.searchBufferText.reposition = function () {
            this.left = 0;
            this.top = this.canvas.height * (2 / 4) + 36;
            this.setCoords();
        }

        this.canvas.add(this.searchBufferText);
        this.canvas.add(this.searchBufferTitle);


        this.outputTitle = new fabric.Text("Output:", {
            fontFamily: "Roboto Mono",
            fontSize: 36,
            left: 0,
            top: this.canvas.height * (3 / 4),
            selectable: false,
        });
        this.outputText = new fabric.Text("", {
            fontFamily: "Roboto Mono",
            fontSize: 36,
            left: 0,
            top: this.canvas.height * (3 / 4) + 36,
            selectable: false,
        });

        this.outputText.reposition = function () {
            this.left = 0;
            this.top = this.canvas.height * (3 / 4) + 36;
            this.setCoords();
        }

        this.canvas.add(this.outputTitle);
        this.canvas.add(this.outputText);

        this.scanningTitle = new fabric.Text("Scanning:", {
            fontFamily: "Roboto Mono",
            fontSize: 36,
            left: 0,
            top: this.canvas.height * (1 / 4),
            selectable: false,
        });
        this.scanningText = new fabric.Text("", {
            fontFamily: "Roboto Mono",
            fontSize: 36,
            left: 0,
            top: this.canvas.height * (1 / 4) + 36,
            selectable: false,
        });

        this.scanningText.reposition = function () {
            this.left = 0;
            this.top = this.canvas.height * (1 / 4) + 36;
            this.setCoords();
        }

        this.canvas.add(this.scanningTitle);
        this.canvas.add(this.scanningText);

        // this.text.set("selecteable", false)

        this.texts = [this.searchBufferTitle, this.scanningTitle, this.outputTitle, this.searchBufferText, this.scanningText, this.outputText, this.text]
        this.resizeTexts = [this.searchBufferText, this.scanningText, this.outputText, this.text]

        if (this.showMouse) {
            var coords = new fabric.Text(" , ", {
                fontFamily: "Roboto Mono",
            });
            this.canvas.add(coords);
            coords.adjustPosition("left");
            coords.top = this.canvas.height - 80;

            console.log(this.text.left + ", " + this.text.top);

            this.canvas.on("mouse:move", function (options) {
                var pointer = this.canvas.getPointer(event.e);
                var posX = pointer.x;
                var posY = pointer.y;
                coords.text = posX + ", " + posY;
                this.canvas.renderAll();
            });
        }

        if (!this.fullscreen) {
            this.resizeText();
        }

        this.text.reposition();
        if (this.text.width > this.canvas.width && this.fullscreen) {
            this.canvas.zoomToPoint(new fabric.Point(this.text.left + (this.text.width / 2), this.text.top + (this.text.height / 2)), (this.canvas.width / (this.text.width)));
        }
        this.canvas.renderAll();

        this.checkAutostep();
        this.checkLzss();
    }


    resizeText() {
        var _this = this;
        this.resizeTexts.forEach(function (textObj) {
            while (textObj.width > _this.canvas.width) {
                textObj.fontSize--;
                _this.canvas.renderAll();
                // console.log(textObj.fontSize)
            }
            if (textObj.reposition) {
                textObj.reposition();
            }
        });
        this.canvas.renderAll();
    }

    getCharacterOfText(text, characterIndex) {
        var x = text.left;
        var y = text.top;

        y = y + text.fontSize;

        var characterWidth = text.width / text.text.length;
        x = x + characterWidth * characterIndex;

        return [x, y];
    }

    constructor({ ns = "encode-", fs = false }) {
        this.idNamespace = ns;
        this.fullscreen = fs;

        var _this = this;
        window.addEventListener("load", function () { _this.load(); });
        if (document.readyState === "complete") { this.load(); }
    }

    load() {
        var _this = this;
        document.getElementById(this.idNamespace + "form").onsubmit = function () {
            _this.process();
            return false;
        };

        this.stepCountBtn = document.getElementById(this.idNamespace + "step");

        this.stepCountBtn.addEventListener("click", function () {
            _this.stepThrough();
        });

        this.canvas = document.getElementById(this.idNamespace + "canvas");
        if (!this.canvas.getContext) {
            alert("Please use a browser that supports an HTML5 this.canvas");
        }

        // create a wrapper around native this.canvas element (with id="this.canvas")
        this.canvas = new fabric.Canvas(this.idNamespace + "canvas", {
            selection: false,
            evented: false,
            enableRetinaScaling: true
        });

        if (this.fullscreen) {
            this.canvas.defaultCursor = "all-scroll";
            this.canvas.hoverCursor = "all-scroll";
        } else {
            this.canvas.defaultCursor = "default";
            this.canvas.hoverCursor = "default";
        }

        this.canvas.setDimensions({
            width: document.getElementById(this.idNamespace + "canvas-container-jtd").offsetWidth,
            height: document.getElementById(this.idNamespace + "canvas-container-jtd").offsetHeight,
        });

        var slider = document.getElementById(this.idNamespace + 'speed-slider');

        noUiSlider.create(slider, {
            start: [150],
            range: {
                'min': [0],
                'max': [2500]
            },
            step: 50,
            connect: true,
        });



        var sliderValueElement = document.getElementById(this.idNamespace + 'slider-range-value');

        slider.noUiSlider.on('update', function (values, handle) {
            _this.delay = values[handle];
            sliderValueElement.innerHTML = values[handle];
        });

        this.autostepElement = document.getElementById(this.idNamespace + "autostep");
        this.autostepElement.addEventListener('change', function () { _this.checkAutostep(); });

        this.lzssElement = document.getElementById("lzss");
        this.lzssElement.addEventListener('change', function () { _this.checkLzss })

        document.getElementById(this.idNamespace + "input-text").addEventListener("change", function () {
            _this.process();
        })

        if (this.fullscreen) {
            this.canvas.on('mouse:down', function (opt) {
                var evt = opt.e;
                this.isDragging = true;
                this.selection = false;
                this.lastPosX = evt.clientX;
                this.lastPosY = evt.clientY;
            });
            this.canvas.on('mouse:move', function (opt) {
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
            this.canvas.on('mouse:up', function (opt) {
                // on mouse up we want to recalculate new interaction
                // for all objects, so we call setViewportTransform
                this.setViewportTransform(this.viewportTransform);
                this.isDragging = false;
                this.selection = true;
            });
            this.canvas.on('mouse:wheel', function (opt) {
                var delta = opt.e.deltaY;
                var zoom = this.canvas.getZoom();
                zoom *= 0.990 ** delta;
                if (zoom > 20) zoom = 20;
                if (zoom < 0.01) zoom = 0.01;
                this.canvas.zoomToPoint({ x: opt.e.offsetX, y: opt.e.offsetY }, zoom);
                opt.e.preventDefault();
                opt.e.stopPropagation();
                this.texts.forEach(function (textObj) {
                    console.log(textObj);
                    this.canvas.remove(textObj);
                    this.canvas.add(textObj);
                });
            })
        }
        this.process();
    }

    checkAutostep() {
        if (this.autostepElement.checked) {
            this.autostep = true;
            if (!this.stepCountBtn.disabled) {
                this.stepThrough();
            }
        } else {
            this.autostep = false;
        }
    }

    checkLzss() {
        if (this.lzssElement.checked) {
            this.lzss = true;
        } else {
            this.lzss = false;
        }
    }



    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}