# Frontend Best Practices and Refactor Guide

This document is the single source of truth for how to keep the iD+ by Mhawer dashboard clean, readable, and easy to extend.

The goal is not to rewrite the product. The goal is to keep the current design language, RTL/LTR support, next-intl localization, and glassmorphism look while making the codebase easier to maintain as the dashboard grows.

## What I Reviewed

I reviewed the main app shell, shared components, and the feature pages that currently carry the most complexity:

- `src/app/[locale]/layout.js`
- `src/components/Sidebar.js`
- `src/components/TopNavbar.js`
- `src/components/Dashboard.js`
- `src/components/DemoStoreProvider.js`
- `src/app/[locale]/employees/page.js`
- `src/app/[locale]/approvals/page.js`
- `src/app/[locale]/templates/page.js`
- `src/app/[locale]/leads/page.js`
- `src/app/[locale]/settings/page.js`
- `src/app/[locale]/globals.css`
- `messages/en.json`
- `messages/ar.json`
- `src/i18n/routing.js`

## Current Strengths

The codebase already has a good foundation:

- Next.js App Router is used correctly.
- Locale-aware routing and document direction are already in place.
- next-intl is already namespaced and consistent across the app.
- The design language is cohesive and premium.
- The project already has a shared shell with Sidebar and TopNavbar.
- The demo store is centralized, so feature pages do not fetch random local state.

## Main Problems To Fix

The biggest maintainability issues are not business logic bugs. They are structure problems.

1. Large page components mix layout, state, copy, and markup in the same file.
2. `globals.css` contains too many responsibilities in one file.
3. Shared UI patterns such as buttons, dialogs, cards, and badges are repeated instead of being reusable components.
4. Data transformation and rendering are mixed together inside pages.
5. Some feature state lives only in the page component, which makes reuse and testing harder.
6. Visible strings are mostly localized, but a few product values and labels are still hardcoded in JSX.
7. Feature modules that should be optional can still be linked from navigation unless they are explicitly hidden.

## Principles To Follow

Use these rules for every new feature and every refactor:

- Keep route files thin. A `page.js` file should mostly compose components, not contain the entire feature.
- Put reusable UI in shared components. Put feature-specific UI in feature folders.
- Keep server components as the default. Add `use client` only where interactivity is required.
- Extract stateful logic into hooks when the same pattern appears more than once.
- Keep styles close to the component when the styling is feature-specific.
- Keep global CSS for tokens, reset styles, layout primitives, and truly shared utilities only.
- Keep all visible copy in localization files.
- Keep RTL/LTR behavior logical and consistent. Do not hardcode left/right unless there is no alternative.
- Keep hidden or unfinished features in the codebase if needed, but remove their entry points from the UI.
- Prefer composition over deeply nested conditional rendering.

## Recommended Folder Structure

The current repo can evolve into this structure without changing the product:

```text
src/
  app/
    [locale]/
      layout.js
      page.js
      employees/
      approvals/
      templates/
      leads/
      settings/
  components/
    layout/
      AppShell.js
      Sidebar.js
      TopNavbar.js
    ui/
      Button.js
      Card.js
      Dialog.js
      Input.js
      Select.js
      Textarea.js
      Badge.js
      Table.js
      EmptyState.js
    features/
      dashboard/
      employees/
      approvals/
      templates/
      crm/
  hooks/
    useDisclosure.js
    usePagination.js
    useTableFilters.js
    useDebouncedValue.js
  lib/
    demo-data.js
    chart-configs.js
    formatters.js
  styles/
    globals.css
    tokens.css
    dashboard.css
    employees.css
    approvals.css
    templates.css
```

If you do not want to move files immediately, keep the current routes and extract the new components into `src/components/features/...` first. That gives the same maintainability win without forcing a full folder migration on day one.

## Component Split Plan

### App Shell

The shell should be split into reusable pieces so layout concerns do not spread across the app:

- `AppShell`
- `Sidebar`
- `TopNavbar`
- `LanguageSwitcher`
- `ThemeProvider`
- `ToasterHost`

Keep `src/app/[locale]/layout.js` focused on providers, locale validation, and document direction only.

### Dashboard

`src/components/Dashboard.js` should be split into smaller parts:

- `DashboardHeader`
- `MetricGrid`
- `MetricCard`
- `EngagementChartCard`
- `ActivityFeedCard`
- `RegionalPerformanceCard`
- `SourceMixCard`
- `PipelineHealthCard`

Move chart data and config objects out of the render function into `lib/chart-configs.js` or a feature config file.

### Employees

`src/app/[locale]/employees/page.js` should be broken into:

- `EmployeesHeader`
- `EmployeesFilters`
- `EmployeesTable`
- `EmployeeRow`
- `EmployeeActionsMenu`
- `EmployeeFormDialog`
- `DeleteEmployeeDialog`
- `PaginationControls`

The filter logic and pagination math should live in hooks or a small feature utility rather than inside the JSX body.

### Approvals

`src/app/[locale]/approvals/page.js` should become:

