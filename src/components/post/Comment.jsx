import React, { useState } from "react";
import { Button, Form, Input } from "reactstrap";
import { useAuthStore } from "../../store/store";
import Avatar from "../../assets/profile.png";
import { capitalizeString, getImageUrl } from "../../helper/common";
import UserCard from "../common/UserCard";
import { ChatBubbleOvalLeftIcon } from "@heroicons/react/24/outline";
import axiosInstance from "../../api/base";
import { toast } from "react-hot-toast";
import { useParams } from "react-router-dom";

const CommentForm = ({ isReply, id, setPost, ...rest }) => {
  const [content, setContent] = useState("");
  const { auth } = useAuthStore((state) => state);
  const [isFocused, setIsFocused] = useState(false);

  const onChangeFocused = () => setIsFocused((state) => !state);

  const onComment = async (e) => {
    e.preventDefault();

    try {
      const data = {
        content,
      };

      const commentPromise = axiosInstance.put(`/posts/${id}/comment/`, data);

      toast.promise(commentPromise, {
        loading: "Commenting...",
        success: "Success...",
        error: "Couldn't accept your request...",
      });

      await commentPromise.then(({ data }) => {
        setContent("");
        setIsFocused(false);
        setPost((state) => ({ ...state, comments: data }));
      });
    } catch (error) {
      return toast.error(" Couldn't accept your request... ");
    }
  };

  const onReply = async (e) => {
    e.preventDefault();

    try {
      const data = {
        content,
      };

      const replyPromise = axiosInstance.put(
        `/posts/${id}/comment/${rest?.comment || rest?._id}/reply`,
        data
      );

      toast.promise(replyPromise, {
        loading: "Replying...",
        success: "Success...",
        error: "Couldn't accept your request...",
      });

      await replyPromise.then(({ data }) => {
        setContent("");
        setIsFocused(false);
        setPost((state) => ({ ...state, comments: data }));
      });
    } catch (error) {
      return toast.error(" Couldn't accept your request... ");
    }
  };

  return (
    <div
      className={`shadow-lg py-4 px-3 mt-3 ${
        rest.isOpen ? "d-block" : "d-none"
      }`}
    >
      {!isReply && isFocused ? (
        <div className="d-flex flex-row gap-2 align-items-center mb-4">
          <img
            src={getImageUrl(auth?.profile) || Avatar}
            alt="User"
            width={42}
            height={42}
            className="object-fit-contain rounded-full cursor-pointer border shadow-lg"
          />
          <span>
            {capitalizeString(auth?.firstName)}{" "}
            {capitalizeString(auth?.lastName)}
          </span>
        </div>
      ) : null}
      <Form>
        <Input
          type="text"
          placeholder="What are you thoughts?"
          required
          value={content}
          onChange={(e) => setContent(e.target.value)}
          onFocus={onChangeFocused}
          className="border-0 outline-0"
        />
      </Form>
      {isFocused ? (
        <div
          className={`d-flex justify-content-end ${isReply ? "mt-3" : "mt-5"}`}
        >
          <div className="d-flex gap-3">
            <Button
              type="button"
              color="light"
              className="rounded"
              onClick={onChangeFocused}
            >
              Cancel
            </Button>
            <Button
              type="button"
              color="success"
              className="rounded"
              onClick={isReply ? onReply : onComment}
            >
              Respond
            </Button>
          </div>
        </div>
      ) : null}
    </div>
  );
};

const CommentContent = (props) => {
  const [isOpen, setIsOpen] = useState(false);
  const { id } = useParams();
  const {
    user,
    createdAt: commentCreatedAt,
    content,
    onExpand,
    replies,
    setPost,
  } = props;
  const { auth } = useAuthStore((state) => state);

  return (
    <div>
      <UserCard user={{ ...user, commentCreatedAt }} />

      <div className="my-2">{content}</div>

      <div className="d-flex justify-content-between">
        {replies?.length ? (
          <span onClick={onExpand} className="cursor-pointer">
            <ChatBubbleOvalLeftIcon
              style={{ width: "1.5rem", height: "1.5rem" }}
            />{" "}
            <strong className="mt-5">{replies.length} Replies</strong>
          </span>
        ) : (
          <span></span>
        )}

        {auth ? (
          <span
            className="cursor-pointer"
            onClick={() => setIsOpen((state) => !state)}
          >
            Reply
          </span>
        ) : null}
      </div>
      {/* {isOpen ? ( */}
      <div className="my-2">
        <CommentForm
          isReply={true}
          setPost={setPost}
          id={id}
          {...props}
          isOpen={isOpen}
        />
      </div>
      {/*  ) : null} */}
    </div>
  );
};

const CommentCard = (props) => {
  const [expand, setExpand] = useState(false);

  const onExpand = () => setExpand((state) => !state);

  if (props?.replies?.length) {
    return (
      <div className="mx-4 my-5">
        <CommentContent
          {...props}
          onExpand={onExpand}
          setPost={props.setPost}
        />

        <div
          style={{
            display: expand ? "block" : "none",
            paddingLeft: "12px",
            paddingTop: "3px",
          }}
        >
          {props?.replies?.map((reply, key) => (
            <div className="mx-4" key={`reply-${key}`}>
              <CommentCard
                {...reply}
                setPost={props.setPost}
                comment={props._id}
              />
            </div>
          ))}
        </div>

        <hr />
      </div>
    );
  } else {
    return (
      <div className="mx-4 my-2">
        <CommentContent {...props} onExpand={onExpand} />
      </div>
    );
  }
};

const Comment = ({ comments, setPost }) => {
  const { id } = useParams();

  const { auth } = useAuthStore((state) => state);

  return (
    <div
      className="offcanvas offcanvas-end"
      id="demo"
      style={{ width: "568px" }}
    >
      <div className="offcanvas-header">
        <h4 className="offcanvas-title">Responses ({comments?.length})</h4>
        <button
          type="button"
          className="btn-close"
          data-bs-dismiss="offcanvas"
        ></button>
      </div>
      <div className="offcanvas-body">
        {auth ? <CommentForm setPost={setPost} id={id} isOpen={true} /> : null}

        {comments?.map((comment, key) => (
          <CommentCard {...comment} key={`comment-${key}`} setPost={setPost} />
        ))}
      </div>
    </div>
  );
};

export default Comment;
