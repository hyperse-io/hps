---
'@hyperse/hps-website': minor
---

Migrate the documentation website from Nextra to Fumadocs.

- Replace the Nextra theme, MDX pipeline, and route conventions with Fumadocs
  (`fumadocs-core`, `fumadocs-ui`, `fumadocs-mdx`) and a generated source tree.
- Move every docs page into `website/content/docs` with per-folder `meta.json`
  navigation, and convert Nextra-specific MDX usage (`npm2yarn` code blocks,
  icons, tabs) to their Fumadocs equivalents.
- Add a documentation root index (`/docs`) with an overview page, restoring the
  `/docs/guide/introduction` route and fixing 404s on the docs entry point.
- Enable the full Twoslash + Mermaid pipeline and port the static search
  endpoint (`/api/search`) for the `basePath` deployment under `/hps`.
- Update the GitHub Actions workflows to match the current CI standards and
  remove the obsolete, disabled Rust plugin workflow.
