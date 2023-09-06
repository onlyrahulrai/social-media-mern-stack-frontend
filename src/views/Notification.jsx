import React, { useEffect, useState } from "react";
import axiosInstance from "../api/base";
import { useAuthStore } from "../store/store";
import Spinner from "../components/Spinner";
import NoContent from "../components/profile/NoContent";
import { Col, Row } from "reactstrap";
import { getImageUrl } from "../helper/common";
import Avatar from "../assets/profile.png";
import moment from "moment";
import { NotificationContent } from "../components";
import useSocketContext from "../context/useSocketContext";

const Notification = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { setState, notifications } = useAuthStore();
  const {socket} = useSocketContext(); 

  useEffect(() => {
    const fetchNotification = async () => {
      setLoading(true);

      await axiosInstance
        .get("/notifications")
        .then((response) => {
          if (!response)
            throw new Error(
              "Something went wrong\nPlease try again after some time later."
            );

          const notifications = response.data;

          Promise.resolve(setState({ notifications })).then(() =>
            setLoading(false)
          );
        })
        .catch((error) => {
          Promise.resolve(setError(error.message)).then(() =>
            setLoading(false)
          );
        });
    };

    fetchNotification();
  }, []);

  const onReadNotification = (id) => {
    socket.emit("onNotificationMarkedReadRequest", id);
  };

  if (error)
    return (
      <div
        className="d-flex justify-content-center align-items-center text-center"
        style={{ minHeight: "70vh" }}
      >
        <pre className="text-danger">{error}</pre>
      </div>
    );

  if (loading) return <Spinner style={{ minHeight: "70vh" }} />;

  return (
    <div
      className={`d-flex text-center ${
        !notifications.length ? "justify-content-center" : ""
      } flex-column`}
      style={{ minHeight: "70vh" }}
    >
      {!notifications.length ? (
        <NoContent text={"No Notification Found"} />
      ) : null}

      {notifications
        .sort((a, b) => a.read - b.read)
        .map((notification, key) => (
          <Row
            className={`my-1 cursor-pointer d-flex justify-content-center `}
            onClick={() => onReadNotification(notification?._id)}
            key={key}
          >
            <Col
              md={8}
              className={`d-flex shadow-sm rounded px-2 py-1 justify-content-between align-items-center ${
                !notification.read ? "bg-light-gray" : ""
              }`}
            >
              <div className="d-flex align-items-center">
                <img
                  alt={notification?.created_by?.id}
                  src={
                    notification?.created_by?.profile
                      ? getImageUrl(notification?.created_by?.profile)
                      : Avatar
                  }
                  className="object-fit-contain rounded-full"
                  style={{ width: "64px", height: "64px" }}
                />
                <NotificationContent notification={notification} />
              </div>
              <span>{moment(notification.created_at).fromNow()}</span>
            </Col>
          </Row>
        ))}
    </div>
  );
};

export default Notification;
