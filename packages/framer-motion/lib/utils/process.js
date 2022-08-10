/**
 * Browser-safe usage of process
 */
var defaultEnvironment = "production";
export var env = typeof process === "undefined" || process.env === undefined
    ? defaultEnvironment
    : process.env.NODE_ENV || defaultEnvironment;
//# sourceMappingURL=process.js.map