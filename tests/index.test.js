import isSafeCode from "../src/index";

test("All literals are accepted", () => {
  expect(validateInstruction("1")).toStrictEqual([]);
  expect(validateInstruction("'String'")).toStrictEqual([]);
  expect(validateInstruction("true")).toStrictEqual([]);
  expect(validateInstruction("null")).toStrictEqual([]);
  expect(validateInstruction("/d+/")).toStrictEqual([]);
});

test("some javascript Identifiers are accepted", () => {
  expect(validateInstruction("NaN")).toStrictEqual([]);
  expect(validateInstruction("undefined")).toStrictEqual([]);
  expect(validateInstruction("Infinity")).toStrictEqual([]);
  expect(validateInstruction("-Infinity")).toStrictEqual([]);
});

test("Identifiers are allowed only, if they were params in a function expression", () => {
  expect(
    validateInstruction(
      "[1, 2, 3].filter(function(x) { return x % 2 === 0; });"
    )
  ).toStrictEqual([]);
});

test("object and Array expressions are allowed, each key and value will be validated", () => {
  expect(validateInstruction('undefined == {"name":"John"}')).toStrictEqual([]);
  expect(validateInstruction("[1,2,3,4,5]")).toStrictEqual([]);
  expect(validateInstruction('undefined == {"name":x}')).toStrictEqual([
    {
      end: 22,
      message: "unidetified: x",
      start: 21,
    },
  ]);
  expect(validateInstruction("[1,2,3,4,x]")).toStrictEqual([
    {
      end: 10,
      message: "unidetified: x",
      start: 9,
    },
  ]);
});

test("All global methods are not allowedd", () => {
  expect(validateInstruction('1 + eval("2")')).toStrictEqual([
    {
      end: 13,
      message: "global methods are not permitted",
      start: 4,
    },
  ]);

  expect(validateInstruction('1 + parseInt("2")')).toStrictEqual([
    {
      end: 17,
      message: "global methods are not permitted",
      start: 4,
    },
  ]);

  expect(validateInstruction("Number()")).toStrictEqual([
    {
      end: 8,
      message: "global methods are not permitted",
      start: 0,
    },
  ]);
});

test("function and arrow function excpressions are allowed", () => {
  expect(
    validateInstruction("[1,2,3,4,5].filter(function(x){return x%2==0})")
  ).toStrictEqual([]);

  expect(validateInstruction("[1,2,3,4,5].filter(x => x%2==0)")).toStrictEqual(
    []
  );
});

test("Some static methods are allowed", () => {
  expect(validateInstruction("Number.isFinite(1/0)")).toStrictEqual([]);
  expect(validateInstruction("Math.abs(-1)")).toStrictEqual([]);
  expect(validateInstruction("Date.now()")).toStrictEqual([]);
  expect(
    validateInstruction('Object.keys({"name":"Bob", "age": 23 + 1})')
  ).toStrictEqual([]);
  expect(
    validateInstruction("QlarrScripts.isVoid(x.value)", ["x.value"])
  ).toStrictEqual([]);
});

test("instance methods are allowed", () => {
  expect(validateInstruction("x.value.length()", ["x.value"])).toStrictEqual(
    []
  );
  expect(validateInstruction("[1,2,3,4,5].length()")).toStrictEqual([]);
  expect(
    validateInstruction("[1,2,3,4,5].filter(function(x){return x%2==0})")
  ).toStrictEqual([]);
  expect(validateInstruction('"kabaka".charAt(20)')).toStrictEqual([]);
});

test("Some static properties are  allowed", () => {
  expect(validateInstruction("Math.E")).toStrictEqual([]);
  expect(validateInstruction("Math.LOG2E")).toStrictEqual([]);
  expect(validateInstruction("Number.EPSILON")).toStrictEqual([]);
  expect(validateInstruction("Number.MAX_VALUE")).toStrictEqual([]);
});

