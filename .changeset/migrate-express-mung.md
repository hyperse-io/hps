---
'@hyperse/hps-srv-mock': patch
---

Replace the unmaintained `express-mung` with `express-response-middleware`.

`createJsonResTransformer` now uses `jsonMiddleware` from `express-response-middleware`
and keeps the previous behaviour of skipping error responses (`statusCode >= 400`).
`@types/express-mung` is no longer needed since the new package ships its own types.
