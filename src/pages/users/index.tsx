import { useState } from "react";
import NextLink from "next/link";
import { GetServerSideProps } from "next";
import { RiAddLine, RiPencilLine } from "react-icons/ri";
import { Box, Button, Checkbox, Flex, Heading, Icon, Table, Tbody, Td, Text, Th, Thead, Tr, useBreakpointValue, Spinner, Link } from "@chakra-ui/react";

import { Header } from "../../components/Header";
import { Pagination } from "../../components/Pagination";
import { SideBar } from "../../components/SideBar";

import { queryClient } from '../../services/queryClient';

import { useUsers, getUsers } from "../../services/hooks/useUsers";

import { api } from "../../services/api";


type User = {
  id: string;
  name: string;
  email: string;
  createdAt: string;
}

interface IUserList {
  users: User[],
  totalCount: number;
}

export default function UserList({ users }: IUserList) {
  const [page, setPage] = useState(1);

  const { data, isLoading, error, isFetching } = useUsers(page, {
    initialData: users
  });

  async function handlePrefetchUser(userId: string) {
    await queryClient.prefetchQuery(['user', userId], async () => {
      const res = await api.get(`/users/${userId}`)

      return res.data
    }, {
        staleTime: 1000 * 60 * 10, // 10 minutos
      })
  }


  const isWideVersion = useBreakpointValue({
    base: false,
    lg: true,
  });

  return (
    <Box>
      <Header />

      <Flex w="100%" my="6" maxWidth={1480} mx="auto" px="6">
        <SideBar />

        <Box flex="1" borderRadius={8} bg="gray.800" p="8">
          <Flex mb="8" justify="space-between" align="center">
            <Heading size="lg" fontWeight="normal">
              Usuários
              {!isLoading && isFetching && < Spinner size="sm" color="gray.500" ml="1" />}
            </Heading>

            <NextLink href="/users/create" passHref>
              <Button
                as="a"
                size="sm"
                fontSize="sm"
                colorScheme="pink"
                leftIcon={<Icon as={RiAddLine} />}
              >
                Criar novo
              </Button>
            </NextLink>

          </Flex>

          {isLoading ? (
            <Flex justify="center" >
              <Spinner />
            </Flex>
          ) : error ? (
            <Flex justify="center">
              <Text>Falha ao obter dados dos usuários</Text>
            </Flex>
          ) : (
                <>
                  <Table colorScheme="whiteAlpha">
                    <Thead>
                      <Tr>
                        <Th px={["4", "4", "6"]} color="gray.300" width="8">
                          <Checkbox colorScheme="pink" />
                        </Th>
                        <Th>Usuários</Th>
                        {isWideVersion && <Th>Data de cadastro</Th>}
                        <Th width="8"></Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {data.users.map(user => (
                        <Tr key={user.id}>
                          <Td px={["4", "4", "6"]}>
                            <Checkbox colorScheme="pink" />
                          </Td>
                          <Td>
                            <Box>
                              <Link color='purple.400' onMouseEnter={() => handlePrefetchUser(user.id)}>
                                <Text fontWeight='bold'>{user.name}</Text>
                              </Link>
                              <Text fontWeight="sm" color="gray.300">{user.email}</Text>
                            </Box>
                          </Td>
                          {isWideVersion && <Td>{user.createdAt}</Td>}
                          <Td>
                            {
                              isWideVersion &&
                              (<Button
                                as="a"
                                size="sm"
                                fontSize="sm"
                                colorScheme="purple"
                                leftIcon={<Icon as={RiPencilLine} fontSize="16" />}
                              >
                                {isWideVersion}
                              </Button>)
                            }
                          </Td>
                        </Tr>
                      ))}
                    </Tbody>
                  </Table >
                  <Pagination
                    totalCountOfRegisters={data.totalCount}
                    currentPage={page}
                    onPageChange={setPage}
                  />
                </>
              )}


        </Box >
      </Flex >
    </Box >
  )
}

export const getServerSideProps: GetServerSideProps = async () => {
  // const { users, totalCount } = await getUsers(1);  ta dando erro somente no miragejs

  return {
    props: {
      // users, totalCount
    }
  }
} 