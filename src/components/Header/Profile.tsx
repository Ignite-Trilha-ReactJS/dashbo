import { Avatar, Box, Flex, Text } from "@chakra-ui/react"

interface IProfileProps {
  showProfileData: boolean;
}

export function Profile({ showProfileData }: IProfileProps) {
  return (
    <Flex align="center">
      {showProfileData && (
        <Box mr="4" textAlign="right">
          <Text>Douglas Santos</Text>
          <Text
            color="gray.300"
            fontSize="small"
          >
            douglassantos@email.com
        </Text>
        </Box>
      )}

      <Avatar size="md" name="Douglas Santos" src="https://avatars.githubusercontent.com/u/14297064?v=4" />
    </Flex>
  )
}