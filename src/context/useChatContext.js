import React, { Component, createContext, useContext } from "react";
import { Spinner } from "reactstrap";
import { useAuthStore } from "../store/store";
import useSocketContext from "./useSocketContext";
import { Peer } from "peerjs";
import axiosInstance from "../api/base";

const ChatContext = createContext();

const withStore = (BaseComponent) => (props) => {
  const auth = useAuthStore((state) => state.auth);
  const { onReceiveOnlineUsers, socket } = useSocketContext();

  return <BaseComponent {...props} auth={auth} onReceiveOnlineUsers={onReceiveOnlineUsers} socket={socket} />;
};

class ChatContextProvider extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: false,
      auth: this.props.auth,
      selectedContact: null,
      selectedChat: null,
      socket: this.props.socket,
      peerId: null,
    };
  }

  peer = new Peer({
    config: {
      'iceServers': [
        { url: 'stun:stun.l.google.com:19302' },
      ]
    }
  });

  componentDidUpdate(prevProps, prevState, snapshot) {
    this.props.onReceiveOnlineUsers()
  }

  componentDidMount() {
    this.peer.on("open", (peerId) => {
      this.setState({peerId})
      
    })
  }

  onSelectContact = (selectedContact) => {
    this.setState({ selectedContact, selectedChat: null });
  };

  onSelectChat = (selectedContact, selectedChat) => {
    this.setState({ selectedContact, selectedChat }, () => {
      this.props.socket.emit("onJoinChatRequest", selectedChat)
    })
  }

  onFetchChat = async () => {
    const chat = await axiosInstance.get(`/chats/`, {
      params: {
        recipientId:this.state.selectedContact?._id
      }
    })

    if(!chat.data) return null;

    this.setState({selectedChat:chat.data._id})

    return chat.data;
  }

  render() {

    console.log(" State ",this.state)

    return (
      <ChatContext.Provider
        value={{ ...this.state, onSelectContact: this.onSelectContact, onSelectChat: this.onSelectChat,onFetchChat:this.onFetchChat }}
      >
        {this.state.loading ? <Spinner /> : this.props.children}
      </ChatContext.Provider>
    );
  }
}

const ChatConsumer = ChatContext.Consumer;

const ChatProvider = withStore(ChatContextProvider);

export { ChatProvider, ChatConsumer };

const useChatContext = () => useContext(ChatContext);

export default useChatContext;
