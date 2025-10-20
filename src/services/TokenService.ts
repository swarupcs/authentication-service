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
            const error = createHttpError(500, "PRIVATE_KEY is not set");
            throw error;
        }

        try {
            let privateKey = Config.PRIVATE_KEY;

            // Normalize newlines (redundant but safe)
            privateKey =
                privateKey
                    .replace(/\r\n/g, "\n")
                    .replace(/\r/g, "\n")
                    .replace(/\\n/g, "\n")
                    .replace(/^\uFEFF/, "")
                    .trim() + "\n";

            // 🧠 Add these diagnostic logs:
            console.log(
                "🔍 PRIVATE_KEY line count:",
                privateKey.split("\n").length,
            );
            console.log("🔍 First line:", privateKey.split("\n")[0]);
            console.log("🔍 Last line:", privateKey.split("\n").slice(-2)[0]);
            console.log(
                "🔍 Starts with:",
                JSON.stringify(privateKey.slice(0, 40)),
            );
            console.log("🔍 Ends with:", JSON.stringify(privateKey.slice(-40)));

            const accessToken = sign(payload, privateKey, {
                algorithm: "RS256",
                expiresIn: "1h",
                issuer: "auth-service",
            });

            return accessToken;
        } catch (err) {
            console.error("🔴 JWT sign failed:", err);
            const error = createHttpError(
                500,
                "Error while reading private key",
            );
            throw error;
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