- `ApprovalsTable`
- `ApprovalRow`
- `ApprovalPreviewDialog`
- `CardPreview`
- `ApprovalActions`
- `RejectReasonDialog`

The rejection flow is a good example of why reusable dialogs matter. The preview dialog and rejection dialog share shell behavior, overlay behavior, and close logic. Those should come from one dialog primitive.

### Templates

`src/app/[locale]/templates/page.js` should be split into:

- `TemplateEditorPanel`
- `BrandIdentitySection`
- `ColorPickerField`
- `DisplayedFieldsNotice`
- `CardPreviewStage`
- `FlipCardButton`

This page is visually rich, so the JSX should stay readable by moving the card rendering and control sections into child components.

### CRM / Leads

Even if the CRM entry point stays hidden for the MVP presentation, the feature code should be structured properly:

- `CrmHeader`
- `CrmViewToggle`
- `CrmKanbanBoard`
- `CrmListTable`
- `CrmLockedOverlay`

Hidden features should lose their navigation entry point, not their implementation. That keeps the route ready for later activation.

### Settings

`src/app/[locale]/settings/page.js` should eventually be split into tab sections and shared form rows:

- `SettingsTabs`
- `ProfileSettingsForm`
- `OrganizationSettingsForm`
- `AppearanceSettingsForm`
- `NotificationSettingsForm`
- `SecuritySettingsForm`
- `DelegationTable`

## Shared UI Primitives To Create

These are the most valuable reusable pieces for this repo:

- `Button`
- `IconButton`
- `Dialog`
- `Input`
- `Textarea`
- `Select`
- `Card`
- `Badge`
- `Table`
- `EmptyState`
- `PageHeader`
- `SectionHeader`
- `StatusPill`
- `ConfirmDialog`

When these primitives exist, feature pages become much easier to scan because they only describe layout and behavior.

## State And Logic Rules

- Keep derived state out of JSX when it can be named in a variable or hook.
- Move filter, search, and pagination logic into hooks when the pattern repeats.
- Use a reducer or feature store when state transitions become more complex than simple `useState` calls.
- Keep demo data in one place, preferably in `lib/demo-data.js` or a similar file.
- Keep mutation functions close to the state they update, but do not mix them with page markup.
- Prefer controlled components for complex forms and dialogs.
- Use `FormData` only when the form is simple and there is no validation state to manage.

## Styling Rules

The current visual style is strong, but the styling strategy needs more discipline.

- Keep `globals.css` for tokens, reset rules, layout shells, and shared utility classes.
- Move page-specific styles into feature styles or CSS modules.
- Avoid very large one-off style blocks inside JSX unless the value is truly dynamic.
- Prefer semantic design tokens over scattered hex values.
- If the brand direction is gold for the presentation, define gold once in a token and reuse it everywhere.
- Keep dark and light mode colors defined in variables rather than repeated inline.
- Use logical spacing and direction-aware styles so RTL and LTR both stay correct.

## Accessibility Rules

Every interactive component should meet these minimum expectations:

- Dialogs must be keyboard accessible.
- Dialogs should close on overlay click and Escape key.
- Focus should move into the dialog when it opens.
- Buttons should have clear labels and disabled states.
- Tables should use proper headers and readable empty states.
- Inputs should have labels, not only placeholders.
- Color should never be the only signal for status.

## Internationalization Rules

The repo already uses next-intl well. Keep it consistent:

- Put all visible copy in message files.
- Keep namespaces feature-based.
- Avoid hardcoded English strings in components.
- Keep Arabic copy polished and concise, not translated word-for-word.
- Use locale-aware formatting for dates, counts, and labels when those values become real data.

## Performance Rules

This is an MVP dashboard, so do the simple things first:

- Keep large static data outside the component body.
- Memoize expensive derived lists when a feature actually needs it.
- Split large charts into smaller components so the render tree is easier to reason about.
- Do not add heavy abstractions before a component actually needs them.
- Load only the code needed for the route that is currently visible.

## Refactor Order

If I were doing the cleanup in order, I would do it like this:

1. Create shared UI primitives for button, dialog, input, textarea, badge, and table.
2. Split `Dashboard.js` into metric and chart subcomponents.
3. Split `employees/page.js` into filters, table, row actions, and dialogs.
4. Split `approvals/page.js` into preview and rejection dialog components.
5. Split `templates/page.js` into editor sections and preview components.
6. Extract demo data into a separate library file.
7. Reduce `globals.css` to tokens and truly shared layout styles.
8. Move feature-specific styles into feature-scoped files.
9. Add a small test suite for the shared primitives and the dialog flows.

## What Good Looks Like

After the refactor, each page should read like this:

- The route file decides what feature component to show.
- The feature component handles layout and coordination.
- Child components handle presentation.
- Hooks handle state logic.
- Shared primitives handle repeated UI patterns.
- Localization handles all visible text.
- Styles are predictable and easy to find.

That is the standard to aim for in this repo: simple route files, reusable components, clear state boundaries, and a consistent design system.
