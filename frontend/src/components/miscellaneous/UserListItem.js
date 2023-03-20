import React from 'react'
import { ChatState } from '../../Context/ChatProvider'
import { Avatar, Box, Text } from '@chakra-ui/react';

const UserListItem = ({ user, handleFunction }) => {
    return (
        <Box
            onClick={handleFunction}
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
            <Avatar mr={2} size="sm" cursor="pointer" name={user.username} src={user.profile} />
            <Box>
                <Text>{user.username}</Text>
            </Box>
        </Box>
    )
}

export default UserListItem