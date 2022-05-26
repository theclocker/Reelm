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
exports.Todo = void 0;
var lib_1 = require("../lib");
var Todo = /** @class */ (function () {
    function Todo() {
        this.items = new Array({ done: true, value: '123' }, { done: false, value: '456' });
        this.inputValue = '';
    }
    Todo.prototype.toggleTodoItem = function (item) {
        item.done = !item.done;
    };
    Todo.prototype.makeListItem = function (item) {
        return lib_1.Render.label(lib_1.Render.input().repeatApply('setAttribute', [
            ['type', 'checkbox'],
            ['checked', item.done]
        ]), lib_1.Render.input().setAttribute('value', item.value)).addEventListener('click', this.toggleTodoItem.bind(this, item));
    };
    Todo.prototype.addTodoItem = function (event) {
        event.preventDefault();
        this.items.push({
            done: false,
            value: this.inputValue.value,
        });
        console.log(this.items);
    };
    Todo.prototype.changeInputValue = function (event) {
        this.inputValue = event.target.value;
    };
    Todo.prototype.render = function () {
        var _this = this;
        return (lib_1.Render.div(lib_1.Render.form(lib_1.Render.input().repeatApply('setAttribute', [
            ['placeholder', 'Please enter todo item...'],
            ['type', 'text'],
            ['value', this.inputValue.value]
        ]).addEventListener('keyup', this.changeInputValue.bind(this))).addEventListener('submit', this.addTodoItem.bind(this)), lib_1.Render.span(this.inputValue), 
        // Render.span(this.items.map(item => item.value)),
        lib_1.Render.div(
        // Pending items
        this.items.filter(function (item) { return !item.done; }).map(function (item) { return (_this.makeListItem(item)); })), lib_1.Render.hr(), lib_1.Render.p(
        // Done items
        this.items.filter(function (item) { return true; }).map(function (item) { return (_this.makeListItem(item)); }))));
    };
    __decorate([
        lib_1.Reelm.Watch,
        __metadata("design:type", Array)
    ], Todo.prototype, "items", void 0);
    __decorate([
        lib_1.Reelm.Watch,
        __metadata("design:type", String)
    ], Todo.prototype, "inputValue", void 0);
    Todo = __decorate([
        lib_1.Reelm.Component
    ], Todo);
    return Todo;
}());
exports.Todo = Todo;
//# sourceMappingURL=Todo.js.map