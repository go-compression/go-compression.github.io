
class Arithmetic {

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

        const go = new Go();
        WebAssembly.instantiateStreaming(fetch("/assets/wasm/arithmetic.wasm"), go.importObject).then((result) => {
            go.run(result.instance);
        });
    }

    process() {
        var input = document.getElementById(this.idNamespace + "input-text").value;

        var output = arithmeticEncode(input);

        document.getElementById(this.idNamespace + "output-text").innerHTML = output;
    }
}