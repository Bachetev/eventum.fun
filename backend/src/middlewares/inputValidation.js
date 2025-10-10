// backend/src/middlewares/inputValidation.js

/**
 * Универсальный валидатор.
 * Поддерживает:
 *  - schema.parse(value)   (например, zod/yup, если решишь подключить)
 *  - schema(value) -> { value, error }  (кастомные функции)
 *  - schema(value) -> true/throws
 *
 * source: 'body' | 'query' | 'params'
 */
export function validate(schema, source = "body") {
  return (req, res, next) => {
    try {
      const value = req[source];

      if (!schema) return next();

      // Ветвь под zod/yup-подобные библиотеки
      if (typeof schema.parse === "function") {
        req[source] = schema.parse(value);
        return next();
      }

      // Ветвь под функцию-валидатор
      if (typeof schema === "function") {
        const result = schema(value);
        if (result === true || result === undefined) return next();

        if (result && typeof result === "object") {
          if (result.error) throw result.error;
          if (result.value !== undefined) req[source] = result.value;
          return next();
        }
        return next();
      }

      // По умолчанию пропускаем
      return next();
    } catch (err) {
      return res
        .status(400)
        .json({ error: "validation_error", details: err?.errors || err?.message || String(err) });
    }
  };
}
