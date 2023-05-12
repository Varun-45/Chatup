import React, { useEffect, useState } from 'react'
import { ChatState } from "../../Context/ChatProvider"
import { Box, Center, FormControl, IconButton, Image, Input, Link, Spinner, Text, Toast, chakra, useToast } from '@chakra-ui/react'
import lotti from "../../images/lottie.gif"
import { ArrowBackIcon, ArrowRightIcon } from '@chakra-ui/icons'
import { getSender, getSenderObj } from './ChatLogic'
import ProfileModal from "../miscellaneous/ProfileModal"
import UpdategrpModal from './UpdategrpModal'
import axios from 'axios'
import "./msgs.css"
import io from "socket.io-client"
const ENDPOINT = "http://localhost:5000"
var socket, selectedChatCompare;


const SingleChat = ({ fetch, setfetch }) => {
    const { user, selectedChat, setselectedChat, notify, setnotify } = ChatState()
    const [messages, setmessages] = useState([])
    const [loading, setloading] = useState(false)
    const [newMsg, setnewMsg] = useState()
    const toast = useToast()
    const [socketConnected, setsocketConnected] = useState(false)
    const [typing, settyping] = useState(false);
    const [isTyping, setisTyping] = useState(false)
    const sendmsg = async (event) => {
        if (event.key === "Enter" && newMsg) {
            socket.emit("stop typing", selectedChat._id)
            try {
                const config = {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${user.token}`
                    }
                };
                setnewMsg("");
                const { data } = await axios.post("/api/message", {
                    content: newMsg,
                    chatId: selectedChat._id
                },
                    config)
                console.log(data)

                socket.emit("new message", data)
                setmessages([...messages, data])
            } catch (error) {
                toast({
                    title: "Error Occured",
                    description: "Failed to load",
                    status: "warning",
                    duration: "4000",
                    isClosable: true,
                    position: "top-left"
                })

            }
        }

    }
    const typehandler = (e) => {
        setnewMsg(e.target.value)
        if (!socketConnected) return;
        if (!typing) {
            settyping(true);
            socket.emit("typing", selectedChat._id)
        }
        let lasttypetym = new Date().getTime();
        var timerlength = 3000;
        setTimeout(() => {
            var timenow = new Date().getTime();
            var timediff = timenow - lasttypetym;
            if (timediff >= timerlength && typing) {
                socket.emit("stop typing", selectedChat._id)
                settyping(false)

            }
        }, timerlength);

    }
    useEffect(() => {
        socket = io(ENDPOINT)
        socket.emit("setup", user)
        socket.on("connected", () => setsocketConnected(true))
        socket.on('typing', () => setisTyping(true));
        socket.on('stop typing', () => setisTyping(false));
    }, []);

    const fetchmsg = async (event) => {
        if (!selectedChat) return;
        try {
            const config = {
                headers: {

                    Authorization: `Bearer ${user.token}`
                }
            };
            setloading(true)
            const { data } = await axios.get(`/api/message/${selectedChat._id}`,
                config)
            console.log(data)
            setmessages(data)
            setloading(false)
            socket.emit("join chat", selectedChat._id)

        } catch (error) {
            toast({
                title: "Error loading chats",
                description: "Failed to load",
                status: "warning",
                duration: "4000",
                isClosable: true,
                position: "top-left"
            })
        }
    }

    useEffect(() => {

        fetchmsg()
        selectedChatCompare = selectedChat
    }, [selectedChat])
    useEffect(() => {
        socket.on("message received", (newMessageRecieved) => {
            if (!selectedChatCompare || selectedChatCompare._id !== newMessageRecieved.chat._id) {
                if (!notify.includes(newMessageRecieved)) {
                    setnotify([newMessageRecieved, ...notify])

                    setfetch(!fetch)
                }
            }
            else {
                setmessages([...messages, newMessageRecieved])
            }
        })

    })
    console.log(notify, "ss")
    return (
        <>{
            selectedChat ?
                (
                    <> <Text fontSize={{ base: "28px", md: "30px" }} pb={3} px={2} py={2} width={'100%'} display={'flex'} justifyContent={{ base: "space-between" }} alignItems={'center'}>
                        <IconButton display={{ base: "flex", md: "none" }} icon={<ArrowBackIcon />} onClick={() => setselectedChat("")} margin={5}></IconButton>
                        {!selectedChat.isGrp ? (<>
                            {getSender(user, selectedChat.users)}
                            <ProfileModal user={getSenderObj(user, selectedChat.users)} />
                        </>) :
                            (<>{selectedChat.chatName.toUpperCase()}
                                <UpdategrpModal fetch={fetch} setfetch={setfetch} fetchmsg={fetchmsg} /></>)}
                    </Text>
                        <Box display={'flex'} flexDir={'column'} background={'#ebe6e6'} width={'96%'} height={'91%'} overflowY={'hidden'} borderRadius={'lg'} padding={3} justifyContent={'flex-end'}>

                            {
                                loading ? (
                                    <Spinner
                                        size={'xl'}
                                        alignSelf={'center'} margin={'auto '} />
                                ) : (
                                    <div className='msgs'>




                                        <main class="msger-chat">
                                            {/* <div class="msg left-msg">
                                                <div
                                                    class="msg-img"

                                                ></div>

                                                <div class="msg-bubble">
                                                    <div class="msg-info">
                                                        <div class="msg-info-name">BOT</div>
                                                        <div class="msg-info-time">12:45</div>
                                                    </div>

                                                    <div class="msg-text">
                                                        Hi, welcome to SimpleChat! Go ahead and send me a message. 😄
                                                    </div>
                                                </div>
                                            </div>

                                            <div class="msg right-msg">
                                                <div
                                                    class="msg-img"

                                                ></div>

                                                <div class="msg-bubble">
                                                    <div class="msg-info">
                                                        <div class="msg-info-name">Sajad</div>
                                                        <div class="msg-info-time">12:46</div>
                                                    </div>

                                                    <div class="msg-text">
                                                        You can change your name in JS section!
                                                    </div>
                                                </div>
                                            </div> */}

                                            {
                                                messages.map((doc, index) => {
                                                    let date = new Date(doc.createdAt)
                                                    console.log(date.toLocaleTimeString())

                                                    if (doc.sender._id !== user._id) {
                                                        return (
                                                            <div class="msg left-msg">
                                                                <Image src={doc.sender.profile} className='msg-img' />

                                                                <div class="msg-bubble">
                                                                    <div class="msg-info">
                                                                        <div class="msg-info-name">{doc.sender.username}</div>
                                                                        <div class="msg-info-time"> {date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</div>
                                                                    </div>

                                                                    <div class="msg-text">
                                                                        {doc.content}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        )
                                                    }
                                                    else {
                                                        return (
                                                            <div class="msg right-msg">
                                                                <Image src={doc.sender.profile} className='msg-img' />

                                                                <div class="msg-bubble">
                                                                    <div class="msg-info">
                                                                        <div class="msg-info-name">{doc.sender.username}</div>
                                                                        <div class="msg-info-time">{date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</div>
                                                                    </div>

                                                                    <div class="msg-text">
                                                                        {doc.content}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        )
                                                    }
                                                })
                                            }
                                            {
                                                isTyping ? <div class="msg left-msg">


                                                    <div class="msg-bubble">
                                                        <div class="typing">
                                                            <div class="dot"></div>
                                                            <div class="dot"></div>
                                                            <div class="dot"></div>
                                                        </div>

                                                    </div>
                                                </div> : ("")

                                            }
                                        </main>

                                    </div>
                                )

                            }

                            <FormControl onKeyDown={sendmsg} isRequired display={'flex'} flexDir={'row'}>

                                <Input background={'white'} variant="filled" placeholder='Enter your message...' border={"2px solid black"} onChange={typehandler} value={newMsg} />

                            </FormControl></Box>
                    </>
                )
                :
                (
                    <Center fontSize={'xl'} flexDir={'column'} alignItem={'center'} padding={10}>Please select an user
                        <Image src={lotti} /> <Box >© <Link href={'https://www.linkedin.com/in/vrmalpani'}
                            _hover={{
                                textDecoration: 'none'
                            }}>Varun</Link></Box></Center >
                )
        }
        </>
    )
}

export default SingleChat