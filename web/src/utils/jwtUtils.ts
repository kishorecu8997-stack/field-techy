/**
 * Lightweight JWT payload decoder.
 * Decodes the Base64Url-encoded payload section of a JWT without verifying
 * the signature. Safe to use only for reading non-sensitive claims (e.g.
 * regionId, userId) on the client side, since the token itself is verified
 * by the server on every API call.
 */
export function decodeJwtPayload<T = Record<string, unknown>>(
    token: string,
): T | null {
    try {
        const parts = token.split(".");
        if (parts.length !== 3) return null;

        // Base64Url → Base64 → UTF-8
        const base64 = parts[1].replace(/-/g, "+").replace(/_/g, "/");
        const jsonStr = decodeURIComponent(
            Array.from(atob(base64))
                .map((c) => "%" + c.charCodeAt(0).toString(16).padStart(2, "0"))
                .join(""),
        );
        return JSON.parse(jsonStr) as T;
    } catch {
        return null;
    }
}

export interface JwtClientPayload {
    userId: number | string;
    email?: string;
    role: string;
    isVerified?: boolean;
    regionId?: number;
}
