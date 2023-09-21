import React, { Component, createContext, useContext } from "react";
import { Spinner } from "reactstrap";
import { useAuthStore } from "../store/store";
import useSocketContext from "./useSocketContext";

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
      socket: this.props.socket
    };
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    this.props.onReceiveOnlineUsers()
  }

  componentDidMount() {
    // this.props.socket.on("onSendMessageResponse", (message) => console.log(" On Send Message Response ",message))
  }

  onSelectContact = (selectedContact) => {
    this.setState({ selectedContact, selectedChat: null });
  };

  onSelectChat = (selectedContact, selectedChat) => {
    this.setState({ selectedContact, selectedChat }, () => {
      this.props.socket.emit("onJoinChatRequest", selectedChat)
    })
  }

  render() {
    console.log(" State ", this.state)
    return (
      <ChatContext.Provider
        value={{ ...this.state, onSelectContact: this.onSelectContact, onSelectChat: this.onSelectChat }}
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
