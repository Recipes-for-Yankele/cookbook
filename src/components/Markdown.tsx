import parse, { type HTMLReactParserOptions, Element, domToReact } from 'html-react-parser'
import type { DOMNode } from 'html-react-parser'
import { Link } from '@tanstack/react-router'
import { Box } from '@chakra-ui/react'

type MarkdownProps = {
  html: string
}

export function Markdown({ html }: MarkdownProps) {
  const options: HTMLReactParserOptions = {
    replace: (domNode: DOMNode) => {
      if (!(domNode instanceof Element)) return

      if (domNode.attribs['data-wikilink']) {
        const slug = domNode.attribs['data-wikilink']
        return (
          <Link
            to="/$"
            params={{ _splat: slug }}
            style={{
              backgroundColor: 'color-mix(in srgb, var(--chakra-colors-blue-500) 12%, transparent)',
              padding: '0 0.1em',
              borderRadius: '5px',
              textDecoration: 'none',
              fontWeight: 600,
              transition: 'opacity 0.2s ease',
            }}
          >
            {domToReact(domNode.children as DOMNode[], options)}
          </Link>
        )
      }

      if ('data-wikilink-broken' in domNode.attribs) {
        return (
          <span
            style={{
              backgroundColor: 'color-mix(in srgb, var(--chakra-colors-blue-500) 12%, transparent)',
              padding: '0 0.1em',
              borderRadius: '5px',
              textDecoration: 'none',
              fontWeight: 600,
              opacity: 0.5,
              cursor: 'not-allowed',
            }}
          >
            {domToReact(domNode.children as DOMNode[], options)}
          </span>
        )
      }

      if (domNode.name === 'img') {
        return (
          <img
            {...domNode.attribs}
            loading="lazy"
            style={{ maxWidth: '100%', borderRadius: '6px', margin: '1rem 0' }}
          />
        )
      }
    },
  }

  return (
    <Box
      fontSize="1.1rem"
      lineHeight="1.85"
      css={{
        '& p, & li': { lineHeight: '1.75rem', overflowWrap: 'break-word' },
        '& h1': { fontSize: '2rem', fontWeight: 600, letterSpacing: '-0.02em', marginTop: '2.25rem', marginBottom: '1rem', lineHeight: 1.2 },
        '& h2': { fontSize: '1.4rem', fontWeight: 600, marginTop: '1.9rem', marginBottom: '1rem', letterSpacing: '-0.01em' },
        '& h3': { fontSize: '1.12rem', fontWeight: 600, marginTop: '1.62rem', marginBottom: '1rem' },
        '& h4, & h5, & h6': { fontSize: '1rem', fontWeight: 600, marginTop: '1.5rem', marginBottom: '1rem' },
        '& h1[id] > a.anchor, & h2[id] > a.anchor, & h3[id] > a.anchor, & h4[id] > a.anchor': {
          opacity: 0, transition: 'opacity 0.2s ease', fontFamily: 'ui-monospace, monospace',
          fontSize: '0.75em', marginRight: '0.4rem', textDecoration: 'none', userSelect: 'none',
        },
        '& h1[id]:hover > a.anchor, & h2[id]:hover > a.anchor, & h3[id]:hover > a.anchor, & h4[id]:hover > a.anchor': { opacity: 1 },
        '& a': { fontWeight: 600, transition: 'color 0.2s ease' },
        '& strong': { fontWeight: 600 },
        '& code': { fontSize: '0.82em', borderRadius: '3px', padding: '2px 5px', fontFamily: "ui-monospace, 'SF Mono', 'Fira Code', monospace" },
        '& pre': { borderRadius: '6px', padding: '1.1rem 1.25rem', overflowX: 'auto', fontSize: '0.82rem', lineHeight: 1.65, borderWidth: '1px' },
        '& pre code': { background: 'none', padding: 0, borderRadius: 0, fontSize: 'inherit' },
        '& blockquote': { borderLeftWidth: '3px', paddingLeft: '1.1rem', fontStyle: 'italic', marginInline: 0, margin: '1rem 0' },
        '& hr': { border: 'none', borderTopWidth: '1px', margin: '2rem 0', width: '100%' },
        '& img': { maxWidth: '100%', borderRadius: '6px', margin: '1rem 0' },
        '& ul, & ol': { paddingLeft: '1.5rem' },
        '& li:has(> input[type="checkbox"])': { listStyleType: 'none', paddingLeft: 0 },
        '& table': { width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem', margin: '1rem 0' },
        '& th': { textAlign: 'left', borderBottomWidth: '2px', padding: '0.4rem 0.7rem', fontWeight: 600 },
        '& td': { padding: '0.3rem 0.7rem', borderBottomWidth: '1px', lineHeight: '2rem' },
        '& tr:last-child td': { borderBottom: 'none' },
      }}
    >
      {parse(html, options)}
    </Box>
  )
}
