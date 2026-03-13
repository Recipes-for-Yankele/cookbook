import { createRootRoute, Outlet } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'
import { Box, Center, Flex } from '@chakra-ui/react'
import { Sidebar } from '#/components/Sidebar'

export const Route = createRootRoute({
  component: RootLayout,
})

function RootLayout() {
  return (
    <Flex w="100%" minH="100vh">
      <Center flex="1" minW={0} alignItems="flex-start" py="14" px="8">
      <Box
        w="16rem"
        flexShrink={0}
        borderRightWidth="1px"
        borderColor="border"
        h="100vh"
        position="sticky"
        top={0}
      >
        <Sidebar />
      </Box>

        <Box ml={10} w="100%" maxW="3xl">
          <Outlet />
        </Box>
      </Center>

      <TanStackRouterDevtools position="bottom-right" />
    </Flex>
  )
}
