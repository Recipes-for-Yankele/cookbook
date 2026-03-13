import { createFileRoute } from '@tanstack/react-router'
import { Box, Center, Heading, Text } from '@chakra-ui/react'
import { getCookbookFileBySlug, cookbookNav } from '#/utils/cookbook-api'
import { Markdown } from '#/components/Markdown'

export const Route = createFileRoute('/')({
  component: IndexPage,
})

function IndexPage() {
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
        fontSize="4xl"
        fontWeight="500"
      >
        מַטְבָּח יַנְקֶלֶע
      </Heading>
      <Text
        fontSize="md"
        fontStyle="italic"
        color="fg.muted"
      >
        Yankele's Kitchen
      </Text>
      <Text color="fg.muted" fontSize="sm" maxW="sm">
        A personal collection of recipes and techniques. Pick something from the sidebar.
      </Text>
    </Center>
  )
}
