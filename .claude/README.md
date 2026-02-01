# .claude Folder Guide

These files define how to build and evolve Narratai.

## Core
- `spec.md`: product spec for the current MVP
- `rules.md`: build constraints and conventions

## Supporting
- `gamification.md`: reward rules (no gamification)
- `database-schema.md`: future-only backend schema placeholder
- `adversarial_tester.prompt.md`: security and abuse testing prompt

## Planning
- `tasks.md`: roadmap and next steps
- `prompts.md`: reusable prompts for common work

## Usage

Just ask Claude in plain English. These docs provide context automatically:

- "Add a new story about X" → follows spec.md structure
- "Implement feature Y" → follows rules.md constraints
- "Debug the audio recording" → checks relevant components
- "Review this file" → checks against project conventions
