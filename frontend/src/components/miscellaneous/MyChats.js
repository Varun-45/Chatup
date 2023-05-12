import { AddIcon } from '@chakra-ui/icons'
import { useToast, Box, Button, Stack, Text } from '@chakra-ui/react'
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { ChatState } from '../../Context/ChatProvider'
import ChatLoading from './ChatLoading'
import { getSender } from './ChatLogic'
import GroupChats from './GroupChats'

const MyChats = ({ fetch }) => {
    const { user, setselectedChat, chats, setChats, selectedChat } = ChatState()
    const [loggeduser, setloggeduser] = useState()

    const toast = useToast()

    const fetchChats = async () => {
        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`
                }
            };
            const { data } = await axios.get(`/api/chat`, config);
            console.log(data)
            setChats(data);

        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to load",
                status: "warning",
                duration: "4000",
                isClosable: true,
                position: "top-left"
            })

        }
    }

    useEffect(() => {
        setloggeduser(JSON.parse(localStorage.getItem("userInfo")));
        fetchChats();
    }, [fetch])
    return (
        <Box display={{
            base: selectedChat ? "none " : "flex", md: "flex"
        }}
            flexDir="column"
            alignItems="center"
            p={3}
            bg="white"
            w={{ base: "100%", md: '31%' }}
            borderRadius='lg'
            borderWidth="1px"
        >
            <Box
                pb={3} px={3} display="flex" w="100%" justifyContent="space-between" alignItems="center" >
                Chats
                <GroupChats>
                    <Button rightIcon={<AddIcon />} display="flex" fontSize={{ base: "17px", md: "15px", lg: "17px" }}> Group chat</Button></GroupChats>
            </Box>

            <Box
                display="flex" flexDir="column" p={3} bg="#F8F8F8" w='100%' maxHeight={'93%'} borderRadius="lg" overflowY="hiddem">
                {
                    chats ?
                        (
                            <Stack overflowY="scroll">
                                {
                                    chats.map((chat) => (
                                        <Box onClick={() => setselectedChat(chat)} cursor="pointer" bg={selectedChat === chat ? "#38B2AC" : "#E8E8E8"} color={selectedChat === chat ? "white" : "bllack"} px={3} py={2} borderRadius='lg' key={chat._id} >
                                            <Text>

                                                {
                                                    !chat.isGrp ?
                                                        getSender(loggeduser, chat.users) :

                                                        chat.chatName
                                                }
                                            </Text>

                                        </Box>
                                    ))
                                }
                            </Stack>

                        ) : (
                            <ChatLoading />
                        )
                }
            </Box>

        </Box >

    )
}

export default MyChats