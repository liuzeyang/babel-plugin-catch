const parser = require('@babel/parser')

const DEFAULT = {
  catchCode: identifier => `console.error(${identifier})`,
  identifier: 'e',
  comment: 'catch',
  finallyCode: null,
}

const LIMIT_LINE = 0
module.exports = function ({ types: t }) {
  function catchVisitor(path, state) {
    let node = path.node;
    if (node.body && node.body.leadingComments && node.body.leadingComments.length !== 0) {
      let comments = node.body.leadingComments;
      for (let i = 0; i < comments.length; i++) {
        const comment = comments[i];
        let options = {
          ...DEFAULT,
          ...state.opts
        };
        // ==================== 必须存在 magic comment ===================
        if (comment.value.indexOf(options.comment) !== -1) {
          let blockStatement = node.body;
          // 1. 如果 try catch 包裹了 不需要
          // 2/ 防止 成环
          // 3. 包裹语句 不需要对expression
          // 4. 如果函数内容小于等于 LIMIT_LINE 行不 try catch，当然这个函数可以暴露出来给用户设置
          if (blockStatement.body && t.isTryStatement(blockStatement.body[0])
            || !t.isBlockStatement(blockStatement)
            || !t.isExpressionStatement(blockStatement)
            || blockStatement.body && blockStatement.body.length <= LIMIT_LINE) {
            return;
          }
          if (typeof options.catchCode === "function") {
            options.catchCode = options.catchCode(options.identifier);
          }
          let catchNode = parser.parse(options.catchCode).program.body;
          let finallyNode = options.finallyCode && parser.parse(options.finallyCode).program.body;
          let statement = t.blockStatement(blockStatement.body)
          //     也可以下面这样做：
          // var catchStatement = template.statement(`var t = ${reporter.toString()}`)();
          // var catchBody = catchStatement.declarations[0].init.body;
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