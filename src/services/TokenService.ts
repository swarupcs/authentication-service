import { JwtPayload, sign } from "jsonwebtoken";
import createHttpError from "http-errors";
import { Config } from "../config";
import { RefreshToken } from "../entity/RefreshToken";
import { User } from "../entity/User";
import { Repository } from "typeorm";

export class TokenService {
    constructor(private refreshTokenRepository: Repository<RefreshToken>) {}
    generateAccessToken(payload: JwtPayload) {
        let privateKey: string;
        // console.log("Config.PRIVATE_KEY", Config.PRIVATE_KEY);
        if (!Config.PRIVATE_KEY) {
            const error = createHttpError(500, "PRIVATE_KEY is not set");
            throw error;
        }

        try {
            privateKey = Config.PRIVATE_KEY;
            // 🔹 Handle both formats:
            // (1) Escaped with \n — common in GitHub Actions secrets
            // (2) Actual multiline PEM — common in local .env files
            if (privateKey.includes("\\n")) {
                privateKey = privateKey.replace(/\\n/g, "\n");
            }

            // ✅ Normalize line endings (CRLF → LF) to avoid Linux parse errors
            privateKey = privateKey.replace(/\r\n/g, "\n").replace(/\r/g, "\n");

            console.log(
                "PRIVATE_KEY (first 80 chars):",
                JSON.stringify(Config.PRIVATE_KEY?.slice(0, 80)),
            );

            console.log("private key", privateKey);

            // Optional debug (for CI verification)
            // console.log("Private key starts with:", privateKey.slice(0, 50));
            // privateKey = Config.PRIVATE_KEY?.replace(/\\n/g, "\n");

            // console.log("private Key", privateKey);
        } catch (err) {
            const error = createHttpError(
                500,
                "Error while reading private key",
            );
            throw error;
        }

        // console.log("private Key", privateKey);

        const accessToken = sign(payload, privateKey, {
            algorithm: "RS256",
            expiresIn: "1h",
            issuer: "auth-service",
        });
        return accessToken;
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
