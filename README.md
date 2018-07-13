[![Build Status](https://travis-ci.org/ip-num/ip-num.svg?branch=master)](https://travis-ci.org/ip-num/ip-num)
[![Coverage Status](https://coveralls.io/repos/github/ip-num/ip-num/badge.svg?branch=master)](https://coveralls.io/github/ip-num/ip-num?branch=master)

ip-num
================
`ip-num` is a [TypeScript](https://www.typescriptlang.org/) library for working with `IPv4`, `IPv6` and `ASN` numbers. It provides representations of these internet protocol numbers with the ability to perform various operations like parsing, validating etc. on them.

`ip-num` can be used with both TypeScript and vanila JavaScript. It also support both usage within a browser environment as well as Node.Js environment.

`ip-num` makes use of the [BigInteger.js](https://github.com/peterolson/BigInteger.js/) library to represents numeric values. This is due to the fact that numeric values when dealing with IP numbers can exceed the value that can safely be represented natively within JavaScript without loosing precisions ie numbers greater than 
[Number.MAX_SAFE_INTEGER](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/MAX_SAFE_INTEGER)

`ip-num`'s source can be found on [GitHub](https://github.com/ip-num/ip-num)

You can have a play at `ip-num`'s API via the JsBin at [http://bit.ly/ipnum-playground](http://bit.ly/ipnum-playground)

Installation
----------------

### Node.js
If you want to use `ip-num` from within a Node.js environment, you can install it via [npm](https://npmjs.org/).

```npm install ip-num```

`ip-num` is tested against version 7 - and upwards - of NodeJs.

### Browser
If you are using a browser, you can include `ip-num` by linking to it or download it from GitHub

```<script src="https://ip-num.github.io/ip-num/ip-num.js"></script>```

The source maps can be found at

```https://ip-num.github.io/ip-num/ip-num.js.map"```

Previous releases can be seen at [https://github.com/ip-num/ip-num/releases](https://github.com/ip-num/ip-num/releases)

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
<script src="https://ip-num.github.io/ip-num/ip-num.js"></script>
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
Find below, some example of the usage of `ip-num`. For a more comprehensive overview of the API, please refer to the [documentation](https://ip-num.github.io/ip-num/).

`ip-num` makes use of the [BigInteger.js](https://github.com/peterolson/BigInteger.js/) library to represents numeric values. This is due to the fact that numeric 
values that needs to be worked with when dealing with IP numbers can exceed the numeric value that can be safely represented natively within JavaScript without loosing precisions ie numbers greater than 
[Number.MAX_SAFE_INTEGER](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/MAX_SAFE_INTEGER)
 
### ASN
```
import { Asn } from "ip-num/Asn";
..........
// creating
let asA = Asn.fromNumber(1234) // using the fromNumber factory method to create an instance from number
let asB Asn.fromString("AS1234") // using the fromString factory method to create an instance from string
let asC = Asn.fromString("1234") // string without the "AS" prefix is also supported
let asD = Asn.fromString("1.10") // string in asdot+ format is also supported
let asE = Asn.fromBinaryString('1111') // using the fromBinaryString to create an instance from binary string

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
```
import { IPv4 } from "ip-num/IPv4";

// creating
let firstIPv4 = new IPv4("74.125.43.99") // Creating an instance using the constructor
let secondIPv4 = IPv4.fromBigInteger(bigInt("1876843053")) // Using the fromBigInteger convenience method
let thirdIPv4 = IPv4.fromDecimalDottedString("111.222.90.45") // Using the fromDecimalDottedString convenience method
let fourthIPv4 = IPv4.fromBinaryString("01001010011111010010101101100011") // using the fromBinaryString convenience method

// converting an IPv4 instance to binary string representation
firstIPv4.toBinaryString() // will be 01001010011111010010101101100011

// comparing IPV4
firstIPv4.isEquals(thirdIPv4) // false
firstIPv4.isLessThan(thirdIPv4) // true
firstIPv4.isGreaterThan(thirdIPv4) // false
```

See the [IPv4 documentation](https://ip-num.github.io/ip-num/classes/_ipv4_.ipv4.html) for more information

### IPv6
```
import { IPv6 } from "ip-num/IPv6";

// creating
let firstIPv6 = new IPv6("ffff:ffff:ffff:ffff:ffff:ffff:ffff:ffff") // Creating an instance using the constructor
let secondIPv6 = IPv6.fromBigInteger(bigInt("100")) // Using the fromBigInteger convenience method
let thirdIPv6 = IPv6.fromHexadecimalString(""::") // Using the fromDecimalDottedString convenience method. Not abbreviated representation of IPv6 string is supported
let fourthIPv6 = IPv6.fromBinaryString("01001010011111010010101101100011") // using the fromBinaryString convenience method
   
// converting an IPv6 instance to binary string representation
firstIPv6.toBinaryString() // will be 11111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
   
// comparing IPV6
firstIPv6.isEquals(thirdIPv6) // false
firstIPv6.isLessThan(thirdIPv6) // false
firstIPv6.isGreaterThan(thirdIPv6) // true

```

See the [IPv6 documentation](https://ip-num.github.io/ip-num/classes/_ipv6_.ipv6.html) for more information

### IPv4 Ranges
```
import {IPv4Range} from "ip-num/IPv4Range";

// creating an IPv4 range from CIDR notation
let ipv4Range = IPv4Range.fromCidr("192.198.0.0/24");

// get first and last IPv4 number in the range
ipv4Range.getFirst().toString() // gives 192.198.0.0
ipv4Range.getLast().toString() // gives 192.198.0.255

// getting number of IPv4 numbers in the range
ipv4Range.getSize() // Returns 256

// splitting ranges
ipv4Range.split()[0].toCidrString() // returns 192.198.0.0/25
ipv4Range.split()[1].toCidrString() // returns 192.198.0.128/25
```

See the [IPv4Range documentation](https://ip-num.github.io/ip-num/classes/_ipv4range_.ipv4range.html) for more information

### IPv6 Ranges
```
import {IPv6Range} from "ip-num/IPv6Range";

// creating an IPv6 range from CIDR notation
let ipv6Range = IPv6Range.fromCidr("2001:db8::/33");

// get first and last IPv6 number in the range
ipv6Range.getFirst().toString() // gives 2001:db8:0:0:0:0:0:0
ipv6Range.getLast().toString() // gives 2001:db8:7fff:ffff:ffff:ffff:ffff:ffff

// getting number of IPv6 numbers in the range
ipv6Range.getSize() // Returns 39614081257132168796771975168

// splitting ranges
ipv6Range.split()[0].toCidrString() // returns 2001:db8:0:0:0:0:0:0/34
ipv6Range.split()[1].toCidrString() // returns 2001:db8:4000:0:0:0:0:0/34
```

See the [IPv6Range documentation](https://ip-num.github.io/ip-num/classes/_ipv6range_.ipv6range.html) for more information

### IPNumber and IPRange interfaces
When working in TypeScript, you have the ability to abstract ASN, IPv4 and IPv6 as an IPNumber, and IPv4Range and 
IPv6Range as IPRange

```
// representing ASN, IPv4 and IPv6 with the IPNumber interface
let ipNumbers: IPNumber[] = [];
ipNumbers.push(new Asn("200"));
ipNumbers.push(new IPv4("133.245.233.255"));
ipNumbers.push(new IPv6("2001:800:0:0:0:0:0:2002"))

// console logs AS200
                133.245.233.255
                2001:800:0:0:0:0:0:2002
ipNumbers.forEach(ip => {
   console.log(ip.toString());
});


// representing IPv4Range and IPv6Range with the IPRange interface
let ipRanges: IPRange[] = [];
ipRanges.push(IPv4Range.fromCidr("192.198.0.0/24"));
ipRanges.push(IPv6Range.fromCidr("2001:db8::/33"));

// console logs 192.198.0.0/24
                2001:db8:0:0:0:0:0:0/33
ipRanges.forEach(iprange => {
   console.log(iprange.toCidrString());
});

```

See the [IPNumber documentation](https://ip-num.github.io/ip-num/interfaces/_interface_ipnumber_.ipnumber.html) for more information
See the [IPRange documentation](https://ip-num.github.io/ip-num/interfaces/_interface_iprange_.iprange.html) for more information

### IPv4Subnet and IPv6Subnet

IPv4Subnet and IPv6Subnet are used to represents subnets in IPv4 and IPv6 
respectively. 

Subnets are in all respects IP numbers with the only restriction that they must contain contiguous on bits (1's) 
followed by contiguous off bits (0's). This means IPv4Subnet and IPv6Subnet can perform all the operations available 
on IPv4 and IPv6. The only difference is that the invariant required for a subnet is enforced in the contructor of 
IPv4Subnet and IPv6Subnet. For example:

The following code will throw an exception:

```
import {IPv4Subnet} from 'ip-num/IPv4Subnet'
import {IPv4Subnet} from 'ip-num/IPv4Subnet'

let ipv4Subnet = new IPv4Subnet("10.255.10.3");
let ipv6Subnet = new IPv6Subnet("3ffe:1900:4545:0003:0200:f8ff:fe21:67cf");
```

While the following code works fine:

```
import {IPv4Subnet} from 'ip-num/Subnet'
import {IPv6Subnet} from 'ip-num/Subnet'

let iPv4Subnet = new IPv4Subnet("255.0.0.0");
let iPv6Subnet = new IPv6Subnet("ffff:ffff:ffff:ffff:ffff:ffff:0:0");
``` 
See the [Subnet documentation](https://ip-num.github.io/ip-num/modules/_subnet_.html) for more information

### IPv4-Mapped IPv6 Address Support
IPv4-Compatible IPv6 Address allows embedding an IPv4 address within an IPv6 address. See [IPv6 Addresses with Embedded IPv4 Addresses](https://tools.ietf.org/html/rfc4291#section-2.5.5)

`ip-num` offers various ways to create an IPv4-Compatible IPv6 Address:

##### Converting from an existing IPv4

```
import { IPv4 } from "ip-num/IPv4";

let ipv4 = new IPv4("74.125.43.99")
ipv4.toIPv4MappedIPv6().toString() // produces ::ffff:4a7d:2b63
```

##### From an existing IPv4 using convenience method on IPv6

```
import { IPv6 } from "ip-num/IPv6";

let ipv6 = IPv6.fromIPv4(new IPv4("74.125.43.99"))
ipv6.toString() // produces ::ffff:4a7d:2b63
```

##### From dot-decimal notation using convenience method on IPv6

```
import { IPv6 } from "ip-num/IPv6";

let ipv6 = IPv6.fromIPv4DotDecimalString("74.125.43.99")
ipv6.toString() // produces ::ffff:4a7d:2b63
```

### Validation and Utilities

Various validation are exposed via the `Validator` module.  `ip-num` also provide various utility operations. These 
utility operations can be found in `BinaryUtils`, `IPv6Utils`, and `HexadecimalUtils`.

For example to expand and collapse IPv6 numbers:

```
import {IPv6Utils} from 'ip-num/IPv6Utils'

// expanding
IPv6Utils.expandIPv6Number("::") // Expands to 0000:0000:0000:0000:0000:0000:0000:0000
IPv6Utils.expandIPv6Number("FF01::101")// Expands to FF01:0000:0000:0000:0000:0000:0000:0101
// collapsing
IPv6Utils.collapseIPv6Number("0000:0000:0000:0000:0000:0000:0000:0000") // Collapses to :: 
IPv6Utils.collapseIPv6Number("FF01:0:0:0:0:0:0:101") // Collapses to FF01::101
```

To check if a given string is valid cidr notation:

```
import {Validator} from 'ip-num/Validator'

let result = Validator.isValidIPv4CidrNotation("123.234.334.23")
// result => [false, ["Cidr notation should be in the form [ip number]/[range]"]]
let result = Validator.isValidIPv4CidrNotation("10.0.0.0/8")
// result => [true, []]
``` 
See the [Validator documentation](https://ip-num.github.io/ip-num/classes/_validator_.validator.html) for more information
See the [BinaryUtils documentation](https://ip-num.github.io/ip-num/modules/_binaryutils_.html) for more information
See the [IPv6Utils documentation](https://ip-num.github.io/ip-num/modules/_ipv6utils_.html) for more information
See the [HexadecimalUtils documentation](https://ip-num.github.io/ip-num/modules/_hexadecimalutils_.html) for more information

License
------------------
The `ip-num` library is released under the MIT license

Contributing
------------------

To discuss a new feature or ask a question, open an issue. Find the issue tracker [here](https://github.com/ip-num/ip-num/issues)

Found a bug and you want to provide a fix for it? Then feel free to submit a pull request. It will be appreciated if the changes made are backed with tests.

Change log
------------------
##### v1.1.0
* Fixed isValidIPv4String() incorrectly returns true for some invalid addresses. [Issue #9](https://github.com/ip-num/ip-num/issues/9)
* Improved Validator.isValidIPv6String and added test coverage. [Issue #10](https://github.com/ip-num/ip-num/issues/10)
* Added convenient methods for creating IPv4 (`IPv4.fromBinaryString`) and IPv6 (`IPv6.fromBinaryString`) from binary string [Issue #11](https://github.com/ip-num/ip-num/issues/11)
* Added convenient methods for creating ASN (`ASN.fromBinaryString`) [Issue #13](https://github.com/ip-num/ip-num/issues/13)
* Prepend with "::" if toString value for IPv6 has leading zeros. [Issue #12](https://github.com/ip-num/ip-num/issues/12)
* Implemented support for IPv4-Mapped IPv6 Address. [Issue #3](https://github.com/ip-num/ip-num/issues/3)

##### v1.0.1

* Renamed Subnet to SubnetMask [Issue #1](https://github.com/ip-num/ip-num/issues/1)
* Fixed the throwing of *invalid integer: NaN* when invalid IPv4 and IPv6 strings are passed to Validator
.isValidIPv4String and Validator.isValidIPv6String validators. Fixed by [saiyeek](https://github.com/saiyeek) 
[Issue #5](https://github.com/ip-num/ip-num/issues/5)
* Fixed `Validator.isValidIPv4CidrNotation` improper validation of IPv4 CIDR [Issue #6](https://github.com/ip-num/ip-num/issues/6)
