"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __commonJS = (cb, mod) => function __require() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
var __export = (target, all) => {
  for (var name2 in all)
    __defProp(target, name2, { get: all[name2], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// ../../node_modules/.pnpm/postgres-array@3.0.4/node_modules/postgres-array/index.js
var require_postgres_array = __commonJS({
  "../../node_modules/.pnpm/postgres-array@3.0.4/node_modules/postgres-array/index.js"(exports2) {
    "use strict";
    var BACKSLASH = "\\";
    var DQUOT = '"';
    var LBRACE = "{";
    var RBRACE = "}";
    var LBRACKET = "[";
    var EQUALS = "=";
    var COMMA = ",";
    var NULL_STRING = "NULL";
    function makeParseArrayWithTransform(transform) {
      const haveTransform = transform != null;
      return function parseArray3(str) {
        const rbraceIndex = str.length - 1;
        if (rbraceIndex === 1) {
          return [];
        }
        if (str[rbraceIndex] !== RBRACE) {
          throw new Error("Invalid array text - must end with }");
        }
        let position = 0;
        if (str[position] === LBRACKET) {
          position = str.indexOf(EQUALS) + 1;
        }
        if (str[position++] !== LBRACE) {
          throw new Error("Invalid array text - must start with {");
        }
        const output = [];
        let current = output;
        const stack = [];
        let currentStringStart = position;
        let currentString = "";
        let expectValue = true;
        for (; position < rbraceIndex; ++position) {
          let char = str[position];
          if (char === DQUOT) {
            currentStringStart = ++position;
            let dquot = str.indexOf(DQUOT, currentStringStart);
            let backSlash = str.indexOf(BACKSLASH, currentStringStart);
            while (backSlash !== -1 && backSlash < dquot) {
              position = backSlash;
              const part2 = str.slice(currentStringStart, position);
              currentString += part2;
              currentStringStart = ++position;
              if (dquot === position++) {
                dquot = str.indexOf(DQUOT, position);
              }
              backSlash = str.indexOf(BACKSLASH, position);
            }
            position = dquot;
            const part = str.slice(currentStringStart, position);
            currentString += part;
            current.push(haveTransform ? transform(currentString) : currentString);
            currentString = "";
            expectValue = false;
          } else if (char === LBRACE) {
            const newArray = [];
            current.push(newArray);
            stack.push(current);
            current = newArray;
            currentStringStart = position + 1;
            expectValue = true;
          } else if (char === COMMA) {
            expectValue = true;
          } else if (char === RBRACE) {
            expectValue = false;
            const arr = stack.pop();
            if (arr === void 0) {
              throw new Error("Invalid array text - too many '}'");
            }
            current = arr;
          } else if (expectValue) {
            currentStringStart = position;
            while ((char = str[position]) !== COMMA && char !== RBRACE && position < rbraceIndex) {
              ++position;
            }
            const part = str.slice(currentStringStart, position--);
            current.push(
              part === NULL_STRING ? null : haveTransform ? transform(part) : part
            );
            expectValue = false;
          } else {
            throw new Error("Was expecting delimeter");
          }
        }
        return output;
      };
    }
    var parseArray2 = makeParseArrayWithTransform();
    exports2.parse = (source, transform) => transform != null ? makeParseArrayWithTransform(transform)(source) : parseArray2(source);
  }
});

// src/client.ts
var client_exports = {};
__export(client_exports, {
  $Enums: () => enums_exports,
  Prisma: () => prismaNamespace_exports,
  PrismaClient: () => PrismaClient,
  prisma: () => prisma
});
module.exports = __toCommonJS(client_exports);
var import_path = __toESM(require("path"));
var import_dotenv = require("dotenv");

// ../../node_modules/.pnpm/@prisma+debug@7.2.0/node_modules/@prisma/debug/dist/index.mjs
var __defProp2 = Object.defineProperty;
var __export2 = (target, all) => {
  for (var name2 in all)
    __defProp2(target, name2, { get: all[name2], enumerable: true });
};
var colors_exports = {};
__export2(colors_exports, {
  $: () => $,
  bgBlack: () => bgBlack,
  bgBlue: () => bgBlue,
  bgCyan: () => bgCyan,
  bgGreen: () => bgGreen,
  bgMagenta: () => bgMagenta,
  bgRed: () => bgRed,
  bgWhite: () => bgWhite,
  bgYellow: () => bgYellow,
  black: () => black,
  blue: () => blue,
  bold: () => bold,
  cyan: () => cyan,
  dim: () => dim,
  gray: () => gray,
  green: () => green,
  grey: () => grey,
  hidden: () => hidden,
  inverse: () => inverse,
  italic: () => italic,
  magenta: () => magenta,
  red: () => red,
  reset: () => reset,
  strikethrough: () => strikethrough,
  underline: () => underline,
  white: () => white,
  yellow: () => yellow
});
var FORCE_COLOR;
var NODE_DISABLE_COLORS;
var NO_COLOR;
var TERM;
var isTTY = true;
if (typeof process !== "undefined") {
  ({ FORCE_COLOR, NODE_DISABLE_COLORS, NO_COLOR, TERM } = process.env || {});
  isTTY = process.stdout && process.stdout.isTTY;
}
var $ = {
  enabled: !NODE_DISABLE_COLORS && NO_COLOR == null && TERM !== "dumb" && (FORCE_COLOR != null && FORCE_COLOR !== "0" || isTTY)
};
function init(x, y) {
  let rgx = new RegExp(`\\x1b\\[${y}m`, "g");
  let open = `\x1B[${x}m`, close = `\x1B[${y}m`;
  return function(txt) {
    if (!$.enabled || txt == null) return txt;
    return open + (!!~("" + txt).indexOf(close) ? txt.replace(rgx, close + open) : txt) + close;
  };
}
var reset = init(0, 0);
var bold = init(1, 22);
var dim = init(2, 22);
var italic = init(3, 23);
var underline = init(4, 24);
var inverse = init(7, 27);
var hidden = init(8, 28);
var strikethrough = init(9, 29);
var black = init(30, 39);
var red = init(31, 39);
var green = init(32, 39);
var yellow = init(33, 39);
var blue = init(34, 39);
var magenta = init(35, 39);
var cyan = init(36, 39);
var white = init(37, 39);
var gray = init(90, 39);
var grey = init(90, 39);
var bgBlack = init(40, 49);
var bgRed = init(41, 49);
var bgGreen = init(42, 49);
var bgYellow = init(43, 49);
var bgBlue = init(44, 49);
var bgMagenta = init(45, 49);
var bgCyan = init(46, 49);
var bgWhite = init(47, 49);
var MAX_ARGS_HISTORY = 100;
var COLORS = ["green", "yellow", "blue", "magenta", "cyan", "red"];
var argsHistory = [];
var lastTimestamp = Date.now();
var lastColor = 0;
var processEnv = typeof process !== "undefined" ? process.env : {};
globalThis.DEBUG ??= processEnv.DEBUG ?? "";
globalThis.DEBUG_COLORS ??= processEnv.DEBUG_COLORS ? processEnv.DEBUG_COLORS === "true" : true;
var topProps = {
  enable(namespace) {
    if (typeof namespace === "string") {
      globalThis.DEBUG = namespace;
    }
  },
  disable() {
    const prev = globalThis.DEBUG;
    globalThis.DEBUG = "";
    return prev;
  },
  // this is the core logic to check if logging should happen or not
  enabled(namespace) {
    const listenedNamespaces = globalThis.DEBUG.split(",").map((s) => {
      return s.replace(/[.+?^${}()|[\]\\]/g, "\\$&");
    });
    const isListened = listenedNamespaces.some((listenedNamespace) => {
      if (listenedNamespace === "" || listenedNamespace[0] === "-") return false;
      return namespace.match(RegExp(listenedNamespace.split("*").join(".*") + "$"));
    });
    const isExcluded = listenedNamespaces.some((listenedNamespace) => {
      if (listenedNamespace === "" || listenedNamespace[0] !== "-") return false;
      return namespace.match(RegExp(listenedNamespace.slice(1).split("*").join(".*") + "$"));
    });
    return isListened && !isExcluded;
  },
  log: (...args) => {
    const [namespace, format, ...rest] = args;
    const logWithFormatting = console.warn ?? console.log;
    logWithFormatting(`${namespace} ${format}`, ...rest);
  },
  formatters: {}
  // not implemented
};
function debugCreate(namespace) {
  const instanceProps = {
    color: COLORS[lastColor++ % COLORS.length],
    enabled: topProps.enabled(namespace),
    namespace,
    log: topProps.log,
    extend: () => {
    }
    // not implemented
  };
  const debugCall = (...args) => {
    const { enabled, namespace: namespace2, color, log } = instanceProps;
    if (args.length !== 0) {
      argsHistory.push([namespace2, ...args]);
    }
    if (argsHistory.length > MAX_ARGS_HISTORY) {
      argsHistory.shift();
    }
    if (topProps.enabled(namespace2) || enabled) {
      const stringArgs = args.map((arg) => {
        if (typeof arg === "string") {
          return arg;
        }
        return safeStringify(arg);
      });
      const ms = `+${Date.now() - lastTimestamp}ms`;
      lastTimestamp = Date.now();
      if (globalThis.DEBUG_COLORS) {
        log(colors_exports[color](bold(namespace2)), ...stringArgs, colors_exports[color](ms));
      } else {
        log(namespace2, ...stringArgs, ms);
      }
    }
  };
  return new Proxy(debugCall, {
    get: (_, prop) => instanceProps[prop],
    set: (_, prop, value) => instanceProps[prop] = value
  });
}
var Debug = new Proxy(debugCreate, {
  get: (_, prop) => topProps[prop],
  set: (_, prop, value) => topProps[prop] = value
});
function safeStringify(value, indent = 2) {
  const cache = /* @__PURE__ */ new Set();
  return JSON.stringify(
    value,
    (key, value2) => {
      if (typeof value2 === "object" && value2 !== null) {
        if (cache.has(value2)) {
          return `[Circular *]`;
        }
        cache.add(value2);
      } else if (typeof value2 === "bigint") {
        return value2.toString();
      }
      return value2;
    },
    indent
  );
}

// ../../node_modules/.pnpm/@prisma+driver-adapter-utils@7.2.0/node_modules/@prisma/driver-adapter-utils/dist/index.mjs
var DriverAdapterError = class extends Error {
  name = "DriverAdapterError";
  cause;
  constructor(payload) {
    super(typeof payload["message"] === "string" ? payload["message"] : payload.kind);
    this.cause = payload;
  }
};
var debug = Debug("driver-adapter-utils");
var ColumnTypeEnum = {
  // Scalars
  Int32: 0,
  Int64: 1,
  Float: 2,
  Double: 3,
  Numeric: 4,
  Boolean: 5,
  Character: 6,
  Text: 7,
  Date: 8,
  Time: 9,
  DateTime: 10,
  Json: 11,
  Enum: 12,
  Bytes: 13,
  Set: 14,
  Uuid: 15,
  // Arrays
  Int32Array: 64,
  Int64Array: 65,
  FloatArray: 66,
  DoubleArray: 67,
  NumericArray: 68,
  BooleanArray: 69,
  CharacterArray: 70,
  TextArray: 71,
  DateArray: 72,
  TimeArray: 73,
  DateTimeArray: 74,
  JsonArray: 75,
  EnumArray: 76,
  BytesArray: 77,
  UuidArray: 78,
  // Custom
  UnknownNumber: 128
};
var mockAdapterErrors = {
  queryRaw: new Error("Not implemented: queryRaw"),
  executeRaw: new Error("Not implemented: executeRaw"),
  startTransaction: new Error("Not implemented: startTransaction"),
  executeScript: new Error("Not implemented: executeScript"),
  dispose: new Error("Not implemented: dispose")
};

// ../../node_modules/.pnpm/@prisma+adapter-pg@7.2.0/node_modules/@prisma/adapter-pg/dist/index.mjs
var import_pg = __toESM(require("pg"), 1);
var import_pg2 = __toESM(require("pg"), 1);
var import_postgres_array = __toESM(require_postgres_array(), 1);
var name = "@prisma/adapter-pg";
var FIRST_NORMAL_OBJECT_ID = 16384;
var { types } = import_pg2.default;
var { builtins: ScalarColumnType, getTypeParser } = types;
var AdditionalScalarColumnType = {
  NAME: 19
};
var ArrayColumnType = {
  BIT_ARRAY: 1561,
  BOOL_ARRAY: 1e3,
  BYTEA_ARRAY: 1001,
  BPCHAR_ARRAY: 1014,
  CHAR_ARRAY: 1002,
  CIDR_ARRAY: 651,
  DATE_ARRAY: 1182,
  FLOAT4_ARRAY: 1021,
  FLOAT8_ARRAY: 1022,
  INET_ARRAY: 1041,
  INT2_ARRAY: 1005,
  INT4_ARRAY: 1007,
  INT8_ARRAY: 1016,
  JSONB_ARRAY: 3807,
  JSON_ARRAY: 199,
  MONEY_ARRAY: 791,
  NUMERIC_ARRAY: 1231,
  OID_ARRAY: 1028,
  TEXT_ARRAY: 1009,
  TIMESTAMP_ARRAY: 1115,
  TIMESTAMPTZ_ARRAY: 1185,
  TIME_ARRAY: 1183,
  UUID_ARRAY: 2951,
  VARBIT_ARRAY: 1563,
  VARCHAR_ARRAY: 1015,
  XML_ARRAY: 143
};
var UnsupportedNativeDataType = class _UnsupportedNativeDataType extends Error {
  // map of type codes to type names
  static typeNames = {
    16: "bool",
    17: "bytea",
    18: "char",
    19: "name",
    20: "int8",
    21: "int2",
    22: "int2vector",
    23: "int4",
    24: "regproc",
    25: "text",
    26: "oid",
    27: "tid",
    28: "xid",
    29: "cid",
    30: "oidvector",
    32: "pg_ddl_command",
    71: "pg_type",
    75: "pg_attribute",
    81: "pg_proc",
    83: "pg_class",
    114: "json",
    142: "xml",
    194: "pg_node_tree",
    269: "table_am_handler",
    325: "index_am_handler",
    600: "point",
    601: "lseg",
    602: "path",
    603: "box",
    604: "polygon",
    628: "line",
    650: "cidr",
    700: "float4",
    701: "float8",
    705: "unknown",
    718: "circle",
    774: "macaddr8",
    790: "money",
    829: "macaddr",
    869: "inet",
    1033: "aclitem",
    1042: "bpchar",
    1043: "varchar",
    1082: "date",
    1083: "time",
    1114: "timestamp",
    1184: "timestamptz",
    1186: "interval",
    1266: "timetz",
    1560: "bit",
    1562: "varbit",
    1700: "numeric",
    1790: "refcursor",
    2202: "regprocedure",
    2203: "regoper",
    2204: "regoperator",
    2205: "regclass",
    2206: "regtype",
    2249: "record",
    2275: "cstring",
    2276: "any",
    2277: "anyarray",
    2278: "void",
    2279: "trigger",
    2280: "language_handler",
    2281: "internal",
    2283: "anyelement",
    2287: "_record",
    2776: "anynonarray",
    2950: "uuid",
    2970: "txid_snapshot",
    3115: "fdw_handler",
    3220: "pg_lsn",
    3310: "tsm_handler",
    3361: "pg_ndistinct",
    3402: "pg_dependencies",
    3500: "anyenum",
    3614: "tsvector",
    3615: "tsquery",
    3642: "gtsvector",
    3734: "regconfig",
    3769: "regdictionary",
    3802: "jsonb",
    3831: "anyrange",
    3838: "event_trigger",
    3904: "int4range",
    3906: "numrange",
    3908: "tsrange",
    3910: "tstzrange",
    3912: "daterange",
    3926: "int8range",
    4072: "jsonpath",
    4089: "regnamespace",
    4096: "regrole",
    4191: "regcollation",
    4451: "int4multirange",
    4532: "nummultirange",
    4533: "tsmultirange",
    4534: "tstzmultirange",
    4535: "datemultirange",
    4536: "int8multirange",
    4537: "anymultirange",
    4538: "anycompatiblemultirange",
    4600: "pg_brin_bloom_summary",
    4601: "pg_brin_minmax_multi_summary",
    5017: "pg_mcv_list",
    5038: "pg_snapshot",
    5069: "xid8",
    5077: "anycompatible",
    5078: "anycompatiblearray",
    5079: "anycompatiblenonarray",
    5080: "anycompatiblerange"
  };
  type;
  constructor(code) {
    super();
    this.type = _UnsupportedNativeDataType.typeNames[code] || "Unknown";
    this.message = `Unsupported column type ${this.type}`;
  }
};
function fieldToColumnType(fieldTypeId) {
  switch (fieldTypeId) {
    case ScalarColumnType.INT2:
    case ScalarColumnType.INT4:
      return ColumnTypeEnum.Int32;
    case ScalarColumnType.INT8:
      return ColumnTypeEnum.Int64;
    case ScalarColumnType.FLOAT4:
      return ColumnTypeEnum.Float;
    case ScalarColumnType.FLOAT8:
      return ColumnTypeEnum.Double;
    case ScalarColumnType.BOOL:
      return ColumnTypeEnum.Boolean;
    case ScalarColumnType.DATE:
      return ColumnTypeEnum.Date;
    case ScalarColumnType.TIME:
    case ScalarColumnType.TIMETZ:
      return ColumnTypeEnum.Time;
    case ScalarColumnType.TIMESTAMP:
    case ScalarColumnType.TIMESTAMPTZ:
      return ColumnTypeEnum.DateTime;
    case ScalarColumnType.NUMERIC:
    case ScalarColumnType.MONEY:
      return ColumnTypeEnum.Numeric;
    case ScalarColumnType.JSON:
    case ScalarColumnType.JSONB:
      return ColumnTypeEnum.Json;
    case ScalarColumnType.UUID:
      return ColumnTypeEnum.Uuid;
    case ScalarColumnType.OID:
      return ColumnTypeEnum.Int64;
    case ScalarColumnType.BPCHAR:
    case ScalarColumnType.TEXT:
    case ScalarColumnType.VARCHAR:
    case ScalarColumnType.BIT:
    case ScalarColumnType.VARBIT:
    case ScalarColumnType.INET:
    case ScalarColumnType.CIDR:
    case ScalarColumnType.XML:
    case AdditionalScalarColumnType.NAME:
      return ColumnTypeEnum.Text;
    case ScalarColumnType.BYTEA:
      return ColumnTypeEnum.Bytes;
    case ArrayColumnType.INT2_ARRAY:
    case ArrayColumnType.INT4_ARRAY:
      return ColumnTypeEnum.Int32Array;
    case ArrayColumnType.FLOAT4_ARRAY:
      return ColumnTypeEnum.FloatArray;
    case ArrayColumnType.FLOAT8_ARRAY:
      return ColumnTypeEnum.DoubleArray;
    case ArrayColumnType.NUMERIC_ARRAY:
    case ArrayColumnType.MONEY_ARRAY:
      return ColumnTypeEnum.NumericArray;
    case ArrayColumnType.BOOL_ARRAY:
      return ColumnTypeEnum.BooleanArray;
    case ArrayColumnType.CHAR_ARRAY:
      return ColumnTypeEnum.CharacterArray;
    case ArrayColumnType.BPCHAR_ARRAY:
    case ArrayColumnType.TEXT_ARRAY:
    case ArrayColumnType.VARCHAR_ARRAY:
    case ArrayColumnType.VARBIT_ARRAY:
    case ArrayColumnType.BIT_ARRAY:
    case ArrayColumnType.INET_ARRAY:
    case ArrayColumnType.CIDR_ARRAY:
    case ArrayColumnType.XML_ARRAY:
      return ColumnTypeEnum.TextArray;
    case ArrayColumnType.DATE_ARRAY:
      return ColumnTypeEnum.DateArray;
    case ArrayColumnType.TIME_ARRAY:
      return ColumnTypeEnum.TimeArray;
    case ArrayColumnType.TIMESTAMP_ARRAY:
      return ColumnTypeEnum.DateTimeArray;
    case ArrayColumnType.TIMESTAMPTZ_ARRAY:
      return ColumnTypeEnum.DateTimeArray;
    case ArrayColumnType.JSON_ARRAY:
    case ArrayColumnType.JSONB_ARRAY:
      return ColumnTypeEnum.JsonArray;
    case ArrayColumnType.BYTEA_ARRAY:
      return ColumnTypeEnum.BytesArray;
    case ArrayColumnType.UUID_ARRAY:
      return ColumnTypeEnum.UuidArray;
    case ArrayColumnType.INT8_ARRAY:
    case ArrayColumnType.OID_ARRAY:
      return ColumnTypeEnum.Int64Array;
    default:
      if (fieldTypeId >= FIRST_NORMAL_OBJECT_ID) {
        return ColumnTypeEnum.Text;
      }
      throw new UnsupportedNativeDataType(fieldTypeId);
  }
}
function normalize_array(element_normalizer) {
  return (str) => (0, import_postgres_array.parse)(str, element_normalizer);
}
function normalize_numeric(numeric) {
  return numeric;
}
function normalize_date(date) {
  return date;
}
function normalize_timestamp(time) {
  return `${time.replace(" ", "T")}+00:00`;
}
function normalize_timestamptz(time) {
  return time.replace(" ", "T").replace(/[+-]\d{2}(:\d{2})?$/, "+00:00");
}
function normalize_time(time) {
  return time;
}
function normalize_timez(time) {
  return time.replace(/[+-]\d{2}(:\d{2})?$/, "");
}
function normalize_money(money) {
  return money.slice(1);
}
function normalize_xml(xml) {
  return xml;
}
function toJson(json) {
  return json;
}
var parsePgBytes = getTypeParser(ScalarColumnType.BYTEA);
var normalizeByteaArray = getTypeParser(ArrayColumnType.BYTEA_ARRAY);
function convertBytes(serializedBytes) {
  return parsePgBytes(serializedBytes);
}
function normalizeBit(bit) {
  return bit;
}
var customParsers = {
  [ScalarColumnType.NUMERIC]: normalize_numeric,
  [ArrayColumnType.NUMERIC_ARRAY]: normalize_array(normalize_numeric),
  [ScalarColumnType.TIME]: normalize_time,
  [ArrayColumnType.TIME_ARRAY]: normalize_array(normalize_time),
  [ScalarColumnType.TIMETZ]: normalize_timez,
  [ScalarColumnType.DATE]: normalize_date,
  [ArrayColumnType.DATE_ARRAY]: normalize_array(normalize_date),
  [ScalarColumnType.TIMESTAMP]: normalize_timestamp,
  [ArrayColumnType.TIMESTAMP_ARRAY]: normalize_array(normalize_timestamp),
  [ScalarColumnType.TIMESTAMPTZ]: normalize_timestamptz,
  [ArrayColumnType.TIMESTAMPTZ_ARRAY]: normalize_array(normalize_timestamptz),
  [ScalarColumnType.MONEY]: normalize_money,
  [ArrayColumnType.MONEY_ARRAY]: normalize_array(normalize_money),
  [ScalarColumnType.JSON]: toJson,
  [ArrayColumnType.JSON_ARRAY]: normalize_array(toJson),
  [ScalarColumnType.JSONB]: toJson,
  [ArrayColumnType.JSONB_ARRAY]: normalize_array(toJson),
  [ScalarColumnType.BYTEA]: convertBytes,
  [ArrayColumnType.BYTEA_ARRAY]: normalizeByteaArray,
  [ArrayColumnType.BIT_ARRAY]: normalize_array(normalizeBit),
  [ArrayColumnType.VARBIT_ARRAY]: normalize_array(normalizeBit),
  [ArrayColumnType.XML_ARRAY]: normalize_array(normalize_xml)
};
function mapArg(arg, argType) {
  if (arg === null) {
    return null;
  }
  if (Array.isArray(arg) && argType.arity === "list") {
    return arg.map((value) => mapArg(value, argType));
  }
  if (typeof arg === "string" && argType.scalarType === "datetime") {
    arg = new Date(arg);
  }
  if (arg instanceof Date) {
    switch (argType.dbType) {
      case "TIME":
      case "TIMETZ":
        return formatTime(arg);
      case "DATE":
        return formatDate(arg);
      default:
        return formatDateTime(arg);
    }
  }
  if (typeof arg === "string" && argType.scalarType === "bytes") {
    return Buffer.from(arg, "base64");
  }
  if (ArrayBuffer.isView(arg)) {
    return new Uint8Array(arg.buffer, arg.byteOffset, arg.byteLength);
  }
  return arg;
}
function formatDateTime(date) {
  const pad = (n, z = 2) => String(n).padStart(z, "0");
  const ms = date.getUTCMilliseconds();
  return pad(date.getUTCFullYear(), 4) + "-" + pad(date.getUTCMonth() + 1) + "-" + pad(date.getUTCDate()) + " " + pad(date.getUTCHours()) + ":" + pad(date.getUTCMinutes()) + ":" + pad(date.getUTCSeconds()) + (ms ? "." + String(ms).padStart(3, "0") : "");
}
function formatDate(date) {
  const pad = (n, z = 2) => String(n).padStart(z, "0");
  return pad(date.getUTCFullYear(), 4) + "-" + pad(date.getUTCMonth() + 1) + "-" + pad(date.getUTCDate());
}
function formatTime(date) {
  const pad = (n, z = 2) => String(n).padStart(z, "0");
  const ms = date.getUTCMilliseconds();
  return pad(date.getUTCHours()) + ":" + pad(date.getUTCMinutes()) + ":" + pad(date.getUTCSeconds()) + (ms ? "." + String(ms).padStart(3, "0") : "");
}
var TLS_ERRORS = /* @__PURE__ */ new Set([
  "UNABLE_TO_GET_ISSUER_CERT",
  "UNABLE_TO_GET_CRL",
  "UNABLE_TO_DECRYPT_CERT_SIGNATURE",
  "UNABLE_TO_DECRYPT_CRL_SIGNATURE",
  "UNABLE_TO_DECODE_ISSUER_PUBLIC_KEY",
  "CERT_SIGNATURE_FAILURE",
  "CRL_SIGNATURE_FAILURE",
  "CERT_NOT_YET_VALID",
  "CERT_HAS_EXPIRED",
  "CRL_NOT_YET_VALID",
  "CRL_HAS_EXPIRED",
  "ERROR_IN_CERT_NOT_BEFORE_FIELD",
  "ERROR_IN_CERT_NOT_AFTER_FIELD",
  "ERROR_IN_CRL_LAST_UPDATE_FIELD",
  "ERROR_IN_CRL_NEXT_UPDATE_FIELD",
  "DEPTH_ZERO_SELF_SIGNED_CERT",
  "SELF_SIGNED_CERT_IN_CHAIN",
  "UNABLE_TO_GET_ISSUER_CERT_LOCALLY",
  "UNABLE_TO_VERIFY_LEAF_SIGNATURE",
  "CERT_CHAIN_TOO_LONG",
  "CERT_REVOKED",
  "INVALID_CA",
  "INVALID_PURPOSE",
  "CERT_UNTRUSTED",
  "CERT_REJECTED",
  "HOSTNAME_MISMATCH",
  "ERR_TLS_CERT_ALTNAME_FORMAT",
  "ERR_TLS_CERT_ALTNAME_INVALID"
]);
var SOCKET_ERRORS = /* @__PURE__ */ new Set(["ENOTFOUND", "ECONNREFUSED", "ECONNRESET", "ETIMEDOUT"]);
function convertDriverError(error) {
  if (isSocketError(error)) {
    return mapSocketError(error);
  }
  if (isTlsError(error)) {
    return {
      kind: "TlsConnectionError",
      reason: error.message
    };
  }
  if (isDriverError(error)) {
    return {
      originalCode: error.code,
      originalMessage: error.message,
      ...mapDriverError(error)
    };
  }
  throw error;
}
function mapDriverError(error) {
  var _a, _b, _c, _d, _e, _f, _g, _h, _i, _j, _k, _l;
  switch (error.code) {
    case "22001":
      return {
        kind: "LengthMismatch",
        column: error.column
      };
    case "22003":
      return {
        kind: "ValueOutOfRange",
        cause: error.message
      };
    case "22P02":
      return {
        kind: "InvalidInputValue",
        message: error.message
      };
    case "23505": {
      const fields = (_c = (_b = (_a = error.detail) == null ? void 0 : _a.match(/Key \(([^)]+)\)/)) == null ? void 0 : _b.at(1)) == null ? void 0 : _c.split(", ");
      return {
        kind: "UniqueConstraintViolation",
        constraint: fields !== void 0 ? { fields } : void 0
      };
    }
    case "23502": {
      const fields = (_f = (_e = (_d = error.detail) == null ? void 0 : _d.match(/Key \(([^)]+)\)/)) == null ? void 0 : _e.at(1)) == null ? void 0 : _f.split(", ");
      return {
        kind: "NullConstraintViolation",
        constraint: fields !== void 0 ? { fields } : void 0
      };
    }
    case "23503": {
      let constraint;
      if (error.column) {
        constraint = { fields: [error.column] };
      } else if (error.constraint) {
        constraint = { index: error.constraint };
      }
      return {
        kind: "ForeignKeyConstraintViolation",
        constraint
      };
    }
    case "3D000":
      return {
        kind: "DatabaseDoesNotExist",
        db: (_g = error.message.split(" ").at(1)) == null ? void 0 : _g.split('"').at(1)
      };
    case "28000":
      return {
        kind: "DatabaseAccessDenied",
        db: (_h = error.message.split(",").find((s) => s.startsWith(" database"))) == null ? void 0 : _h.split('"').at(1)
      };
    case "28P01":
      return {
        kind: "AuthenticationFailed",
        user: (_i = error.message.split(" ").pop()) == null ? void 0 : _i.split('"').at(1)
      };
    case "40001":
      return {
        kind: "TransactionWriteConflict"
      };
    case "42P01":
      return {
        kind: "TableDoesNotExist",
        table: (_j = error.message.split(" ").at(1)) == null ? void 0 : _j.split('"').at(1)
      };
    case "42703":
      return {
        kind: "ColumnNotFound",
        column: (_k = error.message.split(" ").at(1)) == null ? void 0 : _k.split('"').at(1)
      };
    case "42P04":
      return {
        kind: "DatabaseAlreadyExists",
        db: (_l = error.message.split(" ").at(1)) == null ? void 0 : _l.split('"').at(1)
      };
    case "53300":
      return {
        kind: "TooManyConnections",
        cause: error.message
      };
    default:
      return {
        kind: "postgres",
        code: error.code ?? "N/A",
        severity: error.severity ?? "N/A",
        message: error.message,
        detail: error.detail,
        column: error.column,
        hint: error.hint
      };
  }
}
function isDriverError(error) {
  return typeof error.code === "string" && typeof error.message === "string" && typeof error.severity === "string" && (typeof error.detail === "string" || error.detail === void 0) && (typeof error.column === "string" || error.column === void 0) && (typeof error.hint === "string" || error.hint === void 0);
}
function mapSocketError(error) {
  switch (error.code) {
    case "ENOTFOUND":
    case "ECONNREFUSED":
      return {
        kind: "DatabaseNotReachable",
        host: error.address ?? error.hostname,
        port: error.port
      };
    case "ECONNRESET":
      return {
        kind: "ConnectionClosed"
      };
    case "ETIMEDOUT":
      return {
        kind: "SocketTimeout"
      };
  }
}
function isSocketError(error) {
  return typeof error.code === "string" && typeof error.syscall === "string" && typeof error.errno === "number" && SOCKET_ERRORS.has(error.code);
}
function isTlsError(error) {
  if (typeof error.code === "string") {
    return TLS_ERRORS.has(error.code);
  }
  switch (error.message) {
    case "The server does not support SSL connections":
    case "There was an error establishing an SSL connection":
      return true;
  }
  return false;
}
var types2 = import_pg.default.types;
var debug2 = Debug("prisma:driver-adapter:pg");
var PgQueryable = class {
  constructor(client, pgOptions) {
    this.client = client;
    this.pgOptions = pgOptions;
  }
  provider = "postgres";
  adapterName = name;
  /**
   * Execute a query given as SQL, interpolating the given parameters.
   */
  async queryRaw(query) {
    var _a;
    const tag = "[js::query_raw]";
    debug2(`${tag} %O`, query);
    const { fields, rows } = await this.performIO(query);
    const columnNames = fields.map((field) => field.name);
    let columnTypes = [];
    try {
      columnTypes = fields.map((field) => fieldToColumnType(field.dataTypeID));
    } catch (e) {
      if (e instanceof UnsupportedNativeDataType) {
        throw new DriverAdapterError({
          kind: "UnsupportedNativeDataType",
          type: e.type
        });
      }
      throw e;
    }
    const udtParser = (_a = this.pgOptions) == null ? void 0 : _a.userDefinedTypeParser;
    if (udtParser) {
      for (let i = 0; i < fields.length; i++) {
        const field = fields[i];
        if (field.dataTypeID >= FIRST_NORMAL_OBJECT_ID && !Object.hasOwn(customParsers, field.dataTypeID)) {
          for (let j = 0; j < rows.length; j++) {
            rows[j][i] = await udtParser(field.dataTypeID, rows[j][i], this);
          }
        }
      }
    }
    return {
      columnNames,
      columnTypes,
      rows
    };
  }
  /**
   * Execute a query given as SQL, interpolating the given parameters and
   * returning the number of affected rows.
   * Note: Queryable expects a u64, but napi.rs only supports u32.
   */
  async executeRaw(query) {
    const tag = "[js::execute_raw]";
    debug2(`${tag} %O`, query);
    return (await this.performIO(query)).rowCount ?? 0;
  }
  /**
   * Run a query against the database, returning the result set.
   * Should the query fail due to a connection error, the connection is
   * marked as unhealthy.
   */
  async performIO(query) {
    const { sql: sql2, args } = query;
    const values = args.map((arg, i) => mapArg(arg, query.argTypes[i]));
    try {
      const result = await this.client.query(
        {
          text: sql2,
          values,
          rowMode: "array",
          types: {
            // This is the error expected:
            // No overload matches this call.
            // The last overload gave the following error.
            // Type '(oid: number, format?: any) => (json: string) => unknown' is not assignable to type '{ <T>(oid: number): TypeParser<string, string | T>; <T>(oid: number, format: "text"): TypeParser<string, string | T>; <T>(oid: number, format: "binary"): TypeParser<...>; }'.
            //   Type '(json: string) => unknown' is not assignable to type 'TypeParser<Buffer, any>'.
            //     Types of parameters 'json' and 'value' are incompatible.
            //       Type 'Buffer' is not assignable to type 'string'.ts(2769)
            //
            // Because pg-types types expect us to handle both binary and text protocol versions,
            // where as far we can see, pg will ever pass only text version.
            //
            // @ts-expect-error
            getTypeParser: (oid, format) => {
              if (format === "text" && customParsers[oid]) {
                return customParsers[oid];
              }
              return types2.getTypeParser(oid, format);
            }
          }
        },
        values
      );
      return result;
    } catch (e) {
      this.onError(e);
    }
  }
  onError(error) {
    debug2("Error in performIO: %O", error);
    throw new DriverAdapterError(convertDriverError(error));
  }
};
var PgTransaction = class extends PgQueryable {
  constructor(client, options, pgOptions, cleanup) {
    super(client, pgOptions);
    this.options = options;
    this.pgOptions = pgOptions;
    this.cleanup = cleanup;
  }
  async commit() {
    var _a;
    debug2(`[js::commit]`);
    (_a = this.cleanup) == null ? void 0 : _a.call(this);
    this.client.release();
  }
  async rollback() {
    var _a;
    debug2(`[js::rollback]`);
    (_a = this.cleanup) == null ? void 0 : _a.call(this);
    this.client.release();
  }
};
var PrismaPgAdapter = class extends PgQueryable {
  constructor(client, pgOptions, release) {
    super(client);
    this.pgOptions = pgOptions;
    this.release = release;
  }
  async startTransaction(isolationLevel) {
    const options = {
      usePhantomQuery: false
    };
    const tag = "[js::startTransaction]";
    debug2("%s options: %O", tag, options);
    const conn = await this.client.connect().catch((error) => this.onError(error));
    const onError = (err) => {
      var _a, _b;
      debug2(`Error from pool connection: ${err.message} %O`, err);
      (_b = (_a = this.pgOptions) == null ? void 0 : _a.onConnectionError) == null ? void 0 : _b.call(_a, err);
    };
    conn.on("error", onError);
    const cleanup = () => {
      conn.removeListener("error", onError);
    };
    try {
      const tx = new PgTransaction(conn, options, this.pgOptions, cleanup);
      await tx.executeRaw({ sql: "BEGIN", args: [], argTypes: [] });
      if (isolationLevel) {
        await tx.executeRaw({
          sql: `SET TRANSACTION ISOLATION LEVEL ${isolationLevel}`,
          args: [],
          argTypes: []
        });
      }
      return tx;
    } catch (error) {
      cleanup();
      conn.release(error);
      this.onError(error);
    }
  }
  async executeScript(script) {
    const statements = script.split(";").map((stmt) => stmt.trim()).filter((stmt) => stmt.length > 0);
    for (const stmt of statements) {
      try {
        await this.client.query(stmt);
      } catch (error) {
        this.onError(error);
      }
    }
  }
  getConnectionInfo() {
    var _a;
    return {
      schemaName: (_a = this.pgOptions) == null ? void 0 : _a.schema,
      supportsRelationJoins: true
    };
  }
  async dispose() {
    var _a;
    return (_a = this.release) == null ? void 0 : _a.call(this);
  }
  underlyingDriver() {
    return this.client;
  }
};
var PrismaPgAdapterFactory = class {
  constructor(poolOrConfig, options) {
    this.options = options;
    if (poolOrConfig instanceof import_pg.default.Pool) {
      this.externalPool = poolOrConfig;
      this.config = poolOrConfig.options;
    } else {
      this.externalPool = null;
      this.config = poolOrConfig;
    }
  }
  provider = "postgres";
  adapterName = name;
  config;
  externalPool;
  async connect() {
    const client = this.externalPool ?? new import_pg.default.Pool(this.config);
    const onIdleClientError = (err) => {
      var _a, _b;
      debug2(`Error from idle pool client: ${err.message} %O`, err);
      (_b = (_a = this.options) == null ? void 0 : _a.onPoolError) == null ? void 0 : _b.call(_a, err);
    };
    client.on("error", onIdleClientError);
    return new PrismaPgAdapter(client, this.options, async () => {
      var _a;
      if (this.externalPool) {
        if ((_a = this.options) == null ? void 0 : _a.disposeExternalPool) {
          await this.externalPool.end();
          this.externalPool = null;
        } else {
          this.externalPool.removeListener("error", onIdleClientError);
        }
      } else {
        await client.end();
      }
    });
  }
  async connectToShadowDb() {
    const conn = await this.connect();
    const database = `prisma_migrate_shadow_db_${globalThis.crypto.randomUUID()}`;
    await conn.executeScript(`CREATE DATABASE "${database}"`);
    const client = new import_pg.default.Pool({ ...this.config, database });
    return new PrismaPgAdapter(client, void 0, async () => {
      await conn.executeScript(`DROP DATABASE "${database}"`);
      await client.end();
    });
  }
};

// src/client.ts
var import_pg3 = require("pg");

// generated/client.ts
var path = __toESM(require("path"));
var import_node_url = require("url");

// generated/internal/class.ts
var runtime = __toESM(require("@prisma/client/runtime/client"));
var config = {
  "previewFeatures": [],
  "clientVersion": "7.7.0",
  "engineVersion": "75cbdc1eb7150937890ad5465d861175c6624711",
  "activeProvider": "postgresql",
  "inlineSchema": 'generator client {\n  provider = "prisma-client"\n  output   = "../generated"\n}\n\ndatasource db {\n  provider = "postgresql"\n}\n\nmodel Server {\n  id               String   @id\n  name             String\n  blacklisted      Boolean  @default(false)\n  nextTicketNumber Int      @default(1)\n  settings         Json     @default("{}")\n  createdAt        DateTime @default(now())\n  updatedAt        DateTime @updatedAt\n\n  warns     Warn[]\n  mutes     Mute[]\n  bans      Ban[]\n  reminders Reminder[]\n  tickets   Ticket[]\n  autoroles AutoRole[]\n\n  @@map("server")\n}\n\nmodel Warn {\n  id          String    @id @default(cuid())\n  guildId     String\n  userId      String\n  moderatorId String\n  reason      String?\n  expiresAt   DateTime?\n  createdAt   DateTime  @default(now())\n\n  server Server @relation(fields: [guildId], references: [id], onDelete: Cascade)\n\n  @@index([guildId, userId])\n  @@map("warns")\n}\n\nmodel Mute {\n  id        String    @id @default(cuid())\n  guildId   String\n  userId    String\n  reason    String?\n  expiresAt DateTime?\n  createdAt DateTime  @default(now())\n\n  server Server @relation(fields: [guildId], references: [id], onDelete: Cascade)\n\n  @@unique([guildId, userId])\n  @@index([expiresAt])\n}\n\nmodel Ban {\n  id        String    @id @default(cuid())\n  guildId   String\n  userId    String\n  reason    String?\n  expiresAt DateTime?\n  createdAt DateTime  @default(now())\n\n  server Server @relation(fields: [guildId], references: [id], onDelete: Cascade)\n\n  @@unique([guildId, userId])\n  @@index([expiresAt])\n}\n\nmodel Reminder {\n  id        String   @id @default(cuid())\n  guildId   String?\n  userId    String\n  channelId String?\n  message   String\n  remindAt  DateTime\n  createdAt DateTime @default(now())\n\n  server Server? @relation(fields: [guildId], references: [id], onDelete: Cascade)\n\n  @@index([remindAt])\n  @@index([userId])\n}\n\nmodel Ticket {\n  id           String   @id @default(cuid())\n  guildId      String\n  ticketNumber Int\n  channelId    String?  @unique\n  userId       String\n  reason       String?\n  createdAt    DateTime @default(now())\n\n  server Server @relation(fields: [guildId], references: [id], onDelete: Cascade)\n\n  @@unique([guildId, ticketNumber])\n  @@index([guildId, userId])\n  @@map("tickets")\n}\n\nmodel AutoRole {\n  id        String   @id @default(cuid())\n  guildId   String\n  roleId    String\n  botRole   Boolean?\n  createdAt DateTime @default(now())\n\n  server Server @relation(fields: [guildId], references: [id], onDelete: Cascade)\n\n  @@unique([guildId, roleId])\n  @@index([guildId])\n  @@map("autoroles")\n}\n',
  "runtimeDataModel": {
    "models": {},
    "enums": {},
    "types": {}
  },
  "parameterizationSchema": {
    "strings": [],
    "graph": ""
  }
};
config.runtimeDataModel = JSON.parse('{"models":{"Server":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"name","kind":"scalar","type":"String"},{"name":"blacklisted","kind":"scalar","type":"Boolean"},{"name":"nextTicketNumber","kind":"scalar","type":"Int"},{"name":"settings","kind":"scalar","type":"Json"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"warns","kind":"object","type":"Warn","relationName":"ServerToWarn"},{"name":"mutes","kind":"object","type":"Mute","relationName":"MuteToServer"},{"name":"bans","kind":"object","type":"Ban","relationName":"BanToServer"},{"name":"reminders","kind":"object","type":"Reminder","relationName":"ReminderToServer"},{"name":"tickets","kind":"object","type":"Ticket","relationName":"ServerToTicket"},{"name":"autoroles","kind":"object","type":"AutoRole","relationName":"AutoRoleToServer"}],"dbName":"server"},"Warn":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"guildId","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"moderatorId","kind":"scalar","type":"String"},{"name":"reason","kind":"scalar","type":"String"},{"name":"expiresAt","kind":"scalar","type":"DateTime"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"server","kind":"object","type":"Server","relationName":"ServerToWarn"}],"dbName":"warns"},"Mute":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"guildId","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"reason","kind":"scalar","type":"String"},{"name":"expiresAt","kind":"scalar","type":"DateTime"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"server","kind":"object","type":"Server","relationName":"MuteToServer"}],"dbName":null},"Ban":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"guildId","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"reason","kind":"scalar","type":"String"},{"name":"expiresAt","kind":"scalar","type":"DateTime"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"server","kind":"object","type":"Server","relationName":"BanToServer"}],"dbName":null},"Reminder":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"guildId","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"channelId","kind":"scalar","type":"String"},{"name":"message","kind":"scalar","type":"String"},{"name":"remindAt","kind":"scalar","type":"DateTime"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"server","kind":"object","type":"Server","relationName":"ReminderToServer"}],"dbName":null},"Ticket":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"guildId","kind":"scalar","type":"String"},{"name":"ticketNumber","kind":"scalar","type":"Int"},{"name":"channelId","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"reason","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"server","kind":"object","type":"Server","relationName":"ServerToTicket"}],"dbName":"tickets"},"AutoRole":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"guildId","kind":"scalar","type":"String"},{"name":"roleId","kind":"scalar","type":"String"},{"name":"botRole","kind":"scalar","type":"Boolean"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"server","kind":"object","type":"Server","relationName":"AutoRoleToServer"}],"dbName":"autoroles"}},"enums":{},"types":{}}');
config.parameterizationSchema = {
  strings: JSON.parse('["where","orderBy","cursor","server","warns","mutes","bans","reminders","tickets","autoroles","_count","Server.findUnique","Server.findUniqueOrThrow","Server.findFirst","Server.findFirstOrThrow","Server.findMany","data","Server.createOne","Server.createMany","Server.createManyAndReturn","Server.updateOne","Server.updateMany","Server.updateManyAndReturn","create","update","Server.upsertOne","Server.deleteOne","Server.deleteMany","having","_avg","_sum","_min","_max","Server.groupBy","Server.aggregate","Warn.findUnique","Warn.findUniqueOrThrow","Warn.findFirst","Warn.findFirstOrThrow","Warn.findMany","Warn.createOne","Warn.createMany","Warn.createManyAndReturn","Warn.updateOne","Warn.updateMany","Warn.updateManyAndReturn","Warn.upsertOne","Warn.deleteOne","Warn.deleteMany","Warn.groupBy","Warn.aggregate","Mute.findUnique","Mute.findUniqueOrThrow","Mute.findFirst","Mute.findFirstOrThrow","Mute.findMany","Mute.createOne","Mute.createMany","Mute.createManyAndReturn","Mute.updateOne","Mute.updateMany","Mute.updateManyAndReturn","Mute.upsertOne","Mute.deleteOne","Mute.deleteMany","Mute.groupBy","Mute.aggregate","Ban.findUnique","Ban.findUniqueOrThrow","Ban.findFirst","Ban.findFirstOrThrow","Ban.findMany","Ban.createOne","Ban.createMany","Ban.createManyAndReturn","Ban.updateOne","Ban.updateMany","Ban.updateManyAndReturn","Ban.upsertOne","Ban.deleteOne","Ban.deleteMany","Ban.groupBy","Ban.aggregate","Reminder.findUnique","Reminder.findUniqueOrThrow","Reminder.findFirst","Reminder.findFirstOrThrow","Reminder.findMany","Reminder.createOne","Reminder.createMany","Reminder.createManyAndReturn","Reminder.updateOne","Reminder.updateMany","Reminder.updateManyAndReturn","Reminder.upsertOne","Reminder.deleteOne","Reminder.deleteMany","Reminder.groupBy","Reminder.aggregate","Ticket.findUnique","Ticket.findUniqueOrThrow","Ticket.findFirst","Ticket.findFirstOrThrow","Ticket.findMany","Ticket.createOne","Ticket.createMany","Ticket.createManyAndReturn","Ticket.updateOne","Ticket.updateMany","Ticket.updateManyAndReturn","Ticket.upsertOne","Ticket.deleteOne","Ticket.deleteMany","Ticket.groupBy","Ticket.aggregate","AutoRole.findUnique","AutoRole.findUniqueOrThrow","AutoRole.findFirst","AutoRole.findFirstOrThrow","AutoRole.findMany","AutoRole.createOne","AutoRole.createMany","AutoRole.createManyAndReturn","AutoRole.updateOne","AutoRole.updateMany","AutoRole.updateManyAndReturn","AutoRole.upsertOne","AutoRole.deleteOne","AutoRole.deleteMany","AutoRole.groupBy","AutoRole.aggregate","AND","OR","NOT","id","guildId","roleId","botRole","createdAt","equals","in","notIn","lt","lte","gt","gte","not","contains","startsWith","endsWith","ticketNumber","channelId","userId","reason","message","remindAt","expiresAt","moderatorId","name","blacklisted","nextTicketNumber","settings","updatedAt","string_contains","string_starts_with","string_ends_with","array_starts_with","array_ends_with","array_contains","guildId_roleId","guildId_ticketNumber","every","some","none","guildId_userId","is","isNot","connectOrCreate","upsert","createMany","set","disconnect","delete","connect","updateMany","deleteMany","increment","decrement","multiply","divide"]'),
  graph: "pQM-cBAEAADsAQAgBQAA7QEAIAYAAO4BACAHAADvAQAgCAAA8AEAIAkAAPEBACCDAQAA6QEAMIQBAAATABCFAQAA6QEAMIYBAQAAAAGKAUAA4wEAIZ4BAQDhAQAhnwEgAOoBACGgAQIA5wEAIaEBAADrAQAgogFAAOMBACEBAAAAAQAgCwMAAOQBACCDAQAA-QEAMIQBAAADABCFAQAA-QEAMIYBAQDhAQAhhwEBAOEBACGKAUAA4wEAIZgBAQDhAQAhmQEBAOgBACGcAUAA9gEAIZ0BAQDhAQAhAwMAAIEDACCZAQAA-gEAIJwBAAD6AQAgCwMAAOQBACCDAQAA-QEAMIQBAAADABCFAQAA-QEAMIYBAQAAAAGHAQEA4QEAIYoBQADjAQAhmAEBAOEBACGZAQEA6AEAIZwBQAD2AQAhnQEBAOEBACEDAAAAAwAgAQAABAAwAgAABQAgCgMAAOQBACCDAQAA-AEAMIQBAAAHABCFAQAA-AEAMIYBAQDhAQAhhwEBAOEBACGKAUAA4wEAIZgBAQDhAQAhmQEBAOgBACGcAUAA9gEAIQMDAACBAwAgmQEAAPoBACCcAQAA-gEAIAsDAADkAQAggwEAAPgBADCEAQAABwAQhQEAAPgBADCGAQEAAAABhwEBAOEBACGKAUAA4wEAIZgBAQDhAQAhmQEBAOgBACGcAUAA9gEAIa4BAAD3AQAgAwAAAAcAIAEAAAgAMAIAAAkAIAoDAADkAQAggwEAAPUBADCEAQAACwAQhQEAAPUBADCGAQEA4QEAIYcBAQDhAQAhigFAAOMBACGYAQEA4QEAIZkBAQDoAQAhnAFAAPYBACEDAwAAgQMAIJkBAAD6AQAgnAEAAPoBACALAwAA5AEAIIMBAAD1AQAwhAEAAAsAEIUBAAD1AQAwhgEBAAAAAYcBAQDhAQAhigFAAOMBACGYAQEA4QEAIZkBAQDoAQAhnAFAAPYBACGuAQAA9AEAIAMAAAALACABAAAMADACAAANACALAwAA8wEAIIMBAADyAQAwhAEAAA8AEIUBAADyAQAwhgEBAOEBACGHAQEA6AEAIYoBQADjAQAhlwEBAOgBACGYAQEA4QEAIZoBAQDhAQAhmwFAAOMBACEDAwAAgQMAIIcBAAD6AQAglwEAAPoBACALAwAA8wEAIIMBAADyAQAwhAEAAA8AEIUBAADyAQAwhgEBAAAAAYcBAQDoAQAhigFAAOMBACGXAQEA6AEAIZgBAQDhAQAhmgEBAOEBACGbAUAA4wEAIQMAAAAPACABAAAQADACAAARACAQBAAA7AEAIAUAAO0BACAGAADuAQAgBwAA7wEAIAgAAPABACAJAADxAQAggwEAAOkBADCEAQAAEwAQhQEAAOkBADCGAQEA4QEAIYoBQADjAQAhngEBAOEBACGfASAA6gEAIaABAgDnAQAhoQEAAOsBACCiAUAA4wEAIQEAAAATACALAwAA5AEAIIMBAADmAQAwhAEAABUAEIUBAADmAQAwhgEBAOEBACGHAQEA4QEAIYoBQADjAQAhlgECAOcBACGXAQEA6AEAIZgBAQDhAQAhmQEBAOgBACEDAwAAgQMAIJcBAAD6AQAgmQEAAPoBACAMAwAA5AEAIIMBAADmAQAwhAEAABUAEIUBAADmAQAwhgEBAAAAAYcBAQDhAQAhigFAAOMBACGWAQIA5wEAIZcBAQAAAAGYAQEA4QEAIZkBAQDoAQAhqgEAAOUBACADAAAAFQAgAQAAFgAwAgAAFwAgCQMAAOQBACCDAQAA4AEAMIQBAAAZABCFAQAA4AEAMIYBAQDhAQAhhwEBAOEBACGIAQEA4QEAIYkBIADiAQAhigFAAOMBACECAwAAgQMAIIkBAAD6AQAgCgMAAOQBACCDAQAA4AEAMIQBAAAZABCFAQAA4AEAMIYBAQAAAAGHAQEA4QEAIYgBAQDhAQAhiQEgAOIBACGKAUAA4wEAIakBAADfAQAgAwAAABkAIAEAABoAMAIAABsAIAEAAAADACABAAAABwAgAQAAAAsAIAEAAAAPACABAAAAFQAgAQAAABkAIAEAAAABACAGBAAA-wIAIAUAAPwCACAGAAD9AgAgBwAA_gIAIAgAAP8CACAJAACAAwAgAwAAABMAIAEAACQAMAIAAAEAIAMAAAATACABAAAkADACAAABACADAAAAEwAgAQAAJAAwAgAAAQAgDQQAAPUCACAFAAD2AgAgBgAA9wIAIAcAAPgCACAIAAD5AgAgCQAA-gIAIIYBAQAAAAGKAUAAAAABngEBAAAAAZ8BIAAAAAGgAQIAAAABoQGAAAAAAaIBQAAAAAEBEAAAKAAgB4YBAQAAAAGKAUAAAAABngEBAAAAAZ8BIAAAAAGgAQIAAAABoQGAAAAAAaIBQAAAAAEBEAAAKgAwARAAACoAMA0EAACnAgAgBQAAqAIAIAYAAKkCACAHAACqAgAgCAAAqwIAIAkAAKwCACCGAQEA_gEAIYoBQACAAgAhngEBAP4BACGfASAApgIAIaABAgCIAgAhoQGAAAAAAaIBQACAAgAhAgAAAAEAIBAAAC0AIAeGAQEA_gEAIYoBQACAAgAhngEBAP4BACGfASAApgIAIaABAgCIAgAhoQGAAAAAAaIBQACAAgAhAgAAABMAIBAAAC8AIAIAAAATACAQAAAvACADAAAAAQAgFwAAKAAgGAAALQAgAQAAAAEAIAEAAAATACAFCgAAoQIAIB0AAKICACAeAAClAgAgHwAApAIAICAAAKMCACAKgwEAANkBADCEAQAANgAQhQEAANkBADCGAQEAwAEAIYoBQADCAQAhngEBAMABACGfASAA2gEAIaABAgDMAQAhoQEAANsBACCiAUAAwgEAIQMAAAATACABAAA1ADAcAAA2ACADAAAAEwAgAQAAJAAwAgAAAQAgAQAAAAUAIAEAAAAFACADAAAAAwAgAQAABAAwAgAABQAgAwAAAAMAIAEAAAQAMAIAAAUAIAMAAAADACABAAAEADACAAAFACAIAwAAoAIAIIYBAQAAAAGHAQEAAAABigFAAAAAAZgBAQAAAAGZAQEAAAABnAFAAAAAAZ0BAQAAAAEBEAAAPgAgB4YBAQAAAAGHAQEAAAABigFAAAAAAZgBAQAAAAGZAQEAAAABnAFAAAAAAZ0BAQAAAAEBEAAAQAAwARAAAEAAMAgDAACfAgAghgEBAP4BACGHAQEA_gEAIYoBQACAAgAhmAEBAP4BACGZAQEAiQIAIZwBQACUAgAhnQEBAP4BACECAAAABQAgEAAAQwAgB4YBAQD-AQAhhwEBAP4BACGKAUAAgAIAIZgBAQD-AQAhmQEBAIkCACGcAUAAlAIAIZ0BAQD-AQAhAgAAAAMAIBAAAEUAIAIAAAADACAQAABFACADAAAABQAgFwAAPgAgGAAAQwAgAQAAAAUAIAEAAAADACAFCgAAnAIAIB8AAJ4CACAgAACdAgAgmQEAAPoBACCcAQAA-gEAIAqDAQAA2AEAMIQBAABMABCFAQAA2AEAMIYBAQDAAQAhhwEBAMABACGKAUAAwgEAIZgBAQDAAQAhmQEBAM0BACGcAUAA1AEAIZ0BAQDAAQAhAwAAAAMAIAEAAEsAMBwAAEwAIAMAAAADACABAAAEADACAAAFACABAAAACQAgAQAAAAkAIAMAAAAHACABAAAIADACAAAJACADAAAABwAgAQAACAAwAgAACQAgAwAAAAcAIAEAAAgAMAIAAAkAIAcDAACbAgAghgEBAAAAAYcBAQAAAAGKAUAAAAABmAEBAAAAAZkBAQAAAAGcAUAAAAABARAAAFQAIAaGAQEAAAABhwEBAAAAAYoBQAAAAAGYAQEAAAABmQEBAAAAAZwBQAAAAAEBEAAAVgAwARAAAFYAMAcDAACaAgAghgEBAP4BACGHAQEA_gEAIYoBQACAAgAhmAEBAP4BACGZAQEAiQIAIZwBQACUAgAhAgAAAAkAIBAAAFkAIAaGAQEA_gEAIYcBAQD-AQAhigFAAIACACGYAQEA_gEAIZkBAQCJAgAhnAFAAJQCACECAAAABwAgEAAAWwAgAgAAAAcAIBAAAFsAIAMAAAAJACAXAABUACAYAABZACABAAAACQAgAQAAAAcAIAUKAACXAgAgHwAAmQIAICAAAJgCACCZAQAA-gEAIJwBAAD6AQAgCYMBAADXAQAwhAEAAGIAEIUBAADXAQAwhgEBAMABACGHAQEAwAEAIYoBQADCAQAhmAEBAMABACGZAQEAzQEAIZwBQADUAQAhAwAAAAcAIAEAAGEAMBwAAGIAIAMAAAAHACABAAAIADACAAAJACABAAAADQAgAQAAAA0AIAMAAAALACABAAAMADACAAANACADAAAACwAgAQAADAAwAgAADQAgAwAAAAsAIAEAAAwAMAIAAA0AIAcDAACWAgAghgEBAAAAAYcBAQAAAAGKAUAAAAABmAEBAAAAAZkBAQAAAAGcAUAAAAABARAAAGoAIAaGAQEAAAABhwEBAAAAAYoBQAAAAAGYAQEAAAABmQEBAAAAAZwBQAAAAAEBEAAAbAAwARAAAGwAMAcDAACVAgAghgEBAP4BACGHAQEA_gEAIYoBQACAAgAhmAEBAP4BACGZAQEAiQIAIZwBQACUAgAhAgAAAA0AIBAAAG8AIAaGAQEA_gEAIYcBAQD-AQAhigFAAIACACGYAQEA_gEAIZkBAQCJAgAhnAFAAJQCACECAAAACwAgEAAAcQAgAgAAAAsAIBAAAHEAIAMAAAANACAXAABqACAYAABvACABAAAADQAgAQAAAAsAIAUKAACRAgAgHwAAkwIAICAAAJICACCZAQAA-gEAIJwBAAD6AQAgCYMBAADTAQAwhAEAAHgAEIUBAADTAQAwhgEBAMABACGHAQEAwAEAIYoBQADCAQAhmAEBAMABACGZAQEAzQEAIZwBQADUAQAhAwAAAAsAIAEAAHcAMBwAAHgAIAMAAAALACABAAAMADACAAANACABAAAAEQAgAQAAABEAIAMAAAAPACABAAAQADACAAARACADAAAADwAgAQAAEAAwAgAAEQAgAwAAAA8AIAEAABAAMAIAABEAIAgDAACQAgAghgEBAAAAAYcBAQAAAAGKAUAAAAABlwEBAAAAAZgBAQAAAAGaAQEAAAABmwFAAAAAAQEQAACAAQAgB4YBAQAAAAGHAQEAAAABigFAAAAAAZcBAQAAAAGYAQEAAAABmgEBAAAAAZsBQAAAAAEBEAAAggEAMAEQAACCAQAwAQAAABMAIAgDAACPAgAghgEBAP4BACGHAQEAiQIAIYoBQACAAgAhlwEBAIkCACGYAQEA_gEAIZoBAQD-AQAhmwFAAIACACECAAAAEQAgEAAAhgEAIAeGAQEA_gEAIYcBAQCJAgAhigFAAIACACGXAQEAiQIAIZgBAQD-AQAhmgEBAP4BACGbAUAAgAIAIQIAAAAPACAQAACIAQAgAgAAAA8AIBAAAIgBACABAAAAEwAgAwAAABEAIBcAAIABACAYAACGAQAgAQAAABEAIAEAAAAPACAFCgAAjAIAIB8AAI4CACAgAACNAgAghwEAAPoBACCXAQAA-gEAIAqDAQAA0gEAMIQBAACQAQAQhQEAANIBADCGAQEAwAEAIYcBAQDNAQAhigFAAMIBACGXAQEAzQEAIZgBAQDAAQAhmgEBAMABACGbAUAAwgEAIQMAAAAPACABAACPAQAwHAAAkAEAIAMAAAAPACABAAAQADACAAARACABAAAAFwAgAQAAABcAIAMAAAAVACABAAAWADACAAAXACADAAAAFQAgAQAAFgAwAgAAFwAgAwAAABUAIAEAABYAMAIAABcAIAgDAACLAgAghgEBAAAAAYcBAQAAAAGKAUAAAAABlgECAAAAAZcBAQAAAAGYAQEAAAABmQEBAAAAAQEQAACYAQAgB4YBAQAAAAGHAQEAAAABigFAAAAAAZYBAgAAAAGXAQEAAAABmAEBAAAAAZkBAQAAAAEBEAAAmgEAMAEQAACaAQAwCAMAAIoCACCGAQEA_gEAIYcBAQD-AQAhigFAAIACACGWAQIAiAIAIZcBAQCJAgAhmAEBAP4BACGZAQEAiQIAIQIAAAAXACAQAACdAQAgB4YBAQD-AQAhhwEBAP4BACGKAUAAgAIAIZYBAgCIAgAhlwEBAIkCACGYAQEA_gEAIZkBAQCJAgAhAgAAABUAIBAAAJ8BACACAAAAFQAgEAAAnwEAIAMAAAAXACAXAACYAQAgGAAAnQEAIAEAAAAXACABAAAAFQAgBwoAAIMCACAdAACEAgAgHgAAhwIAIB8AAIYCACAgAACFAgAglwEAAPoBACCZAQAA-gEAIAqDAQAAywEAMIQBAACmAQAQhQEAAMsBADCGAQEAwAEAIYcBAQDAAQAhigFAAMIBACGWAQIAzAEAIZcBAQDNAQAhmAEBAMABACGZAQEAzQEAIQMAAAAVACABAAClAQAwHAAApgEAIAMAAAAVACABAAAWADACAAAXACABAAAAGwAgAQAAABsAIAMAAAAZACABAAAaADACAAAbACADAAAAGQAgAQAAGgAwAgAAGwAgAwAAABkAIAEAABoAMAIAABsAIAYDAACCAgAghgEBAAAAAYcBAQAAAAGIAQEAAAABiQEgAAAAAYoBQAAAAAEBEAAArgEAIAWGAQEAAAABhwEBAAAAAYgBAQAAAAGJASAAAAABigFAAAAAAQEQAACwAQAwARAAALABADAGAwAAgQIAIIYBAQD-AQAhhwEBAP4BACGIAQEA_gEAIYkBIAD_AQAhigFAAIACACECAAAAGwAgEAAAswEAIAWGAQEA_gEAIYcBAQD-AQAhiAEBAP4BACGJASAA_wEAIYoBQACAAgAhAgAAABkAIBAAALUBACACAAAAGQAgEAAAtQEAIAMAAAAbACAXAACuAQAgGAAAswEAIAEAAAAbACABAAAAGQAgBAoAAPsBACAfAAD9AQAgIAAA_AEAIIkBAAD6AQAgCIMBAAC_AQAwhAEAALwBABCFAQAAvwEAMIYBAQDAAQAhhwEBAMABACGIAQEAwAEAIYkBIADBAQAhigFAAMIBACEDAAAAGQAgAQAAuwEAMBwAALwBACADAAAAGQAgAQAAGgAwAgAAGwAgCIMBAAC_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-QEAMIQBAAADABCFAQAA-QEAMIYBAQDhAQAhhwEBAOEBACGKAUAA4wEAIZgBAQDhAQAhmQEBAOgBACGcAUAA9gEAIZ0BAQDhAQAhAAAAAAG0AQEAAAABAbQBIAAAAAEBtAFAAAAAAQUXAAChAwAgGAAApAMAILEBAACiAwAgsgEAAKMDACC3AQAAAQAgAxcAAKEDACCxAQAAogMAILcBAAABACAAAAAAAAW0AQIAAAABugECAAAAAbsBAgAAAAG8AQIAAAABvQECAAAAAQG0AQEAAAABBRcAAJwDACAYAACfAwAgsQEAAJ0DACCyAQAAngMAILcBAAABACADFwAAnAMAILEBAACdAwAgtwEAAAEAIAAAAAcXAACXAwAgGAAAmgMAILEBAACYAwAgsgEAAJkDACC1AQAAEwAgtgEAABMAILcBAAABACADFwAAlwMAILEBAACYAwAgtwEAAAEAIAAAAAG0AUAAAAABBRcAAJIDACAYAACVAwAgsQEAAJMDACCyAQAAlAMAILcBAAABACADFwAAkgMAILEBAACTAwAgtwEAAAEAIAAAAAUXAACNAwAgGAAAkAMAILEBAACOAwAgsgEAAI8DACC3AQAAAQAgAxcAAI0DACCxAQAAjgMAILcBAAABACAAAAAFFwAAiAMAIBgAAIsDACCxAQAAiQMAILIBAACKAwAgtwEAAAEAIAMXAACIAwAgsQEAAIkDACC3AQAAAQAgAAAAAAABtAEgAAAAAQsXAADpAgAwGAAA7gIAMLEBAADqAgAwsgEAAOsCADCzAQAA7AIAILQBAADtAgAwtQEAAO0CADC2AQAA7QIAMLcBAADtAgAwuAEAAO8CADC5AQAA8AIAMAsXAADdAgAwGAAA4gIAMLEBAADeAgAwsgEAAN8CADCzAQAA4AIAILQBAADhAgAwtQEAAOECADC2AQAA4QIAMLcBAADhAgAwuAEAAOMCADC5AQAA5AIAMAsXAADRAgAwGAAA1gIAMLEBAADSAgAwsgEAANMCADCzAQAA1AIAILQBAADVAgAwtQEAANUCADC2AQAA1QIAMLcBAADVAgAwuAEAANcCADC5AQAA2AIAMAsXAADFAgAwGAAAygIAMLEBAADGAgAwsgEAAMcCADCzAQAAyAIAILQBAADJAgAwtQEAAMkCADC2AQAAyQIAMLcBAADJAgAwuAEAAMsCADC5AQAAzAIAMAsXAAC5AgAwGAAAvgIAMLEBAAC6AgAwsgEAALsCADCzAQAAvAIAILQBAAC9AgAwtQEAAL0CADC2AQAAvQIAMLcBAAC9AgAwuAEAAL8CADC5AQAAwAIAMAsXAACtAgAwGAAAsgIAMLEBAACuAgAwsgEAAK8CADCzAQAAsAIAILQBAACxAgAwtQEAALECADC2AQAAsQIAMLcBAACxAgAwuAEAALMCADC5AQAAtAIAMASGAQEAAAABiAEBAAAAAYkBIAAAAAGKAUAAAAABAgAAABsAIBcAALgCACADAAAAGwAgFwAAuAIAIBgAALcCACABEAAAhwMAMAoDAADkAQAggwEAAOABADCEAQAAGQAQhQEAAOABADCGAQEAAAABhwEBAOEBACGIAQEA4QEAIYkBIADiAQAhigFAAOMBACGpAQAA3wEAIAIAAAAbACAQAAC3AgAgAgAAALUCACAQAAC2AgAgCIMBAAC0AgAwhAEAALUCABCFAQAAtAIAMIYBAQDhAQAhhwEBAOEBACGIAQEA4QEAIYkBIADiAQAhigFAAOMBACEIgwEAALQCADCEAQAAtQIAEIUBAAC0AgAwhgEBAOEBACGHAQEA4QEAIYgBAQDhAQAhiQEgAOIBACGKAUAA4wEAIQSGAQEA_gEAIYgBAQD-AQAhiQEgAP8BACGKAUAAgAIAIQSGAQEA_gEAIYgBAQD-AQAhiQEgAP8BACGKAUAAgAIAIQSGAQEAAAABiAEBAAAAAYkBIAAAAAGKAUAAAAABBoYBAQAAAAGKAUAAAAABlgECAAAAAZcBAQAAAAGYAQEAAAABmQEBAAAAAQIAAAAXACAXAADEAgAgAwAAABcAIBcAAMQCACAYAADDAgAgARAAAIYDADAMAwAA5AEAIIMBAADmAQAwhAEAABUAEIUBAADmAQAwhgEBAAAAAYcBAQDhAQAhigFAAOMBACGWAQIA5wEAIZcBAQAAAAGYAQEA4QEAIZkBAQDoAQAhqgEAAOUBACACAAAAFwAgEAAAwwIAIAIAAADBAgAgEAAAwgIAIAqDAQAAwAIAMIQBAADBAgAQhQEAAMACADCGAQEA4QEAIYcBAQDhAQAhigFAAOMBACGWAQIA5wEAIZcBAQDoAQAhmAEBAOEBACGZAQEA6AEAIQqDAQAAwAIAMIQBAADBAgAQhQEAAMACADCGAQEA4QEAIYcBAQDhAQAhigFAAOMBACGWAQIA5wEAIZcBAQDoAQAhmAEBAOEBACGZAQEA6AEAIQaGAQEA_gEAIYoBQACAAgAhlgECAIgCACGXAQEAiQIAIZgBAQD-AQAhmQEBAIkCACEGhgEBAP4BACGKAUAAgAIAIZYBAgCIAgAhlwEBAIkCACGYAQEA_gEAIZkBAQCJAgAhBoYBAQAAAAGKAUAAAAABlgECAAAAAZcBAQAAAAGYAQEAAAABmQEBAAAAAQaGAQEAAAABigFAAAAAAZcBAQAAAAGYAQEAAAABmgEBAAAAAZsBQAAAAAECAAAAEQAgFwAA0AIAIAMAAAARACAXAADQAgAgGAAAzwIAIAEQAACFAwAwCwMAAPMBACCDAQAA8gEAMIQBAAAPABCFAQAA8gEAMIYBAQAAAAGHAQEA6AEAIYoBQADjAQAhlwEBAOgBACGYAQEA4QEAIZoBAQDhAQAhmwFAAOMBACECAAAAEQAgEAAAzwIAIAIAAADNAgAgEAAAzgIAIAqDAQAAzAIAMIQBAADNAgAQhQEAAMwCADCGAQEA4QEAIYcBAQDoAQAhigFAAOMBACGXAQEA6AEAIZgBAQDhAQAhmgEBAOEBACGbAUAA4wEAIQqDAQAAzAIAMIQBAADNAgAQhQEAAMwCADCGAQEA4QEAIYcBAQDoAQAhigFAAOMBACGXAQEA6AEAIZgBAQDhAQAhmgEBAOEBACGbAUAA4wEAIQaGAQEA_gEAIYoBQACAAgAhlwEBAIkCACGYAQEA_gEAIZoBAQD-AQAhmwFAAIACACEGhgEBAP4BACGKAUAAgAIAIZcBAQCJAgAhmAEBAP4BACGaAQEA_gEAIZsBQACAAgAhBoYBAQAAAAGKAUAAAAABlwEBAAAAAZgBAQAAAAGaAQEAAAABmwFAAAAAAQWGAQEAAAABigFAAAAAAZgBAQAAAAGZAQEAAAABnAFAAAAAAQIAAAANACAXAADcAgAgAwAAAA0AIBcAANwCACAYAADbAgAgARAAAIQDADALAwAA5AEAIIMBAAD1AQAwhAEAAAsAEIUBAAD1AQAwhgEBAAAAAYcBAQDhAQAhigFAAOMBACGYAQEA4QEAIZkBAQDoAQAhnAFAAPYBACGuAQAA9AEAIAIAAAANACAQAADbAgAgAgAAANkCACAQAADaAgAgCYMBAADYAgAwhAEAANkCABCFAQAA2AIAMIYBAQDhAQAhhwEBAOEBACGKAUAA4wEAIZgBAQDhAQAhmQEBAOgBACGcAUAA9gEAIQmDAQAA2AIAMIQBAADZAgAQhQEAANgCADCGAQEA4QEAIYcBAQDhAQAhigFAAOMBACGYAQEA4QEAIZkBAQDoAQAhnAFAAPYBACEFhgEBAP4BACGKAUAAgAIAIZgBAQD-AQAhmQEBAIkCACGcAUAAlAIAIQWGAQEA_gEAIYoBQACAAgAhmAEBAP4BACGZAQEAiQIAIZwBQACUAgAhBYYBAQAAAAGKAUAAAAABmAEBAAAAAZkBAQAAAAGcAUAAAAABBYYBAQAAAAGKAUAAAAABmAEBAAAAAZkBAQAAAAGcAUAAAAABAgAAAAkAIBcAAOgCACADAAAACQAgFwAA6AIAIBgAAOcCACABEAAAgwMAMAsDAADkAQAggwEAAPgBADCEAQAABwAQhQEAAPgBADCGAQEAAAABhwEBAOEBACGKAUAA4wEAIZgBAQDhAQAhmQEBAOgBACGcAUAA9gEAIa4BAAD3AQAgAgAAAAkAIBAAAOcCACACAAAA5QIAIBAAAOYCACAJgwEAAOQCADCEAQAA5QIAEIUBAADkAgAwhgEBAOEBACGHAQEA4QEAIYoBQADjAQAhmAEBAOEBACGZAQEA6AEAIZwBQAD2AQAhCYMBAADkAgAwhAEAAOUCABCFAQAA5AIAMIYBAQDhAQAhhwEBAOEBACGKAUAA4wEAIZgBAQDhAQAhmQEBAOgBACGcAUAA9gEAIQWGAQEA_gEAIYoBQACAAgAhmAEBAP4BACGZAQEAiQIAIZwBQACUAgAhBYYBAQD-AQAhigFAAIACACGYAQEA_gEAIZkBAQCJAgAhnAFAAJQCACEFhgEBAAAAAYoBQAAAAAGYAQEAAAABmQEBAAAAAZwBQAAAAAEGhgEBAAAAAYoBQAAAAAGYAQEAAAABmQEBAAAAAZwBQAAAAAGdAQEAAAABAgAAAAUAIBcAAPQCACADAAAABQAgFwAA9AIAIBgAAPMCACABEAAAggMAMAsDAADkAQAggwEAAPkBADCEAQAAAwAQhQEAAPkBADCGAQEAAAABhwEBAOEBACGKAUAA4wEAIZgBAQDhAQAhmQEBAOgBACGcAUAA9gEAIZ0BAQDhAQAhAgAAAAUAIBAAAPMCACACAAAA8QIAIBAAAPICACAKgwEAAPACADCEAQAA8QIAEIUBAADwAgAwhgEBAOEBACGHAQEA4QEAIYoBQADjAQAhmAEBAOEBACGZAQEA6AEAIZwBQAD2AQAhnQEBAOEBACEKgwEAAPACADCEAQAA8QIAEIUBAADwAgAwhgEBAOEBACGHAQEA4QEAIYoBQADjAQAhmAEBAOEBACGZAQEA6AEAIZwBQAD2AQAhnQEBAOEBACEGhgEBAP4BACGKAUAAgAIAIZgBAQD-AQAhmQEBAIkCACGcAUAAlAIAIZ0BAQD-AQAhBoYBAQD-AQAhigFAAIACACGYAQEA_gEAIZkBAQCJAgAhnAFAAJQCACGdAQEA_gEAIQaGAQEAAAABigFAAAAAAZgBAQAAAAGZAQEAAAABnAFAAAAAAZ0BAQAAAAEEFwAA6QIAMLEBAADqAgAwswEAAOwCACC3AQAA7QIAMAQXAADdAgAwsQEAAN4CADCzAQAA4AIAILcBAADhAgAwBBcAANECADCxAQAA0gIAMLMBAADUAgAgtwEAANUCADAEFwAAxQIAMLEBAADGAgAwswEAAMgCACC3AQAAyQIAMAQXAAC5AgAwsQEAALoCADCzAQAAvAIAILcBAAC9AgAwBBcAAK0CADCxAQAArgIAMLMBAACwAgAgtwEAALECADAAAAAAAAAGBAAA-wIAIAUAAPwCACAGAAD9AgAgBwAA_gIAIAgAAP8CACAJAACAAwAgBoYBAQAAAAGKAUAAAAABmAEBAAAAAZkBAQAAAAGcAUAAAAABnQEBAAAAAQWGAQEAAAABigFAAAAAAZgBAQAAAAGZAQEAAAABnAFAAAAAAQWGAQEAAAABigFAAAAAAZgBAQAAAAGZAQEAAAABnAFAAAAAAQaGAQEAAAABigFAAAAAAZcBAQAAAAGYAQEAAAABmgEBAAAAAZsBQAAAAAEGhgEBAAAAAYoBQAAAAAGWAQIAAAABlwEBAAAAAZgBAQAAAAGZAQEAAAABBIYBAQAAAAGIAQEAAAABiQEgAAAAAYoBQAAAAAEMBQAA9gIAIAYAAPcCACAHAAD4AgAgCAAA-QIAIAkAAPoCACCGAQEAAAABigFAAAAAAZ4BAQAAAAGfASAAAAABoAECAAAAAaEBgAAAAAGiAUAAAAABAgAAAAEAIBcAAIgDACADAAAAEwAgFwAAiAMAIBgAAIwDACAOAAAAEwAgBQAAqAIAIAYAAKkCACAHAACqAgAgCAAAqwIAIAkAAKwCACAQAACMAwAghgEBAP4BACGKAUAAgAIAIZ4BAQD-AQAhnwEgAKYCACGgAQIAiAIAIaEBgAAAAAGiAUAAgAIAIQwFAACoAgAgBgAAqQIAIAcAAKoCACAIAACrAgAgCQAArAIAIIYBAQD-AQAhigFAAIACACGeAQEA_gEAIZ8BIACmAgAhoAECAIgCACGhAYAAAAABogFAAIACACEMBAAA9QIAIAYAAPcCACAHAAD4AgAgCAAA-QIAIAkAAPoCACCGAQEAAAABigFAAAAAAZ4BAQAAAAGfASAAAAABoAECAAAAAaEBgAAAAAGiAUAAAAABAgAAAAEAIBcAAI0DACADAAAAEwAgFwAAjQMAIBgAAJEDACAOAAAAEwAgBAAApwIAIAYAAKkCACAHAACqAgAgCAAAqwIAIAkAAKwCACAQAACRAwAghgEBAP4BACGKAUAAgAIAIZ4BAQD-AQAhnwEgAKYCACGgAQIAiAIAIaEBgAAAAAGiAUAAgAIAIQwEAACnAgAgBgAAqQIAIAcAAKoCACAIAACrAgAgCQAArAIAIIYBAQD-AQAhigFAAIACACGeAQEA_gEAIZ8BIACmAgAhoAECAIgCACGhAYAAAAABogFAAIACACEMBAAA9QIAIAUAAPYCACAHAAD4AgAgCAAA-QIAIAkAAPoCACCGAQEAAAABigFAAAAAAZ4BAQAAAAGfASAAAAABoAECAAAAAaEBgAAAAAGiAUAAAAABAgAAAAEAIBcAAJIDACADAAAAEwAgFwAAkgMAIBgAAJYDACAOAAAAEwAgBAAApwIAIAUAAKgCACAHAACqAgAgCAAAqwIAIAkAAKwCACAQAACWAwAghgEBAP4BACGKAUAAgAIAIZ4BAQD-AQAhnwEgAKYCACGgAQIAiAIAIaEBgAAAAAGiAUAAgAIAIQwEAACnAgAgBQAAqAIAIAcAAKoCACAIAACrAgAgCQAArAIAIIYBAQD-AQAhigFAAIACACGeAQEA_gEAIZ8BIACmAgAhoAECAIgCACGhAYAAAAABogFAAIACACEMBAAA9QIAIAUAAPYCACAGAAD3AgAgCAAA-QIAIAkAAPoCACCGAQEAAAABigFAAAAAAZ4BAQAAAAGfASAAAAABoAECAAAAAaEBgAAAAAGiAUAAAAABAgAAAAEAIBcAAJcDACADAAAAEwAgFwAAlwMAIBgAAJsDACAOAAAAEwAgBAAApwIAIAUAAKgCACAGAACpAgAgCAAAqwIAIAkAAKwCACAQAACbAwAghgEBAP4BACGKAUAAgAIAIZ4BAQD-AQAhnwEgAKYCACGgAQIAiAIAIaEBgAAAAAGiAUAAgAIAIQwEAACnAgAgBQAAqAIAIAYAAKkCACAIAACrAgAgCQAArAIAIIYBAQD-AQAhigFAAIACACGeAQEA_gEAIZ8BIACmAgAhoAECAIgCACGhAYAAAAABogFAAIACACEMBAAA9QIAIAUAAPYCACAGAAD3AgAgBwAA-AIAIAkAAPoCACCGAQEAAAABigFAAAAAAZ4BAQAAAAGfASAAAAABoAECAAAAAaEBgAAAAAGiAUAAAAABAgAAAAEAIBcAAJwDACADAAAAEwAgFwAAnAMAIBgAAKADACAOAAAAEwAgBAAApwIAIAUAAKgCACAGAACpAgAgBwAAqgIAIAkAAKwCACAQAACgAwAghgEBAP4BACGKAUAAgAIAIZ4BAQD-AQAhnwEgAKYCACGgAQIAiAIAIaEBgAAAAAGiAUAAgAIAIQwEAACnAgAgBQAAqAIAIAYAAKkCACAHAACqAgAgCQAArAIAIIYBAQD-AQAhigFAAIACACGeAQEA_gEAIZ8BIACmAgAhoAECAIgCACGhAYAAAAABogFAAIACACEMBAAA9QIAIAUAAPYCACAGAAD3AgAgBwAA-AIAIAgAAPkCACCGAQEAAAABigFAAAAAAZ4BAQAAAAGfASAAAAABoAECAAAAAaEBgAAAAAGiAUAAAAABAgAAAAEAIBcAAKEDACADAAAAEwAgFwAAoQMAIBgAAKUDACAOAAAAEwAgBAAApwIAIAUAAKgCACAGAACpAgAgBwAAqgIAIAgAAKsCACAQAAClAwAghgEBAP4BACGKAUAAgAIAIZ4BAQD-AQAhnwEgAKYCACGgAQIAiAIAIaEBgAAAAAGiAUAAgAIAIQwEAACnAgAgBQAAqAIAIAYAAKkCACAHAACqAgAgCAAAqwIAIIYBAQD-AQAhigFAAIACACGeAQEA_gEAIZ8BIACmAgAhoAECAIgCACGhAYAAAAABogFAAIACACEHBAYCBQoDBg4EBxIFCBgGCRwHCgAIAQMAAQEDAAEBAwABAQMUAQEDAAEBAwABBgQdAAUeAAYfAAcgAAghAAkiAAAAAAUKAA0dAA4eAA8fABAgABEAAAAAAAUKAA0dAA4eAA8fABAgABEBAwABAQMAAQMKABYfABcgABgAAAADCgAWHwAXIAAYAQMAAQEDAAEDCgAdHwAeIAAfAAAAAwoAHR8AHiAAHwEDAAEBAwABAwoAJB8AJSAAJgAAAAMKACQfACUgACYBA4UBAQEDiwEBAwoAKx8ALCAALQAAAAMKACsfACwgAC0BAwABAQMAAQUKADIdADMeADQfADUgADYAAAAAAAUKADIdADMeADQfADUgADYBAwABAQMAAQMKADsfADwgAD0AAAADCgA7HwA8IAA9CwIBDCMBDSUBDiYBDycBESkBEisJEywKFC4BFTAJFjELGTIBGjMBGzQJITcMIjgSIzkCJDoCJTsCJjwCJz0CKD8CKUEJKkITK0QCLEYJLUcULkgCL0kCMEoJMU0VMk4ZM08DNFADNVEDNlIDN1MDOFUDOVcJOlgaO1oDPFwJPV0bPl4DP18DQGAJQWMcQmQgQ2UERGYERWcERmgER2kESGsESW0JSm4hS3AETHIJTXMiTnQET3UEUHYJUXkjUnonU3sFVHwFVX0FVn4FV38FWIEBBVmDAQlahAEoW4cBBVyJAQldigEpXowBBV-NAQVgjgEJYZEBKmKSAS5jkwEGZJQBBmWVAQZmlgEGZ5cBBmiZAQZpmwEJapwBL2ueAQZsoAEJbaEBMG6iAQZvowEGcKQBCXGnATFyqAE3c6kBB3SqAQd1qwEHdqwBB3etAQd4rwEHebEBCXqyATh7tAEHfLYBCX23ATl-uAEHf7kBB4ABugEJgQG9ATqCAb4BPg"
};
async function decodeBase64AsWasm(wasmBase64) {
  const { Buffer: Buffer2 } = await import("buffer");
  const wasmArray = Buffer2.from(wasmBase64, "base64");
  return new WebAssembly.Module(wasmArray);
}
config.compilerWasm = {
  getRuntime: async () => await import("@prisma/client/runtime/query_compiler_fast_bg.postgresql.mjs"),
  getQueryCompilerWasmModule: async () => {
    const { wasm } = await import("@prisma/client/runtime/query_compiler_fast_bg.postgresql.wasm-base64.mjs");
    return await decodeBase64AsWasm(wasm);
  },
  importName: "./query_compiler_fast_bg.js"
};
function getPrismaClientClass() {
  return runtime.getPrismaClient(config);
}

// generated/internal/prismaNamespace.ts
var prismaNamespace_exports = {};
__export(prismaNamespace_exports, {
  AnyNull: () => AnyNull2,
  AutoRoleScalarFieldEnum: () => AutoRoleScalarFieldEnum,
  BanScalarFieldEnum: () => BanScalarFieldEnum,
  DbNull: () => DbNull2,
  Decimal: () => Decimal2,
  JsonNull: () => JsonNull2,
  JsonNullValueFilter: () => JsonNullValueFilter,
  JsonNullValueInput: () => JsonNullValueInput,
  ModelName: () => ModelName,
  MuteScalarFieldEnum: () => MuteScalarFieldEnum,
  NullTypes: () => NullTypes2,
  NullsOrder: () => NullsOrder,
  PrismaClientInitializationError: () => PrismaClientInitializationError2,
  PrismaClientKnownRequestError: () => PrismaClientKnownRequestError2,
  PrismaClientRustPanicError: () => PrismaClientRustPanicError2,
  PrismaClientUnknownRequestError: () => PrismaClientUnknownRequestError2,
  PrismaClientValidationError: () => PrismaClientValidationError2,
  QueryMode: () => QueryMode,
  ReminderScalarFieldEnum: () => ReminderScalarFieldEnum,
  ServerScalarFieldEnum: () => ServerScalarFieldEnum,
  SortOrder: () => SortOrder,
  Sql: () => Sql2,
  TicketScalarFieldEnum: () => TicketScalarFieldEnum,
  TransactionIsolationLevel: () => TransactionIsolationLevel,
  WarnScalarFieldEnum: () => WarnScalarFieldEnum,
  defineExtension: () => defineExtension,
  empty: () => empty2,
  getExtensionContext: () => getExtensionContext,
  join: () => join2,
  prismaVersion: () => prismaVersion,
  raw: () => raw2,
  sql: () => sql
});
var runtime2 = __toESM(require("@prisma/client/runtime/client"));
var PrismaClientKnownRequestError2 = runtime2.PrismaClientKnownRequestError;
var PrismaClientUnknownRequestError2 = runtime2.PrismaClientUnknownRequestError;
var PrismaClientRustPanicError2 = runtime2.PrismaClientRustPanicError;
var PrismaClientInitializationError2 = runtime2.PrismaClientInitializationError;
var PrismaClientValidationError2 = runtime2.PrismaClientValidationError;
var sql = runtime2.sqltag;
var empty2 = runtime2.empty;
var join2 = runtime2.join;
var raw2 = runtime2.raw;
var Sql2 = runtime2.Sql;
var Decimal2 = runtime2.Decimal;
var getExtensionContext = runtime2.Extensions.getExtensionContext;
var prismaVersion = {
  client: "7.7.0",
  engine: "75cbdc1eb7150937890ad5465d861175c6624711"
};
var NullTypes2 = {
  DbNull: runtime2.NullTypes.DbNull,
  JsonNull: runtime2.NullTypes.JsonNull,
  AnyNull: runtime2.NullTypes.AnyNull
};
var DbNull2 = runtime2.DbNull;
var JsonNull2 = runtime2.JsonNull;
var AnyNull2 = runtime2.AnyNull;
var ModelName = {
  Server: "Server",
  Warn: "Warn",
  Mute: "Mute",
  Ban: "Ban",
  Reminder: "Reminder",
  Ticket: "Ticket",
  AutoRole: "AutoRole"
};
var TransactionIsolationLevel = runtime2.makeStrictEnum({
  ReadUncommitted: "ReadUncommitted",
  ReadCommitted: "ReadCommitted",
  RepeatableRead: "RepeatableRead",
  Serializable: "Serializable"
});
var ServerScalarFieldEnum = {
  id: "id",
  name: "name",
  blacklisted: "blacklisted",
  nextTicketNumber: "nextTicketNumber",
  settings: "settings",
  createdAt: "createdAt",
  updatedAt: "updatedAt"
};
var WarnScalarFieldEnum = {
  id: "id",
  guildId: "guildId",
  userId: "userId",
  moderatorId: "moderatorId",
  reason: "reason",
  expiresAt: "expiresAt",
  createdAt: "createdAt"
};
var MuteScalarFieldEnum = {
  id: "id",
  guildId: "guildId",
  userId: "userId",
  reason: "reason",
  expiresAt: "expiresAt",
  createdAt: "createdAt"
};
var BanScalarFieldEnum = {
  id: "id",
  guildId: "guildId",
  userId: "userId",
  reason: "reason",
  expiresAt: "expiresAt",
  createdAt: "createdAt"
};
var ReminderScalarFieldEnum = {
  id: "id",
  guildId: "guildId",
  userId: "userId",
  channelId: "channelId",
  message: "message",
  remindAt: "remindAt",
  createdAt: "createdAt"
};
var TicketScalarFieldEnum = {
  id: "id",
  guildId: "guildId",
  ticketNumber: "ticketNumber",
  channelId: "channelId",
  userId: "userId",
  reason: "reason",
  createdAt: "createdAt"
};
var AutoRoleScalarFieldEnum = {
  id: "id",
  guildId: "guildId",
  roleId: "roleId",
  botRole: "botRole",
  createdAt: "createdAt"
};
var SortOrder = {
  asc: "asc",
  desc: "desc"
};
var JsonNullValueInput = {
  JsonNull: JsonNull2
};
var QueryMode = {
  default: "default",
  insensitive: "insensitive"
};
var JsonNullValueFilter = {
  DbNull: DbNull2,
  JsonNull: JsonNull2,
  AnyNull: AnyNull2
};
var NullsOrder = {
  first: "first",
  last: "last"
};
var defineExtension = runtime2.Extensions.defineExtension;

// generated/enums.ts
var enums_exports = {};

// generated/client.ts
var import_meta = {};
globalThis["__dirname"] = path.dirname((0, import_node_url.fileURLToPath)(import_meta.url));
var PrismaClient = getPrismaClientClass();

// src/client.ts
(0, import_dotenv.config)({ path: import_path.default.resolve(process.cwd(), "../../.env") });
var globalForPrisma = global;
var connectionString = process.env.DATABASE_URL;
var pool = new import_pg3.Pool({
  connectionString
});
var adapter = new PrismaPgAdapterFactory(pool);
var prisma = globalForPrisma.prisma || new PrismaClient({
  adapter
  // Optional: Log queries to see if connection works
  // log: ['query', 'info', 'warn', 'error'],
});
if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  $Enums,
  Prisma,
  PrismaClient,
  prisma
});
