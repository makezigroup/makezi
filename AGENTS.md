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
- MAKEZI UI primitives are in `src/components/mk/` (core, marketplace, layout); salon portal and admin page bodies live in `salon-pages.tsx` / `admin-pages.tsx` with thin route files — keeps the three experiences separated but on one component set.
- Unresolved business/brand decisions are centralised in `src/lib/decisions.ts`; read defaults from there so they stay reversible.
- No backend yet: seed data in `src/lib/data.ts` is sample-only; salons, reviews, inquiries, favourites, comparison and demo login live client-side in `src/lib/app-store.tsx`; replace with Lovable Cloud (server-enforced admin role) before launch.
- Product is a discovery/review directory, not a booking platform: no booking routes or wording; business rules (compare limit, score threshold, one review per user, review validation) live in `src/lib/rules.ts` and are tested in `src/test/rules.test.ts`.
- `/salons/$slug` serves both city pages and salon profiles (city slugs are reserved); area and service pages use `$slug_` un-nested routes.
- All number/price/date display goes through `useFmt()` so the Persian/Latin digits toggle applies everywhere.
- `cn()` uses an extended tailwind-merge that knows the custom `text-{display,h1..label}` size utilities — keep it, or text colours get dropped.
- Public navigation is a shared header with a collapsible mobile menu, not a persistent bottom bar; preserve access to account, favorites, and comparison through the menu so live-site presentation does not change product behavior.
