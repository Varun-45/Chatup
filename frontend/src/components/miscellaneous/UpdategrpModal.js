import React, { useState } from 'react'
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    IconButton,
    useDisclosure,
    Button,
    useToast,
    Badge,
    Box,
    Center,
    Text,
    Flex,
    FormControl,
    Input,
    Skeleton,
    Spinner,
    Avatar,
} from '@chakra-ui/react'
import { CloseIcon, InfoIcon } from "@chakra-ui/icons"
import { ChatState } from '../../Context/ChatProvider'
import axios from 'axios'
import UserListItem from './UserListItem'

const UpdategrpModal = ({ fetch, setfetch, fetchmsg }) => {
    const { isOpen, onOpen, onClose } = useDisclosure()
    const { user, selectedChat, setselectedChat } = ChatState()
    const [grpname, setgrpname] = useState()
    const [srch, setsrch] = useState()
    const [srchres, setsrchres] = useState()
    const [loading, setloading] = useState()
    const [load2, setload2] = useState()
    const toast = useToast()
    const [searchQuery, setsearchQuery] = useState();

    const [searchResult, setsearchResult] = useState([])
    const handleDelete = async (x) => {
        if (selectedChat.admin._id !== user._id && x._id !== user._id) {
            toast({
                title: "Only admins can remove",
                status: "warning",
                duration: "4000",
                isClosable: true,
                position: "top-left"
            })
            return;
        }

        try {
            setloading(true);
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`
                }

            };
            const { data } = await axios.put('/api/chat/removefrmgroup', {
                chatId: selectedChat._id,
                userId: x._id,

            },
                config)
            x._id === user._id ? setselectedChat() : setselectedChat(data);
            setfetch(!fetch)
            fetchmsg()

            setloading(false)

        } catch (error) {
            toast({
                title: "Error occured",
                description: error.response.data.message,
                status: "warning",
                duration: "4000",
                isClosable: true,
                position: "top-left"
            })
        }
    }
    const handleadd = async (x) => {
        if (selectedChat.users.find((u) => u._id === x._id)) {
            toast({
                title: "User already added",
                status: "warning",
                duration: "4000",
                isClosable: true,
                position: "top-left"
            })
            return;
        }
        if (selectedChat.admin._id !== user._id) {
            toast({
                title: "Only admins can add",
                status: "warning",
                duration: "4000",
                isClosable: true,
                position: "top-left"
            })
            return;
        }
        try {
            setloading(true);
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`
                }

            };
            const { data } = await axios.put('/api/chat/addtogroup', {
                chatId: selectedChat._id,
                userId: x._id,

            },
                config)
            setselectedChat(data)
            setfetch(!fetch)
            setloading(false)

        } catch (error) {
            toast({
                title: "Error occured",
                description: error.response.data.message,
                status: "warning",
                duration: "4000",
                isClosable: true,
                position: "top-left"
            })
        }
    }
    const handleRename = async () => {
        if (!grpname) return

        try {
            setload2(true);
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`
                }
            };
            const { data } = await axios.put('/api/chat/rename', {
                chatId: selectedChat._id,
                chatName: grpname,

            },
                config)
            setselectedChat(data)
            setfetch(!fetch)
            setload2(false)
            setgrpname("")
        } catch (error) {
            toast({
                title: "Error occured",
                description: error.response.data.message,
                status: "warning",
                duration: "4000",
                isClosable: true,
                position: "top-left"
            })
        }

    }
    const handleSearch = async (query) => {
        setsearchQuery(query)
        if (!query) {
            return;
        }
        try {
            setloading(true)
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`
                }
            };
            const { data } = await axios.get(`/api/user?search=${searchQuery}`, config);
            console.log(data)
            setsearchResult(data)
            setloading(false)

        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to load the chats",
                status: "warning",
                duration: "4000",
                isClosable: true,
                position: "top-left"
            })
        }
    }
    const handleLeft = async () => {
        try {
            setloading(true);
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`
                }

            };
            const { data } = await axios.put('/api/chat/removefrmgroup', {
                chatId: selectedChat._id,
                userId: user._id,

            },
                config)
            setselectedChat();
            setfetch(!fetch)
            setloading(false)

        } catch (error) {
            toast({
                title: "Error occured",
                description: error.response.data.message,
                status: "warning",
                duration: "4000",
                isClosable: true,
                position: "top-left"
            })
        }
    }

    return (
        <div>
            <IconButton onClick={onOpen} icon={<InfoIcon />} display={{ base: 'flex' }} />
            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>{selectedChat.chatName.toUpperCase()}</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <Center flexDir={'column'}>
                            <Text fontSize={'xl'} marginBottom={3}>Users</Text>
                            <Flex flexDir={'column'}>
                                {selectedChat.users.map((doc, index) => {
                                    // return (<Badge colorScheme='green' marginLeft={'5'} borderRadius={'10'} padding={'2'}>{doc.username} <CloseIcon width={'2'} height={'2'} marginLeft={'1.5'} marginBottom={'1'} as={'button'} onClick={() => handleDelete(doc)} /></Badge>)
                                    return (
                                        <Box

                                            cursor="pointer"
                                            bg="#E8E8E8"
                                            _hover={{
                                                background: " #38B2AC",
                                                color: "White"
                                            }}
                                            w="100%"
                                            display="flex"
                                            alignItems="center"
                                            color="black"
                                            px={3}
                                            py={2}
                                            mb={2}
                                            borderRadius="lg"
                                        >
                                            <Avatar mr={2} size="sm" cursor="pointer" name={doc.username} src={doc.profile} />
                                            <Box>
                                                <Text>{doc.username}</Text>
                                                {
                                                    selectedChat.admin._id === doc._id ?
                                                        (<Text color={'green'} _hover={{

                                                            color: "White"
                                                        }}>Admin</Text>)
                                                        : ""
                                                }

                                            </Box>
                                            <CloseIcon width={'2'} height={'2'} marginLeft={3} marginBottom={'1'} as={'button'} onClick={() => handleDelete(doc)} />
                                        </Box>
                                    )
                                })}</Flex>
                            <FormControl display={'flex'} my={3}>
                                <Input
                                    placeholder='Group name'
                                    mb={3}
                                    value={grpname}
                                    onChange={(e) => setgrpname(e.target.value)} />
                                <Button
                                    variant={'solid'}
                                    colorScheme='teal'
                                    ml={1}
                                    isLoading={load2}
                                    onClick={handleRename}>Update</Button>

                            </FormControl>
                            <FormControl>
                                <Input placeholder='Add users' onChange={(e) => handleSearch(e.target.value)} />
                            </FormControl>
                            {

                                loading ? <Spinner
                                    thickness='4px'
                                    speed='0.65s'
                                    emptyColor='gray.200'
                                    color='blue.500'
                                    size='xl'
                                    mt={3}
                                /> :
                                    searchResult?.slice(0, 4).map((doc, index) => {
                                        return (
                                            <UserListItem user={doc} key={doc._id} handleFunction={(e) => handleadd(doc)} />
                                        )

                                    })
                            }

                        </Center>

                    </ModalBody>

                    <ModalFooter>
                        <Button colorScheme='red' mr={3} onClick={(e) => handleLeft(user)}>
                            Leave group
                        </Button>

                    </ModalFooter>
                </ModalContent>
            </Modal>
        </div>
    )
}

export default UpdategrpModal