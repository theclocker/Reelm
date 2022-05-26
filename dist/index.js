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
Object.defineProperty(exports, "__esModule", { value: true });
exports.todo = exports.getTable = exports.Render = exports.getDiv = void 0;
var Render_1 = require("./lib/Render");
Object.defineProperty(exports, "Render", { enumerable: true, get: function () { return Render_1.Render; } });
var Todo_1 = require("./examples/Todo");
Object.prototype.repeatApply = function (functionName, functionArguments) {
    var _this = this;
    functionArguments.forEach(function (value) {
        _this[functionName].apply(_this, __spreadArray([], __read(value), false));
    });
    return this;
};
function getDiv(rows) {
    console.log(rows);
    return Render_1.Render.div(rows).style("div > div {\n      border: 1px solid black;\n      margin-bottom: 2px;\n    }\n    div > div:nth-child(1) div > div {\n      border: 1px solid black;\n      margin: 2px;\n    }\n    div > div > div div  {\n      box-sizing: border-box;\n      padding-left: 15px;\n    }").element;
}
exports.getDiv = getDiv;
function getTable(headers, rows) {
    return Render_1.Render.table(Render_1.Render.thead(headers.map(function (header) {
        return Render_1.Render.th(header).style('border: 1px solid black; font-weight: bold; background: green;');
    })), Render_1.Render.tbody(rows.map(function (row) {
        return Render_1.Render.tr(row.map(function (cell) {
            return Render_1.Render.td(cell).style('td {color: white}');
        }));
    }))).style("\n      background: red;\n      border: 1px solid black;\n  ")
        .addEventListener('click', function () {
        console.log(123);
    }).element;
}
exports.getTable = getTable;
var headers = ["Name", "Age", "School"];
var rows = [
    ["Harry Potter", "18", "Hogwarts"],
    ["Izuku Midoriya", "16", "UA High"],
    ["Yonatan Vega", "24", "College of Management"],
];
exports.todo = new Todo_1.Todo().render();
//# sourceMappingURL=index.js.map