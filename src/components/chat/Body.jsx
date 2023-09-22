import {
  EllipsisVerticalIcon,
  FaceSmileIcon,
  MagnifyingGlassIcon,
  MicrophoneIcon,
  PaperAirplaneIcon,
  PaperClipIcon,
  PhotoIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import React, { useEffect, useRef, useState } from "react";
import { Button, Dropdown, DropdownItem, DropdownMenu, DropdownToggle, Form, Input, InputGroup, InputGroupText, Modal, ModalBody, ModalFooter, ModalHeader } from "reactstrap";
import useChatContext from "../../context/useChatContext";
import EmptyChatScreen from "../../assets/empty-chat-screen.png";
import UserAvatar from "../common/UserAvatar";
import { capitalizeString, getImageUrl, } from "../../helper/common";
import axiosInstance from "../../api/base";
import Spinner from "../Spinner";
import useSocketContext from "../../context/useSocketContext";
import ScrollableFeed from 'react-scrollable-feed';
import EmojiPicker from 'emoji-picker-react';
import { convertToBase64 } from "../../helper/convert";

const Message = ({ message }) => {
  const { auth } = useChatContext()

  return (
    <div className={`d-flex ${(message?.sender?._id !== auth?.id) ? "justify-content-start" : "justify-content-end"} align-items-center`}>
      <span className="btn btn-light btn-sm">
        {
          (message?.sender?._id !== auth?.id) ? <UserAvatar user={message?.sender} style={{ border: "1px solid", borderRadius: "50%", marginLeft: "6px", marginRight: "6px" }} size={24} /> : null
        }

        {message?.type === 'image' ? (
          <>
            <img src={getImageUrl(message.file)} alt={message._id} className="img-thumbnail" width={156} height={156} />
          </>
        ) : message?.content}
      </span>
    </div>
  )
}

const Body = () => {
  const { selectedContact, selectedChat, onSelectChat } = useChatContext();
  const { socket } = useSocketContext()
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [content, setContent] = useState("");
  const [messageSending, setMessageSending] = useState(false)
  const [showEmojiSelector, setShowEmojiSelector] = useState(false)
  const emojiPickerRef = useRef(null)
  const [showAttachment, setShowAttachment] = useState(false);
  const [field, setField] = useState(null);
  const [displayImage, setDisplayImage] = useState(null);
  const inputFileRef = useRef(null);
  const [isOpenSendImageModel, setIsOpenSendImageModel] = useState(false);

  useEffect(() => {
    const fetchChats = async () => {
      setLoading(true);

      await axiosInstance.get("/chats/messages/", {
        params: {
          recipientId: selectedContact?._id
        }
      })
        .then((response) => {
          setMessages(response.data)
          setLoading(false)
        })
        .catch((error) => {
          setError("Couldn't fetch messages!")
          setLoading(false)
        })
    }

    if (selectedChat) {
      fetchChats();
    }

  }, [selectedChat])

  const onSendMessage = async () => {
    console.log(" Message Sending ", messageSending, !(content || field))

    if (messageSending || !(content || field)) return null;

    setMessageSending(true)

    const formData = new FormData();

    if (field) {
      formData.append('file', field.file)
    } else {
      formData.append('content', content)
    }

    formData.append('recipientId', selectedContact?._id)

    formData.append('type', field ? field.type : "message")

    await axiosInstance.post("/chats/messages", formData)
      .then((response) => {
        setMessages((prevState) => ([...prevState, response.data]))

        console.log(" Response ", response.data)

        if (!selectedChat) {
          onSelectChat(selectedContact, response?.data?.chat?._id)
        }

        socket.emit("onSendMessageRequest", response.data)
        setContent("")
        setField(null)
        setIsOpenSendImageModel(false)
        setDisplayImage(null)
        setMessageSending(false)
        setShowEmojiSelector(false)
      })
      .catch((error) => {
        console.log(" Error ", error)
        setMessageSending(false)
      })
  }

  const onSubmitForm = async (e) => {
    e.preventDefault();

    console.log(" Form Submitting ", content, field)

    onSendMessage()
  }

  useEffect(() => {
    socket.on("onSendMessageResponse", (message) => {
      console.log(" Message ", message)
      setMessages((prevState) => ([...prevState, message]))
    })
  }, [socket])

  useEffect(() => {
    const onClickOutsideEmojiModel = (e) => {
      if (e.target.id !== "emoji-picker") {
        if (emojiPickerRef.current && !emojiPickerRef.current.contains(e.target)) {
          setShowEmojiSelector(false)
        }
      }
    }

    document.addEventListener("click", onClickOutsideEmojiModel);

    return () => document.removeEventListener("click", onClickOutsideEmojiModel);
  }, [document])

  const onClickShowAttachment = () => setShowAttachment((prevState) => !prevState);

  const onUpload = (e) => {
    Promise.resolve(setField({ type: "image", file: e.target.files[0] })).then(async () => {
      setIsOpenSendImageModel(true)
      setDisplayImage(await convertToBase64(e.target.files[0]));
      setShowAttachment(false);
    });
  }

  const onTogglePreviewFileModel = () => {
    setField(null)
    setIsOpenSendImageModel(false)
    setDisplayImage(null)
  }

  return (
    <div className="border" style={{ height: "72vh" }}>
      {selectedContact ? (
        <>
          <div
            className="border-bottom p-2 d-flex justify-content-between align-items-center"
            style={{ height: "8%" }}
          >
            <div className="d-flex align-items-center ">
              <UserAvatar user={selectedContact} />

              <div className="px-2">
                <span>
                  {capitalizeString(
                    `${selectedContact?.firstName} ${selectedContact?.lastName}`
                  )}
                </span>

                <br />

                {selectedContact?.online ? (
                  <div className="d-flex align-items-center gap-2">
                    <small>Online</small>

                    <div
                      className="rounded-circle bg-success"
                      style={{ width: "6px", height: "6px" }}
                    ></div>
                  </div>
                ) : (
                  <small>Offline</small>
                )}
              </div>
            </div>
            <div className="d-flex align-items-center">
              <MagnifyingGlassIcon style={{ width: "2rem", height: "2rem" }} />{" "}
              &nbsp;
              <EllipsisVerticalIcon style={{ width: "2rem", height: "2rem" }} />
            </div>
          </div>
          <div className="position-relative p-1" style={{ height: "92%" }}>

            {
              loading ? <Spinner style={{ height: "100%" }} /> : null
            }

            {
              error ? (
                <div className="d-flex justify-content-center align-items-center" style={{ height: "100%" }}>
                  <span className="text-danger">{error}</span>
                </div>
              ) : null
            }

            <div className="pb-5" style={{ height: "100%" }}>
              <ScrollableFeed>
                {
                  (messages.length > 0 && !loading && !error) ? (
                    <>
                      {
                        messages?.map((message, key) => <Message message={message} key={key} />)
                      }
                    </>
                  ) : null
                }
              </ScrollableFeed>
            </div>



            <div className="position-absolute bottom-0 w-100">

              {
                showEmojiSelector ? (
                  <div className="d-flex justify-content-end" style={{ width: "88%" }} >
                    <div ref={emojiPickerRef}>
                      <EmojiPicker onEmojiClick={(response) => setContent((prevContent) => prevContent + response.emoji)} />
                    </div>
                  </div>
                ) : null
              }

              <Form onSubmit={onSubmitForm}>
                <div className="d-flex align-items-center gap-2">
                  <Dropdown isOpen={showAttachment} toggle={onClickShowAttachment} direction="up">
                    <DropdownToggle caret color="light">
                      <PaperClipIcon style={{ width: "1.5rem", height: "1.5rem" }} />
                    </DropdownToggle>
                    <DropdownMenu>
                      <DropdownItem className="d-flex align-items-center gap-2" onClick={() => inputFileRef.current.click()}>
                        <PhotoIcon style={{ width: "1.5rem", height: "1.5rem" }} />  Photos
                      </DropdownItem>
                    </DropdownMenu>
                  </Dropdown>

                  <InputGroup>
                    <Input placeholder="Type a Message..." value={content} onChange={(e) => setContent(e.target.value)} />

                    <InputGroupText className="cursor-pointer" onClick={() => setShowEmojiSelector((prevState) => !prevState)}>
                      <FaceSmileIcon id="emoji-picker" style={{ width: "1.5rem", height: "1.5rem" }} />
                    </InputGroupText>
                  </InputGroup>

                  <input
                    type="file"
                    hidden
                    accept="image/*"
                    onChange={onUpload}
                    ref={inputFileRef}
                  />

                  <MicrophoneIcon
                    style={{ width: "1.5rem", height: "1.5rem", marginRight: "8px" }}
                  />

                </div>

                {
                  isOpenSendImageModel ? (
                    <Modal isOpen={isOpenSendImageModel} toggle={onTogglePreviewFileModel} centered>
                      <ModalHeader toggle={onTogglePreviewFileModel}>Selected Image - {field?.file?.name}</ModalHeader>

                      <ModalBody className="d-flex justify-content-center align-items-center">
                        <img src={displayImage || ""} alt={field?.file?.name} className="img-thumbnail" width={256} />
                      </ModalBody>

                      <ModalFooter>
                        <Button type="button" color="danger" onClick={onTogglePreviewFileModel}>
                          <XMarkIcon style={{ width: "1.5rem", height: "1.5rem" }} />
                        </Button>{' '}
                        <Button type="button" onClick={onSendMessage} color="success" disabled={messageSending}>
                          <PaperAirplaneIcon style={{ width: "1.5rem", height: "1.5rem", transform: "rotate(-45deg)" }} />
                        </Button>
                      </ModalFooter>
                    </Modal>
                  ) : null
                }
              </Form>
            </div>
          </div>
        </>
      ) : (
        <div
          className="d-flex flex-column align-items-center justify-content-center"
          style={{ height: "100%" }}
        >
          <img src={EmptyChatScreen} alt="Empty Chat Screen" width={356} />
          <h3 style={{ fontFamily: "cursive" }}>No User Selected Yet</h3>
        </div>
      )}
    </div>
  );
};

export default Body;
