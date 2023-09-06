import {
  EllipsisVerticalIcon,
  MagnifyingGlassIcon,
  PaperAirplaneIcon,
} from "@heroicons/react/24/outline";
import React from "react";
import { Button, Form, Input } from "reactstrap";
import useChatContext from "../../context/useChatContext";
import EmptyChatScreen from "../../assets/empty-chat-screen.png";
import UserAvatar from "../common/UserAvatar";
import { capitalizeString } from "../../helper/common";

const Body = () => {
  const { selectedContact } = useChatContext();

  return (
    <div className="border" style={{ height: "72vh" }}>
      {selectedContact ? (
        <>
          <div
            className="border-bottom p-2 d-flex justify-content-between align-items-center"
            style={{ height: "8%" }}
          >
            <div className="d-flex align-items-center ">
              <UserAvatar user={selectedContact} chat />

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
          <div className="position-relative" style={{ height: "92%" }}>
            <div className="position-absolute bottom-0 w-100">
              <Form>
                <div className="d-flex">
                  <Input placeholder="Type a Message..." />
                  <Button type="submit" color="primary">
                    <PaperAirplaneIcon
                      style={{ width: "1.5rem", height: "1.5rem" }}
                    />
                  </Button>
                </div>
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
