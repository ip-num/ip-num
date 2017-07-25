

import * as IPv6Utils from "../src/IPv6Utils";

describe('IPv6 Utils', () => {
    it('Should correctly expand abbreviated ipv6 address', () => {
        expect(IPv6Utils.expandIPv6Address("::")).toBe("0000:0000:0000:0000:0000:0000:0000:0000");
        expect(IPv6Utils.expandIPv6Address("::1")).toBe("0000:0000:0000:0000:0000:0000:0000:0001");

        expect(IPv6Utils.expandIPv6Address("2001:DB8::8:800:200C:417A")).toBe("2001:0DB8:0000:0000:0008:0800:200C:417A");
        expect(IPv6Utils.expandIPv6Address("FF01::101")).toBe("FF01:0000:0000:0000:0000:0000:0000:0101");


        expect(IPv6Utils.expandIPv6Address("2001:0DB8::CD30:0:0:0:0")).toBe("2001:0DB8:0000:CD30:0000:0000:0000:0000");
        expect(IPv6Utils.expandIPv6Address("2001:0DB8:0:CD30::")).toBe("2001:0DB8:0000:CD30:0000:0000:0000:0000");
        expect(IPv6Utils.expandIPv6Address("2001:DB8:0:CD30::")).toBe("2001:0DB8:0000:CD30:0000:0000:0000:0000");

        expect(IPv6Utils.expandIPv6Address("2001:db8:85a3:0:0:8a2e:370:7334")).toBe("2001:0db8:85a3:0000:0000:8a2e:0370:7334");
        expect(IPv6Utils.expandIPv6Address("2001:db8::2:1")).toBe("2001:0db8:0000:0000:0000:0000:0002:0001");
    });

    it('Should correctly abbreviate long ipv6 address', () => {
        expect(IPv6Utils.collapseIPv6Address("0000:0000:0000:0000:0000:0000:0000:0000")).toBe("::");
        expect(IPv6Utils.collapseIPv6Address("0000:0000:0000:0000:0000:0000:0000:0001")).toBe("::1");

        expect(IPv6Utils.collapseIPv6Address("2001:DB8:0:0:8:800:200C:417A")).toBe("2001:DB8::8:800:200C:417A");
        expect(IPv6Utils.collapseIPv6Address("FF01:0:0:0:0:0:0:101")).toBe("FF01::101");

        expect(IPv6Utils.collapseIPv6Address("2001:0DB8:0000:CD30:0000:0000:0000:0000")).toBe("2001:DB8:0:CD30::");
        expect(IPv6Utils.collapseIPv6Address("2001:0db8:85a3:0000:0000:8a2e:0370:7334")).toBe("2001:db8:85a3::8a2e:370:7334");
        expect(IPv6Utils.collapseIPv6Address("2001:0db8:0000:0000:0000:0000:0002:0001")).toBe("2001:db8::2:1");
    });
});