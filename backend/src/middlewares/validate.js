import { validationResult } from "express-validator";

export function validate(rules = []) {
  return [
    ...(Array.isArray(rules) ? rules : [rules]),
    (req, res, next) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ error: "validation", details: errors.array() });
      }
      next();
    },
  ];
}
