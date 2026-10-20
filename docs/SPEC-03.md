# SPEC-03: Cappolla's Website Design System & Pages

| | |
|---|---|
| **Studio** | meedit |
| **Client** | Cappolla's Pizza & Grill · 1857 Aversboro Rd, Garner, NC 27529 · (919) 661-4774 |
| **Design lead** | Claude (writes this spec, reviews every build) |
| **Builder** | OpenCode |
| **Owner** | Mohammad (approves every phase) |
| **Starts from** | `index.html` + `images/` from `cappollas-menu-code.zip` (the interactive menu prototype) |
| **Status** | v1, ready to build Phase 1 |

---

## 1. What we are building

A complete restaurant website, not just a menu. Five pages that share one design system:

| Page | File | Job |
|---|---|---|
| Home | `index.html` | Make people hungry in 3 seconds and send them to order or call |
| Menu | `menu.html` | The interactive menu we already built (pizza builder, cart) |
| Catering | `catering.html` | Win office and party orders: guest planner, packages, request form |
| About | `about.html` | Who Cappolla's is, the kitchen, the people |
| Contact | `contact.html` | Phone, address, hours, map link, message form |

**Later (not now):** customer accounts and saved orders in a SQL database. Every form in this spec is designed so it can connect to a database later without a redesign (see §9).

## 2. Brand direction

**Feeling:** a neighborhood pizzeria with fire and flavor. Warm, bold, friendly, a little Italian, never fancy or cold.

**Three words:** *Hot. Generous. Local.*

**Do:** big food photos, short punchy headings, real prices, one strong red button per screen.
**Don't:** stock-photo people, gradients everywhere, tiny text, more than one accent color competing, emojis as icons.

## 3. Design tokens (put these in one `:root` block in `css/tokens.css`)

### 3.1 Color

The site is dark like a pizza oven, with the Italian tricolor as the signature.

```css
:root{
  /* surfaces */
  --oven:      #17110E;  /* page background, charred brown-black */
  --crust:     #211814;  /* cards, panels */
  --crust-2:   #2A1F1A;  /* raised panels, inputs */
  --char:      #3A2C25;  /* borders, dividers */

  /* text */
  --flour:     #F6EFE8;  /* main text */
  --dough:     #BDAEA3;  /* secondary text */
  --ash:       #8F8076;  /* hints, captions (large text only) */

  /* brand */
  --sauce:     #D8333D;  /* primary action: Order, Call, Add */
  --sauce-dk:  #A8222B;  /* hover/pressed */
  --basil:     #109A55;  /* success, "Included", vegetarian */
  --mozz:      #EFE7DC;  /* tricolor white, focus rings */
  --gold:      #E8B04B;  /* stars, "Popular" badge only */

  /* sauces (from owner) */
  --sauce-regular: #B23A2E;
  --sauce-bbq:     #6B2E1F;
  --sauce-mild:    #A65324;
  --sauce-hot:     #8B3025;

  color-scheme: dark;
}
```

Rules:
- **Red is for actions only.** Never use `--sauce` for decoration or headings.
- Green means "good/included/added". Gold means "popular". Nothing else uses them.
- Body text must reach 4.5:1 contrast on `--oven` and `--crust`. `--ash` only for text 18px or larger.
- The site is dark by design. Don't build a light theme.

### 3.2 Typography

```css
:root{
  --display: "Oswald", "Arial Narrow", sans-serif;      /* headings, prices, buttons labels in caps */
  --body:    "Lato", "Helvetica Neue", Arial, sans-serif; /* everything else */
  --script:  "Kaushan Script", "Brush Script MT", cursive; /* ONE accent word per page max */
}
```

Load from Google Fonts: Oswald 500/600/700, Lato 400/700/900, Kaushan Script 400.

**Type scale** (mobile → desktop, use `clamp`):

| Token | Use | Size | Font / weight |
|---|---|---|---|
| `--t-hero` | Home hero headline | clamp(44px, 9vw, 96px) | Oswald 700, uppercase, line-height 0.95 |
| `--t-h1` | Page titles | clamp(36px, 6vw, 60px) | Oswald 700, uppercase |
| `--t-h2` | Section titles | clamp(28px, 4.5vw, 44px) | Oswald 700, uppercase |
| `--t-h3` | Card titles, item names | 19px | Lato 900 |
| `--t-body` | Paragraphs | 17px / 1.55 | Lato 400 |
| `--t-small` | Descriptions, notes | 14.5px / 1.45 | Lato 400 |
| `--t-label` | Eyebrows, size labels | 12px, letter-spacing .14em, uppercase | Lato 900 |
| `--t-price` | Prices | 20px, `tabular-nums` | Lato 700 |

