"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.Reelm = void 0;
var nanoid_1 = require("nanoid");
var _ = require("lodash");
var deepEqual = require('deep-equal');
var Reelm;
(function (Reelm) {
    function Component(constructor) {
        return /** @class */ (function (_super) {
            __extends(RenderContext, _super);
            function RenderContext() {
                var _this = _super !== null && _super.apply(this, arguments) || this;
                _this.props = {};
                _this.state = {};
                return _this;
            }
            RenderContext.prototype.setProps = function (props) {
                this.props = props;
            };
            RenderContext.prototype.setState = function (state) {
                this.state = state;
            };
            Object.defineProperty(RenderContext.prototype, "componentSymbol", {
                get: function () {
                    return Symbol(constructor.name);
                },
                enumerable: false,
                configurable: true
            });
            RenderContext.prototype.render = function () {
                var element = _super.prototype.render.call(this);
                var proxyTarget = Object.getPrototypeOf(Object.getPrototypeOf(this));
                var originalClassName = proxyTarget.constructor.name;
                if (element == undefined) {
                    throw new Error("".concat(originalClassName, " Render method must return an element, returns undefined."));
                }
                return element;
            };
            return RenderContext;
        }(constructor));
    }
    Reelm.Component = Component;
    function Watch(target, propertyKey, expression) {
        var baseValue = (new target.constructor)[propertyKey];
        var returnClass = createWatchClassFromObjectPrototype(baseValue);
        Object.defineProperty(target, propertyKey, {
            get: function () { return returnClass; },
            set: function (value) {
                returnClass.value = value;
            }
        });
    }
    Reelm.Watch = Watch;
    function createWatchClassFromObjectPrototype(targetObject) {
        var resolvedTarget = targetObject instanceof WatchManipulated ? targetObject.manipulatedValue : targetObject;
        var returnClass = new (/** @class */ (function (_super) {
            __extends(class_1, _super);
            function class_1() {
                var _this = _super !== null && _super.apply(this, arguments) || this;
                _this._sym = Symbol("".concat(targetObject.constructor.name, ".").concat((0, nanoid_1.nanoid)()));
                return _this;
            }
            Object.defineProperty(class_1.prototype, "watchSymbol", {
                get: function () {
                    return this._sym;
                },
                enumerable: false,
                configurable: true
            });
            Object.defineProperty(class_1.prototype, "original", {
                get: function () {
                    if (targetObject instanceof WatchManipulated)
                        return targetObject.original;
                    return undefined;
                },
                enumerable: false,
                configurable: true
            });
            return class_1;
        }(WatchProp)))(resolvedTarget);
        var manipulationOriginal = targetObject instanceof WatchManipulated ? targetObject.original : returnClass;
        // Get the base prototype of the value that is being updated
        var propPrototype = Object.getPrototypeOf(resolvedTarget);
        // The new prototype is based on WatchProp class, this way comparing and instanceof WatchProp still works
        var newProto = Object.getPrototypeOf(returnClass);
        var _loop_1 = function (fnName) {
            if (propPrototype[fnName] instanceof Function && newProto[fnName] === undefined) {
                newProto[fnName] = function () {
                    var args = [];
                    for (var _i = 0; _i < arguments.length; _i++) {
                        args[_i] = arguments[_i];
                    }
                    console.log(fnName);
                    // If the target's symbol prop does not exist yet, create it
                    // Call the original function and store the return value
                    var objectToCompare = returnClass.original != undefined ? returnClass.original : returnClass;
                    var before = _.cloneDeep(objectToCompare.value);
                    var newValue = returnClass.value[fnName].apply(returnClass.value, args);
                    if (!deepEqual(before, objectToCompare.value)) {
                        objectToCompare.addExecutionStep(manipulationOriginal.watchSymbol, fnName, args);
                        // console.log(objectToCompare);
                        objectToCompare.triggerChange();
                    }
                    // new instance of a class extending the WatchManipulated class, so you cant import and use it, its an abstract class
                    var manipulationTarget = new (/** @class */ (function (_super) {
                        __extends(class_2, _super);
                        function class_2() {
                            return _super !== null && _super.apply(this, arguments) || this;
                        }
                        return class_2;
                    }(WatchManipulated)))(manipulationOriginal, newValue);
                    return createWatchClassFromObjectPrototype(manipulationTarget);
                };
            }
        };
        // const existingOrNewSymbol = Symbol(`${target.constructor.name}.${propertyKey}.${nanoid()}`);
        // Bind each prototype method to the return classes's value
        for (var fnName in Object.getOwnPropertyDescriptors(propPrototype)) {
            _loop_1(fnName);
        }
        Object.setPrototypeOf(returnClass, newProto);
        return returnClass;
    }
    var WatchProp = /** @class */ (function () {
        function WatchProp(_value) {
            this._value = _value;
            this.listeners = [];
            this._execution = new Map();
            this.recreateWithSteps = this.recreateWithSteps.bind(this);
            this.addExecutionStep = this.addExecutionStep.bind(this);
        }
        Object.defineProperty(WatchProp.prototype, "value", {
            get: function () {
                return this._value;
            },
            set: function (value) {
                this._value = value;
                this.triggerChange(value);
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(WatchProp.prototype, "execution", {
            get: function () {
                return this._execution;
            },
            enumerable: false,
            configurable: true
        });
        WatchProp.prototype.addExecutionStep = function (identifier, fnName, argumentsArr) {
            if (!this._execution.has(identifier))
                this._execution.set(identifier, new Array());
            this._execution.get(identifier).push({
                fnName: fnName,
                argumentsArr: argumentsArr
            });
        };
        WatchProp.prototype.recreateWithSteps = function (identifier) {
            if (!this._execution.has(identifier))
                return undefined;
            var value = this._value;
            console.log(this);
            this._execution.get(identifier).map(function (_a) {
                var _b;
                var fnName = _a.fnName, argumentsArr = _a.argumentsArr;
                value = (_b = value[fnName]).apply.apply(_b, __spreadArray([value], __read(argumentsArr), false));
            });
            return value;
        };
        WatchProp.prototype.onChange = function (callback) {
            return this.listeners.push(callback);
        };
        WatchProp.prototype.unsubscribe = function (index) {
            this.listeners.splice(index, 1);
        };
        WatchProp.prototype.triggerChange = function (value) {
            var _this = this;
            this.listeners.forEach(function (func) {
                // Call each of the callbacks when the value is updated
                func(value !== null && value !== void 0 ? value : _this._value);
            });
        };
        return WatchProp;
    }());
    Reelm.WatchProp = WatchProp;
    function Prop(target, propertyKey, descriptor) {
        descriptor.value.prop = true;
        return descriptor.value;
    }
    Reelm.Prop = Prop;
    var WatchManipulated = /** @class */ (function () {
        function WatchManipulated(_originalProp, _manipulatedValue) {
            this._originalProp = _originalProp;
            this._manipulatedValue = _manipulatedValue;
        }
        ;
        Object.defineProperty(WatchManipulated.prototype, "original", {
            get: function () {
                return this._originalProp; // Return the original object
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(WatchManipulated.prototype, "manipulatedValue", {
            get: function () {
                return this._manipulatedValue;
            },
            enumerable: false,
            configurable: true
        });
        return WatchManipulated;
    }());
    Reelm.WatchManipulated = WatchManipulated;
})(Reelm = exports.Reelm || (exports.Reelm = {}));
//# sourceMappingURL=Decorators.js.map