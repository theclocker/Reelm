"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ts = require("typescript");
function default_1(program, pluginOptions) {
    return function (ctx) {
        return function (sourceFile) {
            var visitor = function (node) {
                /**
                 * Should inject interface into class file decorated by library class decorators
                 * @param decorator The decorator expression
                 * @returns should inject or not
                 */
                var shouldInjectInterface = function (decorator) {
                    console.log(123);
                    var injectToEach = ['Something'];
                    if (ts.isCallExpression(decorator.expression)) {
                        console.log(decorator.expression.expression.getText());
                        return ts.isIdentifier(decorator.expression.expression) && injectToEach.includes(decorator.expression.expression.getText());
                    }
                    console.log(decorator.expression.getText());
                    return ts.isIdentifier(decorator.expression) && injectToEach.includes(decorator.expression.getText());
                };
                //
                if (ts.isDecorator(node) && shouldInjectInterface(node)) {
                    var newInterfaceName = node.parent.name.getText();
                    var currentLength = node.getSourceFile().text.length;
                    var newInterface = "\ninterface ".concat(newInterfaceName, " extends AnonymousClass {}");
                    var newFile = node.getSourceFile().text + newInterface;
                    //
                    // console.log(node.getSourceFile().getText(), {
                    //   newLength: newFile.length,
                    //   span: {
                    //     start: 0,
                    //     length: currentLength
                    //   }
                    // });
                    //
                    try {
                        console.log(newFile);
                        ts.updateSourceFile(node.getSourceFile(), newFile, {
                            newLength: newFile.length,
                            span: {
                                start: 0,
                                length: currentLength
                            }
                        });
                        // node.getSourceFile().update(newFile, {
                        //   newLength: newFile.length,
                        //   span: {
                        //     start: 0,
                        //     length: currentLength
                        //   }
                        // });
                        console.log('file updated ----');
                        // console.log(node.getSourceFile().getText());
                    }
                    catch (e) {
                        console.error(e);
                    }
                    console.log('passed');
                }
                return ts.visitEachChild(node, visitor, ctx);
            };
            return ts.visitNode(sourceFile, visitor);
        };
    };
}
exports.default = default_1;
//# sourceMappingURL=transformer.js.map