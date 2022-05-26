"use strict";
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
var arr = [false, 'not null', null, 'abc', undefined, 5, 0, 6];
function filterNegatives(filterFalse, filterZero) {
    if (filterFalse === void 0) { filterFalse = false; }
    if (filterZero === void 0) { filterZero = false; }
    var originalArray = this;
    var length = originalArray.length - 1;
    return new (/** @class */ (function () {
        function class_1() {
            this.arrIndex = 0;
        }
        class_1.prototype.shouldFilterIndex = function (index) {
            if ((originalArray[index] == null || originalArray[index] == undefined)) {
                return true;
            }
            if (filterFalse && originalArray[index] === false || filterZero && originalArray[index] === 0) {
                return true;
            }
            return false;
        };
        class_1.prototype.next = function () {
            while (this.arrIndex <= length && this.shouldFilterIndex(this.arrIndex)) {
                this.arrIndex++;
            }
            var done = this.arrIndex > length;
            return {
                done: done,
                value: done ? null : originalArray[this.arrIndex++],
            };
        };
        class_1.prototype.forEach = function (func) {
            var e_1, _a;
            var index = 0;
            try {
                for (var _b = __values(this), _c = _b.next(); !_c.done; _c = _b.next()) {
                    var value = _c.value;
                    func(value, index++, this.arrIndex - 1);
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
                }
                finally { if (e_1) throw e_1.error; }
            }
        };
        class_1.prototype.toArray = function () {
            return __spreadArray([], __read(this), false);
        };
        class_1.prototype[Symbol.iterator] = function () {
            return this;
        };
        return class_1;
    }()));
}
function filterNegativesPropertyDefinition(filterFalse, filterZero) {
    return {
        enumerable: true,
        get: function () {
            if (filterFalse === undefined && filterZero === undefined) {
                return filterNegatives.bind(this);
            }
            return (filterNegatives.bind(this))(filterFalse, filterZero);
        },
        set: function () { return undefined; }
    };
}
Object.defineProperties(Array.prototype, {
    valids: filterNegativesPropertyDefinition(false, false),
    concretePositives: filterNegativesPropertyDefinition(true, false),
    positives: filterNegativesPropertyDefinition(true, true),
    filterNegation: filterNegativesPropertyDefinition()
});
console.log(__spreadArray([], __read(arr.valids), false));
console.log(__spreadArray([], __read(arr.concretePositives), false));
console.log(__spreadArray([], __read(arr.positives), false));
console.log(__spreadArray([], __read(arr.filterNegation(false, true)), false));
//# sourceMappingURL=iterableTest.js.map