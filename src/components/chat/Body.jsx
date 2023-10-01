import {
  EllipsisVerticalIcon,
  FaceSmileIcon,
  MicrophoneIcon,
  PaperAirplaneIcon,
  PaperClipIcon,
  PauseCircleIcon,
  PhoneIcon,
  PhotoIcon,
  TrashIcon,
  VideoCameraIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import React, { useEffect, useRef, useState } from "react";
import { Button, Dropdown, DropdownItem, DropdownMenu, DropdownToggle, Form, Input, InputGroup, InputGroupText, Modal, ModalBody, ModalFooter, ModalHeader } from "reactstrap";
import useChatContext from "../../context/useChatContext";
import EmptyChatScreen from "../../assets/empty-chat-screen.png";
import UserAvatar from "../common/UserAvatar";
import { Swal, capitalizeString, getImageUrl, } from "../../helper/common";
import axiosInstance from "../../api/base";
import Spinner from "../Spinner";
import useSocketContext from "../../context/useSocketContext";
import ScrollableFeed from 'react-scrollable-feed';
import EmojiPicker from 'emoji-picker-react';
import { convertToBase64 } from "../../helper/convert";
import { v4 as uuidv4 } from 'uuid';

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
        ) : message?.type === 'audio' ? (
          <audio controls autoPlay={false}>
            <source src={getImageUrl(message.file)} type="audio/mpeg">
            </source>
          </audio>
        ) : message?.content}
      </span>
    </div>
  )
}

const AudioRecordingComponent = ({ onLeaveAudioRecording, onSaveAudio }) => {
  const [audioStream, setAudioStream] = useState(null);
  const [recorder, setRecorder] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [fileURL, setFileURL] = useState(null);
  const [recordingDuration, setRecordingDuration] = useState(0);

  const onStartRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      const chunks = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunks.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(chunks, { type: 'audio/wav' });
        // You can save the 'audioBlob' or perform other actions with it.

        // // Initialize WaveSurfer for displaying the waveform
        // const wavesurferInstance = WaveSurfer.create({
        //   container: document.body,
        //   waveColor: 'rgb(200, 0, 200)',
        //   progressColor: 'rgb(100, 0, 100)',
        //   responsive: true,

        //   // Set a bar width
        //   barWidth: 2,
        //   // Optionally, specify the spacing between bars
        //   barGap: 1,
        //   // And the bar radius
        //   barRadius: 2,
        // });

        // // Load the recorded audio blob into WaveSurfer
        // wavesurferInstance.loadBlob(audioBlob);

        setFileURL(URL.createObjectURL(audioBlob));

        const audioFile = new File([audioBlob], `${uuidv4()}.mp3`, {
          type: "audio/mpeg"
        });

        onSaveAudio(audioFile)
      };

      mediaRecorder.start();
      setIsRecording(true);
      setAudioStream(stream);
      setRecorder(mediaRecorder);
    } catch (error) {
      console.error('Error starting recording:', error);
    }
  };

  useEffect(() => {
    onStartRecording()
  }, [])

  useEffect(() => {
    let interval;

    if (isRecording) {
      interval = setInterval(() => {
        setRecordingDuration((prevDuration) => {
          return prevDuration + 1
        })
      }, 1000)
    }

    return () => clearInterval(interval);
  }, [isRecording])

  const onStopRecording = () => {
    if (recorder) {
      recorder.stop();
      setIsRecording(false);
      audioStream.getTracks().forEach((track) => track.stop());
    }
  }

  const onResumeRecoding = () => {
    Swal.fire({
      title: 'Are you sure?',
      text: "Do you want to start new recording?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: "Yes, I'm sure"
    }).then((result) => {
      if (result.isConfirmed) {
        onStartRecording()
      }
    })
  }

  const onDeleteRecording = () => {
    Promise.resolve(onStopRecording())
      .then(() => onLeaveAudioRecording())
  }

  const formatTime = (time) => {
    if (isNaN(time)) return "00:00";

    const minutes = Math.floor(time / 60);

    const seconds = Math.floor(time % 60);

    return `${minutes ? `${minutes.toString().padStart(2, "0")}m:` : ""}${seconds.toString().padStart(2, "0")}s`
  }

  return (
    <div className="w-100 d-flex justify-content-end align-items-center gap-3">
      <TrashIcon className="cursor-pointer" style={{ width: "1.5rem", height: "1.5rem" }} onClick={onDeleteRecording} />

      {
        isRecording ? (
          <>
            <div className=" d-flex gap-5 py-2 px-3" style={{ border: "1px solid red", borderRadius: "20px" }}>
              <div>
                Recording...
              </div>
              <div>
                {formatTime(recordingDuration)}
              </div>
            </div>
            <PauseCircleIcon className="cursor-pointer mr-2 text-danger" style={{ width: "1.5rem", height: "1.5rem" }} onClick={onStopRecording} />
          </>
        ) : (
          <>
            {
              fileURL ? (
                <audio controls autoPlay muted>
                  <source src={fileURL} type="audio/wav">
                  </source>
                </audio>
              ) : null
            }
            {/* </div> */}
            <MicrophoneIcon className="cursor-pointer mr-2 text-danger" style={{ width: "1.5rem", height: "1.5rem" }} onClick={onResumeRecoding} />
          </>
        )
      }

      <Button type="submit" color="success">
        <PaperAirplaneIcon
          style={{ width: "1.5rem", height: "1.5rem", marginRight: "8px", transform: "rotate(-45deg)" }}
        />
      </Button>
    </div>
  )
}

