import React, { Component, createContext, useContext } from "react";
import { Spinner } from "reactstrap";
import { useAuthStore } from "../store/store";
import useSocketContext from "./useSocketContext";

const ChatContext = createContext();

const withStore = (BaseComponent) => (props) => {
  const auth = useAuthStore((state) => state.auth);
  const {onReceiveOnlineUsers,socket} = useSocketContext();

  return <BaseComponent {...props} auth={auth} onReceiveOnlineUsers={onReceiveOnlineUsers} socket={socket} />;
};

class ChatContextProvider extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: false,
      auth: this.props.auth,
      selectedContact: null,
      socket:this.props.socket
    };
  }

  componentDidUpdate(prevProps,prevState,snapshot){
    this.props.onReceiveOnlineUsers()
  }

  componentDidMount(){
    this.props.socket.on("onJoinChatResponse",(data) => console.log(" Messages ",data))
  }

  onSelectContact = (contact) => {
    this.setState({ selectedContact: contact },() => {
      this.props.socket.emit("onJoinChatRequest",contact._id)
    });
  };

  render() {
    return (
      <ChatContext.Provider
        value={{ ...this.state, onSelectContact: this.onSelectContact }}
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
