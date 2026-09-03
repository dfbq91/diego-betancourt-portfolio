import type { Plugin } from 'unified';
import type { Root, Paragraph, Html, Nodes } from 'mdast';

type CalloutType = 'note' | 'tip' | 'warning' | 'prompt';

const CALLOUT_LABELS: Record<CalloutType, string> = {
  note: 'NOTE',
  tip: 'TIP',
  warning: 'WARNING',
  prompt: 'PROMPT',
};

function isCalloutType(value: string): value is CalloutType {
  return Object.prototype.hasOwnProperty.call(CALLOUT_LABELS, value);
}

function inlineToHtml(children: Nodes[]): string {
  return children.map((c: any) => {
    switch (c.type) {
      case 'text':
        return c.value.replace(/\n/g, '<br>');
      case 'strong':
        return `<strong>${inlineToHtml(c.children)}</strong>`;
      case 'emphasis':
        return `<em>${inlineToHtml(c.children)}</em>`;
      case 'inlineCode':
        return `<code>${c.value}</code>`;
      case 'link':
        return `<a href="${c.url}">${inlineToHtml(c.children)}</a>`;
      case 'delete':
        return `<del>${inlineToHtml(c.children)}</del>`;
      case 'break':
        return '<br>';
      default:
        return '';
    }
  }).join('');
}

export const remarkCallouts: Plugin<[], Root> = () => {
  return (tree) => {
    tree.children = tree.children.map((node) => {
      if (node.type !== 'paragraph') return node;

      const p = node as Paragraph;
      const first = p.children?.[0];
      const last = p.children?.[p.children.length - 1];
      if (!first || first.type !== 'text' || !last || last.type !== 'text') return node;

      const open = first.value.match(/^:::(\w+)\s*\n/);
      if (!open) return node;

      const type = open[1].toLowerCase();
      if (!isCalloutType(type)) return node;

      if (!last.value.endsWith(':::')) return node;

      const label = CALLOUT_LABELS[type];

      const inner = inlineToHtml(p.children)
        .replace(/^:::\w+\s*<br>/i, '')
        .replace(/<br>:::$/, '')
        .trim();

      const innerHtml = inner
        .split(/<br><br>/)
        .map((para) => `<p>${para.trim()}</p>`)
        .join('');
      const finalHtml = innerHtml || `<p>${inner}</p>`;

      const htmlNode: Html = {
        type: 'html',
        value: `<aside class="callout callout-${type}" role="note"><div class="callout-label">${label}</div><div class="callout-content">${finalHtml}</div></aside>`,
      };
      return htmlNode;
    });
  };
};
