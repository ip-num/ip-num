// [ip-num]  Version: 0.0.9-pre-alpha. Released on: Friday, September 22nd, 2017, 5:39:43 PM  
 var ipnum =
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 13);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const bigInt = __webpack_require__(1);
/**
 * Converts a decimal number to binary string
 *
 * @param num number to parse
 * @returns {string} the binary string representation of number
 */
exports.decimalNumberToBinaryString = (num) => {
    return Number(num).toString(2);
};
/**
 * Converts a given BigInteger number to a binary string
 * @param num the BigInteger number
 * @returns {string} the binary string
 */
exports.bigIntegerNumberToBinaryString = (num) => {
    return num.toString(2);
};
/**
 * Converts a decimal number to binary octet (8 bit) string. If needed the octet will be padded with zeros
 * to make it up to 8 bits
 *
 * @param {number} num to convert to octet string
 * @returns {string} the octet string representation of given number
 */
exports.decimalNumberToOctetString = (num) => {
    let binaryString = exports.decimalNumberToBinaryString(num);
    let length = binaryString.length;
    if (length > 8) {
        throw new Error("Given decimal in binary contains digits greater than an octet");
    }
    return exports.leftPadWithZeroBit(binaryString, 8);
};
/**
 * Parses number in binary to number in BigInteger
 *
 * @param num binary number in string to parse
 * @returns {number} binary number in BigInteger
 */
exports.parseBinaryStringToBigInteger = (num) => {
    return bigInt(num, 2);
};
/**
 * Given an IPv4 number in dot-decimal notated string, e.g 192.168.0.1 converts it to
 * binary string, e.g. '11000000101010000000000000000001'
 *
 * @param dottedDecimal IPv4 string in dot-decimal notation
 * @returns {string} the binary value of the given ipv4 number in string
 */
exports.dottedDecimalNotationToBinaryString = (dottedDecimal) => {
    let stringOctets = dottedDecimal.split(".");
    return stringOctets.reduce((binaryAsString, octet) => {
        return binaryAsString.concat(exports.decimalNumberToOctetString(parseInt(octet)));
    }, '');
};
/**
 * Given a binary string, adds a number of zero to the left until string is as long as the given string length
 * @param {string} binaryString the string to pad
 * @param {number} finalStringLength the final length of string after padding
 * @returns {string}
 */
exports.leftPadWithZeroBit = (binaryString, finalStringLength) => {
    if (binaryString.length > finalStringLength) {
        throw new Error(`Given string is already longer than ${finalStringLength}`);
    }
    return "0".repeat(finalStringLength - binaryString.length).concat(binaryString);
};