const Stream = ({ isOpen, onToggle, video }) => {
  const {selectedContact,auth} = useChatContext();
  const {socket} = useSocketContext();

  const onDismissCall = () => {
    socket.emit("onRequestDismissCall",selectedContact);
  }

  return (
    <Modal isOpen={isOpen} toggle={onToggle} centered size="lg" backdrop fade>
      <ModalBody className="d-flex justify-content-center align-items-center flex-column">
        <div>
          <img src={getImageUrl(selectedContact?.profile)} alt={selectedContact?.username} className="img-thumbnail rounded-circle object-fit-contain" width={128} height={128} />
        </div>

        <div className="mt-3">
          {capitalizeString(`${selectedContact?.firstName} ${selectedContact?.lastName}`)}
        </div>

        <div className="my-3">
          <span>Calling...</span>
        </div>
      </ModalBody>
      <ModalFooter className="justify-content-center">
        <div className="d-flex justify-content-center align-items-center rounded-circle cursor-pointer" style={{width:"2.5rem",height:"2.5rem",background:"#dc3545"}} onClick={onToggle}>
          <PhoneIcon  color="white" style={{ width: "1.5rem", height: "1.5rem",transform:"rotate(135deg)" }} onClick={onDismissCall} />
        </div>
      </ModalFooter>
    </Modal>
  )
}

const Body = () => {
  const { selectedContact, selectedChat, onSelectChat, onFetchChat,peerId,auth } = useChatContext();
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
  const [isAudioSendButtonClicked, setIsAudioSendButtonClicked] = useState(false);
  const [videoCallStartBtnClicked, setVideoCallStartBtnClicked] = useState(false);

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
        setIsAudioSendButtonClicked(false)
      })
      .catch((error) => {
        console.log(" Error ", error)
        setMessageSending(false)
      })
  }

  const onSubmitForm = async (e) => {
    e.preventDefault();

    onSendMessage()
  }

  useEffect(() => {
    socket.on("onSendMessageResponse", (message) => {
      setMessages((prevState) => ([...prevState, message]))
    })

    socket.on("onRejectCallResponse",() => {
      console.log(" Call Rejected... ")
      setVideoCallStartBtnClicked(false)
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

  const onClickVideoCall = async () => {
    const chat = await onFetchChat();

    if (chat) {
      const {id,username,email,firstName,lastName,profile} = auth;

      Promise.resolve(socket.emit("onRequestForVideoCall",{selectedContact,caller:{id,username,email,firstName,lastName,profile},peerId}))
      .then(() => {
        setVideoCallStartBtnClicked(true)
      })
    }
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
            <div className="d-flex align-items-center gap-3">

              <VideoCameraIcon className="cursor-pointer" style={{ width: "1.5rem", height: "1.5rem" }} onClick={onClickVideoCall} />

              <PhoneIcon className="cursor-pointer" style={{ width: "1.2rem", height: "1.2rem" }} />

              <EllipsisVerticalIcon style={{ width: "1.5rem", height: "1.5rem" }} />
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

            <div className="position-absolute bottom-0 start-0 w-100" style={{ backgroundColor: `${isAudioSendButtonClicked ? "#d1d7db" : ""} ` }}>

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
                  {
                    isAudioSendButtonClicked ? (
                      <AudioRecordingComponent onLeaveAudioRecording={() => setIsAudioSendButtonClicked(false)} onSaveAudio={(file) => setField({ type: "audio", file })} />
                    ) : (
                      <>
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

                        {
                          !content ? (
                            <Button type="button" className="btn btn-light" onClick={() => setIsAudioSendButtonClicked(true)}>
                              <MicrophoneIcon
                                style={{ width: "1.5rem", height: "1.5rem", marginRight: "8px" }}
                              />
                            </Button>
                          ) : null
                        }
                      </>
                    )
                  }
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
          </div >
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

      {
        videoCallStartBtnClicked ? (
          <Stream isOpen={videoCallStartBtnClicked} onToggle={() => setVideoCallStartBtnClicked((prevState) => !prevState)} video />
        ) : null
      }
    </div >
  );
};

export default Body;
