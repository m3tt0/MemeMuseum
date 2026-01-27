import { httpErrorHandler } from "./httpUtils.js";

export async function checkNonEmptyBodyFields(req, res, next) {
  console.log(req.headers);
  if (req.headers["content-type"] && req.headers["content-type"].includes("multipart/form-data")) {
    next();
    return;
  }

  const body = req.body;
  const regex = /^[^a-zA-Z0-9]*$/;

  for (const key in body) {
    if (body.hasOwnProperty(key) && typeof body[key] === "string") {
      const sanitizedValue = body[key].trim();

      if (regex.test(sanitizedValue)) {
        next(httpErrorHandler(400, `Field ${key} cannot be empty or contain only special characters`));
        return;
      }
      body[key] = sanitizedValue;
    }
  }
  next();
}