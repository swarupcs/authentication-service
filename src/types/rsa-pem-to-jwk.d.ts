declare module "rsa-pem-to-jwk" {
    interface JwkOptions {
        use?: string;
        kid?: string;
        alg?: string;
    }

    export default function rsaPemToJwk(
        pem: string,
        meta?: JwkOptions,
        type?: "public" | "private",
    ): Record<string, unknown>; // ✅ changed from any → unknown
}
