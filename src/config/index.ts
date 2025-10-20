import { config } from "dotenv";
import path from "path";

config({
    path: path.join(__dirname, `../../.env.${process.env.NODE_ENV || "dev"}`),
});

const {
    PORT,
    NODE_ENV,
    DB_HOST,
    DB_PORT,
    DB_USERNAME,
    DB_PASSWORD,
    DB_NAME,
    REFRESH_TOKEN_SECRET,
    JWKS_URI,
    // PRIVATE_KEY,
} = process.env;

let PRIVATE_KEY = `-----BEGIN RSA PRIVATE KEY-----
MIIEpAIBAAKCAQEAxEkqY07eksKmgHMFvcy8ydnhDGeZNVjx8sGpty59CZ8BIqqs
M6T7HkrJgNRi/m2FxiiLgQ3CKNlrqjUml4JMf3GcLCSkfwUrqnTU6mE0RYrF6trD
94mlm0tygbyfmgiR2tSa6bslUHM/yUo4hMccvJi7cEGjBK8P07XpLrF60v34JUMx
JeMTaE5BFQQRdwgTXObNuhmOZzWpVjEjQReSMgUSCpTbFNhsqO4K/mBpXnaWDish
S9gA1hX2eC5Hg8yZyL8lHNMjoVGyyc7NDliB4gflc+L/2iWlbnXnXZk1WOr89P9K
tnytQJh8O04M8RJ/fXPMB9Q3QNXGXdvcsQ+9mQIDAQABAoIBAAcd8QXDRxIysRdQ
tFlWqlS2S/Dnc7hptnIbIAR2kM2PwJqJbi98MKe/RfGgIcvAXFycPTyra0oQYhU8
kp7lOFFZpPQ7yuQZI6VtUYgDCMJpvvXeQ0M/MCxCjs8R8AaFf4Zb9Zb6dGanmx05
DfYQgyP6dLdkBd1mXJBMVP1erYmnX/zrNGptMvjefEOU8CpkVHetO9bdjwWesIy2
McQ2AcCOML1hlCYeaz9AXIMSy8wl7ppMFjYzz0ylLD6soOqcpVekd2MNa9wvPkPO
057PcgjhD0kh3poWLKJcOp1nQyOfemn0EDcG0ClXFSeiG/1tDlH4xWQ9IxSDT+GO
TppdZEECgYEA5LBV2nl/o4IF+cEX2JUiFoyU/Nl4wnHQdLEBhsoxdW525FJFi855
bzh6+NaSlMOvdYPkW86xbseoBcz05UovLS8ZHTW8DspEi8h/lh/l8clPsJmKlmt5
YwOdwP5ZHVrRnFPJxlrhOgX4dmx+C1JUqZZGOEoMNGrrIFYUR4pTWbkCgYEA27ot
syXYQd0FmslbS4L1mNZG7uWz2cGNllDOD7+re5bFjGHmlxWdWtNBdWJnhnNSqvqf
DrdMD7ReK0q8dS/ipb+QbWKLr0N5KPBU57ur3dFWH/xmLSkaA+26OtO5BOjIRxPW
1Ca1GODpSBEzicN5Nc8kz8Y8OGqgWe5xMNVl8uECgYEAmx+97OeznA7rzMGdUk2/
BLqxqV4/Gu6nLzCOT4dBy112CmSARlh1aOtQBxFN9tlSYI1pzpjDJNkL8XtYt1v9
6lFjYLv9Z67ulj8XxJa4nK0ogCt2pZgbi/18+dfOTSo4uyje2sz0sC4ynunzCez7
/tkvoqkf5EKOYa3iLbD33wkCgYBWYSa+Gs6ddepSI36EfQNYBkT0fdDqdjDXOwUH
I+6iM2+N9J7WHmUx44MERp80N/nzxXrqKhz4v4uVsVfNKfoL9vcsSWVojToAYhq+
zwSNu1IEWRFCB7p2eOqRXdKKn4i8iIwX8u+WzDRpZHnCWto30StDk0bxVtmbASX2
cK4XgQKBgQCjmetGYlEs3LsvZj2rZDxpFsuwAK02M3OF9TqzuwbhK4ooBfBWVPG4
ME/gSXoGlBgL0TWCIbY1Nv4aZB+WBG4G6+oGNvuq2UKMdRpns8dPEW1/Mn/SFkYN
QlFFcdfxLq6CaDiaZlmycBJ8OdCEosEydTBwvy9uPGYPo06GQOLrGg==
-----END RSA PRIVATE KEY-----`;

// Normalize the PEM
PRIVATE_KEY =
    PRIVATE_KEY.trim()
        .replace(/\r\n/g, "\n")
        .replace(/\r/g, "\n")
        .replace(/\\n/g, "\n")
        .replace(/^\uFEFF/, "") + "\n";

export const Config = {
    PORT,
    NODE_ENV,
    DB_HOST,
    DB_PORT,
    DB_USERNAME,
    DB_PASSWORD,
    DB_NAME,
    REFRESH_TOKEN_SECRET,
    JWKS_URI,
    PRIVATE_KEY,
};