/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(module) {var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;var bigInt = (function (undefined) {
    "use strict";

    var BASE = 1e7,
        LOG_BASE = 7,
        MAX_INT = 9007199254740992,
        MAX_INT_ARR = smallToArray(MAX_INT),
        LOG_MAX_INT = Math.log(MAX_INT);

    function Integer(v, radix) {
        if (typeof v === "undefined") return Integer[0];
        if (typeof radix !== "undefined") return +radix === 10 ? parseValue(v) : parseBase(v, radix);
        return parseValue(v);
    }

    function BigInteger(value, sign) {
        this.value = value;
        this.sign = sign;
        this.isSmall = false;
    }
    BigInteger.prototype = Object.create(Integer.prototype);

    function SmallInteger(value) {
        this.value = value;
        this.sign = value < 0;
        this.isSmall = true;
    }
    SmallInteger.prototype = Object.create(Integer.prototype);

    function isPrecise(n) {
        return -MAX_INT < n && n < MAX_INT;
    }

    function smallToArray(n) { // For performance reasons doesn't reference BASE, need to change this function if BASE changes
        if (n < 1e7)
            return [n];
        if (n < 1e14)
            return [n % 1e7, Math.floor(n / 1e7)];
        return [n % 1e7, Math.floor(n / 1e7) % 1e7, Math.floor(n / 1e14)];
    }

    function arrayToSmall(arr) { // If BASE changes this function may need to change
        trim(arr);
        var length = arr.length;
        if (length < 4 && compareAbs(arr, MAX_INT_ARR) < 0) {
            switch (length) {
                case 0: return 0;
                case 1: return arr[0];
                case 2: return arr[0] + arr[1] * BASE;
                default: return arr[0] + (arr[1] + arr[2] * BASE) * BASE;
            }
        }
        return arr;
    }

    function trim(v) {
        var i = v.length;
        while (v[--i] === 0);
        v.length = i + 1;
    }

    function createArray(length) { // function shamelessly stolen from Yaffle's library https://github.com/Yaffle/BigInteger
        var x = new Array(length);
        var i = -1;
        while (++i < length) {
            x[i] = 0;
        }
        return x;
    }

    function truncate(n) {
        if (n > 0) return Math.floor(n);
        return Math.ceil(n);
    }

    function add(a, b) { // assumes a and b are arrays with a.length >= b.length
        var l_a = a.length,
            l_b = b.length,
            r = new Array(l_a),
            carry = 0,
            base = BASE,
            sum, i;
        for (i = 0; i < l_b; i++) {
            sum = a[i] + b[i] + carry;
            carry = sum >= base ? 1 : 0;
            r[i] = sum - carry * base;
        }
        while (i < l_a) {
            sum = a[i] + carry;
            carry = sum === base ? 1 : 0;
            r[i++] = sum - carry * base;
        }
        if (carry > 0) r.push(carry);
        return r;
    }

    function addAny(a, b) {
        if (a.length >= b.length) return add(a, b);
        return add(b, a);
    }

    function addSmall(a, carry) { // assumes a is array, carry is number with 0 <= carry < MAX_INT
        var l = a.length,
            r = new Array(l),
            base = BASE,
            sum, i;
        for (i = 0; i < l; i++) {
            sum = a[i] - base + carry;
            carry = Math.floor(sum / base);
            r[i] = sum - carry * base;
            carry += 1;
        }
        while (carry > 0) {
            r[i++] = carry % base;
            carry = Math.floor(carry / base);
        }
        return r;
    }

    BigInteger.prototype.add = function (v) {
        var n = parseValue(v);
        if (this.sign !== n.sign) {
            return this.subtract(n.negate());
        }
        var a = this.value, b = n.value;
        if (n.isSmall) {
            return new BigInteger(addSmall(a, Math.abs(b)), this.sign);
        }
        return new BigInteger(addAny(a, b), this.sign);
    };
    BigInteger.prototype.plus = BigInteger.prototype.add;

    SmallInteger.prototype.add = function (v) {
        var n = parseValue(v);
        var a = this.value;
        if (a < 0 !== n.sign) {
            return this.subtract(n.negate());
        }
        var b = n.value;
        if (n.isSmall) {
            if (isPrecise(a + b)) return new SmallInteger(a + b);
            b = smallToArray(Math.abs(b));
        }
        return new BigInteger(addSmall(b, Math.abs(a)), a < 0);
    };
    SmallInteger.prototype.plus = SmallInteger.prototype.add;

    function subtract(a, b) { // assumes a and b are arrays with a >= b
        var a_l = a.length,
            b_l = b.length,
            r = new Array(a_l),
            borrow = 0,
            base = BASE,
            i, difference;
        for (i = 0; i < b_l; i++) {
            difference = a[i] - borrow - b[i];
            if (difference < 0) {
                difference += base;
                borrow = 1;
            } else borrow = 0;
            r[i] = difference;
        }
        for (i = b_l; i < a_l; i++) {
            difference = a[i] - borrow;
            if (difference < 0) difference += base;
            else {
                r[i++] = difference;
                break;
            }
            r[i] = difference;
        }
        for (; i < a_l; i++) {
            r[i] = a[i];
        }
        trim(r);
        return r;
    }

    function subtractAny(a, b, sign) {
        var value;
        if (compareAbs(a, b) >= 0) {
            value = subtract(a,b);
        } else {
            value = subtract(b, a);
            sign = !sign;
        }
        value = arrayToSmall(value);
        if (typeof value === "number") {
            if (sign) value = -value;
            return new SmallInteger(value);
        }
        return new BigInteger(value, sign);
    }

    function subtractSmall(a, b, sign) { // assumes a is array, b is number with 0 <= b < MAX_INT
        var l = a.length,
            r = new Array(l),
            carry = -b,
            base = BASE,
            i, difference;
        for (i = 0; i < l; i++) {
            difference = a[i] + carry;
            carry = Math.floor(difference / base);
            difference %= base;
            r[i] = difference < 0 ? difference + base : difference;
        }
        r = arrayToSmall(r);
        if (typeof r === "number") {
            if (sign) r = -r;
            return new SmallInteger(r);
        } return new BigInteger(r, sign);
    }

    BigInteger.prototype.subtract = function (v) {
        var n = parseValue(v);
        if (this.sign !== n.sign) {
            return this.add(n.negate());
        }
        var a = this.value, b = n.value;
        if (n.isSmall)
            return subtractSmall(a, Math.abs(b), this.sign);
        return subtractAny(a, b, this.sign);
    };
    BigInteger.prototype.minus = BigInteger.prototype.subtract;

    SmallInteger.prototype.subtract = function (v) {
        var n = parseValue(v);
        var a = this.value;
        if (a < 0 !== n.sign) {
            return this.add(n.negate());
        }
        var b = n.value;
        if (n.isSmall) {
            return new SmallInteger(a - b);
        }
        return subtractSmall(b, Math.abs(a), a >= 0);
    };
    SmallInteger.prototype.minus = SmallInteger.prototype.subtract;

    BigInteger.prototype.negate = function () {
        return new BigInteger(this.value, !this.sign);
    };
    SmallInteger.prototype.negate = function () {
        var sign = this.sign;
        var small = new SmallInteger(-this.value);
        small.sign = !sign;
        return small;
    };

    BigInteger.prototype.abs = function () {
        return new BigInteger(this.value, false);
    };
    SmallInteger.prototype.abs = function () {
        return new SmallInteger(Math.abs(this.value));
    };

    function multiplyLong(a, b) {
        var a_l = a.length,
            b_l = b.length,
            l = a_l + b_l,
            r = createArray(l),
            base = BASE,
            product, carry, i, a_i, b_j;
        for (i = 0; i < a_l; ++i) {
            a_i = a[i];
            for (var j = 0; j < b_l; ++j) {
                b_j = b[j];
                product = a_i * b_j + r[i + j];
                carry = Math.floor(product / base);
                r[i + j] = product - carry * base;
                r[i + j + 1] += carry;
            }
        }
        trim(r);
        return r;
    }

    function multiplySmall(a, b) { // assumes a is array, b is number with |b| < BASE
        var l = a.length,
            r = new Array(l),
            base = BASE,
            carry = 0,
            product, i;
        for (i = 0; i < l; i++) {
            product = a[i] * b + carry;
            carry = Math.floor(product / base);
            r[i] = product - carry * base;
        }
        while (carry > 0) {
            r[i++] = carry % base;
            carry = Math.floor(carry / base);
        }
        return r;
    }

    function shiftLeft(x, n) {
        var r = [];
        while (n-- > 0) r.push(0);
        return r.concat(x);
    }

    function multiplyKaratsuba(x, y) {
        var n = Math.max(x.length, y.length);

        if (n <= 30) return multiplyLong(x, y);
        n = Math.ceil(n / 2);

        var b = x.slice(n),
            a = x.slice(0, n),
            d = y.slice(n),
            c = y.slice(0, n);

        var ac = multiplyKaratsuba(a, c),
            bd = multiplyKaratsuba(b, d),
            abcd = multiplyKaratsuba(addAny(a, b), addAny(c, d));

        var product = addAny(addAny(ac, shiftLeft(subtract(subtract(abcd, ac), bd), n)), shiftLeft(bd, 2 * n));
        trim(product);
        return product;
    }

    // The following function is derived from a surface fit of a graph plotting the performance difference
    // between long multiplication and karatsuba multiplication versus the lengths of the two arrays.
    function useKaratsuba(l1, l2) {
        return -0.012 * l1 - 0.012 * l2 + 0.000015 * l1 * l2 > 0;
    }

    BigInteger.prototype.multiply = function (v) {
        var n = parseValue(v),
            a = this.value, b = n.value,
            sign = this.sign !== n.sign,
            abs;
        if (n.isSmall) {
            if (b === 0) return Integer[0];
            if (b === 1) return this;
            if (b === -1) return this.negate();
            abs = Math.abs(b);
            if (abs < BASE) {
                return new BigInteger(multiplySmall(a, abs), sign);
            }
            b = smallToArray(abs);
        }
        if (useKaratsuba(a.length, b.length)) // Karatsuba is only faster for certain array sizes
            return new BigInteger(multiplyKaratsuba(a, b), sign);
        return new BigInteger(multiplyLong(a, b), sign);
    };

    BigInteger.prototype.times = BigInteger.prototype.multiply;

    function multiplySmallAndArray(a, b, sign) { // a >= 0
        if (a < BASE) {
            return new BigInteger(multiplySmall(b, a), sign);
        }
        return new BigInteger(multiplyLong(b, smallToArray(a)), sign);
    }
    SmallInteger.prototype._multiplyBySmall = function (a) {
            if (isPrecise(a.value * this.value)) {
                return new SmallInteger(a.value * this.value);
            }
            return multiplySmallAndArray(Math.abs(a.value), smallToArray(Math.abs(this.value)), this.sign !== a.sign);
    };
    BigInteger.prototype._multiplyBySmall = function (a) {
            if (a.value === 0) return Integer[0];
            if (a.value === 1) return this;
            if (a.value === -1) return this.negate();
            return multiplySmallAndArray(Math.abs(a.value), this.value, this.sign !== a.sign);
    };
    SmallInteger.prototype.multiply = function (v) {
        return parseValue(v)._multiplyBySmall(this);
    };
    SmallInteger.prototype.times = SmallInteger.prototype.multiply;

    function square(a) {
        var l = a.length,
            r = createArray(l + l),
            base = BASE,
            product, carry, i, a_i, a_j;
        for (i = 0; i < l; i++) {
            a_i = a[i];
            for (var j = 0; j < l; j++) {
                a_j = a[j];
                product = a_i * a_j + r[i + j];
                carry = Math.floor(product / base);
                r[i + j] = product - carry * base;
                r[i + j + 1] += carry;
            }
        }
        trim(r);
        return r;
    }

    BigInteger.prototype.square = function () {
        return new BigInteger(square(this.value), false);
    };

    SmallInteger.prototype.square = function () {
        var value = this.value * this.value;
        if (isPrecise(value)) return new SmallInteger(value);
        return new BigInteger(square(smallToArray(Math.abs(this.value))), false);
    };

    function divMod1(a, b) { // Left over from previous version. Performs faster than divMod2 on smaller input sizes.
        var a_l = a.length,
            b_l = b.length,
            base = BASE,
            result = createArray(b.length),
            divisorMostSignificantDigit = b[b_l - 1],
            // normalization
            lambda = Math.ceil(base / (2 * divisorMostSignificantDigit)),
            remainder = multiplySmall(a, lambda),
            divisor = multiplySmall(b, lambda),
            quotientDigit, shift, carry, borrow, i, l, q;
        if (remainder.length <= a_l) remainder.push(0);
        divisor.push(0);
        divisorMostSignificantDigit = divisor[b_l - 1];
        for (shift = a_l - b_l; shift >= 0; shift--) {
            quotientDigit = base - 1;
            if (remainder[shift + b_l] !== divisorMostSignificantDigit) {
              quotientDigit = Math.floor((remainder[shift + b_l] * base + remainder[shift + b_l - 1]) / divisorMostSignificantDigit);
            }
            // quotientDigit <= base - 1
            carry = 0;
            borrow = 0;
            l = divisor.length;
            for (i = 0; i < l; i++) {
                carry += quotientDigit * divisor[i];
                q = Math.floor(carry / base);
                borrow += remainder[shift + i] - (carry - q * base);
                carry = q;
                if (borrow < 0) {
                    remainder[shift + i] = borrow + base;
                    borrow = -1;
                } else {
                    remainder[shift + i] = borrow;
                    borrow = 0;
                }
            }
            while (borrow !== 0) {
                quotientDigit -= 1;
                carry = 0;
                for (i = 0; i < l; i++) {
                    carry += remainder[shift + i] - base + divisor[i];
                    if (carry < 0) {
                        remainder[shift + i] = carry + base;
                        carry = 0;
                    } else {
                        remainder[shift + i] = carry;
                        carry = 1;
                    }
                }
                borrow += carry;
            }
            result[shift] = quotientDigit;
        }
        // denormalization
        remainder = divModSmall(remainder, lambda)[0];
        return [arrayToSmall(result), arrayToSmall(remainder)];
    }

    function divMod2(a, b) { // Implementation idea shamelessly stolen from Silent Matt's library http://silentmatt.com/biginteger/
        // Performs faster than divMod1 on larger input sizes.
        var a_l = a.length,
            b_l = b.length,
            result = [],
            part = [],
            base = BASE,
            guess, xlen, highx, highy, check;
        while (a_l) {
            part.unshift(a[--a_l]);
            trim(part);
            if (compareAbs(part, b) < 0) {
                result.push(0);
                continue;
            }
            xlen = part.length;
            highx = part[xlen - 1] * base + part[xlen - 2];
            highy = b[b_l - 1] * base + b[b_l - 2];
            if (xlen > b_l) {
                highx = (highx + 1) * base;
            }
            guess = Math.ceil(highx / highy);
            do {
                check = multiplySmall(b, guess);
                if (compareAbs(check, part) <= 0) break;
                guess--;
            } while (guess);
            result.push(guess);
            part = subtract(part, check);
        }
        result.reverse();
        return [arrayToSmall(result), arrayToSmall(part)];
    }

    function divModSmall(value, lambda) {
        var length = value.length,
            quotient = createArray(length),
            base = BASE,
            i, q, remainder, divisor;
        remainder = 0;
        for (i = length - 1; i >= 0; --i) {
            divisor = remainder * base + value[i];
            q = truncate(divisor / lambda);
            remainder = divisor - q * lambda;
            quotient[i] = q | 0;
        }
        return [quotient, remainder | 0];
    }

    function divModAny(self, v) {
        var value, n = parseValue(v);
        var a = self.value, b = n.value;
        var quotient;
        if (b === 0) throw new Error("Cannot divide by zero");
        if (self.isSmall) {
            if (n.isSmall) {
                return [new SmallInteger(truncate(a / b)), new SmallInteger(a % b)];
            }
            return [Integer[0], self];
        }
        if (n.isSmall) {
            if (b === 1) return [self, Integer[0]];
            if (b == -1) return [self.negate(), Integer[0]];
            var abs = Math.abs(b);
            if (abs < BASE) {
                value = divModSmall(a, abs);
                quotient = arrayToSmall(value[0]);
                var remainder = value[1];
                if (self.sign) remainder = -remainder;
                if (typeof quotient === "number") {
                    if (self.sign !== n.sign) quotient = -quotient;
                    return [new SmallInteger(quotient), new SmallInteger(remainder)];
                }
                return [new BigInteger(quotient, self.sign !== n.sign), new SmallInteger(remainder)];
            }
            b = smallToArray(abs);
        }
        var comparison = compareAbs(a, b);
        if (comparison === -1) return [Integer[0], self];
        if (comparison === 0) return [Integer[self.sign === n.sign ? 1 : -1], Integer[0]];

        // divMod1 is faster on smaller input sizes
        if (a.length + b.length <= 200)
            value = divMod1(a, b);
        else value = divMod2(a, b);

        quotient = value[0];
        var qSign = self.sign !== n.sign,
            mod = value[1],
            mSign = self.sign;
        if (typeof quotient === "number") {
            if (qSign) quotient = -quotient;
            quotient = new SmallInteger(quotient);
        } else quotient = new BigInteger(quotient, qSign);
        if (typeof mod === "number") {
            if (mSign) mod = -mod;
            mod = new SmallInteger(mod);
        } else mod = new BigInteger(mod, mSign);
        return [quotient, mod];
    }

    BigInteger.prototype.divmod = function (v) {
        var result = divModAny(this, v);
        return {
            quotient: result[0],
            remainder: result[1]
        };
    };
    SmallInteger.prototype.divmod = BigInteger.prototype.divmod;

    BigInteger.prototype.divide = function (v) {
        return divModAny(this, v)[0];
    };
    SmallInteger.prototype.over = SmallInteger.prototype.divide = BigInteger.prototype.over = BigInteger.prototype.divide;

    BigInteger.prototype.mod = function (v) {
        return divModAny(this, v)[1];
    };
    SmallInteger.prototype.remainder = SmallInteger.prototype.mod = BigInteger.prototype.remainder = BigInteger.prototype.mod;

    BigInteger.prototype.pow = function (v) {
        var n = parseValue(v),
            a = this.value,
            b = n.value,
            value, x, y;
        if (b === 0) return Integer[1];
        if (a === 0) return Integer[0];
        if (a === 1) return Integer[1];
        if (a === -1) return n.isEven() ? Integer[1] : Integer[-1];
        if (n.sign) {
            return Integer[0];
        }
        if (!n.isSmall) throw new Error("The exponent " + n.toString() + " is too large.");
        if (this.isSmall) {
            if (isPrecise(value = Math.pow(a, b)))
                return new SmallInteger(truncate(value));
        }
        x = this;
        y = Integer[1];
        while (true) {
            if (b & 1 === 1) {
                y = y.times(x);
                --b;
            }
            if (b === 0) break;
            b /= 2;
            x = x.square();
        }
        return y;
    };
    SmallInteger.prototype.pow = BigInteger.prototype.pow;

    BigInteger.prototype.modPow = function (exp, mod) {
        exp = parseValue(exp);
        mod = parseValue(mod);
        if (mod.isZero()) throw new Error("Cannot take modPow with modulus 0");
        var r = Integer[1],
            base = this.mod(mod);
        while (exp.isPositive()) {
            if (base.isZero()) return Integer[0];
            if (exp.isOdd()) r = r.multiply(base).mod(mod);
            exp = exp.divide(2);
            base = base.square().mod(mod);
        }
        return r;
    };
    SmallInteger.prototype.modPow = BigInteger.prototype.modPow;

    function compareAbs(a, b) {
        if (a.length !== b.length) {
            return a.length > b.length ? 1 : -1;
        }
        for (var i = a.length - 1; i >= 0; i--) {
            if (a[i] !== b[i]) return a[i] > b[i] ? 1 : -1;
        }
        return 0;
    }

    BigInteger.prototype.compareAbs = function (v) {
        var n = parseValue(v),
            a = this.value,
            b = n.value;
        if (n.isSmall) return 1;
        return compareAbs(a, b);
    };
    SmallInteger.prototype.compareAbs = function (v) {
        var n = parseValue(v),
            a = Math.abs(this.value),
            b = n.value;
        if (n.isSmall) {
            b = Math.abs(b);
            return a === b ? 0 : a > b ? 1 : -1;
        }
        return -1;
    };

    BigInteger.prototype.compare = function (v) {
        // See discussion about comparison with Infinity:
        // https://github.com/peterolson/BigInteger.js/issues/61
        if (v === Infinity) {
            return -1;
        }
        if (v === -Infinity) {
            return 1;
        }

        var n = parseValue(v),
            a = this.value,
            b = n.value;
        if (this.sign !== n.sign) {
            return n.sign ? 1 : -1;
        }
        if (n.isSmall) {
            return this.sign ? -1 : 1;
        }
        return compareAbs(a, b) * (this.sign ? -1 : 1);
    };
    BigInteger.prototype.compareTo = BigInteger.prototype.compare;

    SmallInteger.prototype.compare = function (v) {
        if (v === Infinity) {
            return -1;
        }
        if (v === -Infinity) {
            return 1;
        }

        var n = parseValue(v),
            a = this.value,
            b = n.value;
        if (n.isSmall) {
            return a == b ? 0 : a > b ? 1 : -1;
        }
        if (a < 0 !== n.sign) {
            return a < 0 ? -1 : 1;
        }
        return a < 0 ? 1 : -1;
    };
    SmallInteger.prototype.compareTo = SmallInteger.prototype.compare;

    BigInteger.prototype.equals = function (v) {
        return this.compare(v) === 0;
    };
    SmallInteger.prototype.eq = SmallInteger.prototype.equals = BigInteger.prototype.eq = BigInteger.prototype.equals;

    BigInteger.prototype.notEquals = function (v) {
        return this.compare(v) !== 0;
    };
    SmallInteger.prototype.neq = SmallInteger.prototype.notEquals = BigInteger.prototype.neq = BigInteger.prototype.notEquals;

    BigInteger.prototype.greater = function (v) {
        return this.compare(v) > 0;
    };
    SmallInteger.prototype.gt = SmallInteger.prototype.greater = BigInteger.prototype.gt = BigInteger.prototype.greater;

    BigInteger.prototype.lesser = function (v) {
        return this.compare(v) < 0;
    };
    SmallInteger.prototype.lt = SmallInteger.prototype.lesser = BigInteger.prototype.lt = BigInteger.prototype.lesser;

    BigInteger.prototype.greaterOrEquals = function (v) {
        return this.compare(v) >= 0;
    };
    SmallInteger.prototype.geq = SmallInteger.prototype.greaterOrEquals = BigInteger.prototype.geq = BigInteger.prototype.greaterOrEquals;

    BigInteger.prototype.lesserOrEquals = function (v) {
        return this.compare(v) <= 0;
    };
    SmallInteger.prototype.leq = SmallInteger.prototype.lesserOrEquals = BigInteger.prototype.leq = BigInteger.prototype.lesserOrEquals;

    BigInteger.prototype.isEven = function () {
        return (this.value[0] & 1) === 0;
    };
    SmallInteger.prototype.isEven = function () {
        return (this.value & 1) === 0;
    };

    BigInteger.prototype.isOdd = function () {
        return (this.value[0] & 1) === 1;
    };
    SmallInteger.prototype.isOdd = function () {
        return (this.value & 1) === 1;
    };

    BigInteger.prototype.isPositive = function () {
        return !this.sign;
    };
    SmallInteger.prototype.isPositive = function () {
        return this.value > 0;
    };

    BigInteger.prototype.isNegative = function () {
        return this.sign;
    };
    SmallInteger.prototype.isNegative = function () {
        return this.value < 0;
    };

    BigInteger.prototype.isUnit = function () {
        return false;
    };
    SmallInteger.prototype.isUnit = function () {
        return Math.abs(this.value) === 1;
    };

    BigInteger.prototype.isZero = function () {
        return false;
    };
    SmallInteger.prototype.isZero = function () {
        return this.value === 0;
    };
    BigInteger.prototype.isDivisibleBy = function (v) {
        var n = parseValue(v);
        var value = n.value;
        if (value === 0) return false;
        if (value === 1) return true;
        if (value === 2) return this.isEven();
        return this.mod(n).equals(Integer[0]);
    };
    SmallInteger.prototype.isDivisibleBy = BigInteger.prototype.isDivisibleBy;

    function isBasicPrime(v) {
        var n = v.abs();
        if (n.isUnit()) return false;
        if (n.equals(2) || n.equals(3) || n.equals(5)) return true;
        if (n.isEven() || n.isDivisibleBy(3) || n.isDivisibleBy(5)) return false;
        if (n.lesser(25)) return true;
        // we don't know if it's prime: let the other functions figure it out
    }

    BigInteger.prototype.isPrime = function () {
        var isPrime = isBasicPrime(this);
        if (isPrime !== undefined) return isPrime;
        var n = this.abs(),
            nPrev = n.prev();
        var a = [2, 3, 5, 7, 11, 13, 17, 19],
            b = nPrev,
            d, t, i, x;
        while (b.isEven()) b = b.divide(2);
        for (i = 0; i < a.length; i++) {
            x = bigInt(a[i]).modPow(b, n);
            if (x.equals(Integer[1]) || x.equals(nPrev)) continue;
            for (t = true, d = b; t && d.lesser(nPrev) ; d = d.multiply(2)) {
                x = x.square().mod(n);
                if (x.equals(nPrev)) t = false;
            }
            if (t) return false;
        }
        return true;
    };
    SmallInteger.prototype.isPrime = BigInteger.prototype.isPrime;

    BigInteger.prototype.isProbablePrime = function (iterations) {
        var isPrime = isBasicPrime(this);
        if (isPrime !== undefined) return isPrime;
        var n = this.abs();
        var t = iterations === undefined ? 5 : iterations;
        // use the Fermat primality test
        for (var i = 0; i < t; i++) {
            var a = bigInt.randBetween(2, n.minus(2));
            if (!a.modPow(n.prev(), n).isUnit()) return false; // definitely composite
        }
        return true; // large chance of being prime
    };
    SmallInteger.prototype.isProbablePrime = BigInteger.prototype.isProbablePrime;

    BigInteger.prototype.modInv = function (n) {
        var t = bigInt.zero, newT = bigInt.one, r = parseValue(n), newR = this.abs(), q, lastT, lastR;
        while (!newR.equals(bigInt.zero)) {
            q = r.divide(newR);
            lastT = t;
            lastR = r;
            t = newT;
            r = newR;
            newT = lastT.subtract(q.multiply(newT));
            newR = lastR.subtract(q.multiply(newR));
        }
        if (!r.equals(1)) throw new Error(this.toString() + " and " + n.toString() + " are not co-prime");
        if (t.compare(0) === -1) {
            t = t.add(n);
        }
        if (this.isNegative()) {
            return t.negate();
        }
        return t;
    };

    SmallInteger.prototype.modInv = BigInteger.prototype.modInv;

    BigInteger.prototype.next = function () {
        var value = this.value;
        if (this.sign) {
            return subtractSmall(value, 1, this.sign);
        }
        return new BigInteger(addSmall(value, 1), this.sign);
    };
    SmallInteger.prototype.next = function () {
        var value = this.value;
        if (value + 1 < MAX_INT) return new SmallInteger(value + 1);
        return new BigInteger(MAX_INT_ARR, false);
    };

    BigInteger.prototype.prev = function () {
        var value = this.value;
        if (this.sign) {
            return new BigInteger(addSmall(value, 1), true);
        }
        return subtractSmall(value, 1, this.sign);
    };
    SmallInteger.prototype.prev = function () {
        var value = this.value;
        if (value - 1 > -MAX_INT) return new SmallInteger(value - 1);
        return new BigInteger(MAX_INT_ARR, true);
    };

    var powersOfTwo = [1];
    while (powersOfTwo[powersOfTwo.length - 1] <= BASE) powersOfTwo.push(2 * powersOfTwo[powersOfTwo.length - 1]);
    var powers2Length = powersOfTwo.length, highestPower2 = powersOfTwo[powers2Length - 1];

    function shift_isSmall(n) {
        return ((typeof n === "number" || typeof n === "string") && +Math.abs(n) <= BASE) ||
            (n instanceof BigInteger && n.value.length <= 1);
    }

    BigInteger.prototype.shiftLeft = function (n) {
        if (!shift_isSmall(n)) {
            throw new Error(String(n) + " is too large for shifting.");
        }
        n = +n;
        if (n < 0) return this.shiftRight(-n);
        var result = this;
        while (n >= powers2Length) {
            result = result.multiply(highestPower2);
            n -= powers2Length - 1;
        }
        return result.multiply(powersOfTwo[n]);
    };
    SmallInteger.prototype.shiftLeft = BigInteger.prototype.shiftLeft;

    BigInteger.prototype.shiftRight = function (n) {
        var remQuo;
        if (!shift_isSmall(n)) {
            throw new Error(String(n) + " is too large for shifting.");
        }
        n = +n;
        if (n < 0) return this.shiftLeft(-n);
        var result = this;
        while (n >= powers2Length) {
            if (result.isZero()) return result;
            remQuo = divModAny(result, highestPower2);
            result = remQuo[1].isNegative() ? remQuo[0].prev() : remQuo[0];
            n -= powers2Length - 1;
        }
        remQuo = divModAny(result, powersOfTwo[n]);
        return remQuo[1].isNegative() ? remQuo[0].prev() : remQuo[0];
    };
    SmallInteger.prototype.shiftRight = BigInteger.prototype.shiftRight;

    function bitwise(x, y, fn) {
        y = parseValue(y);
        var xSign = x.isNegative(), ySign = y.isNegative();
        var xRem = xSign ? x.not() : x,
            yRem = ySign ? y.not() : y;
        var xBits = [], yBits = [];
        var xStop = false, yStop = false;
        while (!xStop || !yStop) {
            if (xRem.isZero()) { // virtual sign extension for simulating two's complement
                xStop = true;
                xBits.push(xSign ? 1 : 0);
            }
            else if (xSign) xBits.push(xRem.isEven() ? 1 : 0); // two's complement for negative numbers
            else xBits.push(xRem.isEven() ? 0 : 1);

            if (yRem.isZero()) {
                yStop = true;
                yBits.push(ySign ? 1 : 0);
            }
            else if (ySign) yBits.push(yRem.isEven() ? 1 : 0);
            else yBits.push(yRem.isEven() ? 0 : 1);

            xRem = xRem.over(2);
            yRem = yRem.over(2);
        }
        var result = [];
        for (var i = 0; i < xBits.length; i++) result.push(fn(xBits[i], yBits[i]));
        var sum = bigInt(result.pop()).negate().times(bigInt(2).pow(result.length));
        while (result.length) {
            sum = sum.add(bigInt(result.pop()).times(bigInt(2).pow(result.length)));
        }
        return sum;
    }

    BigInteger.prototype.not = function () {
        return this.negate().prev();
    };
    SmallInteger.prototype.not = BigInteger.prototype.not;

    BigInteger.prototype.and = function (n) {
        return bitwise(this, n, function (a, b) { return a & b; });
    };
    SmallInteger.prototype.and = BigInteger.prototype.and;

    BigInteger.prototype.or = function (n) {
        return bitwise(this, n, function (a, b) { return a | b; });
    };
    SmallInteger.prototype.or = BigInteger.prototype.or;

    BigInteger.prototype.xor = function (n) {
        return bitwise(this, n, function (a, b) { return a ^ b; });
    };
    SmallInteger.prototype.xor = BigInteger.prototype.xor;

    var LOBMASK_I = 1 << 30, LOBMASK_BI = (BASE & -BASE) * (BASE & -BASE) | LOBMASK_I;
    function roughLOB(n) { // get lowestOneBit (rough)
        // SmallInteger: return Min(lowestOneBit(n), 1 << 30)
        // BigInteger: return Min(lowestOneBit(n), 1 << 14) [BASE=1e7]
        var v = n.value, x = typeof v === "number" ? v | LOBMASK_I : v[0] + v[1] * BASE | LOBMASK_BI;
        return x & -x;
    }

    function max(a, b) {
        a = parseValue(a);
        b = parseValue(b);
        return a.greater(b) ? a : b;
    }
    function min(a, b) {
        a = parseValue(a);
        b = parseValue(b);
        return a.lesser(b) ? a : b;
    }
    function gcd(a, b) {
        a = parseValue(a).abs();
        b = parseValue(b).abs();
        if (a.equals(b)) return a;
        if (a.isZero()) return b;
        if (b.isZero()) return a;
        var c = Integer[1], d, t;
        while (a.isEven() && b.isEven()) {
            d = Math.min(roughLOB(a), roughLOB(b));
            a = a.divide(d);
            b = b.divide(d);
            c = c.multiply(d);
        }
        while (a.isEven()) {
            a = a.divide(roughLOB(a));
        }
        do {
            while (b.isEven()) {
                b = b.divide(roughLOB(b));
            }
            if (a.greater(b)) {
                t = b; b = a; a = t;
            }
            b = b.subtract(a);
        } while (!b.isZero());
        return c.isUnit() ? a : a.multiply(c);
    }
    function lcm(a, b) {
        a = parseValue(a).abs();
        b = parseValue(b).abs();
        return a.divide(gcd(a, b)).multiply(b);
    }
    function randBetween(a, b) {
        a = parseValue(a);
        b = parseValue(b);
        var low = min(a, b), high = max(a, b);
        var range = high.subtract(low);
        if (range.isSmall) return low.add(Math.round(Math.random() * range));
        var length = range.value.length - 1;
        var result = [], restricted = true;
        for (var i = length; i >= 0; i--) {
            var top = restricted ? range.value[i] : BASE;
            var digit = truncate(Math.random() * top);
            result.unshift(digit);
            if (digit < top) restricted = false;
        }
        result = arrayToSmall(result);
        return low.add(typeof result === "number" ? new SmallInteger(result) : new BigInteger(result, false));
    }
    var parseBase = function (text, base) {
        var length = text.length;
        if (2 <= base && base <= 36) {
            if (length <= LOG_MAX_INT / Math.log(base)) {
                return new SmallInteger(parseInt(text, base));
            }
        }
        base = parseValue(base);
        var digits = [];
        var i;
        var isNegative = text[0] === "-";
        for (i = isNegative ? 1 : 0; i < text.length; i++) {
            var c = text[i].toLowerCase(),
                charCode = c.charCodeAt(0);
            if (48 <= charCode && charCode <= 57) digits.push(parseValue(c));
            else if (97 <= charCode && charCode <= 122) digits.push(parseValue(c.charCodeAt(0) - 87));
            else if (c === "<") {
                var start = i;
                do { i++; } while (text[i] !== ">");
                digits.push(parseValue(text.slice(start + 1, i)));
            }
            else throw new Error(c + " is not a valid character");
        }
        return parseBaseFromArray(digits, base, isNegative);
    };

    function parseBaseFromArray(digits, base, isNegative) {
        var val = Integer[0], pow = Integer[1], i;
        for (i = digits.length - 1; i >= 0; i--) {
            val = val.add(digits[i].times(pow));
            pow = pow.times(base);
        }
        return isNegative ? val.negate() : val;
    }

    function stringify(digit) {
        var v = digit.value;
        if (typeof v === "number") v = [v];
        if (v.length === 1 && v[0] <= 35) {
            return "0123456789abcdefghijklmnopqrstuvwxyz".charAt(v[0]);
        }
        return "<" + v + ">";
    }
    function toBase(n, base) {
        base = bigInt(base);
        if (base.isZero()) {
            if (n.isZero()) return "0";
            throw new Error("Cannot convert nonzero numbers to base 0.");
        }
        if (base.equals(-1)) {
            if (n.isZero()) return "0";
            if (n.isNegative()) return new Array(1 - n).join("10");
            return "1" + new Array(+n).join("01");
        }
        var minusSign = "";
        if (n.isNegative() && base.isPositive()) {
            minusSign = "-";
            n = n.abs();
        }
        if (base.equals(1)) {
            if (n.isZero()) return "0";
            return minusSign + new Array(+n + 1).join(1);
        }
        var out = [];
        var left = n, divmod;
        while (left.isNegative() || left.compareAbs(base) >= 0) {
            divmod = left.divmod(base);
            left = divmod.quotient;
            var digit = divmod.remainder;
            if (digit.isNegative()) {
                digit = base.minus(digit).abs();
                left = left.next();
            }
            out.push(stringify(digit));
        }
        out.push(stringify(left));
        return minusSign + out.reverse().join("");
    }

    BigInteger.prototype.toString = function (radix) {
        if (radix === undefined) radix = 10;
        if (radix !== 10) return toBase(this, radix);
        var v = this.value, l = v.length, str = String(v[--l]), zeros = "0000000", digit;
        while (--l >= 0) {
            digit = String(v[l]);
            str += zeros.slice(digit.length) + digit;
        }
        var sign = this.sign ? "-" : "";
        return sign + str;
    };
    SmallInteger.prototype.toString = function (radix) {
        if (radix === undefined) radix = 10;
        if (radix != 10) return toBase(this, radix);
        return String(this.value);
    };

    BigInteger.prototype.valueOf = function () {
        return +this.toString();
    };
    BigInteger.prototype.toJSNumber = BigInteger.prototype.valueOf;

    SmallInteger.prototype.valueOf = function () {
        return this.value;
    };
    SmallInteger.prototype.toJSNumber = SmallInteger.prototype.valueOf;

    function parseStringValue(v) {
            if (isPrecise(+v)) {
                var x = +v;
                if (x === truncate(x))
                    return new SmallInteger(x);
                throw "Invalid integer: " + v;
            }
            var sign = v[0] === "-";
            if (sign) v = v.slice(1);
            var split = v.split(/e/i);
            if (split.length > 2) throw new Error("Invalid integer: " + split.join("e"));
            if (split.length === 2) {
                var exp = split[1];
                if (exp[0] === "+") exp = exp.slice(1);
                exp = +exp;
                if (exp !== truncate(exp) || !isPrecise(exp)) throw new Error("Invalid integer: " + exp + " is not a valid exponent.");
                var text = split[0];
                var decimalPlace = text.indexOf(".");
                if (decimalPlace >= 0) {
                    exp -= text.length - decimalPlace - 1;
                    text = text.slice(0, decimalPlace) + text.slice(decimalPlace + 1);
                }
                if (exp < 0) throw new Error("Cannot include negative exponent part for integers");
                text += (new Array(exp + 1)).join("0");
                v = text;
            }
            var isValid = /^([0-9][0-9]*)$/.test(v);
            if (!isValid) throw new Error("Invalid integer: " + v);
            var r = [], max = v.length, l = LOG_BASE, min = max - l;
            while (max > 0) {
                r.push(+v.slice(min, max));
                min -= l;
                if (min < 0) min = 0;
                max -= l;
            }
            trim(r);
            return new BigInteger(r, sign);
    }

    function parseNumberValue(v) {
        if (isPrecise(v)) {
            if (v !== truncate(v)) throw new Error(v + " is not an integer.");
            return new SmallInteger(v);
        }
        return parseStringValue(v.toString());
    }

    function parseValue(v) {
        if (typeof v === "number") {
            return parseNumberValue(v);
        }
        if (typeof v === "string") {
            return parseStringValue(v);
        }
        return v;
    }
    // Pre-define numbers in range [-999,999]
    for (var i = 0; i < 1000; i++) {
        Integer[i] = new SmallInteger(i);
        if (i > 0) Integer[-i] = new SmallInteger(-i);
    }
    // Backwards compatibility
    Integer.one = Integer[1];
    Integer.zero = Integer[0];
    Integer.minusOne = Integer[-1];
    Integer.max = max;
    Integer.min = min;
    Integer.gcd = gcd;
    Integer.lcm = lcm;
    Integer.isInstance = function (x) { return x instanceof BigInteger || x instanceof SmallInteger; };
    Integer.randBetween = randBetween;

    Integer.fromArray = function (digits, base, isNegative) {
        return parseBaseFromArray(digits.map(parseValue), parseValue(base || 10), isNegative);
    };

    return Integer;
})();

// Node.js check
if (typeof module !== "undefined" && module.hasOwnProperty("exports")) {
    module.exports = bigInt;
}

//amd check
if ( true ) {
  !(__WEBPACK_AMD_DEFINE_ARRAY__ = [], __WEBPACK_AMD_DEFINE_RESULT__ = function() {
    return bigInt;
  }.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
}

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(14)(module)))

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const BinaryUtils_1 = __webpack_require__(0);
const bigInt = __webpack_require__(1);
const IPNumType_1 = __webpack_require__(3);
const IPv6Utils_1 = __webpack_require__(4);
class Validator {
    /**
     * Checks if given ipNumber is in between the given lower and upper bound
     *
     * @param ipNumber ipNumber to check
     * @param lowerBound lower bound
     * @param upperBound upper bound
     * @returns {boolean} true if ipNumber is between lower and upper bound
     */
    static isWithinRange(ipNumber, lowerBound, upperBound) {
        return ipNumber.greaterOrEquals(lowerBound) && ipNumber.lesserOrEquals(upperBound);
    }
    /**
     * Checks if the number given is within the value considered valid for an ASN number
     *
     * @param asnNumber the asn number to validate
     * @returns {[boolean , string]} first value is true if valid ASN, false otherwise. Second value contains
     * "valid" or an error message when value is invalid
     */
    static isValidAsnNumber(asnNumber) {
        let isValid = this.isWithinRange(asnNumber, bigInt.zero, this.THIRTY_TWO_BIT_SIZE);
        return [isValid, isValid ? [] : [Validator.invalidAsnRangeMessage]];
    }
    /**
     * Checks if the given ASN number is a 16bit ASN number
     *
     * @param {bigInt.BigInteger} asnNumber to check if 16bit or not
     * @returns {[boolean , string]} first value is true if valid 16bit ASN, false otherwise. Second value contains
     * "valid" or an error message when value is invalid
     */
    static isValid16BitAsnNumber(asnNumber) {
        let isValid = Validator.isWithinRange(asnNumber, bigInt.zero, Validator.SIXTEEN_BIT_SIZE);
        return [isValid, isValid ? [] : [Validator.invalid16BitAsnRangeMessage]];
    }
    /**
     * Checks if the number given is within the value considered valid for an IPv4 number
     *
     * @param ipv4Number the asn number to validate
     * @returns {[boolean , string]} first value is true if valid IPv4 number, false otherwise. Second value contains
     * "valid" or an error message when value is invalid
     */
    static isValidIPv4Number(ipv4Number) {
        let isValid = this.isWithinRange(ipv4Number, bigInt.zero, this.THIRTY_TWO_BIT_SIZE);
        return isValid ? [isValid, []] : [isValid, [Validator.invalidIPv4NumberMessage]];
    }
    /**
     * Checks if the number given is within the value considered valid for an IPv6 number
     *
     * @param ipv6Number the asn number to validate
     * @returns {[boolean , string]} first value is true if valid IPv6 number, false otherwise. Second value contains
     * "valid" or an error message when value is invalid
     */
    static isValidIPv6Number(ipv6Number) {
        let isValid = this.isWithinRange(ipv6Number, bigInt.zero, this.ONE_HUNDRED_AND_TWENTY_EIGHT_BIT_SIZE);
        return isValid ? [isValid, []] : [isValid, [Validator.invalidIPv6NumberMessage]];
    }
    /**
     * Checks if the number given is valid for an IPv4 octet
     *
     * @param octetNumber the octet value
     * @returns {boolean} true if valid octet, false otherwise
     */
    static isValidIPv4Octet(octetNumber) {
        let withinRange = this.isWithinRange(octetNumber, bigInt.zero, this.EIGHT_BIT_SIZE);
        return [withinRange, withinRange ? [] : [Validator.invalidOctetRangeMessage]];
    }
    /**
     * Checks if the number given is valid for an IPv6 hexadecatet
     *
     * @param {bigInt.BigInteger} hexadecatetNum the hexadecatet value
     * @returns {[boolean , string]} first value is true if valid hexadecatet, false otherwise. Second value contains
     * "valid" or an error message when value is invalid
     */
    static isValidIPv6Hexadecatet(hexadecatetNum) {
        let isValid = this.isWithinRange(hexadecatetNum, bigInt.zero, this.SIXTEEN_BIT_SIZE);
        return isValid ? [isValid, []] : [isValid, [Validator.invalidHexadecatetMessage]];
    }
    /**
     * Checks if given string is a valid IPv4 value.
     *
     * @param {string} ipv4String the IPv4 string to validate
     * @returns {[boolean , string]} result of validation, first value represents if is valid IPv4, second value
     * contains error message if invalid IPv4
     */
    static isValidIPv4String(ipv4String) {
        let rawOctets = ipv4String.split(".");
        if (rawOctets.length != 4) {
            return [false, [Validator.invalidOctetCountMessage]];
        }
        let isValid = rawOctets.every(octet => {
            let [valid,] = Validator.isValidIPv4Octet(bigInt(parseInt(octet)));
            return valid;
        });
        return [isValid, isValid ? [] : [Validator.invalidOctetRangeMessage]];
    }
    /**
     * Checks if given string is a valid IPv6 value.
     *
     * @param {string} ipv6String the IPv6 string to validate
     * @returns {[boolean , string]} result of validation, first value represents if is valid IPv6, second value
     * contains error message if invalid IPv6
     */
    static isValidIPv6String(ipv6String) {
        let hexadecimals = ipv6String.split(":");
        if (hexadecimals.length != 8) {
            return [false, [Validator.invalidHexadecatetCountMessage]];
        }
        let isValid = hexadecimals.every(hexadecimal => {
            let numberValue = parseInt(hexadecimal, 16);
            return Validator.isValidIPv6Hexadecatet(bigInt(numberValue))[0];
        });
        return [isValid, isValid ? [] : [Validator.invalidHexadecatetMessage]];
    }
    /**
     * Checks if given value is a valid prefix value
     *
     * @param prefixValue value to check
     * @param ipNumType The type of IP number
     * @returns {(boolean|string)[]} a tuple representing if valid or not and corresponding message
     */
    static isValidPrefixValue(prefixValue, ipNumType) {
        if (IPNumType_1.IPNumType.IPv4 === ipNumType) {
            let withinRange = Validator.isWithinRange(bigInt(prefixValue), bigInt.zero, bigInt(32));
            return [withinRange, withinRange ? [] : [Validator.invalidPrefixValueMessage]];
        }
        if (IPNumType_1.IPNumType.IPv6 === ipNumType) {
            let withinRange = Validator.isWithinRange(bigInt(prefixValue), bigInt.zero, bigInt(128));
            return [withinRange, withinRange ? [] : [Validator.invalidPrefixValueMessage]];
        }
        return [false, ["Given ipNumType must be either InetNumType.IPv4 or InetNumType.IPv6"]];
    }
    /**
     * Checks if given string is a valid IPv4 subnet
     *
     * @param {string} ipv4SubnetString the given IPv4 subnet string
     * @returns {[boolean , string]} first value is true if valid IPv4 subnet string, false otherwise. Second value
     * contains "valid" or an error message when value is invalid
     */
    static isValidIPv4Subnet(ipv4SubnetString) {
        let ipv4InBinary = BinaryUtils_1.dottedDecimalNotationToBinaryString(ipv4SubnetString);
        let isValid = Validator.IPV4_SUBNET_BIT_PATTERN.test(ipv4InBinary);
        return isValid ? [isValid, []] : [isValid, [Validator.invalidSubnetMessage]];
    }
    /**
     * Checks if given string is a valid IPv6 subnet
     *
     * @param {string} ipv6SubnetString the given IPv6 subnet string
     * @returns {[boolean , string]} first value is true if valid IPv6 subnet string, false otherwise. Second value
     * contains "valid" or an error message when value is invalid
     */
    static isValidIPv6Subnet(ipv6SubnetString) {
        let ipv6InBinary = IPv6Utils_1.hexadectetNotationToBinaryString(ipv6SubnetString);
        let isValid = Validator.IPV6_SUBNET_BIT_PATTERN.test(ipv6InBinary);
        return isValid ? [isValid, []] : [isValid, [Validator.invalidSubnetMessage]];
    }
    /**
     * Checks if the given string is a valid IPv4 range in Cidr notation
     *
     * @param {string} ipv4RangeAsCidrString the IPv4 range in Cidr notation
     *
     * @returns {[boolean , string[]]} first value is true if valid IPv4 range in Cidr notation, false otherwise. Second
     * value contains "valid" or an error message when value is invalid
     */
    static isValidIPv4CidrNotation(ipv4RangeAsCidrString) {
        let cidrComponents = ipv4RangeAsCidrString.split("/");
        if (cidrComponents.length !== 2 || (cidrComponents[0].length === 0 || cidrComponents[1].length === 0)) {
            return [false, [Validator.invalidIPv4CidrNotationMessage]];
        }
        let ip = cidrComponents[0];
        let range = cidrComponents[1];
        let [validIpv4, invalidIpv4Message] = Validator.isValidIPv4String(ip);
        let [validPrefix, invalidPrefixMessage] = Validator.isValidPrefixValue(parseInt(range), IPNumType_1.IPNumType.IPv4);
        let isValid = validIpv4 && validPrefix;
        let invalidMessage = invalidIpv4Message.concat(invalidPrefixMessage);
        return isValid ? [isValid, []] : [isValid, invalidMessage];
    }
    /**
     * Checks if the given string is a valid IPv6 range in Cidr notation
     *
     * @param {string} ipv6RangeAsCidrString the IPv6 range in Cidr notation
     *
     * @returns {[boolean , string]} first value is true if valid IPv6 range in Cidr notation, false otherwise.
     * Second value contains "valid" or an error message when value is invalid
     */
    static isValidIPv6CidrNotation(ipv6RangeAsCidrString) {
        let isValid = Validator.IPV6_RANGE_PATTERN.test(ipv6RangeAsCidrString);
        return isValid ? [isValid, []] : [isValid, [Validator.invalidIPv6CidrNotationString]];
    }
}
Validator.IPV4_PATTERN = new RegExp(/^(0?[0-9]?[0-9]|1[0-9][0-9]|2[0-4][0-9]|25[0-5])\.(0?[0-9]?[0-9]|1[0-9][0-9]|2[0-4][0-9]|25[0-5])\.(0?[0-9]?[0-9]|1[0-9][0-9]|2[0-4][0-9]|25[0-5])\.(0?[0-9]?[0-9]|1[0-9][0-9]|2[0-4][0-9]|25[0-5])$/);
Validator.IPV4_RANGE_PATTERN = new RegExp(/^(0?[0-9]?[0-9]|1[0-9][0-9]|2[0-4][0-9]|25[0-5])\.(0?[0-9]?[0-9]|1[0-9][0-9]|2[0-4][0-9]|25[0-5])\.(0?[0-9]?[0-9]|1[0-9][0-9]|2[0-4][0-9]|25[0-5])\.(0?[0-9]?[0-9]|1[0-9][0-9]|2[0-4][0-9]|25[0-5])(\/)([1-9]|[1-2][0-9]|3[0-2])$/);
Validator.IPV6_RANGE_PATTERN = new RegExp(/^s*((([0-9A-Fa-f]{1,4}:){7}([0-9A-Fa-f]{1,4}|:))|(([0-9A-Fa-f]{1,4}:){6}(:[0-9A-Fa-f]{1,4}|((25[0-5]|2[0-4]d|1dd|[1-9]?d)(.(25[0-5]|2[0-4]d|1dd|[1-9]?d)){3})|:))|(([0-9A-Fa-f]{1,4}:){5}(((:[0-9A-Fa-f]{1,4}){1,2})|:((25[0-5]|2[0-4]d|1dd|[1-9]?d)(.(25[0-5]|2[0-4]d|1dd|[1-9]?d)){3})|:))|(([0-9A-Fa-f]{1,4}:){4}(((:[0-9A-Fa-f]{1,4}){1,3})|((:[0-9A-Fa-f]{1,4})?:((25[0-5]|2[0-4]d|1dd|[1-9]?d)(.(25[0-5]|2[0-4]d|1dd|[1-9]?d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){3}(((:[0-9A-Fa-f]{1,4}){1,4})|((:[0-9A-Fa-f]{1,4}){0,2}:((25[0-5]|2[0-4]d|1dd|[1-9]?d)(.(25[0-5]|2[0-4]d|1dd|[1-9]?d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){2}(((:[0-9A-Fa-f]{1,4}){1,5})|((:[0-9A-Fa-f]{1,4}){0,3}:((25[0-5]|2[0-4]d|1dd|[1-9]?d)(.(25[0-5]|2[0-4]d|1dd|[1-9]?d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){1}(((:[0-9A-Fa-f]{1,4}){1,6})|((:[0-9A-Fa-f]{1,4}){0,4}:((25[0-5]|2[0-4]d|1dd|[1-9]?d)(.(25[0-5]|2[0-4]d|1dd|[1-9]?d)){3}))|:))|(:(((:[0-9A-Fa-f]{1,4}){1,7})|((:[0-9A-Fa-f]{1,4}){0,5}:((25[0-5]|2[0-4]d|1dd|[1-9]?d)(.(25[0-5]|2[0-4]d|1dd|[1-9]?d)){3}))|:)))(%.+)?s*(\/([0-9]|[1-9][0-9]|1[0-1][0-9]|12[0-8]))?$/);
Validator.IPV4_SUBNET_BIT_PATTERN = new RegExp(/^(1){0,32}(0){0,32}$/);
Validator.IPV6_SUBNET_BIT_PATTERN = new RegExp(/^(1){0,128}(0){0,128}$/);
Validator.EIGHT_BIT_SIZE = bigInt("1".repeat(8), 2);
Validator.SIXTEEN_BIT_SIZE = bigInt("1".repeat(16), 2);
Validator.THIRTY_TWO_BIT_SIZE = bigInt("1".repeat(32), 2);
Validator.ONE_HUNDRED_AND_TWENTY_EIGHT_BIT_SIZE = bigInt("1".repeat(128), 2);
Validator.invalidAsnRangeMessage = "ASN number given less than zero or is greater than 32bit";
Validator.invalid16BitAsnRangeMessage = "ASN number given less than zero or is greater than 16bit";
Validator.invalidIPv4NumberMessage = "IPv4 number given less than zero or is greater than 32bit";
Validator.invalidIPv6NumberMessage = "IPv6 number given less than zero or is greater than 128bit";
Validator.invalidOctetRangeMessage = "Value given contains an invalid Octet; Value is less than zero or is greater than 8bit";
Validator.invalidHexadecatetMessage = "The value given is less than zero or is greater than 16bit";
Validator.invalidOctetCountMessage = "An IP4 number cannot have less or greater than 4 octets";
Validator.invalidHexadecatetCountMessage = "An IP6 number cannot have less or greater than 8 octets";
Validator.invalidSubnetMessage = "The Subnet is invalid";
Validator.invalidPrefixValueMessage = "A Prefix value cannot be less than 0 or greater than 32";
Validator.invalidIPv4CidrNotationMessage = "Cidr notation should be in the form [ip number]/[range]";
Validator.invalidIPv6CidrNotationString = "A Cidr notation string should contain an IPv6 number and prefix";
exports.Validator = Validator;


/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var IPNumType;
(function (IPNumType) {
    IPNumType[IPNumType["ASN"] = 0] = "ASN";
    IPNumType[IPNumType["IPv4"] = 1] = "IPv4";
    IPNumType[IPNumType["IPv6"] = 2] = "IPv6";
})(IPNumType = exports.IPNumType || (exports.IPNumType = {}));


/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const BinaryUtils_1 = __webpack_require__(0);
const HexadecimalUtils_1 = __webpack_require__(6);
/**
 * Expands an IPv6 number in abbreviated format into its full form
 *
 * {@see https://en.wikipedia.org/wiki/IPv6_address#Representation} for more on the representation of IPv6 addresses
 *
 * @param {string} ipv6String the abbreviated IPv6 address to expand
 * @returns {string} the expanded IPv6 address
 */
exports.expandIPv6Number = (ipv6String) => {
    let expandWithZero = (hexadecimalArray) => {
        let paddedArray = hexadecimalArray.map((hexadecimal) => {
            if (hexadecimal === "") {
                return hexadecimal;
            }
            return BinaryUtils_1.leftPadWithZeroBit(hexadecimal, 4);
        });
        return paddedArray.join(":");
    };
    let expandDoubleColon = (gapCount) => {
        let pads = [];
        for (let count = 0; count < gapCount; count++) {
            pads.push("0000");
        }
        return pads.join(":");
    };
    if (ipv6String.includes("::")) {
        let split = ipv6String.split("::");
        let leftPortion = split[0];
        let rightPortion = split[1];
        let leftPortionSplit = leftPortion.split(":").filter(hexadecimal => { return hexadecimal !== ""; });
        let rightPortionSplit = rightPortion.split(":").filter(hexadecimal => { return hexadecimal !== ""; });
        let doublePortion = expandDoubleColon(8 - (leftPortionSplit.length + rightPortionSplit.length));
        let leftString = expandWithZero(leftPortionSplit);
        if (leftString !== "") {
            leftString += ":";
        }
        let rightString = expandWithZero(rightPortionSplit);
        if (rightString !== "") {
            rightString = ":" + rightString;
        }
        return `${leftString}${doublePortion}${rightString}`;
    }
    else {
        return expandWithZero(ipv6String.split(":"));
    }
};
/**
 * Collapses an IPv6 number in full format into its abbreviated form
 *
 * {@see https://en.wikipedia.org/wiki/IPv6_address#Representation} for more on the representation of IPv6 addresses
 *
 * @param {string} ipv6String the full form IPv6 number to collapse
 * @returns {string} the collapsed IPv6 number
 */
exports.collapseIPv6Number = (ipv6String) => {
    let hexadecimals = ipv6String.split(":");
    let hexadecimalsWithoutLeadingZeros = hexadecimals.map((hexidecimal) => {
        let withoutLeadingZero = hexidecimal.replace(/^0+/, '');
        if (withoutLeadingZero !== '') {
            return withoutLeadingZero;
        }
        else {
            return "0";
        }
    });
    let contracted = hexadecimalsWithoutLeadingZeros.join(":").replace(/(^0)?(:0){2,}/, ':');
    if (contracted.slice(-1) === ":") {
        return `${contracted}:`;
    }
    return contracted;
};
/**
 * Converts a given IPv6 number expressed in the hexadecimal string notation into a 16 bit binary number in string
 * @param {string} hexadectetString the IPv6 number
 * @returns {string} the IPv6 number converted to binary string
 */
exports.hexadectetNotationToBinaryString = (hexadectetString) => {
    let expand = exports.expandIPv6Number(hexadectetString);
    let hexadecimals = expand.split(":");
    return hexadecimals.reduce((hexadecimalAsString, hexavalue) => {
        return hexadecimalAsString.concat(BinaryUtils_1.leftPadWithZeroBit(HexadecimalUtils_1.hexadecimalStringToBinaryString(hexavalue), 16));
    }, '');
};


/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const bigInt = __webpack_require__(1);
const BinaryUtils_1 = __webpack_require__(0);
/**
 * Provides the implementation of functionality that are common to {@link IPNumber}'s
 */
class AbstractIPNum {
    /**
     * Gets the numeric value of an IP number as {@link BigInteger}
     *
     * @returns {bigInt.BigInteger} the numeric value of an IP number.
     */
    getValue() {
        return this.value;
    }
    /**
     * Gets the binary string representation of an IP number.
     *
     * @returns {string} the string binary representation.
     */
    toBinaryString() {
        return BinaryUtils_1.leftPadWithZeroBit(this.value.toString(2), this.bitSize);
    }
    /**
     * Checks if an IP number has a value greater than the present value
     * @returns {boolean} true, if there is a value greater than the present value. Returns false otherwise.
     */
    hasNext() {
        return this.value.lesser(this.maximumBitSize);
    }
    /**
     * Checks if an IP number has a value lesser than the present value
     * @returns {boolean} true, if there is a value lesser than the present value. Returns false otherwise.
     */
    hasPrevious() {
        return this.value.greater(bigInt.zero);
    }
    /**
     * Checks if the given IP number, is equals to the current IP number
     *
     * @param {AbstractIPNum} anotherIPNum the other IP number to compare with
     * @returns {boolean} true if the given IP number is equals
     */
    isEquals(anotherIPNum) {
        return this.value.equals(anotherIPNum.value);
    }
    /**
     * Checks if the given IP number is lesser than this current IP number
     *
     * @param {AbstractIPNum} anotherIPNum the other IP number to compare with
     * @returns {boolean} true if the given IP number is less than this current one. False otherwise.
     */
    isLessThan(anotherIPNum) {
        return this.value.lt(anotherIPNum.value);
    }
    /**
     * Checks if the given IP number is greater than this current IP number
     *
     * @param {AbstractIPNum} anotherIPNum the other IP number to compare with
     * @returns {boolean} true if the given IP number is greater than this current one. False otherwise.
     */
    isGreaterThan(anotherIPNum) {
        return this.value.gt(anotherIPNum.value);
    }
    /**
     * Checks if the given IP number is less than or equals to this current IP number
     *
     * @param {AbstractIPNum} anotherIPNum the other IP number to compare with
     * @returns {boolean} true if the given IP number is less than or equals to this current one. False otherwise.
     */
    isLessThanOrEquals(anotherIPNum) {
        return this.value.lesserOrEquals(anotherIPNum.value);
    }
    /**
     * Checks if the given IP number is greater than or equals to this current IP number
     *
     * @param {AbstractIPNum} anotherIPNum the other IP number to compare with
     * @returns {boolean} {boolean} true if the given IP number is greater than or equals to this current one. False
     * otherwise.
     */
    isGreaterThanOrEquals(anotherIPNum) {
        return this.value.greaterOrEquals(anotherIPNum.value);
    }
}
exports.AbstractIPNum = AbstractIPNum;


/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const bigInt = __webpack_require__(1);
/**
 * Converts a given BigInteger number to a hexadecimal string
 * @param num the BigInteger number
 * @returns {string} the hexadeciaml string
 */
exports.bigIntegerNumberToHexadecimalString = (num) => {
    return num.toString(16);
};
/**
 * Converts a number in hexadecimal (base 16) to binary string
 * @param {string} hexadecimalString the number in base 16
 * @returns {string} the number converted to base 2
 */
exports.hexadecimalStringToBinaryString = (hexadecimalString) => {
    let inDecimal = bigInt(hexadecimalString, 16);
    return inDecimal.toString(2);
};
/**
 * Converts number in binary string to hexadecimal string
 * @param {string} num in binary string
 * @returns {string} num in hexadecimal string
 */
exports.binaryStringToHexadecimalString = (num) => {
    // first convert to binary string to decimal (big Integer)
    let inDecimal = bigInt(num, 2);
    return inDecimal.toString(16);
};


/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const Validator_1 = __webpack_require__(2);
const bigInt = __webpack_require__(1);
/**
 * A base 16 (hexadecimal) representation of a 16 bit value.
 *
 * It consists of four (base 16) number.
 *
 * It is used to represents the components of an IPv6 address
 */
class Hexadecatet {
    /**
     * A convenience method for constructing an instance of {@link Hexadecatet} from a four (base 16) number
     * representation of a 16bit value.
     *
     * @param {string} rawValue the four (base 16) number
     * @returns {Hexadecatet} an instance of {@link Hexadecatet}
     */
    static fromString(rawValue) {
        return new Hexadecatet(rawValue);
    }
    ;
    /**
     * A convenience method for constructing an instance of {@link Hexadecatet} from a decimal number representation
     * of a 16 bit value
     *
     * @param {number} rawValue decimal number representation of a 16 bit value
     * @returns {Hexadecatet} an instance of {@link Hexadecatet}
     */
    static fromNumber(rawValue) {
        return new Hexadecatet(rawValue);
    }
    ;
    /**
     * Constructor for creating an instance of {@link Hexadecatet}
     *
     * @param {string | number} givenValue a string or numeric value. If given value is a string then it should be a
     * four (base 16) number representation of a 16bit value. If it is a number, then it should be a decimal number
     * representation of a 16 bit value
     */
    constructor(givenValue) {
        let hexadecatetValue;
        if (typeof givenValue === 'string') {
            hexadecatetValue = parseInt(givenValue, 16);
        }
        else {
            hexadecatetValue = parseInt(String(givenValue), 16);
        }
        let [isValid, message] = Validator_1.Validator.isValidIPv6Hexadecatet(bigInt(hexadecatetValue));
        if (!isValid) {
            throw Error(message.filter(msg => { return msg !== ''; }).toString());
        }
        this.value = hexadecatetValue;
    }
    /**
     * Returns the numeric value in base 10 (ie decimal)
     *
     * @returns {number} the numeric value in base 10 (ie decimal)
     */
    getValue() {
        return this.value;
    }
    /**
     * Returns the string representation of the base 16 representation of the value
     * @returns {string} the string representation of the base 16 representation of the value
     */
    // TODO pad with a zero if digit is less than 4
    toString() {
        return this.value.toString(16);
    }
}
exports.Hexadecatet = Hexadecatet;


/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const Validator_1 = __webpack_require__(2);
const bigInt = __webpack_require__(1);
/**
 * A binary representation of a 8 bit value.
 *
 * {@see https://en.wikipedia.org/wiki/Octet_(computing)} for more information on Octets
 *
 * An octet is used in the textual representation of an {@link IPv4} number, where the IP number value is divided
 * into 4 octets
 */
class Octet {
    /**
     * Convenience method for creating an Octet out of a string value representing the value of the octet
     *
     * @param {string} rawValue the octet value in string
     * @returns {Octet} the Octet instance
     */
    static fromString(rawValue) {
        return new Octet(rawValue);
    }
    ;
    /**
     * Convenience method for creating an Octet out of a numeric value representing the value of the octet
     *
     * @param {number} rawValue the octet value in number
     * @returns {Octet} the Octet instance
     */
    static fromNumber(rawValue) {
        return new Octet(rawValue);
    }
    ;
    /**
     * Constructor for creating an instance of an Octet.
     *
     * The constructor parameter given could either be a string or number.
     *
     * If a string, it is the string representation of the numeric value of the octet
     * If a number, it is the numeric representation of the value of the octet
     *
     * @param {string | number} givenValue value of the octet to be created.
     */
    constructor(givenValue) {
        let octetValue;
        if (typeof givenValue === 'string') {
            octetValue = parseInt(givenValue);
        }
        else {
            octetValue = givenValue;
        }
        let [isValid, message] = Validator_1.Validator.isValidIPv4Octet(bigInt(octetValue));
        if (!isValid) {
            throw Error(message.filter(msg => { return msg !== ''; }).toString());
        }
        this.value = octetValue;
    }
    /**
     * Method to get the numeric value of the octet
     *
     * @returns {number} the numeric value of the octet
     */
    getValue() {
        return this.value;
    }
    /**
     * Returns a decimal representation of the value of the octet in string
     *
     * @returns {string} a decimal representation of the value of the octet in string
     */
    toString() {
        return this.value.toString(10);
    }
}
exports.Octet = Octet;


/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const Validator_1 = __webpack_require__(2);
const Subnet_1 = __webpack_require__(10);
const BinaryUtils_1 = __webpack_require__(0);
const IPNumType_1 = __webpack_require__(3);
const Subnet_2 = __webpack_require__(10);
const HexadecimalUtils_1 = __webpack_require__(6);
const Hexadecatet_1 = __webpack_require__(7);
/**
 * Represents the prefix portion in the CIDR notation for representing IP ranges
 *
 * The IPv4 prefix portion represents the subnet mask. It is the number of continuous bits turned on (with value 1)
 * counting from the left side of an 8 bit value.
 *
 * {@see https://en.wikipedia.org/wiki/Classless_Inter-Domain_Routing} for more information on CIDR
 */
class IPv4Prefix {
    /**
     * Convenience method for constructing an instance of IPv4 prefix from a decimal number
     *
     * @param {number} rawValue the decimal value to construct the IPv4 prefix from.
     * @returns {IPv4Prefix} the instance of an IPv4 prefix
     */
    static fromNumber(rawValue) {
        return new IPv4Prefix(rawValue);
    }
    ;
    /**
     * Constructor for an instance of IPv4 prefix from a decimal number
     *
     * @param {number} rawValue the decimal value to construct the IPv4 prefix from.
     * @returns {IPv4Prefix} the instance of an IPv4 prefix
     */
    constructor(rawValue) {
        let isValid;
        let message;
        [isValid, message] = Validator_1.Validator.isValidPrefixValue(rawValue, IPNumType_1.IPNumType.IPv4);
        if (!isValid) {
            throw new Error(message.filter(msg => { return msg !== ''; }).toString());
        }
        this.value = rawValue;
    }
    /**
     * Gets the decimal value of the IPv4 prefix
     *
     * @returns {number} the decimal value of the IPv4 prefix
     */
    getValue() {
        return this.value;
    }
    /**
     * Gets the decimal value of the IPv4 prefix as string
     * @returns {string} he decimal value of the IPv4 prefix as string
     */
    toString() {
        return this.value.toString();
    }
    /**
     * Converts the IPv4 prefix to a {@link IPv4Subnet}
     *
     * The IPv4 Subnet is the representation of the prefix in the dot-decimal notation
     *
     * @returns {IPv4Subnet} the subnet representation of the IPv4 number
     */
    toSubnet() {
        let onBits = '1'.repeat(this.value);
        let offBits = '0'.repeat(32 - this.value);
        return Subnet_1.IPv4Subnet.fromString(this.toDecimalNotation(`${onBits}${offBits}`));
    }
    toDecimalNotation(bits) {
        return `${BinaryUtils_1.parseBinaryStringToBigInteger(bits.substr(0, 8))}.${BinaryUtils_1.parseBinaryStringToBigInteger(bits.substr(8, 8))}.${BinaryUtils_1.parseBinaryStringToBigInteger(bits.substr(16, 8))}.${BinaryUtils_1.parseBinaryStringToBigInteger(bits.substr(24, 8))}`;
    }
}
exports.IPv4Prefix = IPv4Prefix;
/**
 * Represents the prefix portion in the CIDR notation for representing IP ranges
 *
 * The IPv6 prefix portion represents the subnet mask. It is the number of continuous bits turned on (with value 1)
 * counting from the left side of an 128 bit value.
 *
 * {@see https://en.wikipedia.org/wiki/Classless_Inter-Domain_Routing} for more information on CIDR
 */
class IPv6Prefix {
    /**
     * Convenience method for constructing an instance of IPv46 prefix from a decimal number
     *
     * @param {number} rawValue the decimal value to construct the IPv6 prefix from.
     * @returns {IPv4Prefix} the instance of an IPv6 prefix
     */
    static fromNumber(rawValue) {
        return new IPv6Prefix(rawValue);
    }
    ;
    /**
     * Constructor for an instance of IPv6 prefix from a decimal number
     *
     * @param {number} rawValue the decimal value to construct the IPv6 prefix from.
     * @returns {IPv4Prefix} the instance of an IPv6 prefix
     */
    constructor(rawValue) {
        let isValid;
        let message;
        [isValid, message] = Validator_1.Validator.isValidPrefixValue(rawValue, IPNumType_1.IPNumType.IPv6);
        if (!isValid) {
            throw new Error(message.filter(msg => { return msg !== ''; }).toString());
        }
        this.value = rawValue;
    }
    /**
     * Gets the decimal value of the IPv6 prefix
     *
     * @returns {number} the decimal value of the IPv6 prefix
     */
    getValue() {
        return this.value;
    }
    /**
     * Gets the decimal value of the IPv4 prefix as string
     * @returns {string} he decimal value of the IPv4 prefix as string
     */
    toString() {
        return this.value.toString();
    }
    /**
     * Converts the IPv6 prefix to a {@link IPv6Subnet}
     *
     * The IPv6 Subnet is the representation of the prefix in 8 groups of 16 bit values represented in hexadecimal
     *
     * @returns {IPv4Subnet} the subnet representation of the IPv4 number
     */
    toSubnet() {
        let onBits = '1'.repeat(this.value);
        let offBits = '0'.repeat(128 - this.value);
        return Subnet_2.IPv6Subnet.fromString(this.toHexadecatetNotation(`${onBits}${offBits}`));
    }
    toHexadecatetNotation(bits) {
        let binaryStrings = bits.match(/.{1,16}/g);
        let hexadecimalStrings = binaryStrings.map((binaryString) => {
            return Hexadecatet_1.Hexadecatet.fromString(HexadecimalUtils_1.binaryStringToHexadecimalString(binaryString));
        });
        return hexadecimalStrings.map((value) => { return value.toString(); }).join(":");
    }
}
exports.IPv6Prefix = IPv6Prefix;


/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const Octet_1 = __webpack_require__(8);
const Validator_1 = __webpack_require__(2);
const bigInt = __webpack_require__(1);
const BinaryUtils_1 = __webpack_require__(0);
const Hexadecatet_1 = __webpack_require__(7);
const IPv6Utils_1 = __webpack_require__(4);
/**
 * The IPv4Subnet can be seen as a specialized IPv4 number where, in a 32 bit number, starting from the left, you have
 * continuous bits turned on (with 1 value) followed by bits turned off (with 0 value)
 */
class IPv4Subnet {
    /**
     * Constructor for creating an instance of IPv4Subnet. The passed strings need to be a valid IPv4
     * number in dot-decimal notation.
     *
     * @param {string} ipString The passed string in dot-decimal notation
     */
    // TODO similar code as in constructor of IPv4, reuse?
    constructor(ipString) {
        /**
         * An array of {@link Octet}'s
         *
         * @type {Array} the octets that makes up the IPv4Subnet
         */
        this.octets = [];
        let isValid;
        let message;
        [isValid, message] = Validator_1.Validator.isValidIPv4Subnet(ipString);
        if (!isValid) {
            throw new Error(message.filter(msg => { return msg !== ''; }).toString());
        }
        let stringOctets = ipString.split(".");
        this.octets = stringOctets.map((rawOctet) => {
            return Octet_1.Octet.fromString(rawOctet);
        });
        this.value = bigInt(BinaryUtils_1.dottedDecimalNotationToBinaryString(ipString), 2);
    }
    /**
     * A convenience method for creating an instance of IPv4Subnet. The passed strings need to be a valid IPv4
     * number in dot-decimal notation.
     *
     * @param {string} rawValue The passed string in dot-decimal notation
     * @returns {IPv4Subnet} the instance of IPv4Subnet
     */
    static fromString(rawValue) {
        return new IPv4Subnet(rawValue);
    }
    ;
    /**
     * Method to get the decimal numeric value of the IPv4Subnet as BigInteger
     *
     * @returns {bigInt.BigInteger} the decimal numeric value of the IPv4Subnet as BigInteger
     */
    getValue() {
        return this.value;
    }
    /**
     * Method that converts the IPv4Subnet to a string representation.
     *
     * The string representation is in dot-decimal notation
     *
     * @returns {string} The string representation of the IPv4Subnet in dot-decimal notation
     */
    toString() {
        return this.octets.map(function (value) { return value.toString(); }).join(".");
    }
    /**
     * Gets the individual {@link Octet} that makes up the IPv4 subnet
     *
     * @returns {Array<Octet>} The individual {@link Octet} that makes up the IPv4 subnet
     */
    getOctets() {
        return this.octets;
    }
}
exports.IPv4Subnet = IPv4Subnet;
/**
 * The IPv6Subnet can be seen as a specialized IPv4 number where, in a 128 bit number, starting from the left, you have
 * continuous bits turned on (with 1 value) followed by bits turned off (with 0 value)
 */
class IPv6Subnet {
    /**
     * Constructor for creating an instance of IPv6Subnet. The passed strings need to be a valid IPv6
     * number in textual representation
     *
     * @param {string} ipString The passed IPv6 string
     */
    // TODO similar code as in constructor of IPv4, reuse?
    constructor(ipString) {
        /**
         * An array of {@link Hexadecatet}'s
         *
         * @type {Array} the hexadecatet that makes up the IPv6 number
         */
        this.hexadecatet = [];
        let isValid;
        let message;
        [isValid, message] = Validator_1.Validator.isValidIPv6Subnet(ipString);
        if (!isValid) {
            throw new Error(message.filter(msg => { return msg !== ''; }).toString());
        }
        let stringHexadecimals = ipString.split(":");
        this.hexadecatet = stringHexadecimals.map((stringHexadecatet) => {
            return Hexadecatet_1.Hexadecatet.fromString(stringHexadecatet);
        });
        this.value = bigInt(IPv6Utils_1.hexadectetNotationToBinaryString(ipString), 2);
    }
    /**
     * A convenience method for creating an instance of IPv6Subnet. The passed strings need to be a valid IPv6
     * number in textual representation.
     *
     * @param {string} rawValue The passed string in textual notation
     * @returns {IPv6Subnet} the instance of IPv6Subnet
     */
    static fromString(rawValue) {
        return new IPv6Subnet(rawValue);
    }
    ;
    /**
     * Method to get the decimal numeric value of the IPv6Subnet as BigInteger
     *
     * @returns {bigInt.BigInteger} the decimal numeric value of the IPv6Subnet as BigInteger
     */
    getValue() {
        return this.value;
    }
    /**
     * Method that converts the IPv6Subnet to a string representation.
     *
     *
     * @returns {string} The string representation of the IPv6Subnet
     */
    toString() {
        return this.hexadecatet.map(function (value) { return value.toString(); }).join(":");
    }
    /**
     * Gets the individual {@link Hexadecatet} that makes up the IPv6 subnet
     *
     * @returns {Array<Hexadecatet>} The individual {@link Hexadecatet} that makes up the IPv6 subnet
     */
    getHexadecatet() {
        return this.hexadecatet;
    }
}
exports.IPv6Subnet = IPv6Subnet;


/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const Octet_1 = __webpack_require__(8);
const Validator_1 = __webpack_require__(2);
const bigInt = __webpack_require__(1);
const BinaryUtils_1 = __webpack_require__(0);
const BinaryUtils_2 = __webpack_require__(0);
const BinaryUtils_3 = __webpack_require__(0);
const BinaryUtils_4 = __webpack_require__(0);
const AbstractIPNum_1 = __webpack_require__(5);
const IPNumType_1 = __webpack_require__(3);
/**
 * Represents an IPv4 number. A 32 bit number that is used to uniquely identify a device that is part of a computer
 * network that uses the internet protocol for communication.
 *
 * @see https://en.wikipedia.org/wiki/IPv4
 * @see https://www.rfc-editor.org/info/rfc791
 */
class IPv4 extends AbstractIPNum_1.AbstractIPNum {
    /**
     * Constructor for an IPv4 number.
     *
     * @param {string | bigInt.BigInteger} ipValue value to construct an IPv4 from. The given value can either be
     * numeric or string. If a string is given then it needs to be in dot-decimal notation
     */
    constructor(ipValue) {
        super();
        /**
         * The number of bits needed to represents the value of the IPv4 number
         */
        this.bitSize = 32;
        /**
         * The maximum bit size (i.e. binary value) of the IPv4 number in BigInteger
         */
        this.maximumBitSize = Validator_1.Validator.THIRTY_TWO_BIT_SIZE;
        /**
         * The type of IP number. Value is one of the values of the {@link IPNumType} enum
         * @type {IPNumType} the type of IP number
         */
        this.type = IPNumType_1.IPNumType.IPv4;
        /**
         * An array of {@link Octet}'s
         *
         * @type {Array} the octets that makes up the IPv4 number
         */
        this.octets = [];
        /**
         * The string character used to separate the individual octets when the IPv4 is rendered as strings
         *
         * @type {string} The string character used to separate the individual octets when rendered as strings
         */
        this.separator = ".";
        if (typeof ipValue === "string") {
            let [value, octets] = this.constructFromDecimalDottedString(ipValue);
            this.value = value;
            this.octets = octets;
        }
        else {
            let [value, octets] = this.constructFromBigIntegerValue(ipValue);
            this.value = value;
            this.octets = octets;
        }
    }
    /**
     * A convenience method for creating an {@link IPv4} by providing the decimal value of the IP number in BigInteger
     *
     * @param {bigInt.BigInteger} bigIntValue the decimal value of the IP number in BigInteger
     * @returns {IPv4} the IPv4 instance
     */
    static fromBigInteger(bigIntValue) {
        return new IPv4(bigIntValue);
    }
    /**
     * A convenience method for creating an {@link IPv4} by providing the IP number in dot-decimal notation. E.g
     * "10.1.1.10"
     *
     * {@see https://en.wikipedia.org/wiki/Dot-decimal_notation} for more information on dot-decimal notation.
     *
     * @param {string} ipString the IP number in dot-decimal notation
     * @returns {IPv4} the IPv4 instance
     */
    static fromDecimalDottedString(ipString) {
        return new IPv4(ipString);
    }
    /**
     * A string representation of the IPv4 number. The string representation is in dot-decimal notation
     *
     * @returns {string} The string representation in dot-decimal notation
     */
    toString() {
        return this.octets.map((value) => { return value.toString(); }).join(this.separator);
    }
    /**
     * Gets the individual {@link Octet} that makes up the IPv4 number
     *
     * @returns {Array<Octet>} The individual {@link Octet} that makes up the IPv4 number
     */
    getOctets() {
        return this.octets;
    }
    /**
     * Returns the next IPv4 number
     *
     * @returns {IPv4} the next IPv4 number
     */
    nextIPNumber() {
        return IPv4.fromBigInteger(this.getValue().add(1));
    }
    /**
     * Returns the previous IPv4 number
     *
     * @returns {IPv4} the previous IPv4 number
     */
    previousIPNumber() {
        return IPv4.fromBigInteger(this.getValue().minus(1));
    }
    constructFromDecimalDottedString(ipString) {
        let octets;
        let value;
        let [isValid, message] = Validator_1.Validator.isValidIPv4String(ipString);
        if (!isValid) {
            throw new Error(message.filter(msg => { return msg !== ''; }).toString());
        }
        let stringOctets = ipString.split(".");
        octets = stringOctets.map((rawOctet) => {
            return Octet_1.Octet.fromString(rawOctet);
        });
        value = bigInt(BinaryUtils_1.dottedDecimalNotationToBinaryString(ipString), 2);
        return [value, octets];
    }
    constructFromBigIntegerValue(ipv4Number) {
        let [isValid, message] = Validator_1.Validator.isValidIPv4Number(ipv4Number);
        if (!isValid) {
            throw new Error(message.filter(msg => { return msg !== ''; }).toString());
        }
        let binaryString = BinaryUtils_2.bigIntegerNumberToBinaryString(ipv4Number);
        return [ipv4Number, this.binaryStringToDecimalOctets(binaryString)];
    }
    binaryStringToDecimalOctets(ipv4BinaryString) {
        if (ipv4BinaryString.length < 32) {
            ipv4BinaryString = BinaryUtils_4.leftPadWithZeroBit(ipv4BinaryString, 32);
        }
        let octets = ipv4BinaryString.match(/.{1,8}/g);
        return octets.map((octet) => {
            return Octet_1.Octet.fromString(BinaryUtils_3.parseBinaryStringToBigInteger(octet).toString());
        });
    }
}
exports.IPv4 = IPv4;


/***/ }),
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const Hexadecatet_1 = __webpack_require__(7);
const Validator_1 = __webpack_require__(2);
const BinaryUtils_1 = __webpack_require__(0);
const HexadecimalUtils_1 = __webpack_require__(6);
const IPv6Utils_1 = __webpack_require__(4);
const IPv6Utils_2 = __webpack_require__(4);
const bigInt = __webpack_require__(1);
const AbstractIPNum_1 = __webpack_require__(5);
const IPNumType_1 = __webpack_require__(3);
/**
 * Represents an IPv6 number. A 128 bit number that is used to uniquely identify a device that is part of a computer
 * network that uses the internet protocol for communication.
 *
 * @see https://en.wikipedia.org/wiki/IPv6
 * @see https://www.rfc-editor.org/info/rfc8200
 */
class IPv6 extends AbstractIPNum_1.AbstractIPNum {
    /**
     * Constructor for an IPv6 number.
     *
     * @param {string | bigInt.BigInteger} ipValue value to construct an IPv6 from. The given value can either be
     * numeric or string. If a string is given then it needs to be in hexadecatet string notation
     */
    constructor(ipValue) {
        super();
        /**
         * The number of bits needed to represents the value of the IPv6 number
         */
        this.bitSize = 128;
        /**
         * The maximum bit size (i.e. binary value) of the IPv6 number in BigInteger
         */
        this.maximumBitSize = Validator_1.Validator.ONE_HUNDRED_AND_TWENTY_EIGHT_BIT_SIZE;
        /**
         * The type of IP number. Value is one of the values of the {@link IPNumType} enum
         * @type {IPNumType} the type of IP number
         */
        this.type = IPNumType_1.IPNumType.IPv6;
        /**
         * An array of {@link Hexadecatet}'s
         *
         * @type {Array} the hexadecatet that makes up the IPv6 number
         */
        this.hexadecatet = [];
        /**
         * The string character used to separate the individual hexadecatet when the IPv6 is rendered as strings
         *
         * @type {string} The string character used to separate the individual hexadecatet when rendered as strings
         */
        this.separator = ":";
        if (typeof ipValue === "string") {
            let expandedIPv6 = IPv6Utils_1.expandIPv6Number(ipValue);
            let [value, hexadecatet] = this.constructFromHexadecimalDottedString(expandedIPv6);
            this.value = value;
            this.hexadecatet = hexadecatet;
        }
        else {
            let [value, hexadecatet] = this.constructFromBigIntegerValue(ipValue);
            this.value = value;
            this.hexadecatet = hexadecatet;
        }
    }
    /**
     * A convenience method for creating an {@link IPv6} by providing the decimal value of the IP number in BigInteger
     *
     * @param {bigInt.BigInteger} bigIntValue the decimal value of the IP number in BigInteger
     * @returns {IPv6} the IPv6 instance
     */
    static fromBigInteger(bigIntValue) {
        return new IPv6(bigIntValue);
    }
    /**
     * A convenience method for creating an {@link IPv6} by providing the IP number in hexadecatet notation. E.g
     * "2001:800:0:0:0:0:0:2002"
     *
     * {@see https://en.wikipedia.org/wiki/IPv6_address#Representation} for more information on hexadecatet notation.
     *
     * @param {string} ipString the IP number in hexadecatet
     * @returns {IPv6} the IPv6 instance
     */
    static fromHexadecimalString(ipString) {
        return new IPv6(ipString);
    }
    /**
     * A string representation of the IPv6 number.
     *
     * @returns {string} The string representation of IPv6
     */
    toString() {
        return this.hexadecatet.map((value) => { return value.toString(); }).join(":");
    }
    /**
     * Gets the individual {@link Hexadecatet} that makes up the IPv6 number
     *
     * @returns {Array<Hexadecatet>} The individual {@link Hexadecatet} that makes up the IPv6 number
     */
    //TODO maybe rename to something like getSegments? so it can be same with getOctet
    getHexadecatet() {
        return this.hexadecatet;
    }
    /**
     * Returns the next IPv6 number
     *
     * @returns {IPv6} the next IPv6 number
     */
    nextIPNumber() {
        return IPv6.fromBigInteger(this.getValue().add(1));
    }
    /**
     * Returns the previous IPv6 number
     *
     * @returns {IPv6} the previous IPv6 number
     */
    previousIPNumber() {
        return IPv6.fromBigInteger(this.getValue().minus(1));
    }
    constructFromBigIntegerValue(ipv6Number) {
        let [isValid, message] = Validator_1.Validator.isValidIPv6Number(ipv6Number);
        if (!isValid) {
            throw new Error(message.filter(msg => { return msg !== ''; }).toString());
        }
        let binaryString = BinaryUtils_1.bigIntegerNumberToBinaryString(ipv6Number);
        return [ipv6Number, this.binaryStringToHexadecatets(binaryString)];
    }
    constructFromHexadecimalDottedString(expandedIPv6) {
        let [isValid, message] = Validator_1.Validator.isValidIPv6String(expandedIPv6);
        if (!isValid) {
            throw new Error(message.filter(msg => { return msg !== ''; }).toString());
        }
        let stringHexadecimals = expandedIPv6.split(":");
        let hexadecatet = stringHexadecimals.map((stringHexadecatet) => {
            return Hexadecatet_1.Hexadecatet.fromString(stringHexadecatet);
        });
        let value = bigInt(IPv6Utils_2.hexadectetNotationToBinaryString(expandedIPv6), 2);
        return [value, hexadecatet];
    }
    binaryStringToHexadecatets(binaryString) {
        let hexadecimalString = HexadecimalUtils_1.binaryStringToHexadecimalString(binaryString);
        let hexadecimalStrings = hexadecimalString.match(/.{1,4}/g);
        return hexadecimalStrings.map((stringHexadecatet) => {
            return Hexadecatet_1.Hexadecatet.fromString(stringHexadecatet);
        });
    }
}
exports.IPv6 = IPv6;


/***/ }),
/* 13 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
__export(__webpack_require__(5));
__export(__webpack_require__(15));
__export(__webpack_require__(0));
__export(__webpack_require__(7));
__export(__webpack_require__(6));
__export(__webpack_require__(3));
__export(__webpack_require__(11));
__export(__webpack_require__(16));
__export(__webpack_require__(12));
__export(__webpack_require__(17));
__export(__webpack_require__(4));
__export(__webpack_require__(8));
__export(__webpack_require__(9));
__export(__webpack_require__(10));
__export(__webpack_require__(2));


/***/ }),
/* 14 */
/***/ (function(module, exports) {

module.exports = function(module) {
	if(!module.webpackPolyfill) {
		module.deprecate = function() {};
		module.paths = [];
		// module.parent = undefined by default
		if(!module.children) module.children = [];
		Object.defineProperty(module, "loaded", {
			enumerable: true,
			get: function() {
				return module.l;
			}
		});
		Object.defineProperty(module, "id", {
			enumerable: true,
			get: function() {
				return module.i;
			}
		});
		module.webpackPolyfill = 1;
	}
	return module;
};


/***/ }),
/* 15 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const Validator_1 = __webpack_require__(2);
const BinaryUtils_1 = __webpack_require__(0);
const bigInt = __webpack_require__(1);
const IPNumType_1 = __webpack_require__(3);
const AbstractIPNum_1 = __webpack_require__(5);
/**
 * Represents an Autonomous System Number. Which is a number that is used to identify
 * a group of IP addresses with a common, clearly defined routing policy.
 *
 * @see https://en.wikipedia.org/wiki/Autonomous_system_(Internet)
 * @see https://www.rfc-editor.org/info/rfc4271
 */
class Asn extends AbstractIPNum_1.AbstractIPNum {
    /**
     * Constructor for an instance of {@link ASN}
     *
     * @param {string | number} rawValue value to construct an ASN from. The given value can either be numeric or
     * string. If in string then it can be in asplain, asdot or asdot+ string representation format
     */
    constructor(rawValue) {
        super();
        /**
         * The number of bits needed to represents the value of the ASN number
         */
        this.bitSize = 32;
        /**
         * The maximum bit size (i.e. binary value) of the ASN number in BigInteger
         */
        this.maximumBitSize = Validator_1.Validator.THIRTY_TWO_BIT_SIZE;
        this.type = IPNumType_1.IPNumType.ASN;
        if (typeof rawValue === 'string') {
            if (Asn.startWithASprefix(rawValue)) {
                this.value = bigInt(parseInt(rawValue.substring(2)));
            }
            else if (rawValue.indexOf(".") != -1) {
                this.value = bigInt(this.parseFromDotNotation(rawValue));
            }
            else {
                this.value = bigInt(parseInt(rawValue));
            }
        }
        if (typeof rawValue === 'number') {
            let valueAsBigInt = bigInt(rawValue);
            let [isValid, message] = Validator_1.Validator.isValidAsnNumber(valueAsBigInt);
            if (!isValid) {
                throw Error(message.filter(msg => { return msg !== ''; }).toString());
            }
            this.value = valueAsBigInt;
        }
    }
    /**
     * A convenience method for creating an instance of {@link Asn} from a string
     *
     * The given string can be in asplain, asdot or asdot+ representation format.
     * {@see https://tools.ietf.org/html/rfc5396} for more information on
     * the different ASN string representation
     *
     * @param {string} rawValue the asn string. In either asplain, asdot or asdot+ format
     * @returns {Asn} the constructed ASN instance
     */
    static fromString(rawValue) {
        return new Asn(rawValue);
    }
    ;
    /**
     * A convenience method for creating an instance of {@link Asn} from a numeric value
     *
     * @param {number} rawValue the asn numeric value
     * @returns {Asn} he constructed ASN instance
     */
    static fromNumber(rawValue) {
        return new Asn(rawValue);
    }
    ;
    /**
     * A string representation where the asn value is prefixed by "ASN". For example "AS65526"
     *
     * @returns {string} A string representation where the asn value is prefixed by "ASN"
     */
    toString() {
        let stringValue = this.value.toString();
        return `${Asn.AS_PREFIX}${stringValue}`;
    }
    /**
     * A string representation where the ASN numeric value of is represented as a string. For example "65526"
     *
     * @returns {string} A string representation where the ASN numeric value of is represented as a string
     */
    toASPlain() {
        return this.value.toString();
    }
    /**
     * A string representation where the ASN value is represented using the asplain notation if the ASN value is
     * less than 65536 and uses asdot+ notation when the value is greater than 65536.
     *
     * For example 65526 will be represented as "65526" while 65546 will be represented as "1.10"
     *
     *
     * @returns {string} A string representation of the ASN in either asplain or asdot+ notation depending on
     * whether the numeric value of the ASN number is greater than 65526 or not.
     */
    toASDot() {
        if (this.value.valueOf() >= 65536) {
            return this.toASDotPlus();
        }
        return this.toASPlain();
    }
    /**
     * A string representation where the ASN value is represented using the asdot+ notation
     *
     * @returns {string} A string representation where the ASN value is represented using the asdot+ notation
     *
     */
    toASDotPlus() {
        let high = Math.floor(this.value.valueOf() / 65535);
        let low = (this.value.valueOf() % 65535) - high;
        return `${high}.${low}`;
    }
    /**
     * Converts the ASN value to binary numbers represented with strings
     *
     * @returns {string} a binary string representation of the value of the ASN number
     */
    toBinaryString() {
        return BinaryUtils_1.decimalNumberToBinaryString(this.value.valueOf());
    }
    /**
     * Checks if the ASN value is 16bit
     *
     * @returns {boolean} true if the ASN is a 16bit value. False otherwise.
     */
    is16Bit() {
        let [valid16BitAsnNumber,] = Validator_1.Validator.isValid16BitAsnNumber(this.value);
        return valid16BitAsnNumber;
    }
    /**
     * Checks if the ASN value is 32bit
     *
     * @returns {boolean} true if the ASN is a 32bit value. False otherwise.
     */
    is32Bit() {
        return !this.is16Bit();
    }
    /**
     * Returns the next ASN number
     *
     * @returns {IPNumber} the next ASN number
     */
    nextIPNumber() {
        return new Asn(this.value.valueOf() + 1);
    }
    /**
     * Returns the previous ASN number
     *
     * @returns {IPNumber} the previous ASN number
     */
    previousIPNumber() {
        return new Asn(this.value.valueOf() - 1);
    }
    static startWithASprefix(word) {
        return word.indexOf(Asn.AS_PREFIX) === 0;
    }
    parseFromDotNotation(rawValue) {
        let values = rawValue.split(".");
        let high = parseInt(values[0]);
        let low = parseInt(values[1]);
        return (high * 65535) + (low + high);
    }
}
Asn.AS_PREFIX = "AS";
exports.Asn = Asn;


/***/ }),
/* 16 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const IPv4_1 = __webpack_require__(11);
const Prefix_1 = __webpack_require__(9);
const BinaryUtils_1 = __webpack_require__(0);
const BinaryUtils_2 = __webpack_require__(0);
const Validator_1 = __webpack_require__(2);
const bigInt = __webpack_require__(1);
/**
 * Represents a continuous segment of IPv4 numbers following the
 * classless inter-domain routing scheme for allocating IP addresses.
 *
 * @see https://en.wikipedia.org/wiki/Classless_Inter-Domain_Routing
 */
class IPv4Range {
    /**
     * Constructor for creating an instance of an IPv4 range.
     *
     * The arguments taken by the constructor is inspired by the CIDR notation which basically consists of the IP
     * number and the prefix.
     *
     * @param {IPv4} ipv4 the IP number used to construct the range. By convention this is the first IP number in
     * the range, but it could also be any IP number within the range
     * @param {IPv4Prefix} cidrPrefix the prefix which is a representation of the number of bits used to mask the
     * given IP number in other to create the range
     */
    constructor(ipv4, cidrPrefix) {
        this.ipv4 = ipv4;
        this.cidrPrefix = cidrPrefix;
        this.bitValue = bigInt(32);
        this.internalCounterValue = this.getFirst();
    }
    /**
     * Convenience method for constructing an instance of an IPV4Range from an IP range represented in CIDR notation
     *
     * @param {string} rangeIncidrNotation the range of the IPv4 number in CIDR notation
     * @returns {IPv4Range} the IPv4Range
     */
    // TODO introduce an abstract class to share some of the logic between IPv4Range and IPv6Range
    static fromCidr(rangeIncidrNotation) {
        let [isValid, errorMessages] = Validator_1.Validator.isValidIPv4CidrNotation(rangeIncidrNotation);
        if (!isValid) {
            let messages = errorMessages.filter(message => { return message !== ''; });
            throw new Error(messages.join(' and '));
        }
        let cidrComponents = rangeIncidrNotation.split("/");
        let ipString = cidrComponents[0];
        let prefix = parseInt(cidrComponents[1]);
        return new IPv4Range(IPv4_1.IPv4.fromDecimalDottedString(ipString), Prefix_1.IPv4Prefix.fromNumber(prefix));
    }
    ;
    /**
     * Gets the size of IPv4 numbers contained within the IPv4 range
     *
     * @returns {bigInt.BigInteger} the amount of IPv4 numbers in the range
     */
    getSize() {
        /**
         * Using bitwise shit operation this will be
         * 1 << (this.bitValue - this.prefix.getValue())
         * Since left shift a number by x is equivalent to multiplying the number by the power x raised to 2
         * 2 << 4 = 2 * (2 raised to 4)
          */
        return bigInt(2).pow(this.bitValue.minus(bigInt(this.cidrPrefix.getValue())));
    }
    /**
     * Method that returns the IPv4 range in CIDR (Classless Inter-Domain Routing) notation.
     *
     * See {@link https://en.wikipedia.org/wiki/Classless_Inter-Domain_Routing#CIDR_notation} for more information
     * on the Classless Inter-Domain Routing notation
     *
     * @returns {string} the IPv4 range in CIDR (Classless Inter-Domain Routing) notation
     */
    toCidrString() {
        return `${this.ipv4.toString()}/${this.cidrPrefix.toString()}`;
    }
    /**
     * Method that returns the IPv4 range in string notation where the first IPv4 number and last IPv4 number are
     * separated by an hyphen. eg. 192.198.0.0-192.198.0.255
     *
     * @returns {string} the range in [first IPv4 number] - [last IPv4 number] format
     */
    toRangeString() {
        return `${this.getFirst()}-${this.getLast()}`;
    }
    /**
     * Method that returns the first IPv4 number in the IPv4 range
     *
     * @returns {IPv4} the first IPv4 number in the IPv4 range
     */
    getFirst() {
        return IPv4_1.IPv4.fromBigInteger(this.ipv4.getValue().and(this.cidrPrefix.toSubnet().getValue()));
    }
    /**
     * Method that returns the last IPv4 number in the IPv4 range
     *
     * @returns {IPv4} the last IPv4 number in the IPv4 range
     */
    getLast() {
        let onMask = bigInt("1".repeat(32), 2);
        let subnetAsBigInteger = this.cidrPrefix.toSubnet().getValue();
        let invertedSubnet = BinaryUtils_1.leftPadWithZeroBit(subnetAsBigInteger.xor(onMask).toString(2), 32);
        return IPv4_1.IPv4.fromBigInteger(this.ipv4.getValue().or(BinaryUtils_2.parseBinaryStringToBigInteger(invertedSubnet)));
    }
    /**
     * Indicates whether the given IPv4 range is an adjacent range.
     *
     * An adjacent range being one where the end of the given range, when incremented by one marks the start of the
     * other range. Or where the start of the given range, when decreased by one, marks the end of the other range
     *
     * @param {IPv4Range} otherRange the other IPv4 range to compare with
     * @returns {boolean} true if the two IPv4 ranges are consecutive, false otherwise
     */
    // TODO move this to the IPRange interface?
    isConsecutive(otherRange) {
        let thisFirst = this.getFirst();
        let thisLast = this.getLast();
        let otherFirst = otherRange.getFirst();
        let otherLast = otherRange.getLast();
        return (thisLast.hasNext() && thisLast.nextIPNumber().isEquals(otherFirst)
            ||
                otherLast.hasNext() && otherLast.nextIPNumber().isEquals(thisFirst));
    }
    /**
     * Indicates if the given IPv4 range is a subset.
     *
     * By a subset range, it means all the values of the given range are contained by this IPv4 range
     *
     * @param {IPv4Range} otherRange the other IPv4 range
     * @returns {boolean} true if the other Ipv4 range is a subset. False otherwise.
     */
    // TODO move this to the IPRange interface?
    contains(otherRange) {
        let thisFirst = this.getFirst();
        let thisLast = this.getLast();
        let otherFirst = otherRange.getFirst();
        let otherLast = otherRange.getLast();
        return (thisFirst.isLessThanOrEquals(otherFirst) && thisLast.isGreaterThanOrEquals(otherLast));
    }
    /**
     * Indicate if the given range is a container range.
     *
     * By container range, it means all the IP number in this current range can be found within the given range.
     *
     * @param {IPv4Range} otherRange he other IPv4 range
     * @returns {boolean} true if the other Ipv4 range is a container range. False otherwise.
     */
    inside(otherRange) {
        let thisFirst = this.getFirst();
        let thisLast = this.getLast();
        let otherFirst = otherRange.getFirst();
        let otherLast = otherRange.getLast();
        return (otherFirst.isLessThanOrEquals(thisFirst) && otherLast.isGreaterThanOrEquals(thisLast));
    }
    /**
     * Checks if two IPv4 ranges overlap
     * @param {IPv4Range} otherRange the other IPv4 range
     * @returns {boolean} true if the ranges overlap, false otherwise
     */
    // TODO or confirm than normal ranges cannot overlap
    isOverlapping(otherRange) {
        let thisFirst = this.getFirst();
        let thisLast = this.getLast();
        let otherFirst = otherRange.getFirst();
        let otherLast = otherRange.getLast();
        return (thisLast.isGreaterThan(otherFirst) && thisLast.isLessThanOrEquals(otherLast) && thisFirst.isLessThan(otherFirst)
            ||
                otherLast.isGreaterThan(thisFirst) && otherLast.isLessThanOrEquals(thisLast) && otherFirst.isLessThan(otherFirst));
    }
    /**
     * Method that takes IPv4 number from within an IPv4 range, starting from the first IPv4 number
     *
     * @param {number} count the amount of IPv4 number to take from the IPv4 range
     * @returns {Array<IPv4>} an array of IPv4 number, taken from the IPv4 range
     */
    take(count) {
        let ipv4s = [this.getFirst()];
        let iteratingIPv4 = this.getFirst();
        if (bigInt(count).greater(this.getSize())) {
            throw new Error(`${count} is greater than ${this.getSize()}, the size of the range`);
        }
        for (var counter = 0; counter < count - 1; counter++) {
            ipv4s.push(iteratingIPv4.nextIPNumber());
            iteratingIPv4 = iteratingIPv4.nextIPNumber();
        }
        return ipv4s;
    }
    /**
     * Method that splits an IPv4 range into two halves
     *
     * @returns {Array<IPv4Range>} An array of two {@link IPv4Range}
     */
    split() {
        let prefixToSplit = this.cidrPrefix.getValue();
        if (prefixToSplit === 32) {
            throw new Error("Cannot split an IP range with a single IP number");
        }
        let splitCidr = Prefix_1.IPv4Prefix.fromNumber(prefixToSplit + 1);
        let firstIPOfFirstRange = this.getFirst();
        let firstRange = new IPv4Range(firstIPOfFirstRange, splitCidr);
        let firstIPOfSecondRange = firstRange.getLast().nextIPNumber();
        let secondRange = new IPv4Range(firstIPOfSecondRange, splitCidr);
        return [firstRange, secondRange];
    }
    next(value) {
        let returnValue = this.internalCounterValue;
        this.internalCounterValue = this.internalCounterValue.nextIPNumber();
        if (returnValue.isLessThanOrEquals(this.getLast())) {
            return {
                done: false,
                value: returnValue
            };
        }
        else {
            return {
                done: true
            };
        }
    }
    return(value) {
        return {
            done: true,
            value: this.internalCounterValue
        };
    }
    // TODO read up on what this method does and decide to implement or remove
    throw(e) {
        throw new Error("Method not implemented.");
    }
    [Symbol.iterator]() {
        return this;
    }
}
exports.IPv4Range = IPv4Range;


/***/ }),
/* 17 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const Prefix_1 = __webpack_require__(9);
const IPv6_1 = __webpack_require__(12);
const bigInt = __webpack_require__(1);
const BinaryUtils_1 = __webpack_require__(0);
const BinaryUtils_2 = __webpack_require__(0);
const Validator_1 = __webpack_require__(2);
/**
 * Represents a continuous segment of IPv6 number following the
 * classless inter-domain routing scheme for allocating IP addresses.
 *
 * @see https://en.wikipedia.org/wiki/Classless_Inter-Domain_Routing
 */
// TODO introduce an abstract class to share some of the logic between IPv4Range and IPv6Range
class IPv6Range {
    /**
     * Constructor for creating an instance of an IPv6 range.
     *
     * The arguments taken by the constructor is inspired by the CIDR notation which basically consists of the IP
     * number and the prefix.
     *
     * @param {IPv6} IPv6 the IP number used to construct the range. By convention this is the first IP number in
     * the range, but it could also be any IP number within the range
     * @param {IPv6Prefix} cidrPrefix the prefix which is a representation of the number of bits used to mask the
     * given IPv6 number in other to create the range
     */
    constructor(ipv6, cidrPrefix) {
        this.ipv6 = ipv6;
        this.cidrPrefix = cidrPrefix;
        this.bitValue = bigInt(128);
        this.internalCounterValue = this.getFirst();
    }
    /**
     * Convenience method for constructing an instance of an IPV6Range from an IP range represented in CIDR notation
     *
     * @param {string} rangeIncidrNotation the range of the IPv6 number in CIDR notation
     * @returns {IPV6Range} the IPV6Range
     */
    static fromCidr(rangeIncidrNotation) {
        let [isValid, message] = Validator_1.Validator.isValidIPv6CidrNotation(rangeIncidrNotation);
        if (!isValid) {
            throw new Error(message.filter(msg => { return msg !== ''; }).toString());
        }
        let cidrComponents = rangeIncidrNotation.split("/");
        let ipString = cidrComponents[0];
        let prefix = parseInt(cidrComponents[1]);
        return new IPv6Range(IPv6_1.IPv6.fromHexadecimalString(ipString), Prefix_1.IPv6Prefix.fromNumber(prefix));
    }
    ;
    /**
     * Gets the size of IPv6 numbers contained within the IPv6 range
     *
     * @returns {bigInt.BigInteger} the amount of IPv6 numbers in the range
     */
    getSize() {
        /**
         * Using bitwise shit operation this will be
         * 1 << (this.bitValue - this.prefix.getValue())
         * Since left shift a number by x is equivalent to multiplying the number by the power x raised to 2
         * 2 << 4 = 2 * (2 raised to 4)
         */
        return bigInt(2).pow(this.bitValue.minus(bigInt(this.cidrPrefix.getValue())));
    }
    /**
     * Method that returns the IPv6 range in CIDR (Classless Inter-Domain Routing) notation.
     *
     * See {@link https://en.wikipedia.org/wiki/Classless_Inter-Domain_Routing#CIDR_notation} for more information
     * on the Classless Inter-Domain Routing notation
     *
     * @returns {string} the IPv6 range in CIDR (Classless Inter-Domain Routing) notation
     */
    toCidrString() {
        return `${this.ipv6.toString()}/${this.cidrPrefix.toString()}`;
    }
    /**
     * Method that returns the IPv6 range in string notation where the first IPv6 number and last IPv6 number are
     * separated by an hyphen. eg. "2001:db8:0:0:0:0:0:0-2001:db8:0:ffff:ffff:ffff:ffff:ffff"
     *
     * @returns {string} the range in [first IPv6 number] - [last IPv6 number] format
     */
    toRangeString() {
        return `${this.getFirst()}-${this.getLast()}`;
    }
    /**
     * Method that returns the first IPv6 number in the IPv6 range
     *
     * @returns {IPv6} the first IPv6 number in the IPv6 range
     */
    getFirst() {
        return IPv6_1.IPv6.fromBigInteger(this.ipv6.getValue().and(this.cidrPrefix.toSubnet().getValue()));
    }
    /**
     * Method that returns the last IPv6 number in the IPv6 range
     *
     * @returns {IPv6} the last IPv6 number in the IPv6 range
     */
    getLast() {
        let onMask = bigInt("1".repeat(128), 2);
        let subnetAsBigInteger = this.cidrPrefix.toSubnet().getValue();
        let invertedSubnet = BinaryUtils_1.leftPadWithZeroBit(subnetAsBigInteger.xor(onMask).toString(2), 128);
        return IPv6_1.IPv6.fromBigInteger(this.ipv6.getValue().or(BinaryUtils_2.parseBinaryStringToBigInteger(invertedSubnet)));
    }
    /**
     * Indicates whether the given IPv6 range is an adjacent range.
     *
     * An adjacent range being one where the end of the given range, when incremented by one marks the start of the
     * other range. Or where the start of the given range, when decreased by one, marks the end of the other range
     *
     * @param {IPv6Range} otherRange the other IPv6 range to compare with
     * @returns {boolean} true if the two IPv6 ranges are consecutive, false otherwise
     */
    // TODO move this to the IPRange interface?
    isConsecutive(otherRange) {
        let thisFirst = this.getFirst();
        let thisLast = this.getLast();
        let otherFirst = otherRange.getFirst();
        let otherLast = otherRange.getLast();
        return (thisLast.hasNext() && thisLast.nextIPNumber().isEquals(otherFirst)
            ||
                otherLast.hasNext() && otherLast.nextIPNumber().isEquals(thisFirst));
    }
    /**
     * Indicates if the given IPv6 range is a subset.
     *
     * By a subset range, it means all the values of the given range are contained by this IPv6 range
     *
     * @param {IPv6Range} otherRange the other IPv6 range
     * @returns {boolean} true if the other Ipv6 range is a subset. False otherwise.
     */
    // TODO move this to the IPRange interface?
    contains(otherRange) {
        let thisFirst = this.getFirst();
        let thisLast = this.getLast();
        let otherFirst = otherRange.getFirst();
        let otherLast = otherRange.getLast();
        return (thisFirst.isLessThanOrEquals(otherFirst) && thisLast.isGreaterThanOrEquals(otherLast));
    }
    /**
     * Indicate if the given range is a container range.
     *
     * By container range, it means all the IP number in this current range can be found within the given range.
     *
     * @param {IPv6Range} otherRange he other IPv6 range
     * @returns {boolean} true if the other Ipv6 range is a container range. False otherwise.
     */
    // TODO move this to the IPRange interface?
    inside(otherRange) {
        let thisFirst = this.getFirst();
        let thisLast = this.getLast();
        let otherFirst = otherRange.getFirst();
        let otherLast = otherRange.getLast();
        return (otherFirst.isLessThanOrEquals(thisFirst) && otherLast.isGreaterThanOrEquals(thisLast));
    }
    /**
     * Checks if two IPv6 ranges overlap
     * @param {IPv6Range} otherRange the other IPv6 range
     * @returns {boolean} true if the ranges overlap, false otherwise
     */
    // TODO or confirm than normal ranges cannot overlap
    isOverlapping(otherRange) {
        let thisFirst = this.getFirst();
        let thisLast = this.getLast();
        let otherFirst = otherRange.getFirst();
        let otherLast = otherRange.getLast();
        return (thisLast.isGreaterThan(otherFirst) && thisLast.isLessThanOrEquals(otherLast) && thisFirst.isLessThan(otherFirst)
            ||
                otherLast.isGreaterThan(thisFirst) && otherLast.isLessThanOrEquals(thisLast) && otherFirst.isLessThan(otherFirst));
    }
    /**
     * Method that takes IPv6 number from within an IPv6 range, starting from the first IPv6 number
     *
     * @param {number} count the amount of IPv6 number to take from the IPv6 range
     * @returns {Array<IPv6>} an array of IPv6 number, taken from the IPv6 range
     */
    take(count) {
        let iPv6s = [this.getFirst()];
        let iteratingIPv6 = this.getFirst();
        if (bigInt(count).greater(this.getSize())) {
            throw new Error(`${count} is greater than ${this.getSize()}, the size of the range`);
        }
        for (var counter = 0; counter < count - 1; counter++) {
            iPv6s.push(iteratingIPv6.nextIPNumber());
            iteratingIPv6 = iteratingIPv6.nextIPNumber();
        }
        return iPv6s;
    }
    /**
     * Method that splits an IPv6 range into two halves
     *
     * @returns {Array<IPv6Range>} An array of two {@link IPv6Range}
     */
    split() {
        let prefixToSplit = this.cidrPrefix.getValue();
        if (prefixToSplit === 128) {
            throw new Error("Cannot split an IP range with a single IP number");
        }
        let splitCidr = Prefix_1.IPv6Prefix.fromNumber(prefixToSplit + 1);
        let firstIPOfFirstRange = this.getFirst();
        let firstRange = new IPv6Range(firstIPOfFirstRange, splitCidr);
        let firstIPOfSecondRange = firstRange.getLast().nextIPNumber();
        let secondRange = new IPv6Range(firstIPOfSecondRange, splitCidr);
        return [firstRange, secondRange];
    }
    next(value) {
        let returnValue = this.internalCounterValue;
        this.internalCounterValue = this.internalCounterValue.nextIPNumber();
        if (returnValue.isLessThanOrEquals(this.getLast())) {
            return {
                done: false,
                value: returnValue
            };
        }
        else {
            return {
                done: true
            };
        }
    }
    return(value) {
        return {
            done: true,
            value: this.internalCounterValue
        };
    }
    // TODO read up on what this method does and decide to implement or remove
    throw(e) {
        throw new Error("Method not implemented.");
    }
    [Symbol.iterator]() {
        return this;
    }
}
exports.IPv6Range = IPv6Range;


/***/ })
/******/ ]);
//# sourceMappingURL=ip-num.js.map 