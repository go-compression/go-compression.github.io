
class Arithmetic {

    TopTextSize = 48;
    TopTextColor = "#132743"

    TopTextHighlight = "#407088"

    BarPadding = 40;
    BarColor = "#407088"
    BarBorderColor = "#70adb5"

    BarSelectedColor = "#ffcbcb"

    RangeText = 16;
    RangeColor = "#70adb5"

    CharText = 24;
    CharColor = "#132743"

    RectPadding = 24;

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

        this.canvas = new fabric.Canvas(this.idNamespace + "canvas", {
            selection: false,
            evented: false,
            enableRetinaScaling: true
        })

        this.setupPanning();

        this.canvas.setDimensions({
            width: document.getElementById(this.idNamespace + "canvas-container-jtd").offsetWidth - 2,
            height: document.getElementById(this.idNamespace + "canvas-container-jtd").offsetHeight - 2,
        });

        this.stepBtn = document.getElementById(this.idNamespace + "step");

        this.stepBtn.addEventListener("click", function () {
            _this.stepThrough();
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

        const go = new Go();
        WebAssembly.instantiateStreaming(fetch("/assets/wasm/arithmetic.wasm"), go.importObject).then((result) => {
            go.run(result.instance);
        });

        this.process();
    }

    process() {
        this.canvas.clear();

        var input = document.getElementById(this.idNamespace + "input-text").value;

        this.topText = new fabric.Text(input, {
            top: 5,
            fill: this.TopTextColor,
            fontSize: this.TopTextSize,
            fontFamily: "Roboto Mono"
        })

        this.canvas.add(this.topText)

        this.topText.centerH();

        this.step = 0;
        this.input = input;

        var rect = new fabric.Rect({
            width: this.canvas.width - this.BarPadding,
            height: 20,
            left: this.BarPadding / 2,
            top: 120
        })

        this.canvas.add(rect)
        this.lastRect = rect;

        var freqs = this.freqTable(input)

        var last = 0;
        freqs.forEach((value, key, map) => {
            this.createRange(rect, key, last, last + value, 1);
            this.canvas.renderAll();
            last += value;
        });

        this.freqs = freqs;

        this.stepBtn.disabled = false;

        // var output = arithmeticEncode(input);

        // document.getElementById(this.idNamespace + "output-text").innerHTML = output;
    }

    stepThrough() {
        this.highlight(this.topText, this.step, this.TopTextHighlight);

        var char = this.input.charAt(this.step);

        var start = 0;
        var end = 0;
        for (const [key, value] of this.freqs.entries()) {
            if (key === char) {
                this.selectRange(this.lastRect, key, start, start + value)
                end = start + value;
                break;
            }
            start += value;
        }

        this.step++;

        var rect = new fabric.Rect({
            width: this.canvas.width - this.BarPadding,
            height: 20,
            left: this.BarPadding / 2,
            top: this.lastRect.top + this.lastRect.height + this.CharText + this.RectPadding
        })

        this.canvas.add(rect)

        this.drawLine(start, 0, rect)
        this.drawLine(end, 1, rect)

        this.lastRect = rect;

        var last = 0;
        this.freqs.forEach((value, key, map) => {
            this.createRange(this.lastRect, key, last, last + value, (end - start));
            this.canvas.renderAll();
            last += value;
        });

        if (this.step >= this.input.length) {
            this.stepBtn.disabled = true;
        }
    }

    drawLine(from, to, targetRect) {
        var fromX = this.lastRect.left + (this.lastRect.width * from);
        var fromY = this.lastRect.top + this.lastRect.height;

        var toX = targetRect.left + (targetRect.width * to);
        var toY = targetRect.top;

        var coords = [fromX, fromY, toX, toY]

        this.canvas.add(new fabric.Line(coords, {
            fill: this.BarSelectedColor,
            stroke: this.BarSelectedColor,
            strokeWidth: 2
        }));
    }

    createRange(rect, char, start, end, modifier) {
        this.drawRangeWithColors({ rect: rect, char: char, start: start, end: end, modifier: modifier })
    }

    selectRange(rect, char, start, end) {
        var _this = this;
        this.drawRangeWithColors({ rect: rect, char: char, start: start, end: end, BarColor: _this.BarSelectedColor })
    }

    drawRangeWithColors({ rect, char, start, end, BarColor = false, BarBorderColor = false, CharText = false, CharColor = false, RangeText = false, RangeColor = false, modifier = 1 }) {
        var rangeLeft = rect.left + (start * rect.width);
        var rangeWidth = (end - start) * rect.width;

        var range = new fabric.Rect({
            width: rangeWidth,
            height: rect.height,
            left: rangeLeft,
            top: rect.top,
            fill: BarColor ? BarColor : this.BarColor,
            stroke: BarBorderColor ? BarBorderColor : this.BarBorderColor,
        })

        this.canvas.add(range)

        var char = new fabric.Text(char, {
            left: rangeLeft + (0.5 * rangeWidth),
            top: range.top - (CharText ? CharText : this.CharText),
            fontSize: CharText ? CharText : this.CharText,
            fill: CharColor ? CharColor : this.CharColor,
            fontFamily: "Roboto Mono"
        })

        this.canvas.add(char)

        var leftRangeText = new fabric.Text(this.roundDisplay(start * modifier).toString(), {
            left: rangeLeft,
            top: range.top - (RangeText ? RangeText : this.RangeText) - 1,
            fontSize: RangeText ? RangeText : this.RangeText,
            fill: RangeColor ? RangeColor : this.RangeColor,
            fontFamily: "Roboto Mono"
        })

        leftRangeText.left -= leftRangeText.width / 2

        this.canvas.add(leftRangeText)

        if (end === 1) {
            var rightRangeText = new fabric.Text(this.roundDisplay(end * modifier).toString(), {
                left: rangeLeft + rangeWidth - (this.RangeText / 2),
                top: range.top - (RangeText ? RangeText : this.RangeText) + 1,
                fontSize: RangeText ? RangeText : this.RangeText,
                fill: RangeColor ? RangeColor : this.RangeColor,
                fontFamily: "Roboto Mono"
            })

            this.canvas.add(rightRangeText)
        }
    }

    roundDisplay(num) {
        return +(Math.round(num + "e+3") + "e-3");
    }

    freqTable(str) {
        var chars = new Map();
        for (var i = 0; i < str.length; i++) {
            var char = str.charAt(i);
            if (!chars.get(char)) {
                chars.set(char, 1)
            } else {
                chars.set(char, chars.get(char) + 1)
            }
        }

        chars.forEach((value, key, map) => {
            map.set(key, value / str.length)
        })

        return chars
    }

    setupPanning() {
        this.canvas.defaultCursor = "all-scroll";
        this.canvas.hoverCursor = "all-scroll";
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
    }

    getCharacterOfText(text, characterIndex) {
        var x = text.left;
        var y = text.top;

        y = y + text.fontSize;

        var characterWidth = text.width / text.text.length;
        x = x + characterWidth * characterIndex;

        return [x, y];
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
                height: 6,
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
}