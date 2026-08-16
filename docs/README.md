# Project documentation

This directory contains documentation that helps a reader understand, run, review, or extend the public repository.

## What is committed

- `ARCHITECTURE.md`: stable application structure and data flow.
- `EDITORIAL_GUIDE.md`: how to publish journal entries and reflections.
- `ACCESSIBILITY_AND_PRIVACY.md`: implemented accessibility and privacy principles.

These documents describe the current code. They should be updated in the same commit as a structural or policy change.

## What stays local

Working roadmaps, audit matrices, generated reports, migration notes, and one-off investigation logs stay at the repository root and are ignored by Git. They remain useful to maintainers, but publishing them would mix temporary evidence with durable documentation and could expose local paths, private media inventories, obsolete findings, or implementation noise.

The current local-only set is declared explicitly in `.gitignore`. When an internal document contains durable information, summarize the verified and still-current part in this directory instead of committing the report wholesale.

## Decision rule

Commit a Markdown file when it helps an external reader use or understand the current repository. Keep it local when it is a temporary plan, generated evidence, a private inventory, or a historical audit snapshot.