test("length is the only instance property allowed", () => {
  expect(validateInstruction("x.value.length", ["x.value"])).toStrictEqual([]);
  expect(validateInstruction("[1,2,3,4,5].length")).toStrictEqual([]);
  expect(validateInstruction("x.value.constructor", ["x.value"])).toStrictEqual(
    [
      {
        end: 19,
        message: "unIdentified member property",
        start: 8,
      },
    ]
  );
});

test("computed properties and functions are not allowed", () => {
  expect(validateInstruction("x.value.length", ["x.value"])).toStrictEqual([]);
  expect(validateInstruction('x.value["length"]', ["x.value"])).toStrictEqual([
    {
      end: 17,
      message: "Computed member expressions are not allowed",
      start: 0,
    },
  ]);
  // this is the alternative
  expect(
    validateInstruction('QlarrScripts.safeAccess(x.value,"length")', [
      "x.value",
    ])
  ).toStrictEqual([]);
});

test("some unary operators are allowed", () => {
  expect(validateInstruction("-1")).toStrictEqual([]);
  expect(validateInstruction("!true")).toStrictEqual([]);
  expect(validateInstruction("+1")).toStrictEqual([]);
  expect(validateInstruction("~1")).toStrictEqual([]);
  expect(validateInstruction("typeof x.value", ["x.value"])).toStrictEqual([]);
  expect(validateInstruction("-x")).toStrictEqual([
    {
      end: 2,
      message: "unidetified: x",
      start: 1,
    },
  ]);
});

test("binary operations are allowed", () => {
  expect(validateInstruction("1 + 2")).toStrictEqual([]);
  expect(validateInstruction("(true && false) || true")).toStrictEqual([]);
  expect(validateInstruction(" 8 / 2")).toStrictEqual([]);
  expect(validateInstruction("1/x")).toStrictEqual([
    {
      end: 3,
      message: "unidetified: x",
      start: 2,
    },
  ]);
});

test("ConditionalExpression are allowed", () => {
  expect(
    validateInstruction("x.relevance ? 'OK' : 'NOT OK'", ["x.relevance"])
  ).toStrictEqual([]);
});

test("IF statement is not allowed", () => {
  expect(
    validateInstruction(
      "[1,2,3,4].filter(function(x){if(x%2==0){return true} else {return false}})"
    )
  ).toStrictEqual([
    {
      end: 72,
      message: "If statements are not allowed",
      start: 29,
    },
  ]);
});

test("loops not allowed", () => {
  expect(validateInstruction("while(true){1}")).toStrictEqual([
    {
      end: 14,
      message: "Loops are not allowed",
      start: 0,
    },
  ]);
  expect(
    validateInstruction("for (let i = 0; i < 9; i++) {  str = str + i;}")
  ).toStrictEqual([
    {
      end: 46,
      message: "Loops are not allowed",
      start: 0,
    },
  ]);
  expect(
    validateInstruction("for (const element of array1) {console.log(element);}")
  ).toStrictEqual([
    {
      end: 53,
      message: "Loops are not allowed",
      start: 0,
    },
  ]);
});

test("variable and function declarations, assignments and updates are not allowed", () => {
  expect(validateInstruction("let x = 3")).toStrictEqual([
    {
      end: 9,
      message: "Variable Declarations are not allowed",
      start: 0,
    },
  ]);
  expect(validateInstruction("x++")).toStrictEqual([
    {
      end: 3,
      message: "Update Expressions are not allowed",
      start: 0,
    },
  ]);
  expect(validateInstruction("function min(x){return x -1 }")).toStrictEqual([
    {
      end: 29,
      message: "Function Declarations are not allowed",
      start: 0,
    },
  ]);
  expect(validateInstruction("x.value = 3", ["x.value"])).toStrictEqual([
    {
      end: 11,
      message: "Assignments are not allowed",
      start: 0,
    },
  ]);
});

const validateInstruction = (script, allowedVariables = []) => {
  const instructionList = [
    {
      script: script,
      allowedVariables: allowedVariables,
    },
  ];
  const result = isSafeCode(JSON.stringify(instructionList));
  return JSON.parse(result)[0];
};
