"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Table = void 0;
var Render_1 = require("../lib/Render");
var Decorators_1 = require("../lib/Decorators");
var Table = /** @class */ (function () {
    function Table(headers, rows) {
        this.headers = headers;
        this.rows = rows;
        this.something = "Hello, World!";
        this.foo = 123;
        // console.log(this.foo);
    }
    Table.prototype.style = function () {
        return "\n      background: red;\n      display: inline-block;\n      border: 1px solid black;\n    ";
    };
    Table.prototype.onclick = function (event) {
        // this.bar = Math.random();
        // this.something = `Hello, ${Math.random()}`;
    };
    Table.prototype.onInputChange = function (event) {
        this.something = event.target.value;
    };
    Table.prototype.getRandomHeader = function () {
        this.foo = Math.random();
    };
    Table.prototype.render = function () {
        return Render_1.Render.div(Render_1.Render.div(this.foo).addEventListener('click', this.getRandomHeader.bind(this)), Render_1.Render.div(this.something), Render_1.Render.input().setAttribute('value', this.something).addEventListener('keyup', this.onInputChange.bind(this))
            .repeatApply('setAttribute', [
            ['type', 'text'],
            ['placeholder', 'name']
        ]), Render_1.Render.table(Render_1.Render.thead(Th(this.headers)), Render_1.Render.tbody(this.rows.map(function (row) { return (new Tr(row)).render(); }))));
    };
    __decorate([
        Decorators_1.Reelm.Watch,
        __metadata("design:type", String)
    ], Table.prototype, "something", void 0);
    __decorate([
        Decorators_1.Reelm.Watch,
        __metadata("design:type", Number)
    ], Table.prototype, "foo", void 0);
    __decorate([
        Decorators_1.Reelm.Prop,
        __metadata("design:type", Function),
        __metadata("design:paramtypes", []),
        __metadata("design:returntype", void 0)
    ], Table.prototype, "style", null);
    __decorate([
        Decorators_1.Reelm.Prop,
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Event]),
        __metadata("design:returntype", void 0)
    ], Table.prototype, "onclick", null);
    Table = __decorate([
        Decorators_1.Reelm.Component,
        __metadata("design:paramtypes", [Array, Array])
    ], Table);
    return Table;
}());
exports.Table = Table;
var Th = function (headers) { return headers.map(function (header) {
    return Render_1.Render.th(header).style('border: 1px solid black; font-weight: bold; background: green;');
}); };
var Tr = /** @class */ (function () {
    function Tr(row) {
        this.row = row;
    }
    Tr.prototype.render = function () {
        return Render_1.Render.tr(this.row.map(function (cell) {
            return Render_1.Render.td(cell).style('td {color: white}');
        }));
    };
    Tr = __decorate([
        Decorators_1.Reelm.Component,
        __metadata("design:paramtypes", [Array])
    ], Tr);
    return Tr;
}());
//# sourceMappingURL=Table.js.map