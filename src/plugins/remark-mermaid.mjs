import { visit } from 'unist-util-visit'

const ESCAPES = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;',
}

const escapeHtml = (value) => value.replace(/[&<>"']/g, (char) => ESCAPES[char])

export function remarkMermaid() {
  return (tree) => {
    visit(tree, 'code', (node) => {
      if (node.lang !== 'mermaid') return

      const source = escapeHtml(node.value)

      node.type = 'html'
      node.value = `<div class="mermaid not-content" data-status="loading" data-content="${source}"><noscript><pre>${source}</pre></noscript></div>`
    })
  }
}
