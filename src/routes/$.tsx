import { createFileRoute, notFound, Link } from '@tanstack/react-router'
import { Box, Flex, Text, Separator } from '@chakra-ui/react'
import { useFontSize } from '#/utils'
import { BreadcrumbRoot, BreadcrumbLink, BreadcrumbCurrentLink } from '#/components/ui/breadcrumb'
import { getCookbookFileBySlug } from '#/utils'
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
    <BreadcrumbRoot size="lg">
      {parts.map((part, i) => {
        const isLast = i === parts.length - 1
        const label = part.replace(/-/g, ' ')
        const partSlug = parts.slice(0, i + 1).join('/')
        return isLast ? (
          <BreadcrumbCurrentLink key={partSlug} fontWeight="500">{label}</BreadcrumbCurrentLink>
        ) : (
          <BreadcrumbLink key={partSlug} asChild>
            <Link to="/$" params={{ _splat: partSlug }}>{label}</Link>
          </BreadcrumbLink>
        )
      })}
    </BreadcrumbRoot>
  )
}

function RightSidebar({ slug, headings }: { slug: string; headings: NonNullable<ReturnType<typeof getCookbookFileBySlug>>['headings'] }) {
  return (
    <Flex direction="column" gap="5">
      <Graph slug={slug} />
      <Separator />
      <TableOfContents headings={headings} />
      <Separator />
      <Backlinks slug={slug} />
    </Flex>
  )
}

const H1_SIZE: Record<string, object> = {
  sm: { base: 'xl', md: '2xl' },
  md: { base: '2xl', md: '3xl' },
  lg: { base: '3xl', md: '4xl' },
}

function FilePage() {
  const { fileContent, slug } = Route.useLoaderData()
  const { size } = useFontSize()

  return (
    <Flex gap="16" align="flex-start" direction={{ base: 'column', lg: 'row' }}>
      {/* Article */}
      <Box as="article" minW={0} flex="1" w="100%">
        <Box mb="8">
          <SlugBreadcrumb slug={slug} />
          <Text
            as="h1"
            fontSize={H1_SIZE[size]}
            fontWeight="700"
            letterSpacing="-0.03em"
            lineHeight="1.15"
            mt="3"
            mb="0"
          >
            {fileContent.name}
          </Text>
        </Box>

        <Markdown html={fileContent.html} />

        {/* Right sidebar content — shown below article on mobile */}
        <Box
          display={{ base: 'block', lg: 'none' }}
          mt="10"
          pt="6"
          borderTopWidth="1px"
          borderColor="border"
        >
          <RightSidebar slug={slug} headings={fileContent.headings} />
        </Box>
      </Box>

      {/* Right sidebar — desktop only, sticky */}
      <Box
        as="aside"
        display={{ base: 'none', lg: 'block' }}
        w="220px"
        flexShrink={0}
        position="sticky"
        top="10"
        alignSelf="flex-start"
        maxH="calc(100vh - 5rem)"
        overflowY="auto"
        css={{
          scrollbarWidth: 'none',
          '&::-webkit-scrollbar': { display: 'none' },
        }}
      >
        <RightSidebar slug={slug} headings={fileContent.headings} />
      </Box>
    </Flex>
  )
}
