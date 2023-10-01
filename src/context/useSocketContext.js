import React, { createContext, useContext } from "react";
import { getAuthTokens } from "../api/base";
import io from "socket.io-client";
import { isAuthTokenExpired } from "../helper/validate";
import { useAuthStore } from "../store/store";

const SocketContext = createContext();

const withStore = (BaseComponent) => (props) => {
  const store = useAuthStore((state) => state);

  return <BaseComponent {...props} store={store} />;
};

class SocketContextProvider extends React.Component {
  constructor(props) {
    super(props);
  }

  socket = io.connect(process.env.REACT_APP_BASE_URL, {
    query:
      getAuthTokens()?.access && !isAuthTokenExpired(getAuthTokens()?.access)
        ? {
            token: getAuthTokens()?.access,
          }
        : null,
  });

  componentDidMount() {
    this.socket.on("connect",() => {
      console.log(" Connection Established.. ")
      this.socket.emit("onSocketConnection")
    })

    this.socket.on(
      "onNotificationMarkedReadResponse",
      ({ notification: _notification, countOfNotification }) => {
        const tempNotifications = this.props.store.notifications.map(
          (notification) => {
            if (notification._id === _notification?._id) {
              return { ...notification, read: _notification?.read };
            }
            return notification;
          }
        );

        this.props.store.setState({
          notifications: tempNotifications,
          auth: { ...this.props.store.auth, countOfNotification },
        });
      }
    );

    this.socket.on("onPostLikedResponseNotification", (data) => {
      const { countOfNotification, notification } = data;

      this.props.store.setState({
        notifications: [...this.props.store.notifications,notification],
        auth: { ...this.props.store.auth, countOfNotification },
        socket: this.socket,
      });
    });

    this.socket.on("onFollowUserResponse", (data) => {
      const { countOfNotification, notification } = data;

      this.props.store.setState({
        notifications: this.props.store.notifications.concat(notification),
        auth: { ...this.props.store.auth, countOfNotification },
      });
    });

    this.socket.on("onCreatePostResponse", (data) => {
      const { countOfNotification, notification } = data;

      this.props.store.setState({
        notifications: this.props.store.notifications.concat(notification),
        auth: { ...this.props.store.auth, countOfNotification },
      });
    });
  }

  onReceiveOnlineUsers = () => {
    this.socket.emit("onRequestForOnlineUsers", this.props.store.auth.username);
  };

  onFollowUserRequest = (data) => {
    console.log(" Data ");

    this.socket.emit("onFollowUserRequest", data);
  };

  onPostLikedRequestNotification = (data) => {
    console.log(" On Post Liked Request Notification ",data);
    this.socket.emit("onPostLikedRequestNotification", data);
  };

  render() {
    return (
      <SocketContext.Provider
        value={{
          onReceiveOnlineUsers: this.onReceiveOnlineUsers,
          socket: this.socket,
          onFollowUserRequest: this.onFollowUserRequest,
          onPostLikedRequestNotification: this.onPostLikedRequestNotification,
        }}
      >
        {this.props.children}
      </SocketContext.Provider>
    );
  }
}

const SocketProvider = withStore(SocketContextProvider);

export { SocketProvider };

const useSocketContext = () => useContext(SocketContext);

export default useSocketContext;
