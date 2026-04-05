# Agent Skills Directory

This directory contains AI agent skills installed via the `skills` CLI.

## Structure

```
.agents/
└── skills/          # Actual skill files stored here
    ├── react-components/
    ├── shadcn-ui/
    └── stitch-design/
```

Other agent-specific directories (`.claude/`, `.codebuddy/`, `.continue/`, etc.) contain symlinks pointing to the skills in this directory. These symlink directories are git-ignored to keep the repository clean.

## Installed Skills

See [STITCH_SKILLS.md](../STITCH_SKILLS.md) in the root directory for detailed documentation about installed skills.

## Managing Skills

### List installed skills
```bash
npx skills list
```

### Install a new skill
```bash
npx skills add google-labs-code/stitch-skills --skill <skill-name> --yes
```

### Remove a skill
```bash
npx skills remove <skill-name>
```

### Check for updates
```bash
npx skills check
npx skills update
```

## Version Tracking

The `skills-lock.json` file in the root directory tracks installed skills and their versions, similar to `package-lock.json` for npm packages.

## Documentation

Each skill contains:
- `SKILL.md` - Main skill instructions for AI agents
- `README.md` - Human-readable documentation
- `scripts/` - Executable helper scripts
- `resources/` - Templates, guides, and reference materials
- `examples/` - Example implementations
