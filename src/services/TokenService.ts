import { JwtPayload, sign } from "jsonwebtoken";
import createHttpError from "http-errors";
import { Config } from "../config";
import { RefreshToken } from "../entity/RefreshToken";
import { User } from "../entity/User";
import { Repository } from "typeorm";

export class TokenService {
    constructor(private refreshTokenRepository: Repository<RefreshToken>) {}
    generateAccessToken(payload: JwtPayload) {
        if (!Config.PRIVATE_KEY) {
            throw createHttpError(500, "PRIVATE_KEY is not set");
        }

        try {
            let privateKey = Config.PRIVATE_KEY;

            // console.log("private key", privateKey);
            console.log("private key", privateKey);

            // ✅ Handle both escaped (\n) and real multiline PEMs
            if (privateKey.includes("\\n")) {
                privateKey = privateKey.replace(/\\n/g, "\n");
            }

            // ✅ Normalize line endings (Windows/Linux safe)
            privateKey = privateKey.replace(/\r\n/g, "\n").replace(/\r/g, "\n");

            // ✅ Ensure PEM starts/ends correctly (validation)
            privateKey = privateKey.trim();
            if (
                !privateKey.startsWith("-----BEGIN") ||
                !privateKey.endsWith("-----END RSA PRIVATE KEY-----")
            ) {
                console.error("🔴 Invalid PRIVATE_KEY format detected");
                console.error(
                    "Starts with:",
                    privateKey.slice(0, 40),
                    "...",
                    "Ends with:",
                    privateKey.slice(-40),
                );
                throw createHttpError(500, "Invalid PRIVATE_KEY format");
            }

            // ✅ Sign the token
            const accessToken = sign(payload, privateKey, {
                algorithm: "RS256",
                expiresIn: "1h",
                issuer: "auth-service",
            });

            return accessToken;
        } catch (err) {
            console.error("🔴 JWT signing failed:", err);
            console.error(
                "🔴 PRIVATE_KEY (first 100 chars):",
                JSON.stringify(Config.PRIVATE_KEY?.slice(0, 100)),
            );
            console.error(
                "🔴 PRIVATE_KEY (last 100 chars):",
                JSON.stringify(Config.PRIVATE_KEY?.slice(-100)),
            );
            throw createHttpError(500, "Error while reading private key");
        }
    }

    generateRefreshToken(payload: JwtPayload) {
        const refreshToken = sign(payload, Config.REFRESH_TOKEN_SECRET!, {
            algorithm: "HS256",
            expiresIn: "1y",
            issuer: "auth-service",
            jwtid: String(payload.id),
        });
        return refreshToken;
    }

    async persistRefreshToken(user: User) {
        const MS_IN_YEAR = 1000 * 60 * 60 * 24 * 365; // 1Y -> (Leap year)

        const newRefreshToken = await this.refreshTokenRepository.save({
            user: user,
            expiresAt: new Date(Date.now() + MS_IN_YEAR),
        });
        return newRefreshToken;
    }

    async deleteRefreshToken(tokenId: number) {
        return await this.refreshTokenRepository.delete({ id: tokenId });
    }
}
