var ElementCreator = new Proxy({}, {
    get: function (t, p) {
        return "<".concat(p, "></").concat(p, ">");
    }
});
var someObj = {
    something: 123
};
var SomethingProxy = new Proxy(someObj, {
    get: function (target, property) {
        if (property === 'something') {
            return 'You cant access something';
        }
        return target[property] * 2;
    }
});
var someRandomDiv = ElementCreator.div;
console.log(someRandomDiv);
console.log(SomethingProxy.something);
//# sourceMappingURL=createElementProxy.js.map