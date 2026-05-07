## Why

<!-- Explain the motivation for this change. What problem does this solve? Why now? -->

## What Changes

<!-- Describe what will change. Be specific about new capabilities, modifications, or removals. -->

## Capabilities

### New Capabilities
<!-- Capabilities being introduced. Replace <name> with kebab-case identifier (e.g., user-auth, data-export, api-rate-limiting). Each creates specs/<name>/spec.md -->
- `<name>`: <brief description of what this capability covers>

### Modified Capabilities
<!-- Existing capabilities whose REQUIREMENTS are changing (not just implementation).
     Only list here if spec-level behavior changes. Each needs a delta spec file.
     Use existing spec names from ovsespec/specs/. Leave empty if no requirement changes. -->
- `<existing-name>`: <what requirement is changing>

## Impact

<!-- Affected code, APIs, dependencies, systems -->

## Team Coordination

<!-- Optional for small single-owner changes. For team/API work, keep these fields explicit. -->
- Repo / module / service: <name or unknown>
- Owner: <owner or unknown>
- Reviewer: <reviewer or unknown>
- Acceptance: <how this will be accepted>
- Rollback: <rollback path or N/A>
- Handoff: <who needs to know, and when>

## API / YAPI Contracts

<!-- Required when this change touches public API, Controller, route, DTO, request/response schema, error wrapper, or advmock. -->
- `method + path`: <GET /api/example or unknown>
- `program_name`: <program name or unknown>
- `service_id`: <service id or unknown>
- `interface_id`: <interface id, new, or unknown>
- Category: <YAPI category or unknown>
- Owner / reviewer: <owner / reviewer>
- Controller / handler: <code location or unknown>
- Request / response / wrapper: <contract summary>
- Mock / advmock: <default success, empty data, error code, permission failure, boundary cases>
- Sync status: <create/update/audit/blocker>
