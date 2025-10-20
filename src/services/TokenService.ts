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

            // 🔹 Normalize all line endings and escaped characters
            privateKey = privateKey
                .replace(/\r\n/g, "\n")
                .replace(/\r/g, "\n")
                .replace(/\\n/g, "\n")
                .replace(/^\uFEFF/, "")
                .trim();

            // console.log("private key", privateKey);
            // 🔹 Ensure the key has the correct headers/footers
            if (!privateKey.startsWith("-----BEGIN RSA PRIVATE KEY-----")) {
                privateKey = `-----BEGIN RSA PRIVATE KEY-----\n${privateKey}`;
            }
            if (!privateKey.endsWith("-----END RSA PRIVATE KEY-----")) {
                privateKey = `${privateKey}\n-----END RSA PRIVATE KEY-----`;
            }

            privateKey += "\n"; // Always ensure a trailing newline

            const accessToken = sign(payload, privateKey, {
                algorithm: "RS256",
                expiresIn: "1h",
                issuer: "auth-service",
            });

            return accessToken;
        } catch (err) {
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
