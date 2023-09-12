import React from "react";
import { EllipsisVerticalIcon, XMarkIcon } from "@heroicons/react/24/outline";
import UserAvatar from "../common/UserAvatar";
import apiClient from "../../api/base";
import { capitalizeString } from "../../helper/common";
import { Input, Spinner } from "reactstrap";
import useChatContext, { ChatConsumer } from "../../context/useChatContext";

const ChatUser = ({ user }) => {
  const { onSelectContact, selectedContact } = useChatContext();

  return (
    <div
      className={`card mb-1 cursor-pointer ${
        selectedContact?._id === user?._id ? "bg-light-gray" : ""
      }`}
      onClick={() => onSelectContact(user)}
    >
      <div className="card-body  p-half d-flex">
        <div className="position-relative">
          <UserAvatar user={user} chat />

          {user?.online ? (
            <div
              className="rounded-circle bg-success position-absolute top-0 end-0"
              style={{ width: "6px", height: "6px" }}
            ></div>
          ) : null}
        </div>

        <div className="px-2">
          <strong>
            {capitalizeString(`${user?.firstName} ${user?.lastName}`)}
          </strong>
          <br />
          <span>Hi</span>
        </div>
      </div>
    </div>
  );
};

class Sidebar extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      contacts: [],
      chats: [],
      loading: false,
      error: null,
      search: "",
    };
  }

  fetchAuthContacts = async () => {
    this.setState({ loading: true });

    console.log(" Called... ");

    await apiClient
      .get("/auth-contacts/", {
        params: {
          search: this.state.search,
        },
      })
      .then((response) => {
        if (!response)
          throw new Error(
            "Something went wrong\nPlease try again after some time later."
          );

        this.setState({ contacts: response.data }, () =>
          this.setState({ loading: false })
        );
      })
      .catch((error) => {
        this.setState({
          error: "Couldn't Load Contacts...",
          loading: false,
        });
      });
  };

  fetchAuthChats = async () => {
    this.setState({ loading: true });

    await apiClient
      .get("/chats/")
      .then((response) => {
        if (!response)
          throw new Error(
            "Something went wrong\nPlease try again after some time later."
          );

        this.setState({ chats: response.data }, () =>
          this.setState({ loading: false })
        );
      })
      .catch((error) => {
        this.setState({
          error: error.message,
          loading: false,
        });
      });
  };

  componentDidMount() {
    this.fetchAuthChats();
  }

  debounce = (func, delay) => {
    let timer;
    return (...args) => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        func(...args);
      }, delay);
    };
  };

  onDebouceSearch = this.debounce(() => this.fetchAuthContacts(), 3000);

  onChange = (e) => {
    this.setState({ search: e.target.value }, this.onDebouceSearch());
  };

  onClearSearch = () => {
    this.setState({ search: "",contacts:[] }, () => this.fetchAuthChats());
  };

  getChatRecipient = (authId, members) =>
    members.filter((member) => member._id !== authId).shift();

  render() {
    console.log(" Chats ", this.state.chats);
    return (
      <ChatConsumer>
        {(props) => (
          <div className="border " style={{ height: "72vh" }}>
            <div
              className="d-flex border-bottom  flex-column justify-content-between p-2"
              style={{ height: "16%" }}
            >
              <div className="d-flex justify-content-between align-items-center">
                <UserAvatar user={props?.auth} />

                <div>
                  <EllipsisVerticalIcon
                    style={{ width: "2rem", height: "2rem" }}
                  />
                </div>
              </div>

              <div className="position-relative">
                <Input
                  value={this.state.search}
                  onChange={this.onChange}
                  placeholder="Search or start a new chat"
                />

                {this.state.search ? (
                  <XMarkIcon
                    className="position-absolute top-50 cursor-pointer"
                    style={{
                      width: "1.5rem",
                      height: "1.5rem",
                      transform: "translateY(-50%)",
                      right: "6px",
                    }}
                    onClick={this.onClearSearch}
                  />
                ) : null}
              </div>
            </div>

            <div className="p-1" style={{ height: "84%", overflowY: "auto" }}>
              {this.state.contacts.length ? (
                <div>
                  <span className="text-success">Contacts</span>

                  <div className="p-1">
                    {this.state.contacts.map((contact, key) => (
                      <ChatUser user={contact} key={`conatct-${key}`} />
                    ))}
                  </div>
                </div>
              ) : (
                <div className="p-1">
                  {this.state.chats.map((chat, key) => (
                    <ChatUser
                      user={this.getChatRecipient(props.auth.id, chat.members)}
                      key={`conatct-${key}`}
                    />
                  ))}
                </div>
              )}

              {this.state.loading ? <Spinner /> : null}
            </div>
          </div>
        )}
      </ChatConsumer>
    );
  }
}

export default Sidebar;
