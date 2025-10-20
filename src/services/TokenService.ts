import { JwtPayload, sign } from "jsonwebtoken";
import createHttpError from "http-errors";
import { Config } from "../config";
import { RefreshToken } from "../entity/RefreshToken";
import { User } from "../entity/User";
import { Repository } from "typeorm";
import fs from "fs";
import os from "os";
import path from "path";

export class TokenService {
    constructor(private refreshTokenRepository: Repository<RefreshToken>) {}
    generateAccessToken(payload: JwtPayload) {
        if (!Config.PRIVATE_KEY) {
            throw createHttpError(500, "PRIVATE_KEY is not set");
        }

        try {
            let privateKey = Config.PRIVATE_KEY;

            // Handle both escaped and real multiline PEMs
            if (privateKey.includes("\\n")) {
                privateKey = privateKey.replace(/\\n/g, "\n");
            }

            // Normalize line endings and remove hidden characters
            privateKey = privateKey.replace(/\r\n/g, "\n").replace(/\r/g, "\n");
            privateKey = privateKey.replace(/^\uFEFF/, "").trim() + "\n";

            // ✅ Write private key to a temporary file (Linux/OpenSSL-safe)
            const tmpKeyPath = path.join(
                os.tmpdir(),
                `private-${Date.now()}.pem`,
            );
            fs.writeFileSync(tmpKeyPath, privateKey, { mode: 0o600 });

            // ✅ Use the file-based key for signing (works in CI & local)
            const accessToken = sign(
                payload,
                fs.readFileSync(tmpKeyPath, "utf8"),
                {
                    algorithm: "RS256",
                    expiresIn: "1h",
                    issuer: "auth-service",
                },
            );

            // Delete temp file immediately
            fs.unlinkSync(tmpKeyPath);

            return accessToken;
        } catch (err) {
            console.error("JWT sign error:", err);
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
