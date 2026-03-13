import { createFileRoute, notFound, Link } from '@tanstack/react-router'
import { Box, Flex, Text, Breadcrumb, Separator } from '@chakra-ui/react'
import { getCookbookFileBySlug, cookbookNav } from '#/utils/cookbook-api'
import { Markdown } from '#/components/Markdown'
import { TableOfContents } from '#/components/TableOfContents'
import { Backlinks } from '#/components/Backlinks'
import { Graph } from '#/components/Graph'

export const Route = createFileRoute('/$')({
  loader: ({ params }) => {
    const slug = params._splat ?? ''
    const fileContent = getCookbookFileBySlug(slug)
    if (!fileContent) throw notFound()
    return { fileContent, slug }
  },
  component: FilePage,
  notFoundComponent: () => (
    <Text fontSize="sm" color="fg.muted">Page not found.</Text>
  ),
})

function SlugBreadcrumb({ slug }: { slug: string }) {
  const parts = slug.split('/')

  return (
    <Breadcrumb.Root size="sm" mb="6">
      <Breadcrumb.List>
        {parts.map((part, i) => {
          const isLast = i === parts.length - 1
          const label = part.replace(/-/g, ' ')
          const partSlug = parts.slice(0, i + 1).join('/')

          return (
            <Breadcrumb.Item key={partSlug}>
              {isLast ? (
                <Breadcrumb.CurrentLink>{label}</Breadcrumb.CurrentLink>
              ) : (
                <Breadcrumb.Link asChild>
                  <Link to="/$" params={{ _splat: partSlug }}>{label}</Link>
                </Breadcrumb.Link>
              )}
              {!isLast && <Breadcrumb.Separator />}
            </Breadcrumb.Item>
          )
        })}
      </Breadcrumb.List>
    </Breadcrumb.Root>
  )
}

function FilePage() {
  const { fileContent, slug } = Route.useLoaderData()

  return (
    <Flex gap="10" align="flex-start">
      <Box as="article" minW={0} flex="1">
        <SlugBreadcrumb slug={slug} />
        <Markdown html={fileContent.html} />
      </Box>

      <Box
        as="aside"
        w="180px"
        flexShrink={0}
        position="sticky"
        top="14"
        alignSelf="flex-start"
        display="flex"
        flexDirection="column"
        gap="4"
      >
        <TableOfContents headings={fileContent.headings} />
        <Separator />
        <Graph slug={slug} nav={cookbookNav} />
        <Separator />
        <Backlinks slug={slug} nav={cookbookNav} />
      </Box>
    </Flex>
  )
}
