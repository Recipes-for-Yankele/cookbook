import { createFileRoute } from '@tanstack/react-router'
import { Box, Center, Heading, Text } from '@chakra-ui/react'
import { getCookbookFileBySlug, cookbookNav } from '#/utils'
import { Markdown } from '#/components/Markdown'
import { useFontSize } from '#/utils'

export const Route = createFileRoute('/')({
  component: IndexPage,
})

const HEADING_SIZE: Record<string, string> = { sm: '3xl', md: '4xl', lg: '5xl' }
const SUBTEXT_SIZE: Record<string, string> = { sm: 'sm', md: 'md', lg: 'lg' }

function IndexPage() {
  const { size } = useFontSize()
  const fileContent = cookbookNav.rootIndexSlug
    ? getCookbookFileBySlug('overview')
    : null

  if (fileContent) {
    return (
      <Box as="article" maxW="2xl">
        <Markdown html={fileContent.html} />
      </Box>
    )
  }

  return (
    <Center flexDirection="column" textAlign="center" py="20" gap="3">
      <Heading
        as="h1"
        fontSize={HEADING_SIZE[size]}
        fontWeight="500"
        transition="font-size 0.15s ease"
      >
        מַטְבָּח יַנְקֶלֶע
      </Heading>
      <Text
        fontSize={SUBTEXT_SIZE[size]}
        fontStyle="italic"
        color="fg.muted"
        transition="font-size 0.15s ease"
      >
        Yankele's Kitchen
      </Text>
      <Text color="fg.muted" fontSize={size} maxW="sm" transition="font-size 0.15s ease">
        A personal collection of recipes and techniques. Pick something from the sidebar.
      </Text>
    </Center>
  )
}
