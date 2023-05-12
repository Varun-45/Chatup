import { Box, Button, Tooltip, Text, Menu, MenuButton, MenuList, Avatar, MenuItem, MenuDivider, Drawer, DrawerOverlay, DrawerContent, DrawerHeader, DrawerBody, Input, useToast, Spinner } from '@chakra-ui/react'
import React, { useState } from 'react'
import { BellIcon, ChevronDownIcon, Search2Icon } from '@chakra-ui/icons'
import { ChatState } from '../../Context/ChatProvider'
import ProfileModal from './ProfileModal'
import { useHistory } from 'react-router-dom'
import { useDisclosure } from '@chakra-ui/hooks'
import axios from "axios"
import ChatLoading from './ChatLoading'
import UserListItem from './UserListItem'
import { getSender, getSenderObj } from './ChatLogic'
import { MdNotificationsActive } from 'react-icons/md'
import { Icon } from '@chakra-ui/react'

const SideDrawer = () => {
    const [srch, setsrch] = useState("")
    const [searchres, setasearchres] = useState([])
    const [loading, setloading] = useState(false)
    const [loadingChat, setloadingChat] = useState();
    const { user, setselectedChat, chats, setChats, notify, setnotify } = ChatState()
    // console.log(user)
    const history = useHistory()
    const { isOpen, onOpen, onClose } = useDisclosure()

    const logOutHandler = () => {
        localStorage.removeItem("userInfo");
        history.push("/")
        window.location.reload()
    }

    const tipOpen = async () => {
        onOpen();
        setloading(true)

        const config = {
            headers: {
                Authorization: `Bearer ${user.token}`
            }
        };
        const { data } = await axios.get(`/api/user?search=${srch}`, config)
        setloading(false);
        setasearchres(data);
        // console.log(searchres)

    }
    const Toast = useToast()
    const handleSearch = async () => {
        if (!srch) {
            Toast({
                title: "Please enter something to search",
                status: "warning",
                duration: "4000",
                isClosable: true,
                position: "top-left"
            })
        }

        try {
            setloading(true)

            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`
                }
            };
            const { data } = await axios.get(`/api/user?search=${srch}`, config)
            setloading(false);
            setasearchres(data);
            console.log(searchres)
        }
        catch (error) {
            console.log(error)
            Toast({
                title: "Error",
                description: "Failed to load",
                status: "warning",
                duration: "4000",
                isClosable: true,
                position: "top-left"
            })
        }
    }

    const accessChat = async (userId) => {
        try {

            setloadingChat(true);
            const config = {
                headers: {
                    "Content-type": "application/json",
                    Authorization: `Bearer ${user.token}`
                }
            };
            const { data } = await axios.post("/api/chat", { userId }, config)

            if (!chats.find((c) => c._id === data._id)) {
                setChats([data, ...chats])
            }

            setselectedChat(data);
            setloadingChat(false);
            onClose();

        } catch (error) {
            Toast({
                title: "Error Fetching the chat",
                description: error.msg,
                status: "warning",
                duration: "4000",
                isClosable: true,
                position: "top-left"
            })
        }

    }
    return (
        <>
            <Box display="flex" justifyContent="space-between" alignItems="center" bg="white" w="100%" p="5px 10px 5px 10px" borderWidth="5px">
                <Tooltip label="Search for user" hasArrow placement='bottom-end'>
                    <Button variant="ghost" onClick={tipOpen} ><Search2Icon ></Search2Icon>
                        <Text display={{ base: "none", md: "flex" }} px="4">Search User</Text></Button>
                </Tooltip>
                <Text fontSize="2xl" >ChatUp</Text>
                <div>
                    <Menu><MenuButton padding={1}>

                        <BellIcon fontSize="2xl" margin="1">

                        </BellIcon></MenuButton>
                        <MenuList pl={2}>
                            {
                                !notify.length && "No new messages"
                            }
                            {
                                notify.map(doc => (
                                    <MenuItem onClick={() => {
                                        setselectedChat(doc.chat);
                                        setnotify(notify.filter((n) => n !== doc))
                                    }}>
                                        {
                                            doc.chat.isGrp ? `New message in ${doc.chat.chatName}` : `New message from ${getSender(user, doc.chat.users)}`
                                        }
                                    </MenuItem>
                                ))
                            }

                        </MenuList>
                    </Menu>
                    <Menu>
                        <MenuButton as={Button} rightIcon={<ChevronDownIcon></ChevronDownIcon>}>
                            <Avatar size="sm" cursor="pointer" name={user.username} src={user.profile} />
                        </MenuButton>
                        <MenuList>
                            <ProfileModal user={user}>
                                <MenuItem>My Profile</MenuItem>
                            </ProfileModal>
                            <MenuDivider />
                            <MenuItem onClick={logOutHandler}>Logout</MenuItem>

                        </MenuList>
                    </Menu>
                </div>
            </Box>
            <Drawer placement='left' onClose={onClose} isOpen={isOpen}>
                <DrawerOverlay />
                <DrawerContent>
                    <DrawerHeader borderBottomWidth="1px">Search User</DrawerHeader>               <DrawerBody >
                        <Box display="flex" pb={2}>
                            <Input placeholder="Search User by name or email" mr={2} value={srch} onChange={(e) => setsrch(e.target.value)} />
                            <Button onClick={handleSearch}>Go</Button>
                        </Box>
                        {
                            loading ? (
                                <ChatLoading />
                            ) :
                                (
                                    searchres?.map((user) => (

                                        <UserListItem key={user._id}
                                            user={user} handleFunction={() => accessChat(user._id)} />

                                    ))
                                )
                        }
                        {
                            loadingChat && <Spinner
                                thickness='4px'
                                speed='0.65s'
                                emptyColor='gray.200'
                                color='blue.500'
                                size='xl'
                            />
                        }

                    </DrawerBody>  </DrawerContent>

            </Drawer>
        </>
    )
}

export default SideDrawer