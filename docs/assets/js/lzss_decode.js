'use strict';

class LZDecoder extends LZ {
    constructor(...args) {
        super(...args);
        this.colorStepToken = "#e042f5"
        this.inToken = false;
        this.parseOffset = false;

        this.offsetText = "Token Offset: "
        this.lengthText = "Token Length: "
    }

    async stepThrough() {
        this.stepCountBtn.disabled = true;
        this.highlight(this.text, this.stepCount, this.inToken ? this.colorStepToken : this.colorStep);

        var character = this.text.text[this.stepCount];

        this.scan(character);

        await this.sleep(this.delay / 2);

        if (character === "<") {
            this.inToken = true;
            this.parseOffset = true;

            this.clearHightlights(this.text);
            this.highlight(this.text, this.stepCount, this.colorStepToken);

            this.tokenOffset.fontWeight = "bold";
        } else if (character === ">") {
            this.inToken = false;
            this.tokenLength.fontWeight = "normal";

            var offset = parseInt(this.tokenOffset.text.substr(this.offsetText.length, this.tokenOffset.length));
            var length = parseInt(this.tokenLength.text.substr(this.lengthText.length, this.tokenLength.length));

            for (var i = 0; i <= offset; i++) {
                var start = this.outputText.text.length - i;
                var end = this.outputText.text.length - i + length;
                this.highlightRange(this.outputText, start, end, (offset - i).toString() + " ".repeat(length - 1), this.colorCurrent);
                await this.sleep(this.delay);
            }
            this.clearHightlights(this.outputText)
            await this.sleep(this.delay / 2)
            this.output(this.outputText.text.substr(this.outputText.text.length - offset, length))

            this.tokenOffset.text = this.offsetText;
            this.tokenLength.text = this.lengthText;
        } else if (character === ",") {
            this.parseOffset = false;
            this.tokenOffset.fontWeight = "normal";
            this.tokenLength.fontWeight = "bold";
        } else if (this.inToken) {
            if (this.parseOffset) {
                this.tokenOffset.text += character;
            } else {
                this.tokenLength.text += character;
            }
        } else {
            this.output(character);
        }

        await this.sleep(this.delay / 2);

        this.resetScanning();

        this.canvas.renderAll();

        if (!this.fullscreen) {
            this.resizeText();
        }

        this.stepCount++;

        if (this.stepCount >= this.text.text.length) {
            this.stepCountBtn.disabled = true;
        } else {
            this.stepCountBtn.disabled = false;
        }

        if (this.autostep && !this.stepCountBtn.disabled) {
            this.stepThrough();
        }
    }

    process() {
        this.stepCount = 0;
        this.stepCountBtn.disabled = false;
        this.canvas.clear();
        this.found = false;
        document.getElementById(this.idNamespace + "output-text").innerHTML = "";

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
                this.outputTitle.left = this.left;
                this.outputText.left = this.left;
                this.scanningTitle.left = this.left;
                this.scanningText.left = this.left;
            }
        }

        this.canvas.add(this.text);

        this.tokenOffset = new fabric.Text(this.offsetText, {
            fontFamily: "Roboto Mono",
            fontSize: 36,
            left: 0,
            top: this.canvas.height * (1 / 4),
            selectable: false,
        });
        this.tokenLength = new fabric.Text(this.lengthText, {
            fontFamily: "Roboto Mono",
            fontSize: 36,
            left: 0,
            top: this.canvas.height * (1 / 4) + (36 * 2),
            selectable: false,
        });

        this.canvas.add(this.tokenOffset);
        this.canvas.add(this.tokenLength);

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
            top: this.canvas.height * (2 / 4),
            selectable: false,
        });
        this.scanningText = new fabric.Text("", {
            fontFamily: "Roboto Mono",
            fontSize: 36,
            left: 0,
            top: this.canvas.height * (2 / 4) + 36,
            selectable: false,
        });

        this.scanningText.reposition = function () {
            this.left = 0;
            this.top = this.canvas.height * (2 / 4) + 36;
            this.setCoords();
        }

        this.canvas.add(this.scanningTitle);
        this.canvas.add(this.scanningText);

        // this.text.set("selecteable", false)

        this.texts = [this.scanningTitle, this.outputTitle, this.scanningText, this.outputText, this.text]
        this.resizeTexts = [this.scanningText, this.outputText, this.text]

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
}