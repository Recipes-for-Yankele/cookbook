import { useEffect, useRef, useState } from 'react'
import { Link, Text, TreeView, createTreeCollection } from '@chakra-ui/react'
import type { MarkdownHeading } from '#/utils/markdown'

type Props = {
  headings: MarkdownHeading[]
}

interface HeadingNode {
  id: string
  text: string
  children?: HeadingNode[]
}

function buildCollection(headings: MarkdownHeading[]) {
  const children: HeadingNode[] = []

  for (const h of headings.filter((h) => h.level <= 3)) {
    if (h.level === 2) {
      children.push({ id: h.id, text: h.text, children: [] })
    } else {
      const parent = children.at(-1)
      if (parent?.children) {
        parent.children.push({ id: h.id, text: h.text })
      } else {
        children.push({ id: h.id, text: h.text })
      }
    }
  }

  return createTreeCollection<HeadingNode>({
    nodeToValue: (n) => n.id,
    nodeToString: (n) => n.text,
    rootNode: {
      id: 'ROOT',
      text: '',
      children: children.map((n) =>
        n.children?.length === 0 ? { ...n, children: undefined } : n,
      ),
    },
  })
}

export function TableOfContents({ headings }: Props) {
  const [activeId, setActiveId] = useState<string>('')
  const observerRef = useRef<IntersectionObserver | null>(null)

  useEffect(() => {
    if (!headings.length) return
    observerRef.current?.disconnect()

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id)
            break
          }
        }
      },
      { rootMargin: '0px 0px -80% 0px', threshold: 0 },
    )

    for (const h of headings) {
      const el = document.getElementById(h.id)
      if (el) observer.observe(el)
    }

    observerRef.current = observer
    return () => observer.disconnect()
  }, [headings])

  if (!headings.filter((h) => h.level <= 3).length) return null

  const collection = buildCollection(headings)
  const expandedValue = collection.rootNode.children
    ?.filter((n) => n.children?.length)
    .map((n) => n.id) ?? []

  return (
    <>
      <Text fontSize="xs" color="fg.muted">
        On this page
      </Text>
      <TreeView.Root
        collection={collection}
        defaultExpandedValue={expandedValue}
        selectedValue={[activeId]}
        size="sm"
        variant="subtle"
      >
        <TreeView.Tree>
          <TreeView.Node
            render={({ node, nodeState }) =>
              nodeState.isBranch ? (
                <TreeView.BranchControl>
                  <TreeView.BranchIndicator />
                  <Link href={`#${node.id}`} textDecoration="none">
                    {node.text}
                  </Link>
                </TreeView.BranchControl>
              ) : (
                <TreeView.Item>
                  <TreeView.ItemText>
                    <Link href={`#${node.id}`} textDecoration="none">
                      {node.text}
                    </Link>
                  </TreeView.ItemText>
                </TreeView.Item>
              )
            }
          />
        </TreeView.Tree>
      </TreeView.Root>
    </>
  )
}
