// [ip-num]  Version: 0.0.3-pre-alpha. Released on: Wednesday, September 13th, 2017, 11:11:48 PM  
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
Validator.invalidIPv4CidrNotationMessage = "Cidr notation should be in the form [ip address]/[range]";
Validator.invalidIPv6CidrNotationString = "A Cidr notation string should contain an IPv6 address and prefix";
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
exports.expandIPv6Address = (ipv6String) => {
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
exports.collapseIPv6Address = (ipv6String) => {
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
 * Converts a given IPv6 address expressed in the hexadecimal string notation into a 16 bit binary number in string
 * @param {string} hexadectetString the IPv6 number
 * @returns {string} the IPv6 number converted to binary string
 */
exports.hexadectetNotationToBinaryString = (hexadectetString) => {
    let expand = exports.expandIPv6Address(hexadectetString);
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
class AbstractIPNum {
    getValue() {
        return this.value;
    }
    toBinaryString() {
        return BinaryUtils_1.leftPadWithZeroBit(this.value.toString(2), this.bitSize);
    }
    hasNext() {
        return this.value.lesser(this.validatorBitSize);
    }
    hasPrevious() {
        return this.value.greater(bigInt.zero);
    }
    isEquals(anotherIPNum) {
        return this.value.equals(anotherIPNum.value);
    }
    isLessThan(anotherIPNum) {
        return this.value.lt(anotherIPNum.value);
    }
    isGreaterThan(anotherIPNum) {
        return this.value.gt(anotherIPNum.value);
    }
    isLessThanOrEquals(anotherIPNum) {
        return this.value.lesserOrEquals(anotherIPNum.value);
    }
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
class Hexadecatet {
    static fromString(rawValue) {
        return new Hexadecatet(rawValue);
    }
    ;
    static fromNumber(rawValue) {
        return new Hexadecatet(rawValue);
    }
    ;
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
    getValue() {
        return this.value;
    }
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
class Octet {
    static fromString(rawValue) {
        return new Octet(rawValue);
    }
    ;
    static fromNumber(rawValue) {
        return new Octet(rawValue);
    }
    ;
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
    getValue() {
        return this.value;
    }
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
class IPv4Prefix {
    static fromNumber(rawValue) {
        return new IPv4Prefix(rawValue);
    }
    ;
    constructor(rawValue) {
        let isValid;
        let message;
        [isValid, message] = Validator_1.Validator.isValidPrefixValue(rawValue, IPNumType_1.IPNumType.IPv4);
        if (!isValid) {
            throw new Error(message.filter(msg => { return msg !== ''; }).toString());
        }
        this.value = rawValue;
    }
    getValue() {
        return this.value;
    }
    toString() {
        return this.value.toString();
    }
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
class IPv6Prefix {
    static fromNumber(rawValue) {
        return new IPv6Prefix(rawValue);
    }
    ;
    constructor(rawValue) {
        let isValid;
        let message;
        [isValid, message] = Validator_1.Validator.isValidPrefixValue(rawValue, IPNumType_1.IPNumType.IPv6);
        if (!isValid) {
            throw new Error(message.filter(msg => { return msg !== ''; }).toString());
        }
        this.value = rawValue;
    }
    getValue() {
        return this.value;
    }
    toString() {
        return this.value.toString();
    }
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
class IPv4Subnet {
    // TODO similar code as in constructor of IPv4, reuse?
    constructor(ipString) {
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
    static fromString(rawValue) {
        return new IPv4Subnet(rawValue);
    }
    ;
    getValue() {
        return this.value;
    }
    toString() {
        return this.octets.map(function (value) { return value.toString(); }).join(".");
    }
    getOctets() {
        return this.octets;
    }
}
exports.IPv4Subnet = IPv4Subnet;
class IPv6Subnet {
    // TODO similar code as in constructor of IPv4, reuse?
    constructor(ipString) {
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
    static fromString(rawValue) {
        return new IPv6Subnet(rawValue);
    }
    ;
    getValue() {
        return this.value;
    }
    toString() {
        return this.hexadecatet.map(function (value) { return value.toString(); }).join(":");
    }
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
    constructor(ipValue) {
        super();
        this.type = IPNumType_1.IPNumType.IPv4;
        this.octets = [];
        this.separator = ".";
        this.bitSize = 32;
        this.validatorBitSize = Validator_1.Validator.THIRTY_TWO_BIT_SIZE;
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
    static fromBigInteger(bigIntValue) {
        return new IPv4(bigIntValue);
    }
    static fromDecimalDottedString(ipString) {
        return new IPv4(ipString);
    }
    toString() {
        return this.octets.map((value) => { return value.toString(); }).join(this.separator);
    }
    getOctets() {
        return this.octets;
    }
    nextIPNumber() {
        return IPv4.fromBigInteger(this.getValue().add(1));
    }
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
    constructor(ipValue) {
        super();
        this.type = IPNumType_1.IPNumType.IPv6;
        this.hexadecatet = [];
        this.separator = ":";
        this.bitSize = 128;
        this.validatorBitSize = Validator_1.Validator.ONE_HUNDRED_AND_TWENTY_EIGHT_BIT_SIZE;
        if (typeof ipValue === "string") {
            let expandedIPv6 = IPv6Utils_1.expandIPv6Address(ipValue);
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
    static parseFromBigInteger(bigIntValue) {
        return new IPv6(bigIntValue);
    }
    static parseFromHexadecimalString(ipString) {
        return new IPv6(ipString);
    }
    //TODO maybe rename to something like getSegments? so it can be same with getOctet
    getHexadecatet() {
        return this.hexadecatet;
    }
    toString() {
        return this.hexadecatet.map((value) => { return value.toString(); }).join(":");
    }
    nextIPNumber() {
        return IPv6.parseFromBigInteger(this.getValue().add(1));
    }
    previousIPNumber() {
        return IPv6.parseFromBigInteger(this.getValue().minus(1));
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
    constructor(rawValue) {
        super();
        this.bitSize = 32;
        this.validatorBitSize = Validator_1.Validator.THIRTY_TWO_BIT_SIZE;
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
    static fromString(rawValue) {
        return new Asn(rawValue);
    }
    ;
    static fromNumber(rawValue) {
        return new Asn(rawValue);
    }
    ;
    getValue() {
        return this.value;
    }
    toString() {
        let stringValue = this.value.toString();
        return `${Asn.AS_PREFIX}${stringValue}`;
    }
    toASPlain() {
        return this.value.toString();
    }
    toASDot() {
        if (this.value.valueOf() >= 65536) {
            return this.toASDotPlus();
        }
        return this.toASPlain();
    }
    toASDotPlus() {
        let high = Math.floor(this.value.valueOf() / 65535);
        let low = (this.value.valueOf() % 65535) - high;
        return `${high}.${low}`;
    }
    toBinaryString() {
        return BinaryUtils_1.decimalNumberToBinaryString(this.value.valueOf());
    }
    is16Bit() {
        let [valid16BitAsnNumber,] = Validator_1.Validator.isValid16BitAsnNumber(this.value);
        return valid16BitAsnNumber;
    }
    is32Bit() {
        return !this.is16Bit();
    }
    isEquals(anotherAsn) {
        return this.value.equals(anotherAsn.value);
    }
    isGreaterThan(anotherAsn) {
        return this.value.greater(anotherAsn.value);
    }
    isLessThan(anotherAsn) {
        return this.value.lesser(anotherAsn.value);
    }
    isGreaterThanOrEquals(anotherAsn) {
        return this.value.greaterOrEquals(anotherAsn.value);
    }
    isLessThanOrEquals(anotherAsn) {
        return this.value.lesserOrEquals(anotherAsn.value);
    }
    next() {
        return new Asn(this.value.valueOf() + 1);
    }
    previous() {
        return new Asn(this.value.valueOf() - 1);
    }
    nextIPNumber() {
        return this.next();
    }
    previousIPNumber() {
        return this.previous();
    }
    hasNext() {
        return this.value < Validator_1.Validator.THIRTY_TWO_BIT_SIZE;
    }
    hasPrevious() {
        return this.value.valueOf() > 0;
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
 * Represents a continuous segment of IPv4 addresses following the
 * classless inter-domain routing scheme for allocating IP addresses.
 *
 * @see https://en.wikipedia.org/wiki/Classless_Inter-Domain_Routing
 */
class IPv4Range {
    constructor(ipv4, cidrPrefix) {
        this.ipv4 = ipv4;
        this.cidrPrefix = cidrPrefix;
        this.bitValue = bigInt(32);
        this.internalCounterValue = this.getFirst();
    }
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
    getSize() {
        /**
         * Using bitwise shit operation this will be
         * 1 << (this.bitValue - this.prefix.getValue())
         * Since left shift a number by x is equivalent to multiplying the number by the power x raised to 2
         * 2 << 4 = 2 * (2 raised to 4)
          */
        return bigInt(2).pow(this.bitValue.minus(bigInt(this.cidrPrefix.getValue())));
    }
    toCidrString() {
        return `${this.ipv4.toString()}/${this.cidrPrefix.toString()}`;
    }
    toRangeString() {
        return `${this.getFirst()}-${this.getLast()}`;
    }
    getFirst() {
        return IPv4_1.IPv4.fromBigInteger(this.ipv4.getValue().and(this.cidrPrefix.toSubnet().getValue()));
    }
    getLast() {
        let onMask = bigInt("1".repeat(32), 2);
        let subnetAsBigInteger = this.cidrPrefix.toSubnet().getValue();
        let invertedSubnet = BinaryUtils_1.leftPadWithZeroBit(subnetAsBigInteger.xor(onMask).toString(2), 32);
        return IPv4_1.IPv4.fromBigInteger(this.ipv4.getValue().or(BinaryUtils_2.parseBinaryStringToBigInteger(invertedSubnet)));
    }
    isConsecutive(otherRange) {
        let thisFirst = this.getFirst();
        let thisLast = this.getLast();
        let otherFirst = otherRange.getFirst();
        let otherLast = otherRange.getLast();
        return (thisLast.hasNext() && thisLast.nextIPNumber().isEquals(otherFirst)
            ||
                otherLast.hasNext() && otherLast.nextIPNumber().isEquals(thisFirst));
    }
    contains(otherRange) {
        let thisFirst = this.getFirst();
        let thisLast = this.getLast();
        let otherFirst = otherRange.getFirst();
        let otherLast = otherRange.getLast();
        return (thisFirst.isLessThanOrEquals(otherFirst) && thisLast.isGreaterThanOrEquals(otherLast));
    }
    inside(otherRange) {
        let thisFirst = this.getFirst();
        let thisLast = this.getLast();
        let otherFirst = otherRange.getFirst();
        let otherLast = otherRange.getLast();
        return (otherFirst.isLessThanOrEquals(thisFirst) && otherLast.isGreaterThanOrEquals(thisLast));
    }
    isOverlapping(otherRange) {
        let thisFirst = this.getFirst();
        let thisLast = this.getLast();
        let otherFirst = otherRange.getFirst();
        let otherLast = otherRange.getLast();
        return (thisLast.isGreaterThan(otherFirst) && thisLast.isLessThanOrEquals(otherLast) && thisFirst.isLessThan(otherFirst)
            ||
                otherLast.isGreaterThan(thisFirst) && otherLast.isLessThanOrEquals(thisLast) && otherFirst.isLessThan(otherFirst));
    }
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
    split() {
        let prefixToSplit = this.cidrPrefix.getValue();
        if (prefixToSplit === 32) {
            throw new Error("Cannot split an IP range with a single IP address");
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
 * Represents a continuous segment of IPv4 addresses following the
 * classless inter-domain routing scheme for allocating IP addresses.
 *
 * @see https://en.wikipedia.org/wiki/Classless_Inter-Domain_Routing
 */
class IPv6Range {
    constructor(ipv6, cidrPrefix) {
        this.ipv6 = ipv6;
        this.cidrPrefix = cidrPrefix;
        this.bitValue = bigInt(128);
        this.internalCounterValue = this.getFirst();
    }
    static fromCidr(rangeIncidrNotation) {
        let [isValid, message] = Validator_1.Validator.isValidIPv6CidrNotation(rangeIncidrNotation);
        if (!isValid) {
            throw new Error(message.filter(msg => { return msg !== ''; }).toString());
        }
        let cidrComponents = rangeIncidrNotation.split("/");
        let ipString = cidrComponents[0];
        let prefix = parseInt(cidrComponents[1]);
        return new IPv6Range(IPv6_1.IPv6.parseFromHexadecimalString(ipString), Prefix_1.IPv6Prefix.fromNumber(prefix));
    }
    ;
    getSize() {
        /**
         * Using bitwise shit operation this will be
         * 1 << (this.bitValue - this.prefix.getValue())
         * Since left shift a number by x is equivalent to multiplying the number by the power x raised to 2
         * 2 << 4 = 2 * (2 raised to 4)
         */
        return bigInt(2).pow(this.bitValue.minus(bigInt(this.cidrPrefix.getValue())));
    }
    toCidrString() {
        return `${this.ipv6.toString()}/${this.cidrPrefix.toString()}`;
    }
    toRangeString() {
        return `${this.getFirst()}-${this.getLast()}`;
    }
    getFirst() {
        return IPv6_1.IPv6.parseFromBigInteger(this.ipv6.getValue().and(this.cidrPrefix.toSubnet().getValue()));
    }
    getLast() {
        let onMask = bigInt("1".repeat(128), 2);
        let subnetAsBigInteger = this.cidrPrefix.toSubnet().getValue();
        let invertedSubnet = BinaryUtils_1.leftPadWithZeroBit(subnetAsBigInteger.xor(onMask).toString(2), 128);
        return IPv6_1.IPv6.parseFromBigInteger(this.ipv6.getValue().or(BinaryUtils_2.parseBinaryStringToBigInteger(invertedSubnet)));
    }
    isConsecutive(otherRange) {
        let thisFirst = this.getFirst();
        let thisLast = this.getLast();
        let otherFirst = otherRange.getFirst();
        let otherLast = otherRange.getLast();
        return (thisLast.hasNext() && thisLast.nextIPNumber().isEquals(otherFirst)
            ||
                otherLast.hasNext() && otherLast.nextIPNumber().isEquals(thisFirst));
    }
    contains(otherRange) {
        let thisFirst = this.getFirst();
        let thisLast = this.getLast();
        let otherFirst = otherRange.getFirst();
        let otherLast = otherRange.getLast();
        return (thisFirst.isLessThanOrEquals(otherFirst) && thisLast.isGreaterThanOrEquals(otherLast));
    }
    inside(otherRange) {
        let thisFirst = this.getFirst();
        let thisLast = this.getLast();
        let otherFirst = otherRange.getFirst();
        let otherLast = otherRange.getLast();
        return (otherFirst.isLessThanOrEquals(thisFirst) && otherLast.isGreaterThanOrEquals(thisLast));
    }
    isOverlapping(otherRange) {
        let thisFirst = this.getFirst();
        let thisLast = this.getLast();
        let otherFirst = otherRange.getFirst();
        let otherLast = otherRange.getLast();
        return (thisLast.isGreaterThan(otherFirst) && thisLast.isLessThanOrEquals(otherLast) && thisFirst.isLessThan(otherFirst)
            ||
                otherLast.isGreaterThan(thisFirst) && otherLast.isLessThanOrEquals(thisLast) && otherFirst.isLessThan(otherFirst));
    }
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
    split() {
        let prefixToSplit = this.cidrPrefix.getValue();
        if (prefixToSplit === 128) {
            throw new Error("Cannot split an IP range with a single IP address");
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