import * as IPv6Utils from "../src/IPv6Utils";

describe('IPv6 Utils', () => {
    it('Should correctly expand abbreviated ipv6 number', () => {
        expect(IPv6Utils.expandIPv6Number("::")).toBe("0000:0000:0000:0000:0000:0000:0000:0000");
        expect(IPv6Utils.expandIPv6Number("0000:0000:0000:0000:0000:0000:0000:0000")).toBe("0000:0000:0000:0000:0000:0000:0000:0000");

        expect(IPv6Utils.expandIPv6Number("::1")).toBe("0000:0000:0000:0000:0000:0000:0000:0001");
        expect(IPv6Utils.expandIPv6Number("0000:0000:0000:0000:0000:0000:0000:0001")).toBe("0000:0000:0000:0000:0000:0000:0000:0001");

        expect(IPv6Utils.expandIPv6Number("2001:DB8::8:800:200C:417A")).toBe("2001:0DB8:0000:0000:0008:0800:200C:417A");
        expect(IPv6Utils.expandIPv6Number("2001:0DB8:0000:0000:0008:0800:200C:417A")).toBe("2001:0DB8:0000:0000:0008:0800:200C:417A");

        expect(IPv6Utils.expandIPv6Number("FF01::101")).toBe("FF01:0000:0000:0000:0000:0000:0000:0101");
        expect(IPv6Utils.expandIPv6Number("FF01:0000:0000:0000:0000:0000:0000:0101")).toBe("FF01:0000:0000:0000:0000:0000:0000:0101");

        expect(IPv6Utils.expandIPv6Number("2001:0DB8::CD30:0:0:0:0")).toBe("2001:0DB8:0000:CD30:0000:0000:0000:0000");
        expect(IPv6Utils.expandIPv6Number("2001:0DB8:0000:CD30:0000:0000:0000:0000")).toBe("2001:0DB8:0000:CD30:0000:0000:0000:0000");

        expect(IPv6Utils.expandIPv6Number("2001:0DB8:0:CD30::")).toBe("2001:0DB8:0000:CD30:0000:0000:0000:0000");
        expect(IPv6Utils.expandIPv6Number("2001:0DB8:0000:CD30:0000:0000:0000:0000")).toBe("2001:0DB8:0000:CD30:0000:0000:0000:0000");

        expect(IPv6Utils.expandIPv6Number("2001:DB8:0:CD30::")).toBe("2001:0DB8:0000:CD30:0000:0000:0000:0000");
        expect(IPv6Utils.expandIPv6Number("2001:0DB8:0000:CD30:0000:0000:0000:0000")).toBe("2001:0DB8:0000:CD30:0000:0000:0000:0000");

        expect(IPv6Utils.expandIPv6Number("2001:db8:85a3:0:0:8a2e:370:7334")).toBe("2001:0db8:85a3:0000:0000:8a2e:0370:7334");
        expect(IPv6Utils.expandIPv6Number("2001:0db8:85a3:0000:0000:8a2e:0370:7334")).toBe("2001:0db8:85a3:0000:0000:8a2e:0370:7334");

        expect(IPv6Utils.expandIPv6Number("2001:db8::2:1")).toBe("2001:0db8:0000:0000:0000:0000:0002:0001");
        expect(IPv6Utils.expandIPv6Number("2001:0db8:0000:0000:0000:0000:0002:0001")).toBe("2001:0db8:0000:0000:0000:0000:0002:0001");

        expect(IPv6Utils.expandIPv6Number("2001:0555:0001:0800::/128")).toBe("2001:0555:0001:0800:0000:0000:0000:0000/128");
        expect(IPv6Utils.expandIPv6Number("2001:0555:0001:0800:0000:0000:0000:0000/128")).toBe("2001:0555:0001:0800:0000:0000:0000:0000/128");

        expect(IPv6Utils.expandIPv6Number("2001:0470:0001:0800:0:0:0:0/128")).toBe("2001:0470:0001:0800:0000:0000:0000:0000/128");
        expect(IPv6Utils.expandIPv6Number("2001:0470:0001:0800:0000:0000:0000:0000/128")).toBe("2001:0470:0001:0800:0000:0000:0000:0000/128");

        expect(IPv6Utils.expandIPv6Number("2001:0555:0001:0800:0:0:0:0/50")).toBe("2001:0555:0001:0800:0000:0000:0000:0000/50");
        expect(IPv6Utils.expandIPv6Number("2001:0555:0001:0800:0000:0000:0000:0000/50")).toBe("2001:0555:0001:0800:0000:0000:0000:0000/50");
    });

    it('Should correctly collapse long ipv6 number', () => {
        expect(IPv6Utils.collapseIPv6Number("0000:0000:0000:0000:0000:0000:0000:0000")).toBe("::");
        expect(IPv6Utils.collapseIPv6Number("::")).toBe("::");
        expect(IPv6Utils.collapseIPv6Number("0000:0000:0000:0000:0000:0000:0000:0001")).toBe("::1");
        expect(IPv6Utils.collapseIPv6Number("::1")).toBe("::1");

        expect(IPv6Utils.collapseIPv6Number("2001:DB8:0:0:8:800:200C:417A")).toBe("2001:DB8::8:800:200C:417A");
        expect(IPv6Utils.collapseIPv6Number("2001:DB8::8:800:200C:417A")).toBe("2001:DB8::8:800:200C:417A");
        expect(IPv6Utils.collapseIPv6Number("FF01:0:0:0:0:0:0:101")).toBe("FF01::101");
        expect(IPv6Utils.collapseIPv6Number("FF01::101")).toBe("FF01::101");

        expect(IPv6Utils.collapseIPv6Number("2001:0DB8:0000:CD30:0000:0000:0000:0000")).toBe("2001:DB8:0:CD30::");
        expect(IPv6Utils.collapseIPv6Number("2001:DB8:0:CD30::")).toBe("2001:DB8:0:CD30::");
        expect(IPv6Utils.collapseIPv6Number("2001:0db8:85a3:0000:0000:8a2e:0370:7334")).toBe("2001:db8:85a3::8a2e:370:7334");
        expect(IPv6Utils.collapseIPv6Number("2001:db8:85a3::8a2e:370:7334")).toBe("2001:db8:85a3::8a2e:370:7334");
        expect(IPv6Utils.collapseIPv6Number("2001:0db8:0000:0000:0000:0000:0002:0001")).toBe("2001:db8::2:1");
        expect(IPv6Utils.collapseIPv6Number("2001:db8::2:1")).toBe("2001:db8::2:1");

        expect(IPv6Utils.collapseIPv6Number("2001:0555:0001:0800::/128")).toBe("2001:555:1:800::/128");
        expect(IPv6Utils.collapseIPv6Number("2001:555:1:800::/128")).toBe("2001:555:1:800::/128");
        expect(IPv6Utils.collapseIPv6Number("2001:0555:0001:0800::/50")).toBe("2001:555:1:800::/50");
        expect(IPv6Utils.collapseIPv6Number("2001:555:1:800::/50")).toBe("2001:555:1:800::/50");

        // GitHub Issue Cases:
        expect(IPv6Utils.collapseIPv6Number("2001:550:0:1000:0:0:9a1a:2187")).toBe("2001:550:0:1000::9a1a:2187");
        expect(IPv6Utils.collapseIPv6Number("2001:4457:0:371a:0:0:0:0")).toBe("2001:4457:0:371a::");
        expect(IPv6Utils.collapseIPv6Number("2001:550:0:1000:0:0:9a18:3c58")).toBe("2001:550:0:1000::9a18:3c58");

        // Addresses with multiple zero sequences (longest chosen, then first if tie):
        expect(IPv6Utils.collapseIPv6Number("0:0:1:2:0:0:0:3")).toBe("0:0:1:2::3");
        expect(IPv6Utils.collapseIPv6Number("1:0:0:2:0:0:0:3")).toBe("1:0:0:2::3");
        expect(IPv6Utils.collapseIPv6Number("1:0:0:0:2:0:0:3")).toBe("1::2:0:0:3");
        expect(IPv6Utils.collapseIPv6Number("0:1:0:0:0:2:0:0")).toBe("0:1::2:0:0");
        expect(IPv6Utils.collapseIPv6Number("0:0:0:1:0:0:0:2")).toBe("::1:0:0:0:2"); // Tie length 3, first chosen
        expect(IPv6Utils.collapseIPv6Number("1:0:0:0:2:3:0:0")).toBe("1::2:3:0:0");   // Longest 0:0:0 chosen
        expect(IPv6Utils.collapseIPv6Number("0:0:1:0:0:2:0:0")).toBe("::1:0:0:2:0:0"); // Tie length 2, first chosen

        // Addresses starting or ending with zero sequences:
        expect(IPv6Utils.collapseIPv6Number("0:0:0:1:2:3:4:5")).toBe("::1:2:3:4:5");
        expect(IPv6Utils.collapseIPv6Number("1:2:3:4:5:0:0:0")).toBe("1:2:3:4:5::");

        // All zeros:
        expect(IPv6Utils.collapseIPv6Number("0:0:0:0:0:0:0:0")).toBe("::");

        // No compressible zeros (single zero blocks not compressible by :: as per RFC 5952):
        expect(IPv6Utils.collapseIPv6Number("2001:db8:0:1:2:3:4:5")).toBe("2001:db8:0:1:2:3:4:5");
        expect(IPv6Utils.collapseIPv6Number("0:db8:1:2:3:4:5:6")).toBe("0:db8:1:2:3:4:5:6");
        expect(IPv6Utils.collapseIPv6Number("1:db8:2:3:4:5:6:0")).toBe("1:db8:2:3:4:5:6:0");

        // Already optimally collapsed (idempotency check):
        expect(IPv6Utils.collapseIPv6Number("2001:db8::1")).toBe("2001:db8::1");
        expect(IPv6Utils.collapseIPv6Number("1::")).toBe("1::");
        expect(IPv6Utils.collapseIPv6Number("2001:0:0:1::2")).toBe("2001:0:0:1::2");

        // Addresses with prefix:
        expect(IPv6Utils.collapseIPv6Number("2001:db8:0:0:0:0:0:0/64")).toBe("2001:db8::/64");
        expect(IPv6Utils.collapseIPv6Number("0:0:0:0:0:0:0:0/128")).toBe("::/128");
        expect(IPv6Utils.collapseIPv6Number("2001:550:0:1000:0:0:9a1a:2187/48")).toBe("2001:550:0:1000::9a1a:2187/48");
    });
});
