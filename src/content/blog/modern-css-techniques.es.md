---
title: Técnicas modernas de CSS que debes conocer
date: 2024-02-20
excerpt: Descubre las características de CSS que están transformando la forma en que diseñamos interfaces web.
lang: es
author: Diego Betancourt
---

# Técnicas modernas de CSS que debes conocer

CSS ha evolucionado enormemente en los últimos años. Estas técnicas te ayudarán a escribir código más limpio y eficiente.

## Container Queries

Ahora puedes crear componentes verdaderamente responsivos que reaccionan al tamaño de su contenedor, no solo al viewport.

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

El selector `:has()` es como una consulta SQL para CSS. Permite seleccionar elementos basados en sus hijos.

```css
.card:has(img) {
  display: flex;
}

.card:has(footer) {
  background: blue;
}
```

## Subgrid

Subgrid permite que los elementos hijos participen en el grid del padre, facilitando alineaciones complejas.

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

## Conclusión

Estas características hacen que CSS sea más poderoso que nunca. ¡Experimenta con ellas en tus proyectos!
