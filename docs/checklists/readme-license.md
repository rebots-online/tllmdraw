# README and License Update Checklist

- ✅ Create `docs/architecture/readme-license.md` with current project UUID and existing component diagram.
- ✅ Expand `README.md` with project overview, features, setup instructions, and licensing details including default copyright.
- [ ] Run `pnpm lint` to ensure formatting and linting pass. *(fails: existing lint errors in unrelated files)*
- [ ] Attempt to write architecture nodes and relationships to Neo4j using project UUID `45977b8f-64c1-4b09-94e6-6d5416521aa1`. *(connection refused)*
- [ ] Attempt to store updated `README.md` content in Postgres tagged with the same UUID. *(connection refused)*
- [ ] Attempt to embed `README.md` content with `mxbai-embed-large` and upsert into Qdrant collection keyed by the UUID. *(connection refused)*
