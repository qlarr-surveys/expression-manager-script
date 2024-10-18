import * as acorn from "acorn";

import {
  allowedIdentifiers,
  unaryOperators,
  identifiersWithNew,
  identifiersWithStaticMethods,
  identifiersWithStaticProperties,
  dateStaticMethods,
  mathStaticMethods,
  qlarrStaticMethods,
  numberStaticMethods,
  objectStaticMethods,
  mathStaticProperties,
  numberStaticProperties,
  allowedProperties,
  allowedMethods,
} from "./constants";

export function validateCode(instructionList) {
  return JSON.stringify(
    JSON.parse(instructionList).map(function (instruction) {
      return isSafeCode(instruction.script, instruction.allowedVariables);
    })
  );
}

function isSafeCode(code, allowedVariables) {
  try {
    const ast = acorn.parse(code, { ecmaVersion: 2020 });
    if (!ast || typeof ast !== "object") {
      return [];
    }
    if (
      ast.type != "Program" ||
      ast.body.length !== 1 ||
      ast.body[0]?.type !== "ExpressionStatement"
    ) {
      console.error(ast)
      console.log(ast.type)
      console.log(ast.body.length)
      return [
        {
          message: "This script must be a single ExpressionStatement",
          start: 0,
          end: ast.end,
        },
      ];
    }
    return isSafe(ast, allowedVariables);
  } catch (error) {
    console.log(error);
    // Error occurred during parsing, consider it unsafe
    return [
      {
        message: "Fatal error - could not parse",
        start: 0,
        end: code.length - 1,
      },
    ];
  }
}

function isSafe(node, allowedVariables, extraParams = []) {
  console.log(node.type);
  switch (node.type) {
    // if program validate body
    case "Program":
    case "BlockStatement":
      return validateProgram(node, allowedVariables, extraParams);
    // if expression validate by expression type
    case "ExpressionStatement":
      return isSafe(node.expression, allowedVariables, extraParams);
    case "Identifier":
      if (
        allowedIdentifiers.indexOf(node.name) == -1 &&
        extraParams.indexOf(node.name) == -1
      ) {
        return [
          {
            message: node.name +  " is not defined",
            start: node.start,
            end: node.end,
          },
        ];
      } else {
        return [];
      }
    case "Property":
      if (node.kind != "init") {
        return [
          {
            message: "only init properties are allowed within object",
            start: node.start,
            end: node.end,
          },
        ];
      }
      return mergeResults(
        isSafe(node.key, allowedVariables, extraParams),
        isSafe(node.value, allowedVariables, extraParams)
      );
    case "ObjectExpression":
      return mergeResults(
        ...node.properties.map((element) =>
          isSafe(element, allowedVariables, extraParams)
        )
      );

    case "ArrowFunctionExpression":
    case "FunctionExpression":
      const params = node.params.map((x) => x.name).concat(extraParams);
      return isSafe(node.body, allowedVariables, params);
    case "CallExpression":
      let calleeResult = [];
      if (node.callee.type == "Identifier") {
        return [
          {
            message: "global methods are not permitted",
            start: node.start,
            end: node.end,
          },
        ];
      } else if (node.callee.type != "MemberExpression") {
        return [
          {
            message:
              "functions are meant to be only invoked as instance methods",
            start: node.start,
            end: node.end,
          },
        ];
      } else if (isStaticMethod(node.callee)) {
        calleeResult = isSafeStaticFunction(node.callee);
      } else {
        calleeResult = mergeResults(
          isSafe(node.callee.object, allowedVariables, extraParams),
          isSafeInstanceMethod(node.callee.property)
        );
      }
      let callExpressionArguments = mergeResults(
        ...node.arguments.map((element) =>
          isSafe(element, allowedVariables, extraParams)
        )
      );
      return mergeResults(calleeResult, callExpressionArguments);
    case "MemberExpression":
      if (node.computed) {
        return [
          {
            message: "Computed member expressions are not allowed",
            start: node.start,
            end: node.end,
          },
        ];
      } else if (isStaticPropery(node)) {
        return isSafeStaticProperty(node);
      } else if (isADependency(node, allowedVariables)) {
        return [];
      } else if (isSafeInstanceProperty(node.property)) {
        return isSafe(node.object, allowedVariables, extraParams);
      } else if (
        node.object.type == "Identifier" &&
        node.property.type == "Identifier"
      ) {
        return [
          {
            message:
              "unIdentified: " + node.object.name + "." + node.property.name,
            start: node.start,
            end: node.end,
          },
        ];
      } else {
        return [
          {
            message: "unIdentified member property",
            start: node.property.start,
            end: node.property.end,
          },
        ];
      }

    case "ArrayExpression":
      return mergeResults(
        ...node.elements.map((element) =>
          isSafe(element, allowedVariables, extraParams)
        )
      );
    // literals are safe on of their own
    case "Literal":
      return [];
    case "UnaryExpression":
      if (unaryOperators.indexOf(node.operator) == -1)
        return [
          {
            message: node.operator + " operator is not allowed",
            start: node.start,
            end: node.end,
          },
        ];
      else {
        return isSafe(node.argument, allowedVariables, extraParams);
      }
    // continue to validate argument
    case "ReturnStatement":
      return isSafe(node.argument, allowedVariables, extraParams);
    case "LogicalExpression":
    case "BinaryExpression":
      return mergeResults(
        isSafe(node.left, allowedVariables, extraParams),
        isSafe(node.right, allowedVariables, extraParams)
      );
    case "ConditionalExpression":
      return mergeResults(
        isSafe(node.test, allowedVariables, extraParams),
        isSafe(node.consequent, allowedVariables, extraParams),
        isSafe(node.alternate, allowedVariables, extraParams)
      );
    case "NewExpression":
      if (
        node.callee.type == "Identifier" &&
        identifiersWithNew.indexOf(node.callee.name) > -1
      ) {
        return mergeResults(
          ...node.arguments.map((element) =>
            isSafe(element, allowedVariables, extraParams)
          )
        );
      } else {
        return [
          {
            message: "New expressions are not allowed",
            start: node.start,
            end: node.end,
          },
        ];
      }
    case "IfStatement":
      return [
        {
          message: "If statements are not allowed",
          start: node.start,
          end: node.end,
        },
      ];
    case "ForOfStatement":
    case "ForStatement":
    case "DoWhileStatement":
    case "WhileStatement":
    case "ForInStatement":
      return [
        {
          message: "Loops are not allowed",
          start: node.start,
          end: node.end,
        },
      ];

    case "VariableDeclaration":
      return [
        {
          message: "Variable Declarations are not allowed",
          start: node.start,
          end: node.end,
        },
      ];

    case "UpdateExpression":
      return [
        {
          message: "Update Expressions are not allowed",
          start: node.start,
          end: node.end,
        },
      ];

    case "FunctionDeclaration":
      return [
        {
          message: "Function Declarations are not allowed",
          start: node.start,
          end: node.end,
        },
      ];
    case "AssignmentExpression":
      return [
        {
          message: "Assignments are not allowed",
          start: node.start,
          end: node.end,
        },
      ];
    default:
      return [
        {
          message: "Unidentified node: " + node.type,
          start: node.start,
          end: node.end,
        },
      ];
  }
}

