import * as ts from 'typescript';

export default function(program: ts.Program, pluginOptions: {}) {
  return (ctx: ts.TransformationContext) => {
    return (sourceFile: ts.SourceFile) => {
      const visitor = (node: ts.Node): ts.Node => {
        /**
         * Should inject interface into class file decorated by library class decorators
         * @param decorator The decorator expression
         * @returns should inject or not
         */
        const shouldInjectInterface = (decorator: ts.Decorator): boolean => {
          console.log(123);
          const injectToEach = ['Something'];
          if (ts.isCallExpression(decorator.expression)) {
            console.log(decorator.expression.expression.getText());
            return ts.isIdentifier(decorator.expression.expression) && injectToEach.includes(decorator.expression.expression.getText());
          }
          console.log(decorator.expression.getText());
          return ts.isIdentifier(decorator.expression) && injectToEach.includes(decorator.expression.getText());
        }
        //
        if (ts.isDecorator(node) && shouldInjectInterface(node)) {
          const newInterfaceName = node.parent.name.getText();
          const currentLength = node.getSourceFile().text.length;
          const newInterface = `\ninterface ${newInterfaceName} extends AnonymousClass {}`;
          const newFile = node.getSourceFile().text + newInterface;
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
          } catch (e) {
            console.error(e);
          }
          console.log('passed');
        }
        return ts.visitEachChild(node, visitor, ctx);
      };
      return ts.visitNode(sourceFile, visitor);
    };
  }
}