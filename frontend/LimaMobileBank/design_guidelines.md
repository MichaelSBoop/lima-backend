# Lima Multibanking App - Design Guidelines

## Design Approach
**Reference-Based Approach**: Modern fintech applications (Revolut, N26, Wise, Monzo)
- Clean, trust-building interface prioritizing clarity and security
- Card-based information architecture for easy scanning
- Data visualization for financial insights
- Mobile-first responsive design

## Core Design Elements

### Typography
**Font Family**: Inter or similar modern sans-serif via Google Fonts CDN
- **Headings**: 600-700 weight, sizes: text-2xl (dashboard), text-xl (cards), text-lg (sections)
- **Body Text**: 400-500 weight, text-base for transactions, text-sm for metadata
- **Numbers/Currency**: 600 weight (tabular-nums for alignment), prominent sizing for balances
- **Labels**: 500 weight, text-xs uppercase with tracking-wide for categories

### Layout System
**Spacing Units**: Tailwind units of 3, 4, 6, and 8 (p-4, gap-6, mb-8, etc.)
- Mobile containers: px-4 with full-width cards
- Card spacing: p-6 for content, gap-4 between elements
- Section breaks: my-8 for visual rhythm
- List items: py-3 for comfortable tap targets

### Component Library

**Navigation**
- Bottom tab bar (mobile): 5 icons max, active state with accent indicator
- Top header: Logo/title left, notifications/profile right, h-16 min-height

**Cards**
- Rounded corners: rounded-2xl for primary cards
- Shadow: shadow-sm for subtle elevation
- Padding: p-6 for content areas
- White/surface background with subtle borders

**Account Cards**
- Bank logo + name header
- Large balance display (text-3xl, font-semibold)
- Account number/type (text-sm, muted)
- Card number visualization (•••• pattern)
- Action buttons: icon-only, ghost style

**Transaction List**
- Merchant icon (40x40px circle) left-aligned
- Two-line layout: merchant name (font-medium) + category (text-sm, muted)
- Amount right-aligned (font-semibold, tabular-nums)
- Dividers between items (border-b)
- Group by date with sticky headers

**Financial Goals Cards**
- Icon (24x24) with subtle background circle
- Title (text-lg, font-semibold)
- Description (text-sm, 2-3 lines)
- Selection state: border highlight + checkmark
- Vertical stack on mobile, grid on tablet+

**Charts**
- Line/area charts for spending trends
- Bar charts for category breakdowns
- Minimal grid lines, clear axis labels
- Interactive tooltips on hover/tap
- Height: h-48 to h-64

**Forms & Inputs**
- Label above input (text-sm, font-medium, mb-2)
- Input height: h-12 for comfortable mobile interaction
- Rounded: rounded-lg
- Border focus states with accent color
- Helper text below (text-xs, muted)

**Buttons**
- Primary: Full-width on mobile, px-6 py-3, rounded-lg, font-semibold
- Secondary: Outline variant, same sizing
- Icon buttons: 44x44px min-tap target
- Disabled state: reduced opacity

**Bank Selection List**
- Bank logo (48x48px) in circle
- Bank name (font-medium, text-base)
- Connection status indicator (text-xs, muted)
- Chevron right for navigation
- Tap target: min-h-16

**Onboarding Screens**
- Centered content with max-w-md
- Large illustration/graphic at top (h-64 to h-80)
- Headline (text-2xl, font-bold, text-center)
- Description (text-base, text-center, max-w-sm)
- CTA button at bottom with safe area padding

### Animations
**Minimal Motion**:
- Slide transitions between screens (300ms ease-in-out)
- Number counter animations for balance updates
- Pull-to-refresh indicator
- Card tap feedback (scale-95)
- No decorative animations

## Images
**Onboarding Illustrations**: Custom fintech illustrations showing phone mockups, financial concepts, security features
**Bank Logos**: Use actual bank logos (48x48px circles) - T-Bank, VTB, Alfa-Bank, Ozon Bank, Sberbank, etc.
**Merchant Icons**: Transaction list requires merchant/category icons (40x40px) - restaurants, shopping, transport
**No Hero Images**: This is a utility app focused on data and functionality

## Russian Localization
All interface text in Russian (Cyrillic), currency in rubles (₽), date format DD.MM.YYYY