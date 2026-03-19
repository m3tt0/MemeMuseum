import { httpErrorHandler } from "./httpUtils.js";

export function validatePasswordStrength(password) {
    if (typeof password !== "string") {
        throw httpErrorHandler(400, "Password must be a string");
    }

    const normalizedPassword = password.trim();

    if (normalizedPassword.length < 6) {
        throw httpErrorHandler(400, "Password must be at least 6 characters long");
    }

    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d).{6,}$/;

    if (!passwordRegex.test(normalizedPassword)) {
        throw httpErrorHandler(
            400,
            "Password must contain at least 6 characters, including letters and numbers"
        );
    }
}