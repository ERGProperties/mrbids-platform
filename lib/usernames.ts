import { RESERVED_USERNAMES } from "./reserved-usernames";

const USERNAME_REGEX = /^[a-z0-9._]{3,20}$/;

export function normalizeUsername(username: string) {
  return username.trim().toLowerCase();
}

export function validateUsername(username: string) {
  const value = normalizeUsername(username);

  if (!USERNAME_REGEX.test(value)) {
    return {
      valid: false,
      message:
        "Username must be 3–20 characters and contain only letters, numbers, periods, or underscores.",
    };
  }

  if (value.startsWith(".") || value.endsWith(".")) {
    return {
      valid: false,
      message: "Username cannot begin or end with a period.",
    };
  }

  if (value.includes("..")) {
    return {
      valid: false,
      message: "Username cannot contain consecutive periods.",
    };
  }

  if (RESERVED_USERNAMES.includes(value)) {
    return {
      valid: false,
      message: "That username is reserved.",
    };
  }

  return {
    valid: true,
    message: "",
  };
}