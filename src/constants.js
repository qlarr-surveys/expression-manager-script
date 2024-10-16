
export const allowedIdentifiers = ["undefined", "NaN", "Infinity", "-Infinity"];
export const unaryOperators = ["+", "-", "!", "~", "typeof"];

// static methods
export const identifiersWithNew = ["Date", "RegExp"];
export const identifiersWithStaticMethods = [
  "Date",
  "Number",
  "Math",
  "Object",
  "QlarrScripts",
];
export const identifiersWithStaticProperties = ["Number", "Math"];
export const dateStaticMethods = ["now", "parse", "UTC"];
export const mathStaticMethods = [
  "abs",
  "acos",
  "acosh",
  "asin",
  "asinh",
  "atan",
  "atan2",
  "atanh",
  "cbrt",
  "ceil",
  "clz32",
  "cos",
  "cosh",
  "exp",
  "expm1",
  "f16round",
  "floor",
  "fround",
  "hypot",
  "imul",
  "log",
  "log10",
  "log1p",
  "log2",
  "max",
  "min",
  "pow",
  "random",
  "round",
  "sign",
  "sin",
  "sinh",
  "sqrt",
  "tan",
  "tanh",
  "trunc",
];
export const qlarrStaticMethods = [
  "separator",
  "safeAccess",
  "and",
  "isValidSqlDateTime",
  "listStrings",
  "isValidTime",
  "isValidDay",
  "sqlDateTimeToDate",
  "formatSqlDate",
  "formatTime",
  "dateStringToDate",
  "toSqlDateTimeIgnoreTime",
  "toSqlDateTime",
  "toSqlDateTimeIgnoreDate",
  "isVoid",
  "isNotVoid",
  "wordCount",
  "hasDuplicates",
];
export const numberStaticMethods = [
  "isFinite",
  "isInteger",
  "isNaN",
  "isSafeInteger",
  "parseFloat",
  "parseInt",
];
export const objectStaticMethods = ["entries", "keys"];
export const mathStaticProperties = [
  "E",
  "LN10",
  "LN2",
  "LOG10E",
  "LOG2E",
  "PI",
  "SQRT1_2",
  "SQRT2",
];
export const numberStaticProperties = [
  "EPSILON",
  "MAX_SAFE_INTEGER",
  "MAX_VALUE",
  "MIN_SAFE_INTEGER",
  "MIN_VALUE",
  "NaN",
  "NEGATIVE_INFINITY",
  "POSITIVE_INFINITY",
];

export const allowedProperties = [
  // Array properties
  "length", // Array
];

export const allowedMethods = [
  // Object methods
  "toString", // Object
  "toLocaleString", // Object

  // Number methods
  "toExponential", // Number
  "toFixed", // Number
  "toLocaleString", // Number
  "toPrecision", // Number

  // RegExp methods
  "exec", // RegExp
  "test", // RegExp
  "toString", // RegExp

  // Array methods
  "at", // Array
  "filter", // Array
  "find", // Array
  "findIndex", // Array
  "findLast", // Array
  "findLastIndex", // Array
  "includes", // Array
  "indexOf", // Array
  "keys", // Array
  "lastIndexOf", // Array
  "map", // Array
  "pop", // Array
  "push", // Array
  "reduce", // Array
  "reduceRight", // Array
  "reverse", // Array
  "shift", // Array
  "slice", // Array
  "some", // Array
  "sort", // Array
  "splice", // Array
  "toReversed", // Array
  "toSorted", // Array
  "toSpliced", // Array
  "toString", // Array

  // String methods
  "charAt", // String
  "concat", // String
  "endsWith", // String
  "includes", // String
  "indexOf", // String
  "lastIndexOf", // String
  "match", // String
  "matchAll", // String
  "padEnd", // String
  "padStart", // String
  "repeat", // String
  "replace", // String
  "replaceAll", // String
  "search", // String
  "slice", // String
  "split", // String
  "startsWith", // String
  "substring", // String
  "toLowerCase", // String
  "toUpperCase", // String
  "trim", // String
  "trimEnd", // String
  "trimStart", // String

  // Date methods
  "getDate", // Date
  "getDay", // Date
  "getFullYear", // Date
  "getHours", // Date
  "getMilliseconds", // Date
  "getMinutes", // Date
  "getMonth", // Date
  "getSeconds", // Date
  "getTime", // Date
  "getTimezoneOffset", // Date
  "getUTCDate", // Date
  "getUTCDay", // Date
  "getUTCFullYear", // Date
  "getUTCHours", // Date
  "getUTCMilliseconds", // Date
  "getUTCMinutes", // Date
  "getUTCMonth", // Date
  "getUTCSeconds", // Date
  "setDate", // Date
  "setFullYear", // Date
  "setHours", // Date
  "setMilliseconds", // Date
  "setMinutes", // Date
  "setMonth", // Date
  "setSeconds", // Date
  "setTime", // Date
  "setUTCDate", // Date
  "setUTCFullYear", // Date
  "setUTCHours", // Date
  "setUTCMilliseconds", // Date
  "setUTCMinutes", // Date
  "setUTCMonth", // Date
  "setUTCSeconds", // Date
  "toDateString", // Date
  "toISOString", // Date
  "toJSON", // Date
  "toLocaleDateString", // Date
  "toLocaleString", // Date
  "toLocaleTimeString", // Date
  "toString", // Date
  "toTimeString", // Date
  "toUTCString", // Date
];