function isADependency(node, allowedVariables) {
  return (
    node.object.type == "Identifier" &&
    node.property.type == "Identifier" &&
    allowedVariables.indexOf(node.object.name + "." + node.property.name) != -1
  );
}

function isSafeInstanceProperty(propertyNode) {
  return allowedProperties.indexOf(propertyNode.name) > -1;
}

function isSafeInstanceMethod(propertyNode) {
  return allowedMethods.indexOf(propertyNode.name) > -1;
}

function isStaticMethod(calleeNode) {
  return (
    calleeNode.type == "MemberExpression" &&
    calleeNode.object.type == "Identifier" &&
    identifiersWithStaticMethods.indexOf(calleeNode.object.name) > -1
  );
}

function isStaticPropery(node) {
  return (
    node.object.type == "Identifier" &&
    identifiersWithStaticProperties.indexOf(node.object.name) > -1
  );
}
function isSafeStaticProperty(node) {
  switch (node.object.name) {
    case "Number":
      if (numberStaticProperties.indexOf(node.property.name) == -1) {
        return [
          {
            message:
              "Unidentified propery name for Number: " + node.property.name,
            start: node.property.start,
            end: node.property.end,
          },
        ];
      } else {
        return [];
      }
    case "Math":
      if (mathStaticProperties.indexOf(node.property.name) == -1) {
        return [
          {
            message:
              "Unidentified propery name for Math: " + node.property.name,
            start: node.property.start,
            end: node.property.end,
          },
        ];
      } else {
        return [];
      }
  }
  return [];
}

function isSafeStaticFunction(calleeNode) {
  switch (calleeNode.object.name) {
    case "Date":
      if (dateStaticMethods.indexOf(calleeNode.property.name) == -1) {
        return [
          {
            message:
              "Unidentified method name for Date: " + calleeNode.property.name,
            start: calleeNode.property.start,
            end: calleeNode.property.end,
          },
        ];
      } else {
        return [];
      }
    case "FrankieScripts":
      if (qlarrStaticMethods.indexOf(calleeNode.property.name) == -1) {
        return [
          {
            message:
              "Unidentified method name for frankieStaticMethods: " +
              calleeNode.property.name,
            start: calleeNode.property.start,
            end: calleeNode.property.end,
          },
        ];
      } else {
        return [];
      }
    case "Number":
      if (numberStaticMethods.indexOf(calleeNode.property.name) == -1) {
        return [
          {
            message:
              "Unidentified method name for Number: " +
              calleeNode.property.name,
            start: calleeNode.property.start,
            end: calleeNode.property.end,
          },
        ];
      } else {
        return [];
      }
    case "Object":
      if (objectStaticMethods.indexOf(calleeNode.property.name) == -1) {
        return [
          {
            message:
              "Unidentified method name for Object: " +
              calleeNode.property.name,
            start: calleeNode.property.start,
            end: calleeNode.property.end,
          },
        ];
      } else {
        return [];
      }
    case "Math":
      if (mathStaticMethods.indexOf(calleeNode.property.name) == -1) {
        return [
          {
            message:
              "Unidentified method name for Math: " + calleeNode.property.name,
            start: calleeNode.property.start,
            end: calleeNode.property.end,
          },
        ];
      } else {
        return [];
      }
  }
  return [];
}

function mergeResults(...args) {
  let result = [];
  args.forEach((element) => {
    if (element && element.length) {
      result = result.concat(element);
    }
  });
  return result;
}

function validateProgram(node, allowedVariables, extraParams) {
  let result = [];
  if (node.body.directive) {
    result.push({
      message: "directives are not allowed",
      start: node.start,
      end: node.end,
    });
  }
  node.body.forEach((element) => {
    const isElementSafe = isSafe(element, allowedVariables, extraParams);
    if (isElementSafe && isElementSafe.length) {
      result = result.concat(isElementSafe);
    }
  });
  return result;
}

if (typeof module !== "undefined" && typeof module.exports !== "undefined") {
  module.exports = validateCode;
}