- Headings use `text-wrap: balance`. Paragraphs max 65 characters wide.
- The script font is used for **one word per page**, for example *Hot* in "Hot out of the oven". Never for full sentences.

### 3.3 Spacing, shape, depth

```css
:root{
  --s1:4px; --s2:8px; --s3:12px; --s4:16px; --s5:24px; --s6:32px; --s7:48px; --s8:72px; --s9:112px;
  --radius-sm:8px; --radius:14px; --radius-lg:22px; --pill:999px;
  --shadow: 0 12px 32px rgba(0,0,0,.45);
  --max: 1160px;   /* content width */
}
```
- Space between page sections: `--s8` mobile, `--s9` desktop.
- Side gutter: at least 16px, using `padding-inline: max(16px, env(safe-area-inset-left))`.
- Use `gap` in flex/grid, not margins between siblings.

### 3.4 Signature details (what makes it Cappolla's)

1. **Tricolor rule:** the 7px green/white/red stripe under the header and under each page title. Reuse the existing `.tri` class.
2. **Price tags:** prices sit in a small "ticket" shape (rounded rectangle, `--crust-2`, Oswald numbers).
3. **Oven glow:** photo banners get a warm dark gradient from the left so white text stays readable. No other gradients on the site.
4. **Dough-ball dots:** the small red dot separator between words ("Meetings • Events • Parties").

## 4. Components (build once in `css/components.css`, reuse everywhere)

| Component | Spec |
|---|---|
| **Header** | Logo left (height 48px mobile, 60px desktop), nav center/right, red **Order now** button right. Sticky; background `--oven` at 92% with blur. On phones: logo + Order button + menu icon that opens a full-screen nav. |
| **Buttons** | Height ≥ 48px, pill shape. Primary: `--sauce` fill, white Lato 900. Secondary: transparent, 1.5px `--char` border. Ghost: text only, underline on hover. One primary button per screen area. |
| **Food card** | Photo on top (4:3), name, one-line description, "from $X" price tag, Add button. Hover: lift 2px + shadow. |
| **Photo banner** | 21:7 desktop, 16:9 mobile, oven glow gradient, title bottom-left. |
| **Badges** | Popular (gold), New (basil), Vegetarian (basil outline). Small caps, 11px. Only when the owner sets them. |
| **Stepper** | − / number / + in a pill, 44px buttons. |
| **Form fields** | Label above field (never placeholder-only), `--crust-2` fill, 1.5px `--char` border, focus ring 2px `--mozz`. Error text in `--sauce` under the field with what to fix. |
| **Cart bar** | Fixed bottom on phones, shows count + total + "View order". Appears after first add. |
| **Footer** | 3 columns desktop / stacked mobile: Visit (address, hours), Call (number as selectable text + copy button), Follow (Instagram). Bottom line: "© Cappolla's Pizza & Grill · Site by meedit". |

## 5. Pages

### 5.1 Home (`index.html`)
1. **Hero:** full-width pizza photo with oven glow. Headline: "HOT OUT OF THE OVEN" (*Hot* in script). Subline: "Pizza, wings and Italian trays in Garner, NC." Buttons: **Order online** (primary), **Call (919) 661-4774** (secondary).
2. **Quick picks:** 4 food cards (a popular pizza, wings, a tray, garlic knots) with real prices and "See full menu".
3. **Build your own pizza teaser:** split section, photo left, text right: "Your pizza, your way. Half-and-half toppings, 4 sauces." Button → `menu.html#byo`.
4. **Catering strip:** dark banner: "Feeding a crowd? Trays for 8 to 100+." Button → `catering.html`.
5. **Why Cappolla's:** 3 short points with simple line icons (no emojis): made fresh daily / family recipes / local in Garner. ⚠ owner to confirm wording.
6. **Visit us:** address, hours ⚠ owner to give hours, "Get directions" link to Google Maps.
7. Footer.

