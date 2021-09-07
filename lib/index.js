const parser = require('@babel/parser')

const DEFAULT = {
  catchCode: identifier => `console.error(${identifier})`,
  identifier: 'e',
  comment: 'catch',
  finallyCode: null,
}

module.exports = function ({ types: t }) {
  function catchVisitor(path, state) {
    let node = path.node;
    if (node.body && node.body.leadingComments && node.body.leadingComments.length !== 0) {
      let comments = node.body.leadingComments;
      for (let i = 0; i < comments.length; i++) {
        const comment = comments[i];
        if (comment.value.indexOf(options.comment) !== -1) {
          let options = {
            ...DEFAULT,
            ...state.opts
          };
          if (typeof options.catchCode === "function") {
            options.catchCode = options.catchCode(options.identifier);
          }
          let catchNode = parser.parse(options.catchCode).program.body;
          let finallyNode = options.finallyCode && parser.parse(options.finallyCode).program.body;
          if (node.body.body.length === 1 && t.isTryStatement(node.body.body[0])) {
            return;
          }
          let statement = t.blockStatement(node.body.body)
          let tryCatchAst = t.tryStatement(
            statement,
            t.catchClause(
              t.identifier(options.identifier),
              t.blockStatement(catchNode)
            ),
            finallyNode && t.blockStatement(finallyNode)
          )
          node.body.body = [tryCatchAst]
        }
      }
    }
  }

  return {
    visitor: {
      ClassMethod(path, state) {
        catchVisitor(path, state)
      },
      FunctionDeclaration(path, state) {
        catchVisitor(path, state)
      },
      ArrowFunctionExpression(path, state) {
        catchVisitor(path, state)
      }
    }
  };
}