import { Link } from '@tanstack/react-router'
import { Box, Text } from '@chakra-ui/react'
import type { CookbookNav } from '#/utils/cookbook-api'

type Props = {
  slug: string
  nav: CookbookNav
}

export function Backlinks({ slug, nav }: Props) {
  const backlinkSlugs = nav.backlinks[slug] ?? []
  if (!backlinkSlugs.length) return null

  const allFiles = nav.sections.flatMap((s) => [
    ...(s.indexSlug ? [{ slug: s.indexSlug, name: s.name, isIndex: true }] : []),
    ...s.files,
  ])
  const backlinkFiles = backlinkSlugs
    .map((s) => allFiles.find((f) => f.slug === s))
    .filter(Boolean) as typeof allFiles

  return (
    <Box>
      <Text
        fontSize="xs"
        fontWeight="600"
        textTransform="uppercase"
        letterSpacing="0.08em"
        color="fg.subtle"
        mb="2.5"
      >
        Backlinks
      </Text>
      <Box display="flex" flexWrap="wrap" gap="1.5">
        {backlinkFiles.map((f) => (
          <Link key={f.slug} to="/$" params={{ _splat: f.slug }}>
            <Box
              as="span"
              display="inline-flex"
              alignItems="center"
              fontSize="xs"
              fontWeight="500"
              px="2.5"
              py="1"
              borderRadius="md"
              bg="bg.emphasized"
              color="fg.muted"
              cursor="pointer"
              transition="all 0.15s ease"
              _hover={{
                bg: 'bg.muted',
                color: 'fg',
              }}
            >
              <Box as="span" color="fg.subtle" mr="0.5">#</Box>
              {f.slug}
            </Box>
          </Link>
        ))}
      </Box>
    </Box>
  )
}
