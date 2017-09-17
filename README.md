ip-num
================
`ip-num` is a [TypeScript](https://www.typescriptlang.org/) library for working with `IPv4`, `IPv6` and `ASN` numbers. It provides representations of these internet protocol numbers with the ability to perform various operations like parsing, validating etc. on them.

`ip-num` can be used with both TypeScript and vanila JavaScript. It also support both usage within a browser environment as well as Node.Js environment.

`ip-num` makes use of the [BigInteger.js](https://github.com/peterolson/BigInteger.js/) library to represents numeric values. This is due to the fact that numeric values when dealing with IP numbers can exceed the value that can safely be represented natively within JavaScript without loosing precisions ie numbers greater than 
[Number.MAX_SAFE_INTEGER](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/MAX_SAFE_INTEGER)
 

Installation
----------------

### Node.js
If you want to use `ip-num` from within a Node.js environment, you can install it via [npm](https://npmjs.org/).

```npm install ip-num```

### Browser
If you are using a browser, you can include `ip-num` by linking to it or download it from GitHub

```<script src="https://raw.githubusercontent.com/ip-num/ip-num/master/ip-num.js"></script>```

Usage
------------------

The functionality `ip-num` exposes can be grouped into 2 broad categories:
* Modules representing ASN, IPv4, and IPv6 internet protocol numbers
* Utilities and Validator 

How you get access to the above, depends on the module loading mechanism being used. The examples below will show how
 to access `ip-num` using ES module mechanism with TypeScript in Node.js, using CommonJs module mechanism with 
 JavaScript in Node.Js, and by including `ip-num` via a script tag with JavaScript in the browser.

### ES module with TypeScript

Import what you need from `ip-num` and use away

```
import { Asn } from "ip-num/Asn";
import { IPv4 } from "ip-num/IPv4";
import { IPv6 } from "ip-num/IPv6";
```

You can then make use of the imported module in your TypeScript code

```
let asn = new Asn(65546);
asn.toBinaryString() //10000000000001010

let ipv4 = new IPv4("74.125.43.99");
ipv4.toBinaryString() //01001010011111010010101101100011

let ipv6 = new IPv6("ffff:ffff:ffff:ffff:ffff:ffff:ffff:ffff");
ipv6.toBinaryString() //11111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
```

### CommonJs with JavaScript

All external modules in `ip-num` are exported and made available via the global _ip-num_ module. So you can `require
('ip-num')` and then access the module you want to use in your application, or access the module in one go, while 
requiring; as shown below:

```
const Asn = require("ip-num").Asn;
const IPv4 = require("ip-num").IPv4;
const IPv6 = require("ip-num").IPv6;
```

The imported module can then be used:

```
let asn = new Asn(65546);
asn.toBinaryString() //10000000000001010

let ipv4 = new IPv4("74.125.43.99");
ipv4.toBinaryString() //01001010011111010010101101100011

let ipv6 = new IPv6("ffff:ffff:ffff:ffff:ffff:ffff:ffff:ffff");
ipv6.toBinaryString() //11111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
```

### Via Script tag with JavaScript

Including the `ip-num` library via the script tag in the browser exposes `ipnum` variable from which you can access 
the modules exposes by the library.

```
<script src="https://raw.githubusercontent.com/ip-num/ip-num/master/ip-num.js"></script>
........
let asn = new ipnum.Asn(65546);
console.log(asn.toBinaryString()); //10000000000001010

let ipv4 = new ipnum.IPv4("74.125.43.99")
console.log(ipv4.toBinaryString()); //01001010011111010010101101100011

let ipv6 = new ipnum.IPv6("ffff:ffff:ffff:ffff:ffff:ffff:ffff:ffff");
console.log(ipv6.toBinaryString()); //11111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111

```

Documentation
------------------
Documentation can be found at [https://ip-num.github.io/ip-num/](https://ip-num.github.io/ip-num/)

Examples
------------------
Find below some example of the API `ip-num` provides and how to use them. Check the [documentation](https://ip-num.github.io/ip-num/) for a more complete
 overview of `ip-num's` API.

`ip-num` makes use of the [BigInteger.js](https://github.com/peterolson/BigInteger.js/) library to represents numeric values. This is due to the fact that numeric 
values that needs to be worked with when dealing with IP numbers can exceed the numeric value that can be safely represented natively within JavaScript without loosing precisions ie numbers greater than 
[Number.MAX_SAFE_INTEGER](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/MAX_SAFE_INTEGER)

This would be seen in some of the example given below.
 
### ASN
```
import { Asn } from "ip-num/Asn";
..........
// creating
let asA = Asn.fromNumber(1234) // using the fromNumber factory method to create an instance from number
let asB Asn.fromString("AS1234") // using the fromString factory method to create an instance from string
let asC = Asn.fromString("1234") // string without the "AS" prefix is also supported
let asD = Asn.fromString("1.10") // string in asdot+ format is also supported

// converting between different ASN string representations
Asn.fromNumber(65526).toASDotPlus() // will give "0.65526"
Asn.fromNumber(65546).toASDot() // will give "1.10"
Asn.fromNumber(2).toBinaryString() // will give 10

// check if previous and next values exist, getting previous and next values
Asn.fromNumber(Math.pow(2, 32) - 1).hasNext() // false
Asn.fromNumber(2).hasNext() // true
Asn.fromNumber(0).hasPrevious() // false
Asn.fromNumber(2).hasPrevious() // true

```

See the [ASN documentation](https://ip-num.github.io/ip-num/classes/_asn_.asn.html) for more information

### IPv4
// TODO
### IPv6
// TODO
### Ranges
// TODO
### IPNumber and IPRange interfaces
// TODO

License
------------------
The `ip-num` library is released under the MIT license
