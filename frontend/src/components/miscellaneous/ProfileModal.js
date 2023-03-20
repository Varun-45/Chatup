import React from 'react'
import { useDisclosure } from '@chakra-ui/hooks'
import { IconButton } from '@chakra-ui/react'
import { ViewIcon } from '@chakra-ui/icons'
import { Modal, ModalBody, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalFooter, Button, Image, Text } from '@chakra-ui/react'

const ProfileModal = ({ user, children }) => {
    const { isOpen, onOpen, onClose } = useDisclosure()
    return (
        <div>{
            children ? <span onClick={onOpen}>{children}</span>
                : <IconButton
                    d={{ base: "flex" }}
                    icon={<ViewIcon />}
                    onClick={onOpen}
                />
        }

            <Modal isOpen={isOpen} onClose={onClose} size="lg" isCentered>
                <ModalOverlay />
                <ModalContent >
                    <ModalHeader
                        fontSize="40px"
                        display="flex"
                        justifyContent="center"
                    >{user.username}</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody display="flex" flexDir="column" justifyContent="space-between" alignItems="center
                    ">
                        <Image
                            borderRadius="full"
                            boxSize="200px"
                            src={user.profile}
                        />
                        <Text fontSize="35px" marginTop="2rem">{user.email}</Text>
                    </ModalBody>

                    <ModalFooter>

                        <Button variant='ghost' onClick={onClose}>Close</Button>

                    </ModalFooter>
                </ModalContent>
            </Modal></div>
    )
}

export default ProfileModal