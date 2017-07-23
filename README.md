To do:
- Harmonize the variable names
- Create constuctors for Ipv4 etc that allows creating an InetNumber from BigInt, Binary String
- Replace all uses of numbers to BigInteger
- Remove the use of valueOf in BigInteger...it leads to the same problem of having large numbers in numbers