# MAKEZI architecture audit

Audit baseline: 9 November 2026. Existing application retained; no product implementation changed during this audit.

## Classification

| Requirement | Status | Completion needed |
|---|---|---|
| Salon discovery and profiles | Implemented, incomplete | Server-side pagination/counts; service-specific prices; loading/retry and search continuity |
| Independent services directory and details | Missing | Managed service catalog, offering relationships, public listings/details and filters |
| Categories and locations | Implemented, incomplete | Read managed taxonomy; category service cards and inline filters; staff CRUD |
| Typed search results | Missing | Salon/service/category/city/neighborhood results with persistent search URLs |
| Homepage | Implemented, incomplete | Managed featured content, categories/services and complete database-derived counts |
| Comparison | Implemented, incomplete | Like-for-like shared-service prices; preserve one real persisted comparison, not fake history |
| About and partnership intake | Implemented, incomplete | Correct staff-mediated replies, submitting states; request search and linked conversion |
| Contact intake | Designed, nonfunctional | Current confirmation is a toast without storage; replace with persisted submissions and staff queue |
| General problem reports | Missing | Persist salon/price/content/link problems and expose staff processing |
| Authentication and recovery | Implemented, incomplete | Dedicated public recovery pages, clearer states and signed-in password change |
| Profile and settings | Implemented, incomplete | Avatar upload/display, account details; avoid unsupported privacy controls |
| Favorites, own reviews | Implemented | Preserve owner-scoped persistence; add honest loading/error states |
| Saved comparison | Implemented | One comparison per account, max three salons; no separate history exists |
| User notifications | Missing | Actual moderation/reply/report events; owner-only reads and read actions |
| Account deletion | Missing | Confirmed, tracked deletion request pending retention decision; no automatic review destruction |
| Staff salon/pricing management | Implemented, incomplete | Archive controls, filters/pagination, catalog assignment, media and SEO fields |
| Review moderation | Implemented, incomplete | Private evidence decision details/history, full-data pagination and transactional actions |
| Salon credential verification | Implemented, incomplete | Private documents, staff decisions/notes/history; remove direct evidence-free verification |
| User administration | Missing | Authorized user listing/status/roles and audited privileged mutations |
| Homepage/SEO management | Missing | Persistent configuration and public metadata from managed records |
| Staff contact/notification/audit views | Missing | Reuse existing audit and partnership notifications; add contact processing |
| FAQ, privacy, terms | Implemented, incomplete | Categorized support and factual draft explanations; legal terms remain unapproved |
| Review guidelines/verification/content policies | Missing | Dedicated linked policy pages reflecting actual rules and labelled open decisions |
| Real map | Designed, nonfunctional | Existing visual map is explicitly a schematic, not geographic navigation |

## Checked baseline

- Hosted records: 22 labelled demo salons (20 public), 96 labelled demo reviews (67 approved), 8 labelled demo partnership requests.
- Hosted application entities and RLS policies match the existing salon/review/account model; staff SELECT policy already includes drafts and archived salons.
- Visit evidence bucket is private, with a 5 MB file limit; no salon-media bucket currently exists.
- Browser visited `/`, `/salons`, `/gallery`, `/contact`, `/settings`, `/verify`: HTTP 200, no page errors observed.
- Directory checked at 440 × 807: no horizontal page overflow observed. These observations do not certify every page or signed-in flow.
- Existing four test files executed: 20 tests passed. Current preview build log: build OK.
- Historical telemetry reports module import failures; the fresh browser run did not reproduce them.

## Constraints and acceptance

Preserve brand, RTL, existing URLs, Cloud identity, owner/admin RLS and all demo boundaries. No booking, scheduling, payment or salon-owner dashboard. Never claim untested persistence or permissions as working. Existing bounded client datasets cannot support reliable full-platform counts; add server-side queries before presenting complete totals.

Official support channels, approved legal text, retention and evidence criteria remain unresolved. Keep legal copy labelled draft; use tracked deletion requests instead of automatic erasure. Public storage is currently restricted by workspace policy: investigate private media with controlled public-image delivery without exposing verification documents.

Final verification must exercise real saved data read back through public/user/staff views, denied-user permissions, private evidence access, and desktop/tablet/mobile layouts. Deliver a structured report distinguishing implemented, tested, partial and blocked work.