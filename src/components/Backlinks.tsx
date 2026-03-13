import { useState } from 'react'
import { Link } from '@tanstack/react-router'
import { Box, Link as ChakraLink, Collapsible, Icon, Text } from '@chakra-ui/react'
import type { CookbookNav } from '#/utils/cookbook-api'

type Props = {
  slug: string
  nav: CookbookNav
}

export function Backlinks({ slug, nav }: Props) {
  const [open, setOpen] = useState(true)

  const backlinkSlugs = nav.backlinks[slug] ?? []
  if (!backlinkSlugs.length) return null

  const allFiles = nav.sections.flatMap((s) => s.files)
  const backlinkFiles = backlinkSlugs
    .map((s) => allFiles.find((f) => f.slug === s))
    .filter(Boolean) as typeof allFiles

  return (
    <Collapsible.Root open={open} onOpenChange={(e) => setOpen(e.open)}>
      <Collapsible.Trigger
        display="flex"
        w="full"
        alignItems="center"
        justifyContent="space-between"
        px="2"
        py="1"
        fontSize="xs"
        fontWeight="medium"
        color="fg.muted"
        bg="transparent"
        border="none"
        cursor="pointer"
      >
        <Text>Backlinks</Text>
        <Icon boxSize="3" transform={open ? 'rotate(0deg)' : 'rotate(-90deg)'}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M6 9l6 6 6-6" />
          </svg>
        </Icon>
      </Collapsible.Trigger>
      <Collapsible.Content>
        <Box mt="1" display="flex" flexDirection="column" gap="1" px="2">
          {backlinkFiles.map((f) => (
            <ChakraLink key={f.slug} asChild fontSize="xs" color="fg.muted">
              <Link to="/$" params={{ _splat: f.slug }}>
                {f.name}
              </Link>
            </ChakraLink>
          ))}
        </Box>
      </Collapsible.Content>
    </Collapsible.Root>
  )
}
