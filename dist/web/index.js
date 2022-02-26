/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
var Reelm;
/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/Render.ts":
/*!***********************!*\
  !*** ./src/Render.ts ***!
  \***********************/
/***/ ((__unused_webpack_module, exports) => {

eval("\r\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\r\nexports.Render = void 0;\r\n/**\r\n * The render proxy handler that intercepts calls to the Render proxy and creates HTML Elements recursively\r\n */\r\nvar RenderHandler = /** @class */ (function () {\r\n    function RenderHandler() {\r\n    }\r\n    /**\r\n     * Render HTML elements and return them based on the property accessed on the proxy and the values passed\r\n     * @param target An empty object of type any to intercept any property with any name\r\n     * @param prop An html tag name\r\n     * @returns function that renders html elements based on the values and prop passed\r\n     */\r\n    RenderHandler.prototype.get = function (target, prop) {\r\n        var _this = this;\r\n        return function () {\r\n            var args = [];\r\n            for (var _i = 0; _i < arguments.length; _i++) {\r\n                args[_i] = arguments[_i];\r\n            }\r\n            if (args.length === 1) {\r\n                // Create an element and assign a value to it, if the argument is not an array\r\n                if (!(args[0] instanceof Array))\r\n                    return _this.attachCallsProxy(_this.createElement(args[0], prop));\r\n                // If the argument is an array, assign it to the base argument and continue\r\n                args = args[0];\r\n            }\r\n            console.log(prop);\r\n            console.log(target);\r\n            // If there are two arguments, an array of values and an element to create for the values\r\n            if (args.length == 2 && typeof args[1] == 'function' && args[0] instanceof Array) {\r\n                return _this.createParentFromChildren(prop, args[0], args[1]);\r\n            }\r\n            // If the arguments are comprised of a mix of data, pass it to a recursive function\r\n            return _this.createParentFromValues(target, prop, args);\r\n        };\r\n    };\r\n    /**\r\n     * Creates HTML Elements given an array of values to create HTML Elements for and the type of element to create\r\n     * @param prop The parent's html tag to create\r\n     * @param values The children to create the elements for\r\n     * @param nextElement The next element of the proxy to create\r\n     * @returns The final HTML Element created from the children and the next element function\r\n     */\r\n    RenderHandler.prototype.createParentFromChildren = function (prop, values, nextElement) {\r\n        var base = this.createElement(\"\", prop);\r\n        // Loop through the values and call the element to create with the value\r\n        // when accessing a value we call the proxy's get method again to create an element with a value (or multiple values)\r\n        var subElements = values.map(function (value) { return nextElement(value).element; });\r\n        base.append.apply(base, subElements);\r\n        return this.attachCallsProxy(base);\r\n    };\r\n    /**\r\n     * Given values and a prop, creates elements recursively\r\n     * @param target The proxy target\r\n     * @param prop The Parent HTML Element's tag to create\r\n     * @param values The values to create the elements with\r\n     * @returns The parent HTML Element that was created\r\n     */\r\n    RenderHandler.prototype.createParentFromValues = function (target, prop, values) {\r\n        var _this = this;\r\n        var base = this.createElement(\"\", prop);\r\n        values.forEach(function (curr) {\r\n            if (curr instanceof Object && curr instanceof HTMLElement) {\r\n                curr = curr.element;\r\n            }\r\n            // Create elements when the typeof the curr is not an object and not an html element\r\n            if (!(curr instanceof HTMLElement) && typeof curr !== 'object') {\r\n                curr = _this.createElement(curr, prop);\r\n            }\r\n            // If the curr is an instance of Array, re-call the proxy with the last prop given\r\n            if (curr instanceof Array) {\r\n                curr = _this.get(target, prop)(curr).element;\r\n            }\r\n            base.appendChild(curr);\r\n        });\r\n        return this.attachCallsProxy(base);\r\n    };\r\n    /**\r\n     * Create a simple html element with the tag name and inner html\r\n     * @param value the value to insert into the element\r\n     * @param type the type of the element\r\n     * @returns HTMLElement\r\n     */\r\n    RenderHandler.prototype.createElement = function (value, type) {\r\n        var el = document.createElement(type);\r\n        el.innerHTML = value;\r\n        return el;\r\n    };\r\n    RenderHandler.prototype.attachCallsProxy = function (on) {\r\n        // return on;\r\n        return new Proxy(on, new RenderHandler.AttachedProxyHandler);\r\n    };\r\n    RenderHandler.AttachedProxyHandler = /** @class */ (function () {\r\n        function class_1() {\r\n        }\r\n        class_1.prototype.get = function (target, prop, receiver) {\r\n            // console.log(prop);\r\n            // console.log(prop, (this as any)[prop](target, prop, receiver));\r\n            return (this[prop])(target, prop, receiver);\r\n        };\r\n        class_1.prototype.element = function (target, prop, receiver) {\r\n            return target;\r\n        };\r\n        class_1.prototype.style = function (target, prop, receiver) {\r\n            var _this = this;\r\n            return function (args) {\r\n                _this._css = args;\r\n                target.setAttribute('style', args);\r\n                return _this.get(target, prop, receiver);\r\n            };\r\n        };\r\n        class_1.prototype.class = function (target, prop, receiver) {\r\n            var _this = this;\r\n            return function (args) {\r\n                _this._class = args;\r\n                target.setAttribute('class', args.reduce(function (prev, curr) { return \"\".concat(prev, \" \").concat(curr); }, \"\"));\r\n                return _this.get(target, prop, receiver);\r\n            };\r\n        };\r\n        return class_1;\r\n    }());\r\n    return RenderHandler;\r\n}());\r\n// Export a proxy for the user, using the proxyHandler\r\nexports.Render = new Proxy({}, new RenderHandler);\r\n\n\n//# sourceURL=webpack://Reelm/./src/Render.ts?");

/***/ }),

/***/ "./src/index.ts":
/*!**********************!*\
  !*** ./src/index.ts ***!
  \**********************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

eval("\r\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\r\nexports.getDiv = exports.getTable = exports.Render = void 0;\r\nvar Render_1 = __webpack_require__(/*! ./Render */ \"./src/Render.ts\");\r\nObject.defineProperty(exports, \"Render\", ({ enumerable: true, get: function () { return Render_1.Render; } }));\r\nfunction getDiv(rows) {\r\n    return Render_1.Render.div(rows).element;\r\n}\r\nexports.getDiv = getDiv;\r\nfunction getTable(headers, rows) {\r\n    return Render_1.Render.table(Render_1.Render.thead(headers, Render_1.Render.th), Render_1.Render.tbody(rows.map(function (cells) { return Render_1.Render.tr(cells, Render_1.Render.td); }))).style('background: red').element;\r\n}\r\nexports.getTable = getTable;\r\n\n\n//# sourceURL=webpack://Reelm/./src/index.ts?");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval devtool is used.
/******/ 	var __webpack_exports__ = __webpack_require__("./src/index.ts");
/******/ 	Reelm = __webpack_exports__;
/******/ 	
/******/ })()
;