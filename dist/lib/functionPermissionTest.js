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
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
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
var _this = this;
var permissions = {
    'get/users': true,
    'get/purchases': false,
};
var Users = /** @class */ (function () {
    function Users() {
    }
    Users.prototype.user = function (id, p) {
        return __awaiter(this, void 0, void 0, function () {
            var res;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, p(id)];
                    case 1:
                        res = _a.sent();
                        console.log(res);
                        return [2 /*return*/];
                }
            });
        });
    };
    Users.prototype.purchases = function (userId, p) {
        return __awaiter(this, void 0, void 0, function () {
            var purchases;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        console.log('users purchases');
                        return [4 /*yield*/, p(userId)];
                    case 1:
                        purchases = _a.sent();
                        console.log(purchases);
                        return [2 /*return*/];
                }
            });
        });
    };
    __decorate([
        callable('get/users'),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [String, Object]),
        __metadata("design:returntype", Promise)
    ], Users.prototype, "user", null);
    __decorate([
        callable('get/purchases'),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [String, Object]),
        __metadata("design:returntype", Promise)
    ], Users.prototype, "purchases", null);
    return Users;
}());
var Pets = /** @class */ (function () {
    function Pets() {
    }
    Pets.prototype.purchases = function (userId, p) {
        return __awaiter(this, void 0, void 0, function () {
            var purchases;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        console.log('pets purchases');
                        return [4 /*yield*/, p(userId)];
                    case 1:
                        purchases = _a.sent();
                        console.log(purchases);
                        return [2 /*return*/];
                }
            });
        });
    };
    __decorate([
        callable('get/purchases'),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [String, Object]),
        __metadata("design:returntype", Promise)
    ], Pets.prototype, "purchases", null);
    Pets = __decorate([
        service
    ], Pets);
    return Pets;
}());
function service(constructor) {
    var newConstructor = new (/** @class */ (function (_super) {
        __extends(class_1, _super);
        function class_1() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        return class_1;
    }(constructor)));
    var newPrototype = Object.getPrototypeOf(newConstructor);
    for (var funcName in constructor.prototype) {
        var isDecorated = !!(constructor.prototype[funcName].prototype || {}).callableDecorated;
        var url = isDecorated && constructor.prototype[funcName].prototype.callableUrl;
        if (!url)
            continue;
        if (!permissions[url]) {
            newPrototype[funcName] = undefined;
        }
    }
    Object.setPrototypeOf(newConstructor, newPrototype);
    return newConstructor.constructor;
}
function callable(url, fetchArgs) {
    if (fetchArgs === void 0) { fetchArgs = {}; }
    var isDenied = !permissions[url];
    // Create a promise to call
    return function (target, key, descriptor) {
        var targetFunction = target[key].bind(target);
        // The reason for using a function here, rather than an arrow function, is to preserve binding to the target
        descriptor.value = (function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            // if undefined OR false returns a rejection promise
            if (isDenied)
                return Promise.reject(new Error("Permission Denied for: '".concat(url, "'")));
            // Instead of promise, create a fetch function here
            return targetFunction.apply(void 0, __spreadArray(__spreadArray([], __read(args), false), [function () {
                    var args = [];
                    for (var _i = 0; _i < arguments.length; _i++) {
                        args[_i] = arguments[_i];
                    }
                    new Promise(function (res, rej) {
                        setTimeout(function () { res(' >> Response from promise'); }, 1000);
                    });
                }], false));
        });
        descriptor.value.prototype = __assign(__assign({}, (descriptor.value.prototype || {})), { callableDecorated: true, callableUrl: url });
    };
}
var usersService = new Users();
(function () { return __awaiter(_this, void 0, void 0, function () {
    var e_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, usersService.user('123')];
            case 1:
                _a.sent();
                _a.label = 2;
            case 2:
                _a.trys.push([2, 4, , 5]);
                return [4 /*yield*/, usersService.purchases('456')];
            case 3:
                _a.sent();
                return [3 /*break*/, 5];
            case 4:
                e_1 = _a.sent();
                console.error(e_1.message);
                return [3 /*break*/, 5];
            case 5: return [2 /*return*/];
        }
    });
}); })();
var petsService = new Pets();
console.log(petsService, Object.getPrototypeOf(petsService));
petsService.purchases('678');
//# sourceMappingURL=functionPermissionTest.js.map