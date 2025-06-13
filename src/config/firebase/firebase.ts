import admin from "firebase-admin";
import dotenv from "dotenv";
import * as fs from "fs";
import { resolve, join } from "path";

dotenv.config();

const credentialsPath = process.env.FIREBASE_ADMIN_CREDENTIALS;

if (!credentialsPath) {
  throw new Error("FIREBASE_ADMIN_CREDENTIALS is not set in the environment variables.");
}

const resolvedCredentialsPath = resolve(credentialsPath);

if (!fs.existsSync(resolvedCredentialsPath)) {
  throw new Error(`The credentials file does not exist at path: ${resolvedCredentialsPath}`);
}

const serviceAccount = JSON.parse(
  fs.readFileSync(resolvedCredentialsPath, "utf-8")
);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

export const auth = admin.auth();
