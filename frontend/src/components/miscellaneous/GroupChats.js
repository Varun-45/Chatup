import React, { useState } from 'react'
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    Button,
    useDisclosure,
    useToast,
    FormControl,
    Input,
    Skeleton,
    Badge,
    Box,
} from '@chakra-ui/react'
import { ChatState } from '../../Context/ChatProvider'
import axios from 'axios'
import UserListItem from './UserListItem'
import { CloseIcon } from '@chakra-ui/icons'

const GroupChats = ({ children }) => {
    const { isOpen, onOpen, onClose } = useDisclosure()
    const [groupChat, setGroupchat] = useState()
    const [selecteduser, setselecteduser] = useState([]);
    const [searchQuery, setsearchQuery] = useState();
    const [searchResult, setsearchResult] = useState([])
    const [loading, setloading] = useState(false)
    const toast = useToast();
    const { user, chats, setChats } = ChatState()
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

    const handleSubmit = async () => {
        if (!groupChat || !selecteduser) {
            toast({
                title: "Error",
                description: "Please fill all the fields",
                status: "warning",
                duration: "4000",
                isClosable: true,
                position: "top-left"
            })
            return;
        }
        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`
                }
            };
            const { data } = await axios.post(`/api/chat/group`, {
                name: groupChat,
                users: JSON.stringify(selecteduser.map((u) => u._id))
            }, config);
            setChats([data, ...chats]);

            console.log(data, "s")
            onClose();
            toast({
                title: "New group chat created",
                status: "success",
                duration: "4000",
                isClosable: true,
                position: "top-left"
            })
        } catch (error) {
            console.log("error")
            console.log(error)
            toast({
                title: "Failed to create the chat",
                description: error.response.data,
                status: "warning",
                duration: "4000",
                isClosable: true,
                position: "top-left"
            })
        }

    }
    const handleDelete = (x) => {
        setselecteduser(selecteduser.filter(sel => sel._id !== x._id))
    }
    const handleGroup = (x) => {
        if (selecteduser.includes(x)) {
            toast({
                title: "User already added",
                status: "warning",
                duration: "4000",
                isClosable: true,
                position: "top-left"
            })
            return;
        }
        setselecteduser([...selecteduser, x])
        console.log(selecteduser)
    }
    return (
        <div>
            <>
                <span onClick={onOpen}>{children}</span>

                <Modal isOpen={isOpen} onClose={onClose} isCentered>
                    <ModalOverlay />
                    <ModalContent>
                        <ModalHeader>Create Group chat</ModalHeader>
                        <ModalCloseButton />
                        <ModalBody display={'flex'} flexDir="column" alignItems={'cemter'}>
                            <FormControl>
                                <Input placeholder='Chatname' onChange={(e) => setGroupchat(e.target.value)} marginBottom="15px" />
                                <Input placeholder='Add users' onChange={(e) => handleSearch(e.target.value)} marginBottom="15px" />
                            </FormControl>   <Box width="100%" display="flex" flexWrap={'wrap'} cursor="pointer" userSelect={'none'} marginBottom={'3'}>
                                {
                                    selecteduser.map((doc, index) => {
                                        return (
                                            <Badge colorScheme='green' marginLeft={'5'} borderRadius={'10'} padding={'2'}>{doc.username} <CloseIcon width={'2'} height={'2'} marginLeft={'1.5'} marginBottom={'1'} as={'button'} onClick={() => handleDelete(doc)} /></Badge>
                                        )

                                    })
                                }</Box>
                            {

                                loading ? <Skeleton>
                                    <div>contents wrapped</div>
                                    <div>won't be visible</div>
                                </Skeleton> :
                                    searchResult?.slice(0, 4).map((doc, index) => {
                                        return (
                                            <UserListItem user={doc} key={doc._id} handleFunction={(e) => handleGroup(doc)} />
                                        )

                                    })
                            }

                        </ModalBody>

                        <ModalFooter>
                            <Button colorScheme='blue' mr={3} onClick={handleSubmit}>
                                Create group
                            </Button>

                        </ModalFooter>
                    </ModalContent>
                </Modal>
            </>

        </div>
    )
}

export default GroupChats