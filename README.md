
# Script Validation Library for Qlarr Surveys

This library defines and validates the **dynamic instructions** used in survey design for the [Expression Manager](https://github.com/qlarr-surveys/expression-manager) within the [Qlarr Surveys](https://github.com/qlarr-surveys/expression-manager) platform. These dynamic instructions are written as single JavaScript expressions that return a value, enabling custom survey behavior, such as showing or hiding questions based on answers or counting the words in a response to warn if they are too few.

## How It Works

The library parses the instruction code into an [Abstract Syntax Tree](https://github.com/estree/estree/blob/master/es5.md) (AST) using [acorn](https://github.com/acornjs/acorn) and validates the tree nodes recursively some against rules like:
- The dynamic instruction must be an [ExpressionStatement](https://github.com/estree/estree/blob/master/es5.md#expressions) (a statement that returns a value).
- Permitted Nodes:
  - Literals: (simple values like: `1, "a", true`)
  - Binary Expressions: `1 + 2` `c * b` _left and right expressions are validated recursively_
  - Logical expressions: like `a || b` _left and right expressions are validated recursively_
  - Unary expressions: Like `!true`, `!a` or `Q1.relevance && Q1.value` 
  - [Object Expression](https://github.com/estree/estree/blob/master/es5.md#objectexpression): to declare an object `{name:"Alfred",age:1}` _properties (key and values) are validated recursively_
  - [Array Expression](https://github.com/estree/estree/blob/master/es5.md#arrayexpression): to declare an array `[1,2,3]` _elements are validated recursively_
  - [conditional expression](https://github.com/estree/estree/blob/master/es5.md#conditionalexpression), i.e., a ternary `?`/`:` expression. test, consequent and alternate are validated recursively_
- Prohibited nodes:
  - Variable or function declarations
  - Variable assigment or update
  - IfStatement, WhileStatement or any ForStatement
- Conditionally permitted:
  - Variables (Identifiers and MemberExpressions): some common identifiers like `undefined` or `Infinity` are allowed, otherwise all the variables that are used within the code must be white listed...  expression-manager defines a list of accessible variables (from the context of a survey) that are available to each instruction
  - Functions (Call Expression): to call a function... only some common static methods (`Date.parse()`, or `Math.abs(-1)`) and instance methods are allowed (`"abc".length()`, or `[1,2,3].at(0)`)...
- Also any other node is by default not allowed

### API

This Library exposes one instruction `function validateCode(instructionList)`
- **Input**: The instructionList is an JSON array of objects, each containing 2 properties:
  - scrip`: the JavaScript instruction script
  - allowedVariables: the survey variables that the script can access
 - **Output**: is an array of error objects, each containing:
   - message: a description of the error
   - start, end: locations of the error within the instruction script


### Example Usage

```javascript
const { validateInstructions } = require('qlarr-surveys-script-validation');

const instructionList = [
  {
    script: 'answer.length > 10', // example script to count words
    allowedVariables: ['answer'] // the variables accessible in this script
  }
];

const errors = validateInstructions(instructionList);

if (errors.length > 0) {
  errors.forEach((error) => {
    console.error(`Validation Error: ${error.message}, at position ${error.start}-${error.end}`);
  });
} else {
  console.log("All instructions are valid!");
}
```

---
