export const passageKey = ({quote = '', prefix = '', suffix = ''}) =>
    JSON.stringify([quote, prefix, suffix])

// Rebuild ranges from text, never inject markup into the React/MDX document.
export function findPassage(root, anchor) {
    if (!root || !anchor?.quote) return null
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT)
    const nodes = []
    let text = ''
    let node
    while ((node = walker.nextNode())) {
        nodes.push({node, start: text.length})
        text += node.textContent
    }
    const matches = []
    let start = text.indexOf(anchor.quote)
    while (start >= 0) {
        if (
            (!anchor.prefix || text.slice(0, start).endsWith(anchor.prefix)) &&
            (!anchor.suffix || text.slice(start + anchor.quote.length).startsWith(anchor.suffix))
        )
            matches.push(start)
        start = text.indexOf(anchor.quote, start + 1)
    }
    // An edited or ambiguous passage stays accessible as an archived quotation.
    if (matches.length !== 1) return null
    start = matches[0]
    const end = start + anchor.quote.length
    const first = nodes.find((item) => item.start + item.node.length > start)
    const last = nodes.find((item) => item.start + item.node.length >= end)
    if (!first || !last) return null
    const range = document.createRange()
    range.setStart(first.node, start - first.start)
    range.setEnd(last.node, end - last.start)
    return range
}
