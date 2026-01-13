/**
 * Represents the different kinds/categories of IPv6 addresses.
 * 
 * This enum excludes deprecated address types such as:
 * - IPv4-Compatible IPv6 addresses (::/96) - deprecated RFC 4291
 * - 6to4 addresses (2002::/16) - deprecated RFC 7526
 * - Site-Local addresses (fec0::/10) - deprecated RFC 3879
 * - Teredo addresses (2001::/32) - deprecated
 * 
 * @see https://en.wikipedia.org/wiki/IPv6_address
 * @see https://www.rfc-editor.org/info/rfc4291
 */
export const enum IPv6AddressKind {
    /**
     * Unspecified address (::/128)
     * @see https://datatracker.ietf.org/doc/html/rfc4291
     */
    UNSPECIFIED = "Unspecified",
    
    /**
     * Loopback address (::1/128)
     * @see https://datatracker.ietf.org/doc/html/rfc4291
     */
    LOOPBACK = "Loopback",
    
    /**
     * Link-Local address (fe80::/10)
     * @see https://datatracker.ietf.org/doc/html/rfc4291
     */
    LINK_LOCAL = "Link-Local",
    
    /**
     * Unique Local Address (ULA) / Private address (fc00::/7, typically fd00::/8)
     * @see https://datatracker.ietf.org/doc/html/rfc4193
     */
    UNIQUE_LOCAL = "Unique Local Address",
    
    /**
     * Global Unicast address (2000::/3)
     * @see https://datatracker.ietf.org/doc/html/rfc4291
     */
    GLOBAL_UNICAST = "Global Unicast",
    
    /**
     * Documentation address (2001:db8::/32)
     * @see https://datatracker.ietf.org/doc/html/rfc3849
     */
    DOCUMENTATION = "Documentation",
    
    /**
     * Multicast address (ff00::/8)
     * @see https://datatracker.ietf.org/doc/html/rfc4291
     */
    MULTICAST = "Multicast",
    
    /**
     * IPv4-Mapped IPv6 address (::ffff:0:0/96)
     * @see https://datatracker.ietf.org/doc/html/rfc4291
     */
    IPV4_MAPPED = "IPv4-Mapped IPv6",
    
    /**
     * Discard-Only address (100::/64)
     * @see https://datatracker.ietf.org/doc/html/rfc6666
     */
    DISCARD_ONLY = "Discard-Only",
    
    /**
     * Unknown or unclassified address kind
     */
    UNKNOWN = "Unknown"
}
