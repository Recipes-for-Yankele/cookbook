import { Link, useRouterState } from '@tanstack/react-router'
import {
  Box,
  Flex,
  Text,
  Separator,
  TreeView,
  createTreeCollection,
  Link as ChakraLink,
} from '@chakra-ui/react'
import { ColorModeButton } from '#/components/ui/color-mode'
import { cookbookNav } from '#/utils/cookbook-api'

interface NavNode {
  id: string
  name: string
  slug?: string
  children?: NavNode[]
}

function buildTreeCollection(currentPath: string) {
  const rootNode: NavNode = {
    id: 'ROOT',
    name: '',
    children: cookbookNav.sections.map((section) => {
      const listedFiles = section.files.filter((f) => !f.isIndex)

      if (listedFiles.length > 0) {
        return {
          id: section.slug,
          name: section.name,
          slug: section.indexSlug ?? undefined,
          children: listedFiles.map((file) => ({
            id: file.slug,
            name: file.name,
            slug: file.slug,
          })),
        }
      }

      return {
        id: section.slug,
        name: section.name,
        slug: section.indexSlug ?? undefined,
      }
    }),
  }

  const collection = createTreeCollection<NavNode>({
    nodeToValue: (n) => n.id,
    nodeToString: (n) => n.name,
    rootNode,
  })

  const expandedValue = cookbookNav.sections
    .filter((s) => s.files.filter((f) => !f.isIndex).length > 0)
    .map((s) => s.slug)

  const selectedValue = currentPath.startsWith('/')
    ? [currentPath.slice(1)]
    : [currentPath]

  return { collection, expandedValue, selectedValue }
}

export function Sidebar() {
  const routerState = useRouterState()
  const currentPath = routerState.location.pathname
  const { collection, expandedValue, selectedValue } = buildTreeCollection(currentPath)

  return (
    <Flex direction="column" h="100%" overflow="hidden">
      <Box px="4" py="4" flexShrink={0}>
        <ChakraLink asChild textDecoration="none">
          <Link to="/">
            <Text fontSize="sm" fontWeight="600">
              מַטְבָּח יַנְקֶלֶע
            </Text>
            <Text fontSize="xs" color="fg.muted" mt="0.5">
              Yankele's Kitchen
            </Text>
          </Link>
        </ChakraLink>
      </Box>

      <Separator />

      <Box
        flex="1"
        overflowY="auto"
        py="2"
        px="2"
      >
        <TreeView.Root
          collection={collection}
          defaultExpandedValue={expandedValue}
          selectedValue={selectedValue}
          size="sm"
          variant="subtle"
        >
          <TreeView.Tree>
            <TreeView.Node
              render={({ node, nodeState }) =>
                nodeState.isBranch ? (
                  <TreeView.BranchControl>
                    <TreeView.BranchIndicator />
                    {node.slug ? (
                      <Link to="/$" params={{ _splat: node.slug }}>
                        <ChakraLink asChild flex="1" minW={0}>
                          <TreeView.BranchText truncate>{node.name}</TreeView.BranchText>
                        </ChakraLink>
                      </Link>
                    ) : (
                      <TreeView.BranchText truncate>{node.name}</TreeView.BranchText>
                    )}
                  </TreeView.BranchControl>
                ) : (
                  <Link to="/$" params={{ _splat: node.slug! }}>
                    <TreeView.Item asChild>
                      <TreeView.ItemText truncate>{node.name}</TreeView.ItemText>
                    </TreeView.Item>
                  </Link>
                )
              }
            />
          </TreeView.Tree>
        </TreeView.Root>
      </Box>

      <Separator />

      <Flex px="4" py="2" align="center" justify="space-between" flexShrink={0}>
        <ChakraLink
          href="https://github.com/satwikShresth/cookbook"
          target="_blank"
          rel="noreferrer"
          fontSize="xs"
          color="fg.muted"
          display="flex"
          alignItems="center"
          gap="1.5"
          textDecoration="none"
        >
          <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
            <path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.167 6.839 9.49.5.09.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0 1 12 6.836a9.59 9.59 0 0 1 2.504.337c1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.163 22 16.418 22 12c0-5.523-4.477-10-10-10z" />
          </svg>
          GitHub
        </ChakraLink>
        <ColorModeButton />
      </Flex>
    </Flex>
  )
}
