import { useRef, useState, useMemo } from 'react'
import { Link, useRouterState } from '@tanstack/react-router'
import {
  Link as ChakraLink,
  Box,
  Flex,
  Text,
  TreeView,
  createTreeCollection,
  Highlight,
  useFilter,
  IconButton,
} from '@chakra-ui/react'
import { ColorModeButton } from '#/components/ui/color-mode'
import { Tooltip } from '#/components/ui/tooltip'
import { FontSizeToggle } from '#/components/FontSizeToggle'
import { useFontSize, UI_FONT_SIZE, useNav } from '#/utils'
import type { CookbookSection } from '#/utils'
import { LuGithub, LuSearch, LuX, LuChevronRight, LuFileText } from 'react-icons/lu'

// ── Types ───────────────────────────────────────────────────────────────────

interface NavNode {
  id: string
  name: string
  slug?: string | null
  tags?: string[]
  children?: NavNode[]
}

// ── Build tree collection from nav sections ──────────────────────────────────

function buildCollection(sections: CookbookSection[]) {
  const children: NavNode[] = sections.map((section) => {
    if (section.files.length === 0) {
      return { id: section.slug, name: section.name, slug: section.indexSlug ?? section.slug }
    }
    return {
      id: section.slug,
      name: section.name,
      slug: section.indexSlug,
      children: section.files.map((f) => ({ id: f.slug, name: f.name, slug: f.slug, tags: f.tags })),
    }
  })

  return createTreeCollection<NavNode>({
    nodeToValue: (node) => node.id,
    nodeToString: (node) => node.name,
    rootNode: { id: 'ROOT', name: '', children },
  })
}

// ── Search box ─────────────────────────────────────────────────────────────

function SearchBox({
  value,
  onChange,
}: {
  value: string
  onChange: (v: string) => void
}) {
  const inputRef = useRef<HTMLInputElement>(null)

  return (
    <Flex
      align="center"
      gap="1.5"
      px="2.5"
      h="8"
      borderWidth="1px"
      borderColor="border"
      borderRadius="md"
      bg="bg.subtle"
      cursor="text"
      onClick={() => inputRef.current?.focus()}
      _focusWithin={{ borderColor: 'colorPalette.solid', bg: 'bg' }}
      transition="border-color 0.15s, background 0.15s"
    >
      <LuSearch size={13} style={{ flexShrink: 0, opacity: 0.5 }} />
      <input
        ref={inputRef}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Search…"
        style={{
          flex: 1,
          minWidth: 0,
          background: 'transparent',
          border: 'none',
          outline: 'none',
          fontSize: '0.75rem',
          color: 'inherit',
        }}
      />
      {value && (
        <Box
          as="button"
          onClick={(e: React.MouseEvent) => { e.stopPropagation(); onChange('') }}
          display="flex"
          alignItems="center"
          opacity={0.5}
          _hover={{ opacity: 1 }}
          flexShrink={0}
          style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, color: 'inherit' }}
        >
          <LuX size={12} />
        </Box>
      )}
    </Flex>
  )
}

// ── Section / file icons ────────────────────────────────────────────────────

const leafIcon = <LuFileText size={12} style={{ flexShrink: 0, opacity: 0.4 }} />

// ── Truncation-aware tooltip ─────────────────────────────────────────────────

function useTruncated() {
  const ref = useRef<HTMLElement | null>(null)
  const [truncated, setTruncated] = useState(false)
  const check = () => {
    if (ref.current) setTruncated(ref.current.scrollWidth > ref.current.clientWidth)
  }
  return { ref, truncated, check }
}

// ── Branch item ──────────────────────────────────────────────────────────────

function BranchItem({ node, nodeState, query, uiSize, onNavigate }: {
  node: NavNode
  nodeState: { expanded: boolean }
  query: string
  uiSize: string
  onNavigate?: () => void
}) {
  const { ref, truncated, check } = useTruncated()

  return (
    <Tooltip
      content={node.name}
      disabled={!truncated}
      positioning={{ placement: 'right' }}
      openDelay={300}
      showArrow
    >
      <TreeView.BranchControl
        cursor="pointer"
        _hover={{ bg: 'bg.subtle' }}
        borderRadius="md"
        px="2"
        py="1"
        onMouseEnter={check}
      >
        <LuChevronRight
          size={13}
          style={{
            flexShrink: 0,
            opacity: 0.5,
            transform: nodeState.expanded ? 'rotate(90deg)' : 'rotate(0deg)',
            transition: 'transform 0.15s',
          }}
        />
        <TreeView.BranchText
          ref={ref as React.Ref<HTMLElement>}
          fontSize={uiSize}
          fontWeight="500"
          truncate
          transition="font-size 0.15s ease"
        >
          {node.slug ? (
            <Link
              to="/$"
              params={{ _splat: node.slug }}
              onClick={(e) => { e.stopPropagation(); onNavigate?.() }}
              style={{ flex: 1, minWidth: 0 }}
            >
              <Highlight ignoreCase query={[query]} styles={{ bg: 'yellow.muted', color: 'yellow.fg', px: '0.5', borderRadius: 'sm', fontWeight: '600' }}>
                {node.name}
              </Highlight>
            </Link>
          ) : (
            <Highlight ignoreCase query={[query]} styles={{ bg: 'yellow.muted', color: 'yellow.fg', px: '0.5', borderRadius: 'sm', fontWeight: '600' }}>
              {node.name}
            </Highlight>
          )}
        </TreeView.BranchText>
      </TreeView.BranchControl>
    </Tooltip>
  )
}

// ── Leaf item ────────────────────────────────────────────────────────────────

