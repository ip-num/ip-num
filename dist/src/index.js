"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !exports.hasOwnProperty(p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Exposes all the library's modules making them available from the "ip-num" module.
 * Making it possible to get access to all any of the modules by doing require("ip-num")
 *
 * @example
 * let ipNum = require("ip-num")
 * ipNum.IPv4CidrRange // gets access to IPv4CidrRange
 * ipNum.Asn // gets access to Asn
 */
__exportStar(require("./BinaryUtils"), exports);
__exportStar(require("./Hexadecatet"), exports);
__exportStar(require("./HexadecimalUtils"), exports);
__exportStar(require("./IPNumber"), exports);
__exportStar(require("./IPNumType"), exports);
__exportStar(require("./IPPool"), exports);
__exportStar(require("./IPRange"), exports);
__exportStar(require("./IPv6Utils"), exports);
__exportStar(require("./Octet"), exports);
__exportStar(require("./Prefix"), exports);
__exportStar(require("./Validator"), exports);
//# sourceMappingURL=index.js.map