import React from 'react'
import "./Home.css"
import { useEffect, useState } from 'react';
import { Toast, useToast, Button, Input, InputGroup, InputRightElement } from '@chakra-ui/react'
import axios from "axios"
import { useHistory } from "react-router-dom"
import eye from '../images/eye.png';
import eyeb from '../images/eyeb.png'
import validator from "validator"
import { ChatState } from '../Context/ChatProvider';
const HomePage = () => {

    const toast = useToast();
    const [uname, setuname] = useState();
    const [email, setEmail] = useState()
    const [password, setPassword] = useState();
    const [confirmpassword, setconfirmpassword] = useState()
    const [pic, setPic] = useState();
    const [lemail, setlemail] = useState()
    const [lpassword, setlpassword] = useState();
    const [loading, setloading] = useState(false)
    const [lloading, setlloading] = useState(false)
    const history = useHistory();
    useEffect(() => {
        const user = JSON.parse(localStorage.getItem("userInfo"));
        if (user) history.push("/chats");
    }, [history])
    const [emailError, setEmailError] = useState(false)

    const [show, setShow] = useState(false)
    const [show2, setShow2] = useState(false)
    const handleClick = () => setShow(!show)
    const handleClick2 = () => setShow2(!show2)

    const validateEmail = (e) => {
        var email = e.target.value

        if (validator.isEmail(email)) {
            setEmailError(false)
        } else {
            setEmailError(true)
        }
        console.log(emailError)
    }


    const postDetails = (pic) => {

        setloading(true);
        if (pic === undefined) {
            toast({
                title: 'Please select an image',
                position: 'bottom',
                status: 'warning',
                duration: 5000,
                isClosable: true,
            })
            setloading(false)
            return
        }
        else if (pic.type === "image/jpeg" || pic.type === "image/png" || pic.type === "image/jpg") {
            const data = new FormData();

            data.append("file", pic);
            data.append("upload_preset", "chat-app");
            data.append("cloud_name", "do15gqrjf");
            fetch("https://api.cloudinary.com/v1_1/do15gqrjf/image/upload", {
                method: "post",
                body: data,
            }).then((res) => res.json())
                .then(data => {
                    console.log(data.url.toString())
                    setPic(data.url.toString());
                    setloading(false)
                })
                .catch((err) => {
                    console.log(err)
                    setloading(false)

                })

        }
        else {
            toast({
                title: 'Please select an image',
                description: 'Image format should be png,jpg or jpeg',
                position: 'bottom',
                status: 'warning',
                duration: 5000,
                isClosable: true,
            })
            setloading(false)
            return
        }

    }
    const submitHandler = async () => {
        setloading(true);
        if (!uname || !email || !password || !confirmpassword) {
            toast({
                title: 'Please fill all the fields',
                position: 'bottom',
                status: 'warning',
                duration: 5000,
                isClosable: true,
            })
            setloading(false);
            return;
        }
        if (emailError === true) {
            toast({
                title: 'Please enter valid mail',
                position: 'bottom',
                status: 'warning',
                duration: 5000,
                isClosable: true,
            })
            setloading(false);
            return;
        }
        if (password !== confirmpassword) {
            toast({
                title: 'Please enter correct password',
                position: 'bottom',
                status: 'warning',
                duration: 5000,
                isClosable: true,
            })
            setloading(false);
            return;
        }

        try {
            const config = {
                headers: {
                    "Content-type": "application/json",

                },

            };
            const { data } = await axios.post("/api/user", { username: uname, email, password, confirmpassword, profile: pic },
                config);

            localStorage.setItem("userInfo", JSON.stringify(data));
            setloading(false);
            history.push("/chats")
            window.location.reload()
            toast({
                title: 'Registered Successfully',
                position: 'bottom',
                status: 'success',
                duration: 5000,
                isClosable: true,
            })
        } catch (error) {
            console.log(error.response.data.message)
            toast({
                title: 'Error Occured',
                position: 'bottom',
                description: error.response.data.message,
                status: 'error',
                duration: 5000,
                isClosable: true,
            })
            setloading(false);
        }

    }

    const loginhandler = async () => {
        setlloading(true);
        if (!lemail || !lpassword) {
            toast({
                title: 'Please fill all the fields',
                position: 'bottom',
                status: 'warning',
                duration: 5000,
                isClosable: true,
            })
            setlloading(false);
            return;
        }
        try {
            const config = {
                headers: {
                    "Content-type": "application/json",

                },

            };
            const { data } = await axios.post("/api/user/login", { email: lemail, password: lpassword },
                config);

            localStorage.setItem("userInfo", JSON.stringify(data));
            setlloading(false);
            history.push("/chats")
            window.location.reload()
            toast({
                title: 'Logged in successfully',
                position: 'bottom',
                status: 'success',
                duration: 5000,
                isClosable: true,
            })
        } catch (error) {
            console.log(error.response.data)

            toast({
                title: 'Error Occured',
                position: 'bottom',
                description: error.response.data,
                status: 'error',
                duration: 5000,
                isClosable: true,
            })
            setlloading(false);
        }

    }

    window.onload = function () {
        const loginText = document.querySelector(".title-text .login");
        const loginForm = document.querySelector("form.login");
        const loginBtn = document.querySelector("label.login");
        const signupBtn = document.querySelector("label.signup");
        const signupLink = document.querySelector("form .signup-link a");
        const signupbt = document.querySelector("#signup")
        signupBtn.onclick = (() => {

            loginForm.style.marginLeft = "-50%";
            loginText.style.marginLeft = "-50%";
        });

        loginBtn.onclick = (() => {
            loginForm.style.marginLeft = "0%";
            loginText.style.marginLeft = "0%";
        });
        signupLink.onclick = (() => {
            signupBtn.click();

        });

    };

    return (
        <>  <div class="wrapper">

            <div class="title-text">
                <div class="title login">Login</div>
                <div class="title signup">Signup</div>
            </div>
            <div class="form-container">
                <div class="slide-controls">
                    <input type="radio" name="slide" id="login" />
                    <input type="radio" name="slide" id="signup" />
                    <label for="login" class="slide login">Login</label>
                    <label for="signup" class="slide signup">Signup</label>
                    <div class="slider-tab"></div>
                </div>
                <div class="form-inner">
                    <form action="#" class="login">
                        <div class="field">
                            <input type="Email" placeholder="Email Address" required onChange={(e) => setlemail(e.target.value)} value={lemail} />
                        </div>
                        <div class="field">
                            <input type="password" placeholder="Password" required onChange={(e) => setlpassword(e.target.value)} value={lpassword} />
                        </div>
                        <Button
                            isLoading={lloading}
                            colorScheme="blue"
                            width="100%"
                            color="white"
                            style={{ marginTop: 15 }}
                            onClick={loginhandler}
                        >
                            Log In
                        </Button>
                        <Button

                            colorScheme="yellow"
                            width="100%"
                            color="white"
                            style={{ marginTop: 15 }}
                            onClick={(e) => { setlemail("guest@gmail.com"); setlpassword("123") }}
                        >
                            Join as Guest                        </Button>
                        <div class="signup-link">Not a member? <a>Signup now</a></div>
                    </form>
                    <form action="#" class="signup">
                        <div class="field">
                            <input type="text" placeholder="Username" required onChange={(e) => setuname(e.target.value)} />
                        </div>
                        <div class="field">
                            <input type="Email" placeholder="Email Address" required onChange={(e) => { validateEmail(e); { setEmail(e.target.value) } }} />
                        </div>
                        <div class="field flex-row" >
                            <InputGroup size='md'>
                                <Input
                                    pr='4.5rem'
                                    type={show ? 'text' : 'password'}
                                    placeholder='Enter password'
                                    required onChange={(e) => setPassword(e.target.value)}
                                />
                                <InputRightElement width='4.5rem'>
                                    <Button h='1.75rem' size='sm' onClick={handleClick}>
                                        {show ? 'Hide' : 'Show'}
                                    </Button>
                                </InputRightElement>
                            </InputGroup>
                        </div>

                        <div class="field flex-row">
                            <InputGroup size='md'>
                                <Input
                                    pr='4.5rem'
                                    type={show2 ? 'text' : 'password'}
                                    placeholder='Enter password'
                                    required onChange={(e) => setconfirmpassword(e.target.value)}
                                />
                                <InputRightElement width='4.5rem'>
                                    <Button h='1.75rem' size='sm' onClick={handleClick2}>
                                        {show2 ? 'Hide' : 'Show'}
                                    </Button>
                                </InputRightElement>
                            </InputGroup>
                        </div>
                        <div className='field'>
                            <Input type="file" accept='image/*' onChange={(e) => postDetails(e.target.files[0])} placeholder="Choose a profile image" />
                        </div>

                        <Button
                            isLoading={loading}
                            colorScheme="blue"
                            width="100%"
                            color="white"
                            style={{ marginTop: 15 }}
                            onClick={submitHandler}
                        >
                            Sign Up
                        </Button>


                    </form>
                </div>
            </div>
        </div>
        </>
    )
}

export default HomePage