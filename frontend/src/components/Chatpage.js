import React, { useState } from 'react'
import { useEffect } from 'react'
import { Box } from '@chakra-ui/react'
import { ChatState } from '../Context/ChatProvider';
import SideDrawer from './miscellaneous/SideDrawer';
import ChatBox from './miscellaneous/ChatBox';
import MyChats from './miscellaneous/MyChats';

const Chatpage = () => {
    const { user } = ChatState()
    const [fetch, setfetch] = useState(false)
    return (
        <div style={{ width: "100%" }}>
            {user && <SideDrawer />}
            <Box display="flex" justifyContent="space-between" w="100%" h="91.5vh" p="10px">
                {user && <MyChats fetch={fetch} />}
                {user && <ChatBox fetch={fetch} setfetch={setfetch} />}
            </Box>
        </div>
    );
};

export default Chatpage