### 5.2 Menu (`menu.html`)
Move the current prototype here. Apply the new tokens and components; keep all behavior and prices exactly as they are.

### 5.3 Catering (`catering.html`)
1. Title banner: "CATERING" + "Office lunches • Meetings • Events • Parties".
2. **Guest planner** (from the prototype) at the top: number of guests → suggested trays.
3. **Packages** ⚠ owner to define, e.g. "Office Lunch for 10", "Party for 25". Until then, show trays/wings/salads with half/full prices.
4. **Catering request form:** name, phone, email, event date, time, number of guests, pickup or delivery ⚠, notes. On submit: show "Thanks! We'll call you to confirm." and show the summary to copy. **No data is sent yet** (see §9).
5. FAQ: how much notice, delivery area, minimum order ⚠ all owner answers.

### 5.4 About (`about.html`)
Story section with a big kitchen/storefront photo, 2–3 short paragraphs ⚠ owner to give the story, a team photo if available. Keep it short.

### 5.5 Contact (`contact.html`)
Phone (big, selectable, copy button), address, hours, "Get directions" link, contact form (name, phone, message). Same "not sent yet" rule.

## 6. Photos

- All food photos are the owner's own, shot on the Canon EOS 800D (see the photo guide).
- Export: JPG, 1600px long side for banners, 900px for cards, quality 80, under 250 KB each.
- File names: `images/hero-pizza.jpg`, `images/card-wings.jpg`, etc. (lowercase, hyphens).
- Every `<img>` has `alt` text describing the food, `width`/`height` set, and `loading="lazy"` except the hero.
- Until new photos arrive, use the current ones in `images/`.

## 7. Motion

Allowed: button hover/press, card lift, cart bar slide-in, bottom-sheet slide-up, price fade, smooth scroll.
Not allowed: autoplay sliders, parallax, looping animations, text that types itself.
Everything off under `prefers-reduced-motion: reduce`.

## 8. File structure

```
cappollas-site/
  index.html  menu.html  catering.html  about.html  contact.html
  css/tokens.css  css/base.css  css/components.css  css/pages.css
  js/menu-data.js   js/pricing.js   js/cart.js   js/ui.js
  images/
  docs/  (specs, reviews)
```
- Prices and menu items live **only** in `js/menu-data.js`.
- No frameworks needed. Plain HTML, CSS, JavaScript.
- Serve locally with `python3 -m http.server 8000`.

## 9. Ready for the database later (don't build now)

Forms and the cart already shape data the way a SQL database will want it, so connecting later is easy:

| Future table | Fields the forms already collect |
|---|---|
| `customers` | name, phone, email |
| `orders` | customer, date, pickup/delivery, notes, total_cents |
| `order_items` | order, item id, variant, options, quantity, line_cents |
| `catering_requests` | customer, event date/time, guests, notes |

Rules now: every form field has a stable `name` attribute matching these columns; money is integer cents; JavaScript builds a plain object for each submission (`{name, phone, ...}`) and currently just shows it. Later, a small backend saves that same object.

## 10. Quality bar (every page)

- Works at 360px, 390px, 768px and 1280px wide. No sideways scrolling.
- Lighthouse (Firefox/Chrome dev tools): Accessibility ≥ 95, Performance ≥ 90 on desktop.
- Keyboard: every link, button and field reachable, visible focus ring.
- No console errors. All prices match `AGENTS.md`.

## 11. Build phases (one at a time, commit after each, send Claude a screenshot)

| Phase | Build | Done when |
|---|---|---|
| **1** | Folder structure, `tokens.css`, `base.css`, header, footer, buttons. An empty page per route showing header + title + footer | All 5 pages open, nav works on phone and desktop |
| **2** | Home page, all sections | Matches §5.1, passes §10 |
| **3** | Move the menu prototype into `menu.html` with the new components | All prices and pizza-builder tests still pass |
| **4** | Catering page with planner and request form | Form validates and shows the summary |
| **5** | About + Contact | Owner content in place |
| **6** | Polish: photos, motion, Lighthouse fixes | §10 fully passes |

## 12. Owner answers needed (defaults used until then)

1. Opening hours.
2. Short "about us" story (3–5 sentences).
3. Catering: notice needed, delivery yes/no and area, minimum order.
4. Which items are Popular.
5. Instagram handle for the footer.
