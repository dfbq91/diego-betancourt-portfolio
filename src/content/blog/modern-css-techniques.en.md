---
title: Modern CSS techniques you should know
date: 2024-02-20
excerpt: Discover the CSS features that are transforming how we design web interfaces.
lang: en
author: Diego Betancourt
---

# Modern CSS techniques you should know

CSS has evolved tremendously in recent years. These techniques will help you write cleaner, more efficient code.

## Container Queries

Now you can create truly responsive components that react to their container size, not just the viewport.

```css
.card-container {
  container-type: inline-size;
}

@container (min-width: 400px) {
  .card {
    display: grid;
    grid-template-columns: 200px 1fr;
  }
}
```

## :has() Selector

The `:has()` selector is like an SQL query for CSS. It allows selecting elements based on their children.

```css
.card:has(img) {
  display: flex;
}

.card:has(footer) {
  background: blue;
}
```

## Subgrid

Subgrid allows child elements to participate in the parent's grid, making complex alignments easier.

```css
.parent {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
}

.child {
  grid-column: span 2;
  display: grid;
  grid-template-columns: subgrid;
}
```

## Conclusion

These features make CSS more powerful than ever. Experiment with them in your projects!
