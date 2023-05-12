import React from 'react'
import { ChatState } from "../../Context/ChatProvider"
import { Box } from '@chakra-ui/react'
import SingleChat from "./SingleChat"

const ChatBox = ({ fetch, setfetch }) => {
    const { selectedChat } = ChatState()
    return (
        <Box display={{ base: selectedChat ? "flex" : "none", md: "flex" }} width={{ base: '100%', md: "70%" }} bg="white" flexDir="column" alignItems="center" borderRadius="md" marginLeft={{ base: "0", md: "4" }}> <SingleChat fetch={fetch} setfetch={setfetch} /></Box>
    )
}

export default ChatBox