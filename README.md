
# Script Validation Library for Qlarr Surveys

This library defines and validates the **dynamic instructions** used in survey design for the [Expression Manager](https://github.com/qlarr-surveys/expression-manager) within the [Qlarr Surveys](https://github.com/qlarr-surveys/expression-manager) platform. These dynamic instructions are written as single JavaScript expressions that return a value, enabling custom survey behavior, such as showing or hiding questions based on answers or counting the words in a response to warn if they are too few.

## How It Works

The library parses the instruction code into an [Abstract Syntax Tree](https://github.com/estree/estree/blob/master/es5.md) (AST) using [acorn](https://github.com/acornjs/acorn) and validates the tree nodes recursively against rules listed in [full-spec.md](https://github.com/qlarr-surveys/expression-manager-script/blob/main/full-spec.md). Here are the most important:
- The dynamic instruction must be an [ExpressionStatement](https://github.com/estree/estree/blob/master/es5.md#expressions) (a statement that returns a value).
- Permitted Nodes:
  - Literals: (simple values like: `1, "a", true`)
  - BinaryExpressions: `1 + 2` `c * b` _left and right expressions are validated recursively_
  - LogicalExpressions: like `a || b` _left and right expressions are validated recursively_
  - UnaryExpressions: Like `!true`, `!a` or `Q1.relevance && Q1.value` 
  - ObjectExpression: to declare an object `{name:"Alfred",age:1}` _properties (key and values) are validated recursively_
  - ArrayExpression: to declare an array `[1,2,3]` _elements are validated recursively_
  - ConditionalExpression, i.e., a ternary `?`/`:` expression. test, consequent and alternate are validated recursively_
- Prohibited nodes:
  - Variable or function declarations
  - Variable assigment or update
  - IfStatement, WhileStatement or any ForStatement
- Conditionally permitted:
  - Variables (Identifiers and MemberExpressions): some common identifiers like `undefined` or `Infinity` are allowed, otherwise all the variables that are used within the code must be white listed...  expression-manager defines a list of accessible variables (from the context of a survey) that are available to each instruction
  - Functions (Call Expression): to call a function... only some common static methods (`Date.parse()`, or `Math.abs(-1)`) and instance methods are allowed (`"abc".length()`, or `[1,2,3].at(0)`)...
- Also any other node is by default not allowed

## API

This Library exposes one function: `function validateCode(instructionList)`
- **Input**: The instructionList is an JSON array of objects, each containing 2 properties:
  - scrip`: the JavaScript instruction script
  - allowedVariables: the survey variables that the script can access
 - **Output**: is an array of error objects, each containing:
   - message: a description of the error
   - start, end: locations of the error within the instruction script


## Usage

This library is used in script-engine module, inside [Expression Manager](https://github.com/qlarr-surveys/expression-manager) to validate the custom dynamic instructions in survey designs.

To use locally
1. Clone the repo
2. run `npm install`
3. Add tests to tests/index.test.js and run `npm test` (This is the best way to test if a given instruction will be accepted during validation)
4. Build library using `npm run build`
5. To use new file in Expression Manager: copy output file dist/expression-manager-script.min.js to /expression-manager/scriptengine/src/main/resources/expression-manager-script.min.js and rebuild the expression manager jar file
