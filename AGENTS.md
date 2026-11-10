<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

## Architecture rules
- Brand tokens live in `src/styles/mk-tokens.css` (copied from the MAKEZI Design System); `src/styles.css` maps them to Tailwind/shadcn names — change colours there, never in components.
- MAKEZI UI primitives are in `src/components/mk/` (core, marketplace, layout); admin page bodies use thin route files and the shared primitives to preserve the approved design.
- Unresolved business/brand decisions are centralised in `src/lib/decisions.ts`; read defaults from there so they stay reversible.
- Cloud Auth owns identity; Cloud tables enforce owner/admin access through RLS and a separate user_roles table; demo records are seeded idempotently into Cloud with explicit flags, never supplied by frontend arrays; demo badges, noindex and disabled contact preserve factual boundaries.
- Public SSR reads use publishable-key server functions; profile and service metadata use the same persisted record as the page to avoid fake or stale structured data.
- Visit evidence is private storage linked to a review; a database trigger requires staff-accepted evidence before a verified-visit badge can be saved.
- Product is a discovery/review directory, not a booking platform: no booking routes or wording; business rules (compare limit, score threshold, one review per user, review validation) live in `src/lib/rules.ts` and are tested in `src/test/rules.test.ts`.
- `/salons/$slug` serves both city pages and salon profiles (city slugs are reserved); area and service pages use `$slug_` un-nested routes.
- All number/price/date display goes through `useFmt()` so the Persian/Latin digits toggle applies everywhere.
- `cn()` uses an extended tailwind-merge that knows the custom `text-{display,h1..label}` size utilities — keep it, or text colours get dropped.
- Public navigation is a shared header with a collapsible mobile menu, not a persistent bottom bar; preserve access to account, favorites, and comparison through the menu so live-site presentation does not change product behavior.

- Demo seeding and removal use scripts/demo and stable identifiers, preserve non-demo rows, and never expose test credentials in source or UI.
- Independent services use service_catalog IDs shared with embedded salon offerings; preserve offering prices while catalog metadata stays centrally managed.
- Public directory filtering and result paging run in server functions; bounded Cloud page reads must be drained before deriving complete totals.
- Product context supplies persisted taxonomy/content to shared UI so staff edits reach discovery without source changes.
- Account erasure is a tracked authenticated support request until retention is approved; never automatically remove review/evidence history.
- Images live in private media storage; the public media endpoint serves only references on published salons and never avatars or evidence.
- Media policies isolate avatar folders to the caller, limit shared salon folders to persisted staff roles, and bind upload ownership to the caller; public taxonomy excludes archived rows and public site content is limited to homepage configuration.
- Salon verification requires accepted staff-reviewed private documents; review notifications derive from actual updates and honor profile notification preferences.
