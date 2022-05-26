"use strict";
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
var __values = (this && this.__values) || function(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Element = exports.Render = void 0;
var Decorators_1 = require("./Decorators");
var _ = require("lodash");
var AccessMethod;
(function (AccessMethod) {
    AccessMethod[AccessMethod["Function"] = 0] = "Function";
    AccessMethod[AccessMethod["Parameter"] = 1] = "Parameter";
})(AccessMethod || (AccessMethod = {}));
/**
 * The render proxy handler that intercepts calls to the Render proxy and creates HTML Elements recursively
 */
var RenderHandler = /** @class */ (function () {
    function RenderHandler() {
        /**
         * Proxy being attached to the HTMLElement resolved from the render method
         */
        this.AttachedProxyHandler = /** @class */ (function () {
            function class_1() {
            }
            class_1.prototype.set = function (target, prop, receiver) {
                if (this[prop] != undefined) {
                    return this[prop](target, prop, receiver)(receiver());
                }
                target[prop] = receiver;
                return true;
            };
            class_1.prototype.get = function (target, prop, receiver) {
                var methods = Object.getOwnPropertyNames(Object.getPrototypeOf(this));
                if (!(methods.includes(prop))) {
                    if (typeof target[prop] == 'function') {
                        return function () {
                            var args = [];
                            for (var _i = 0; _i < arguments.length; _i++) {
                                args[_i] = arguments[_i];
                            }
                            args = args.map(function (arg) {
                                if (arg instanceof Decorators_1.Reelm.WatchProp) {
                                    return arg.value;
                                }
                                return arg;
                            });
                            target[prop].apply(target, __spreadArray([], __read(args), false));
                            return receiver;
                        };
                    }
                    return target[prop];
                }
                return (this[prop])(target, prop, receiver);
            };
            class_1.prototype.listen = function (target, prop, receiver) {
                return function () {
                    var e_1, _a;
                    var args = [];
                    for (var _i = 0; _i < arguments.length; _i++) {
                        args[_i] = arguments[_i];
                    }
                    try {
                        for (var args_1 = __values(args), args_1_1 = args_1.next(); !args_1_1.done; args_1_1 = args_1.next()) {
                            var fn = args_1_1.value;
                            console.log(fn);
                            fn.onChange((function (existingElement, newValue) {
                                // console.log(existingElement, newValue);
                                existingElement.innerHTML = newValue;
                            }).bind(null, target));
                        }
                    }
                    catch (e_1_1) { e_1 = { error: e_1_1 }; }
                    finally {
                        try {
                            if (args_1_1 && !args_1_1.done && (_a = args_1.return)) _a.call(args_1);
                        }
                        finally { if (e_1) throw e_1.error; }
                    }
                };
            };
            class_1.prototype.isProxy = function () {
                return true;
            };
            class_1.prototype.element = function (target, prop, receiver) {
                return target;
            };
            class_1.prototype.style = function (target, prop, receiver) {
                return function (args) {
                    var _a;
                    var currentStyle = (_a = target.getAttribute('style')) !== null && _a !== void 0 ? _a : "";
                    currentStyle = (currentStyle == "" || currentStyle.slice(-1) == ';') ? currentStyle : "".concat(currentStyle, "; ");
                    target.setAttribute('style', "".concat(currentStyle).concat(args));
                    return receiver;
                };
            };
            class_1.prototype.class = function (target, prop, receiver) {
                var _this = this;
                return function (args) {
                    target.setAttribute('class', args.reduce(function (prev, curr) { return "".concat(prev, " ").concat(curr); }, ""));
                    return _this.get(target, prop, receiver);
                };
            };
            return class_1;
        }());
    }
    /**
     * Render HTML elements and return them based on the property accessed on the proxy and the values passed
     * @param target An empty object of type any to intercept any property with any name
     * @param prop An html tag name
     * @returns function that renders html elements based on the values and prop passed
     */
    RenderHandler.prototype.get = function (target, prop) {
        // if (target.access === AccessMethod.Parameter) {
        //   return this.renderFunction(target, prop);
        // }
        return this.renderFunction(target, prop);
    };
    RenderHandler.prototype.renderFunction = function (target, prop) {
        var _this = this;
        return function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            console.log(_.cloneDeep(args), prop);
            var isArgProxy = (typeof args[1] == 'function') || ((typeof args[1] == 'object') && (args[1].isProxy === true));
            if (args.length === 1) {
                // console.log(args[0] instanceof Reelm.WatchProp && (args[0] as any).original != undefined);
                // Create an element and assign a value to it, if the argument is not an array
                if (!(args[0] instanceof Array) && !args[0].isProxy && !(args[0] instanceof Decorators_1.Reelm.WatchProp && args[0].value instanceof Array)) {
                    return _this.attachCallsProxy(_this.createElement(target, args[0], prop));
                }
                // If the argument is an array, assign it to the base argument and continue
                if (args[0] instanceof Array) {
                    args = args[0];
                }
            }
            // If there are two arguments, an array of values and an element to create for the values
            if (args.length == 2 && isArgProxy && args[0] instanceof Array) {
                return _this.createParentFromChildren(target, prop, args[0], args[1]);
            }
            // If the arguments are comprised of a mix of data, pass it to a recursive function
            // console.log(target, prop, args);
            return _this.createParentFromValues(target, prop, args);
        };
    };
    /**
     * Creates HTML Elements given an array of values to create HTML Elements for and the type of element to create
     * @param prop The parent's html tag to create
     * @param values The children to create the elements for
     * @param nextElement The next element of the proxy to create
     * @returns The final HTML Element created from the children and the next element function
     */
    RenderHandler.prototype.createParentFromChildren = function (target, prop, values, nextElement) {
        var base = this.createElement(target, "", prop);
        // Loop through the values and call the element to create with the value
        // when accessing a value we call the proxy's get method again to create an element with a value (or multiple values)
        var subElements = values.map(function (value) {
            return nextElement(value).element;
        });
        base.append.apply(base, __spreadArray([], __read(subElements), false));
        return this.attachCallsProxy(base);
    };
    /**
     * Given values and a prop, creates elements recursively
     * @param target The proxy target
     * @param prop The Parent HTML Element's tag to create
     * @param values The values to create the elements with
     * @returns The parent HTML Element that was created
     */
    RenderHandler.prototype.createParentFromValues = function (target, prop, values) {
        var _this = this;
        var base = document.createElement(prop);
        values.forEach(function (curr) {
            if (curr instanceof Object && curr instanceof HTMLElement) {
                curr = curr.element;
            }
            // Create elements when the typeof the curr is not an object and not an html element
            if (!(curr instanceof HTMLElement) && typeof curr !== 'object') {
                curr = _this.createElement(target, curr, prop);
            }
            // If the curr is an instance of Array, re-call the proxy with the last prop given
            if (curr instanceof Array) {
                curr = _this.get(target, prop)(curr).element;
            }
            // If the element is a watch prop
            if (curr instanceof Decorators_1.Reelm.WatchProp) {
                curr = Array.from(_this.createElement(target, curr, prop).childNodes);
            }
            base.append.apply(base, __spreadArray([], __read((curr instanceof Array ? curr : [curr])), false));
        });
        return this.attachCallsProxy(base);
    };
    /**
     * Create a simple html element with the tag name and inner html
     * @param value the value to insert into the element
     * @param type the type of the element
     * @returns HTMLElement
     */
    RenderHandler.prototype.createElement = function (target, value, type) {
        var el = document.createElement(type);
        var innerHtml = value;
        // If the argument passed in is a WatchProp, subscribe to changes
        if (value instanceof Decorators_1.Reelm.WatchProp) {
            var watchPropValue_1 = function (watchProp) {
                if (watchProp.value instanceof Array) {
                    // console.log((this.createParentFromValues(target, type, watchProp.value) as any).element);
                    // return el.appendChild((this.createParentFromValues(target, type, watchProp.value) as any).element);
                    return watchProp.value.reduce(function (prev, child) {
                        console.log(child);
                        prev.appendChild((function () {
                            if (child.isProxy || child instanceof HTMLElement) {
                                return child.element;
                            }
                            var newElement = document.createElement(type);
                            newElement.innerHTML = child;
                            return newElement;
                        })());
                        return prev;
                    }, document.createElement('div')).innerHTML;
                }
                return value.value;
            };
            el.innerHTML = watchPropValue_1(value);
            var listenTo_1 = value.original != undefined ? value.original : value;
            listenTo_1.onChange((function (existingElement, newValue) {
                //console.log(newValue, existingElement, target);
                console.log(listenTo_1.recreateWithSteps(listenTo_1.watchSymbol));
                existingElement.innerHTML = watchPropValue_1(newValue);
            }).bind(null, el));
            return el;
        }
        if (!!value) {
            el.replaceChildren((value instanceof Object && value.isProxy) ? value.element : innerHtml);
        }
        return el;
    };
    RenderHandler.prototype.attachCallsProxy = function (on) {
        return new Proxy(on, new this.AttachedProxyHandler);
    };
    return RenderHandler;
}());
// Export a proxy for the user, using the proxyHandler
exports.Render = new Proxy({
    access: AccessMethod.Function,
    isProxy: true
}, new RenderHandler);
exports.Element = new Proxy({
    access: AccessMethod.Parameter,
    isProxy: true
}, new RenderHandler);
//# sourceMappingURL=Render.js.map