function LeafItem({ node, currentSlug, query, uiSize, onNavigate }: {
  node: NavNode
  currentSlug: string
  query: string
  uiSize: string
  onNavigate?: () => void
}) {
  const { ref, truncated, check } = useTruncated()
  const tags = node.tags?.filter(t => t !== 'recipe') ?? []
  const isActive = currentSlug === node.slug

  const tooltipContent = (truncated || tags.length > 0) ? (
    <Flex direction="column" gap="1.5" maxW="200px">
      {truncated && (
        <Box fontSize="xs" fontWeight="500">{node.name}</Box>
      )}
      {tags.length > 0 && (
        <Flex gap="1" flexWrap="wrap">
          {tags.map(tag => (
            <Box
              key={tag}
              as="span"
              px="1.5"
              py="0.5"
              borderRadius="sm"
              fontSize="2xs"
              fontWeight="500"
              bg="whiteAlpha.200"
              letterSpacing="0.02em"
              textTransform="capitalize"
            >
              {tag}
            </Box>
          ))}
        </Flex>
      )}
    </Flex>
  ) : undefined

  return (
    <Tooltip
      content={tooltipContent}
      disabled={!tooltipContent}
      positioning={{ placement: 'right' }}
      openDelay={300}
      showArrow
    >
      <TreeView.Item asChild>
        <Link
          to="/$"
          params={{ _splat: node.slug ?? node.id }}
          onClick={() => onNavigate?.()}
          onMouseEnter={check}
        >
          {leafIcon}
          <TreeView.ItemText
            ref={ref as React.Ref<HTMLElement>}
            fontSize={uiSize}
            fontWeight={isActive ? '500' : '400'}
            color={isActive ? 'fg' : 'fg.muted'}
            truncate
            transition="font-size 0.15s ease"
          >
            <Highlight ignoreCase query={[query]} styles={{ bg: 'yellow.muted', color: 'yellow.fg', px: '0.5', borderRadius: 'sm', fontWeight: '600' }}>
              {node.name}
            </Highlight>
          </TreeView.ItemText>
        </Link>
      </TreeView.Item>
    </Tooltip>
  )
}

// ── Nav tree ────────────────────────────────────────────────────────────────

function NavTree({
  currentSlug,
  onNavigate,
}: {
  currentSlug: string
  onNavigate?: () => void
}) {
  const { size } = useFontSize()
  const uiSize = UI_FONT_SIZE[size]
  const { contains } = useFilter({ sensitivity: 'base' })
  const { sections } = useNav()

  const baseCollection = useMemo(() => buildCollection(sections), [sections])

  const defaultExpanded = useMemo(() =>
    baseCollection.rootNode.children
      ?.filter((s) => s.children?.some((f) => f.slug === currentSlug) || s.slug === currentSlug)
      .map((s) => s.id) ?? [],
    [baseCollection, currentSlug],
  )

  const [collection, setCollection] = useState(baseCollection)
  const [expanded, setExpanded] = useState<string[]>(defaultExpanded)
  const [query, setQuery] = useState('')

  const search = (value: string) => {
    setQuery(value)
    if (!value) {
      setCollection(baseCollection)
      setExpanded(defaultExpanded)
      return
    }
    const next = baseCollection.filter((node) => contains(node.name, value))
    setCollection(next)
    setExpanded(next.getBranchValues())
  }

  return (
    <>
      <SearchBox value={query} onChange={search} />
      <Box mt={2}>
        <TreeView.Root
          collection={collection}
          animateContent
          size="sm"
          expandedValue={expanded}
          onExpandedChange={(d) => setExpanded(d.expandedValue)}
        >
          <TreeView.Tree>
            <TreeView.Node<NavNode>
              render={({ node, nodeState }) => {
                if (nodeState.isBranch) {
                  return <BranchItem node={node} nodeState={nodeState} query={query} uiSize={uiSize} onNavigate={onNavigate} />
                }
                return <LeafItem node={node} currentSlug={currentSlug} query={query} uiSize={uiSize} onNavigate={onNavigate} />
              }}
            />
          </TreeView.Tree>
        </TreeView.Root>
      </Box>
    </>
  )
}

// ── Shared nav tree ─────────────────────────────────────────────────────────

export function SidebarContent({
  currentSlug,
  onNavigate,
}: {
  currentSlug: string
  onNavigate?: () => void
}) {
  return (
    <Box
      flex="1"
      overflowY="auto"
      px="3"
      pb="6"
      css={{ scrollbarWidth: 'none', '&::-webkit-scrollbar': { display: 'none' } }}
    >
      <NavTree currentSlug={currentSlug} onNavigate={onNavigate} />
    </Box>
  )
}

// ── Desktop sidebar wrapper ─────────────────────────────────────────────────

export function Sidebar() {
  const routerState = useRouterState()
  const currentSlug = routerState.location.pathname.replace(/^\//, '')

  return (
    <Flex direction="column" h="100vh" overflow="hidden">
      <Flex px="4" pt="6" pb="3" flexShrink={0} align="flex-start" justify="space-between" gap="2">
        <Link to="/">
          <Text fontWeight="700" fontSize="lg" letterSpacing="-0.02em" lineHeight="1.2">
            Yankele's Cookbook
          </Text>
        </Link>

        <Flex align="center" gap="0.5" flexShrink={0} mt="0.5">
          <ChakraLink
            href="https://github.com/satwikShresth/cookbook"
            target="_blank"
            rel="noreferrer"
          >
            <IconButton size="xs" variant="ghost">
              <LuGithub />
            </IconButton>
          </ChakraLink>
          <ColorModeButton size="xs" variant="ghost" />
          <FontSizeToggle size="xs" />
        </Flex>
      </Flex>

      <SidebarContent currentSlug={currentSlug} />
    </Flex>
  )
}
