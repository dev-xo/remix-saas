import arcjet, { shield } from "@arcjet/remix";

// Base Arcjet client which can be extended with additional rules. These will
// apply to all instances of the client. See https://docs.arcjet.com
export default arcjet({
  key: process.env.ARCJET_KEY!,
  characteristics: ["ip.src"], // Track requests by IP
  rules: [
    // Shield protects your app from common attacks e.g. SQL injection
    shield({ mode: "LIVE" }),
  ],
});
