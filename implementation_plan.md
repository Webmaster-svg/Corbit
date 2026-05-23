# Make Sitecraft Templates Responsive

The user reported that the layout of the templates looks broken and squished in Edit mode when previewing them in Mobile or Tablet view. 

## Background Context
Currently, the templates (like `TechZone.tsx`) are constructed entirely using hardcoded inline React styles (e.g., `style={{ display: "flex", gridTemplateColumns: "1fr 1fr" }}`). 
Inline styles do not support CSS media queries, meaning the templates are completely static and cannot adapt to smaller screen sizes. When squeezed into a mobile view, the grid elements and flex items simply squish together or overflow, leading to a broken UI.

## Proposed Changes

To fix this properly, we need to convert the templates to use **Tailwind CSS** for layout, which natively supports responsive breakpoints (`md:`, `lg:`). We will retain inline styles *only* for the dynamic theme colors (which depend on user-selected color palettes).

We will start by refactoring the `TechZone` template as a proof-of-concept.

### `TechZone.tsx`
- **[MODIFY]** Remove hardcoded inline layout styles (`display`, `gap`, `padding`, `gridTemplateColumns`, etc.).
- **[MODIFY]** Replace them with Tailwind utility classes (e.g., `flex`, `gap-6`, `p-4`, `grid-cols-1`, `md:grid-cols-2`).
- **[MODIFY]** Add responsive navigation: Hide the main navigation links on mobile (`hidden md:flex`) and implement a mobile hamburger menu.
- **[MODIFY]** Make the grids (like Products and Testimonials) responsive: stack them vertically on mobile (`grid-cols-1`), and split them into multiple columns on tablet/desktop (`md:grid-cols-2 lg:grid-cols-4`).

> [!IMPORTANT]
> Since there are 10 different templates, rewriting all of them is a substantial task. I propose we start by fully refactoring `TechZone.tsx` to make it perfectly responsive across all devices. Once you review and approve the updated TechZone template, we can apply the same responsive approach to the other templates if desired.

## User Review Required

Does this plan sound good? If you approve, I will begin refactoring the `TechZone` template immediately.
