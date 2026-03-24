function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;")
}

function applyInlineMarkdown(value: string) {
  let result = escapeHtml(value)
  result = result.replace(/`([^`]+)`/g, "<code>$1</code>")
  result = result.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
  result = result.replace(/\*([^*]+)\*/g, "<em>$1</em>")
  result = result.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noreferrer">$1</a>')
  return result
}

export function renderMarkdown(markdown: string) {
  const lines = markdown.replace(/\r\n/g, "\n").split("\n")
  const blocks: string[] = []
  let index = 0

  while (index < lines.length) {
    const rawLine = lines[index]
    const line = rawLine.trim()

    if (!line) {
      index += 1
      continue
    }

    if (line.startsWith("```")) {
      const codeLines: string[] = []
      index += 1
      while (index < lines.length && !lines[index].trim().startsWith("```")) {
        codeLines.push(lines[index])
        index += 1
      }
      blocks.push(`<pre><code>${escapeHtml(codeLines.join("\n"))}</code></pre>`)
      index += 1
      continue
    }

    const headingMatch = line.match(/^(#{1,6})\s+(.+)$/)
    if (headingMatch) {
      const level = headingMatch[1].length
      blocks.push(`<h${level}>${applyInlineMarkdown(headingMatch[2])}</h${level}>`)
      index += 1
      continue
    }

    if (line.startsWith(">")) {
      const quoteLines: string[] = []
      while (index < lines.length && lines[index].trim().startsWith(">")) {
        quoteLines.push(lines[index].trim().replace(/^>\s?/, ""))
        index += 1
      }
      blocks.push(`<blockquote>${applyInlineMarkdown(quoteLines.join(" "))}</blockquote>`)
      continue
    }

    if (/^[-*]\s+/.test(line)) {
      const items: string[] = []
      while (index < lines.length && /^[-*]\s+/.test(lines[index].trim())) {
        items.push(`<li>${applyInlineMarkdown(lines[index].trim().replace(/^[-*]\s+/, ""))}</li>`)
        index += 1
      }
      blocks.push(`<ul>${items.join("")}</ul>`)
      continue
    }

    if (/^\d+\.\s+/.test(line)) {
      const items: string[] = []
      while (index < lines.length && /^\d+\.\s+/.test(lines[index].trim())) {
        items.push(`<li>${applyInlineMarkdown(lines[index].trim().replace(/^\d+\.\s+/, ""))}</li>`)
        index += 1
      }
      blocks.push(`<ol>${items.join("")}</ol>`)
      continue
    }

    const paragraphLines: string[] = []
    while (index < lines.length && lines[index].trim()) {
      paragraphLines.push(lines[index].trim())
      index += 1
    }
    blocks.push(`<p>${applyInlineMarkdown(paragraphLines.join(" "))}</p>`)
  }

  return blocks.join("")
}
