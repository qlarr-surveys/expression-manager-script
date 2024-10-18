This document specifies how each ESTree AST node type is validated.

- [Identifier](#identifier)
- [Literal](#literal)
  - [RegExpLiteral](#regexpliteral)
- [Programs](#programs)
- [Functions](#functions)
- [Statements](#statements)
  - [ExpressionStatement](#expressionstatement)
  - [BlockStatement](#blockstatement)
  - [EmptyStatement](#emptystatement)
  - [DebuggerStatement](#debuggerstatement)
  - [WithStatement](#withstatement)
  - [Control flow](#control-flow)
    - [ReturnStatement](#returnstatement)
    - [LabeledStatement](#labeledstatement)
    - [BreakStatement](#breakstatement)
    - [ContinueStatement](#continuestatement)
  - [Choice](#choice)
    - [IfStatement](#ifstatement)
    - [SwitchStatement](#switchstatement)
      - [SwitchCase](#switchcase)
  - [Exceptions](#exceptions)
    - [ThrowStatement](#throwstatement)
    - [TryStatement](#trystatement)
      - [CatchClause](#catchclause)
  - [Loops](#loops)
    - [WhileStatement](#whilestatement)
    - [DoWhileStatement](#dowhilestatement)
    - [ForStatement](#forstatement)
    - [ForInStatement](#forinstatement)
- [Declarations](#declarations)
  - [FunctionDeclaration](#functiondeclaration)
  - [VariableDeclaration](#variabledeclaration)
    - [VariableDeclarator](#variabledeclarator)
- [Expressions](#expressions)
  - [ThisExpression](#thisexpression)
  - [ArrayExpression](#arrayexpression)
  - [ObjectExpression](#objectexpression)
    - [Property](#property)
  - [FunctionExpression](#functionexpression)
  - [Unary operations](#unary-operations)
    - [UnaryExpression](#unaryexpression)
      - [UnaryOperator](#unaryoperator)
    - [UpdateExpression](#updateexpression)
      - [UpdateOperator](#updateoperator)
  - [Binary operations](#binary-operations)
    - [BinaryExpression](#binaryexpression)
      - [BinaryOperator](#binaryoperator)
    - [AssignmentExpression](#assignmentexpression)
      - [AssignmentOperator](#assignmentoperator)
    - [LogicalExpression](#logicalexpression)
      - [LogicalOperator](#logicaloperator)
    - [MemberExpression](#memberexpression)
  - [ConditionalExpression](#conditionalexpression)
  - [CallExpression](#callexpression)
  - [NewExpression](#newexpression)
  - [SequenceExpression](#sequenceexpression)
- [Patterns](#patterns)


# Identifier


```js
interface Identifier <: Expression, Pattern {
    type: "Identifier";
    name: string;
}
```

### Validation: Only those javascript identifiers are allowed (`undefined`, `NaN`, `Infinity`, `-Infinity`)

# Literal

```js
interface Literal <: Expression {
    type: "Literal";
    value: string | boolean | null | number | RegExp;
}
```

A literal token. Like `1`, `true`, `"this is a string"`, `/abc/`
### Validation: All literals are safe

## RegExpLiteral

```js
interface RegExpLiteral <: Literal {
  regex: {
    pattern: string;
    flags: string;
  };
}
```
### Validation: All RegExpLiteral are safe

# Programs

```js
interface Program <: Node {
    type: "Program";
    body: [ Directive | Statement ];
}
```

A complete program source tree.
### Validation: The dynamic instruction is expected to be a Program, with 1 Expression Statement inside the body.

# Functions

```js
interface Function <: Node {
    id: Identifier | null;
    params: [ Pattern ];
    body: FunctionBody;
}
```

A function [declaration](#functiondeclaration) or [expression](#functionexpression).
### Validation: function declarations are not allowed. function expressions are allowed.

# Statements

```js
interface Statement <: Node { }
```

Any statement.

## ExpressionStatement

```js
interface ExpressionStatement <: Statement {
    type: "ExpressionStatement";
    expression: Expression;
}
```

An expression statement, i.e., a statement consisting of a single expression.
### Validation: expression is recursively validated.
## Directive

```js
interface Directive <: ExpressionStatement {
    expression: Literal;
    directive: string;
}
```

A directive from the directive prologue of a script or function.
The `directive` property is the raw string source of the directive without quotes.
### Validation: Not allowed

## BlockStatement

```js
interface BlockStatement <: Statement {
    type: "BlockStatement";
    body: [ Statement ];
}
```

A block statement, i.e., a sequence of statements surrounded by braces.
### Validation: statements (body) are recursively validated.

## FunctionBody

```js
interface FunctionBody <: BlockStatement {
    body: [ Directive | Statement ];
}
```

### Validation: statements (body) are recursively validated.

## EmptyStatement

```js
interface EmptyStatement <: Statement {
    type: "EmptyStatement";
}
```

An empty statement, i.e., a solitary semicolon.

### Validation: not allowed

## DebuggerStatement

```js
interface DebuggerStatement <: Statement {
    type: "DebuggerStatement";
}
```

A `debugger` statement.
### Validation: statements (body) are recursively validated.

## WithStatement

```js
interface WithStatement <: Statement {
    type: "WithStatement";
    object: Expression;
    body: Statement;
}
```

A `with` statement.
### Validation: not allowed

## Control flow (only return is allowed)

### ReturnStatement

```js
interface ReturnStatement <: Statement {
    type: "ReturnStatement";
    argument: Expression | null;
}
```

A `return` statement.
### Validation: argument is validated

### LabeledStatement

```js
interface LabeledStatement <: Statement {
    type: "LabeledStatement";
    label: Identifier;
    body: Statement;
}
```

A labeled statement, i.e., a statement prefixed by a `break`/`continue` label.
### Validation: not allowed

### BreakStatement

```js
interface BreakStatement <: Statement {
    type: "BreakStatement";
    label: Identifier | null;
}
```

A `break` statement.
### Validation: not allowed

### ContinueStatement

```js
interface ContinueStatement <: Statement {
    type: "ContinueStatement";
    label: Identifier | null;
}
```

A `continue` statement.
### Validation: not allowed

## Choice 

### IfStatement

```js
interface IfStatement <: Statement {
    type: "IfStatement";
    test: Expression;
    consequent: Statement;
    alternate: Statement | null;
}
```

An `if` statement.
### Validation: not allowed. Use ConditionalExpressions instead;

### SwitchStatement

```js
interface SwitchStatement <: Statement {
    type: "SwitchStatement";
    discriminant: Expression;
    cases: [ SwitchCase ];
}
```

A `switch` statement.
### Validation: not allowed

#### SwitchCase

```js
interface SwitchCase <: Node {
    type: "SwitchCase";
    test: Expression | null;
    consequent: [ Statement ];
}
```

A `case` (if `test` is an `Expression`) or `default` (if `test === null`) clause in the body of a `switch` statement.
### Validation: not allowed

## Exceptions

### ThrowStatement

```js
interface ThrowStatement <: Statement {
    type: "ThrowStatement";
    argument: Expression;
}
```

A `throw` statement.
### Validation: not allowed

### TryStatement

```js
interface TryStatement <: Statement {
    type: "TryStatement";
    block: BlockStatement;
    handler: CatchClause | null;
    finalizer: BlockStatement | null;
}
```

A `try` statement. If `handler` is `null` then `finalizer` must be a `BlockStatement`.
### Validation: not allowed

#### CatchClause

```js
interface CatchClause <: Node {
    type: "CatchClause";
    param: Pattern;
    body: BlockStatement;
}
```

A `catch` clause following a `try` block.
### Validation: not allowed

## Loops

### WhileStatement

```js
interface WhileStatement <: Statement {
    type: "WhileStatement";
    test: Expression;
    body: Statement;
}
```

A `while` statement.
### Validation: not allowed

### DoWhileStatement

```js
interface DoWhileStatement <: Statement {
    type: "DoWhileStatement";
    body: Statement;
    test: Expression;
}
```

A `do`/`while` statement.
### Validation: not allowed

### ForStatement

```js
interface ForStatement <: Statement {
    type: "ForStatement";
    init: VariableDeclaration | Expression | null;
    test: Expression | null;
    update: Expression | null;
    body: Statement;
}
```

A `for` statement.
### Validation: not allowed

### ForInStatement

```js
interface ForInStatement <: Statement {
    type: "ForInStatement";
    left: VariableDeclaration |  Pattern;
    right: Expression;
    body: Statement;
}
```

A `for`/`in` statement.
### Validation: not allowed

# Declarations (all not allowed)

```js
interface Declaration <: Statement { }
```

Any declaration node. Note that declarations are considered statements; this is because declarations can appear in any statement context.

## FunctionDeclaration

```js
interface FunctionDeclaration <: Function, Declaration {
    type: "FunctionDeclaration";
    id: Identifier;
}
```

A function declaration. Note that unlike in the parent interface `Function`, the `id` cannot be `null`.
### Validation: not allowed

## VariableDeclaration

```js
interface VariableDeclaration <: Declaration {
    type: "VariableDeclaration";
    declarations: [ VariableDeclarator ];
    kind: "var";
}
```

A variable declaration.
### Validation: not allowed
### VariableDeclarator

```js
interface VariableDeclarator <: Node {
    type: "VariableDeclarator";
    id: Pattern;
    init: Expression | null;
}
```

A variable declarator.
### Validation: not allowed

# Expressions

```js
interface Expression <: Node { }
```

Any expression node. Since the left-hand side of an assignment may be any expression in general, an expression can also be a pattern.

## ThisExpression

```js
interface ThisExpression <: Expression {
    type: "ThisExpression";
}
```

A `this` expression.
### Validation: not allowed

## ArrayExpression

```js
interface ArrayExpression <: Expression {
    type: "ArrayExpression";
    elements: [ Expression | null ];
}
```

An array expression. An element might be `null` if it represents a hole in a sparse array. E.g. `[1,,2]`.
### Validation: elements are validated

## ObjectExpression

```js
interface ObjectExpression <: Expression {
    type: "ObjectExpression";
    properties: [ Property ];
}
```

An object expression.
### Validation: properties are validated

### Property

```js
interface Property <: Node {
    type: "Property";
    key: Literal | Identifier;
    value: Expression;
    kind: "init" | "get" | "set";
}
```

A literal property in an object expression can have either a string or number as its `key`. Ordinary property initializers have a `kind` value `"init"`; getters and setters have the kind values `"get"` and `"set"`, respectively.
### Validation: only init properties are allowed.. key and value are validated.

## FunctionExpression

```js
interface FunctionExpression <: Function, Expression {
    type: "FunctionExpression";
}
```

A `function` expression.

## Unary operations

### UnaryExpression

```js
interface UnaryExpression <: Expression {
    type: "UnaryExpression";
    operator: UnaryOperator;
    prefix: boolean;
    argument: Expression;
}
```

A unary operator expression.
### Validation: those operators are allowed `+`, `-`, `!`, `~`, `typeof` are allowed, argument is validated

#### UnaryOperator

```js
enum UnaryOperator {
    "-" | "+" | "!" | "~" | "typeof" | "void" | "delete"
}
```

A unary operator token.

### UpdateExpression

```js
interface UpdateExpression <: Expression {
    type: "UpdateExpression";
    operator: UpdateOperator;
    argument: Expression;
    prefix: boolean;
}
```

An update (increment or decrement) operator expression.
### Validation: not allowed

#### UpdateOperator

```js
enum UpdateOperator {
    "++" | "--"
}
```

An update (increment or decrement) operator token.

## Binary operations

### BinaryExpression

```js
interface BinaryExpression <: Expression {
    type: "BinaryExpression";
    operator: BinaryOperator;
    left: Expression;
    right: Expression;
}
```

A binary operator expression.
### Validation: both right and left expressions are validated

#### BinaryOperator

```js
enum BinaryOperator {
    "==" | "!=" | "===" | "!=="
         | "<" | "<=" | ">" | ">="
         | "<<" | ">>" | ">>>"
         | "+" | "-" | "*" | "/" | "%"
         | "|" | "^" | "&" | "in"
         | "instanceof"
}
```

A binary operator token.

### AssignmentExpression

```js
interface AssignmentExpression <: Expression {
    type: "AssignmentExpression";
    operator: AssignmentOperator;
    left: Pattern | Expression;
    right: Expression;
}
```

An assignment operator expression.
### Validation: not allowed

#### AssignmentOperator

```js
enum AssignmentOperator {
    "=" | "+=" | "-=" | "*=" | "/=" | "%="
        | "<<=" | ">>=" | ">>>="
        | "|=" | "^=" | "&="
}
```

An assignment operator token.

### LogicalExpression

```js
interface LogicalExpression <: Expression {
    type: "LogicalExpression";
    operator: LogicalOperator;
    left: Expression;
    right: Expression;
}
```

A logical operator expression.
### Validation: Just like BinaryExpressions, right and left expressions are validated;

#### LogicalOperator

```js
enum LogicalOperator {
    "||" | "&&"
}
```

A logical operator token.

### MemberExpression

```js
interface MemberExpression <: Expression, Pattern {
    type: "MemberExpression";
    object: Expression;
    property: Expression;
    computed: boolean;
}
```

A member expression. If `computed` is `true`, the node corresponds to a computed (`a[b]`) member expression and `property` is an `Expression`. If `computed` is `false`, the node corresponds to a static (`a.b`) member expression and `property` is an `Identifier`.

### Validation: 
 - Computed Expressions are not allowed. There is a function `Qlarr.safeAccess(obj:Object,propertyName:string)` which takes input: an object and property name and checks if the object contains this property
 - Those static variables are allowed
   - object is `Number` and following are properties `EPSILON`, `MAX_SAFE_INTEGER`, `MAX_VALUE`, `MIN_SAFE_INTEGER`, `MIN_VALUE`, `NaN`, `NEGATIVE_INFINITY`, `POSITIVE_INFINITY`
   - object is `Math` and following are properties `E`, `LN10`, `LN2`, `LOG10E`, `LOG2E`, `PI`, `SQRT1_2`, `SQRT2`
 - There is a list of survey state variables that can be whitelisted through argument: allowedVariables...
 - `length` is allowed as a safe propery, as long as the object is safe

## ConditionalExpression

```js
interface ConditionalExpression <: Expression {
    type: "ConditionalExpression";
    test: Expression;
    alternate: Expression;
    consequent: Expression;
}
```

A conditional expression, i.e., a ternary `?`/`:` expression.

### Validation: test alternate and consequent  expressions are validated;

## CallExpression

```js
interface CallExpression <: Expression {
    type: "CallExpression";
    callee: Expression;
    arguments: [ Expression ];
}
```

A function or method call expression.


### Validation: 
 - callee cannot be an identifier... those are the global methods. It must be a member expression because functions are ment to be called as instance methods only
 - Those static variables are allowed
   - Object is `Number` and the following are methods: `isFinite`, `isInteger`, `isNaN`, `isSafeInteger`, `parseFloat`, `parseInt`
   - Object is `Math` and the following are methods: `abs`, `acos`, `acosh`, `asin`, `asinh`, `atan`, `atan2`, `atanh`, `cbrt`, `ceil`, `clz32`, `cos`, `cosh`, `exp`, `expm1`, `f16round`, `floor`, `fround`, `hypot`, `imul`, `log`, `log10`, `log1p`, `log2`, `max`, `min`, `pow`, `random`, `round`, `sign`, `sin`, `sinh`, `sqrt`, `tan`, `tanh`, `trunc`
   - Object is `Object` and the following are methods: `entries`, `keys`
   - Object is `QlarrScripts` and the following are methods: `separator`, `safeAccess`, `and`, `isValidSqlDateTime`, `listStrings`, `isValidTime`, `isValidDay`, `sqlDateTimeToDate`, `formatSqlDate`, `formatTime`, `dateStringToDate`, `toSqlDateTimeIgnoreTime`, `toSqlDateTime`, `toSqlDateTimeIgnoreDate`, `isVoid`, `isNotVoid`, `wordCount`, `hasDuplicates`
 - Assuming that the calee is a safe Member Expression... those instance methods are safe
   - Instance methods of `Object`: `toString`, `toLocaleString`
   - Instance methods of `Number`: `toExponential`, `toFixed`, `toLocaleString`, `toPrecision`
   - Instance methods of `RegExp`: `exec`, `test`, `toString`
   - Instance methods of `Array`: `at`, `filter`, `find`, `findIndex`, `findLast`, `findLastIndex`, `includes`, `indexOf`, `keys`, `lastIndexOf`, `map`, `pop`, `push`, `reduce`, `reduceRight`, `reverse`, `shift`, `slice`, `some`, `sort`, `splice`, `toReversed`, `toSorted`, `toSpliced`, `toString`
   - Instance methods of `String`: `charAt`, `concat`, `endsWith`, `includes`, `indexOf`, `lastIndexOf`, `match`, `matchAll`, `padEnd`, `padStart`, `repeat`, `replace`, `replaceAll`, `search`, `slice`, `split`, `startsWith`, `substring`, `toLowerCase`, `toUpperCase`, `trim`, `trimEnd`, `trimStart`
   - Instance methods of `Date`: `getDate`, `getDay`, `getFullYear`, `getHours`, `getMilliseconds`, `getMinutes`, `getMonth`, `getSeconds`, `getTime`, `getTimezoneOffset`, `getUTCDate`, `getUTCDay`, `getUTCFullYear`, `getUTCHours`, `getUTCMilliseconds`, `getUTCMinutes`, `getUTCMonth`, `getUTCSeconds`, `setDate`, `setFullYear`, `setHours`, `setMilliseconds`, `setMinutes`, `setMonth`, `setSeconds`, `setTime`, `setUTCDate`, `setUTCFullYear`, `setUTCHours`, `setUTCMilliseconds`, `setUTCMinutes`, `setUTCMonth`, `setUTCSeconds`, `toDateString`, `toISOString`, `toJSON`, `toLocaleDateString`, `toLocaleString`, `toLocaleTimeString`, `toString`, `toTimeString`, `toUTCString`
 - Otherwise, arguments are validated

## NewExpression

```js
interface NewExpression <: Expression {
    type: "NewExpression";
    callee: Expression;
    arguments: [ Expression ];
}
```

A `new` expression.
### Validation: allowed if calee is a literal (Date or RegExp). arguments are validated

## SequenceExpression

```js
interface SequenceExpression <: Expression {
    type: "SequenceExpression";
    expressions: [ Expression ];
}
```

A sequence expression, i.e., a comma-separated sequence of expressions.
### Validation: Not allowed

```js
interface Pattern <: Node { }
```
