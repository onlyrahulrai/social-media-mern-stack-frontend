import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axiosInstance from "../api/base";
import moment from "moment";
import { EditorState, ContentState } from "draft-js";
import { Editor } from "react-draft-wysiwyg";
import { useAuthStore } from "../store/store";
import htmlToDraft from "html-to-draftjs";
import { toast } from "react-hot-toast";
import Spinner from "../components/Spinner";
import { Link } from "react-router-dom";
import Avatar from "../assets/profile.png";
import { capitalizeString, getImageUrl } from "../helper/common";
import {
  EllipsisVerticalIcon,
  PencilIcon,
  TrashIcon,
  HandThumbUpIcon,
  ChatBubbleOvalLeftEllipsisIcon,
  ShareIcon,
  BookmarkIcon,
  LinkIcon,
} from "@heroicons/react/24/outline";
import {
  Card,
  CardBody,
  CardGroup,
  CardImg,
  CardSubtitle,
  Col,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  Row,
  UncontrolledDropdown,
} from "reactstrap";
import {
  FacebookIcon,
  FacebookShareButton,
  LinkedinIcon,
  LinkedinShareButton,
  TwitterIcon,
  TwitterShareButton,
} from "react-share";
import Comment from "../components/post/Comment";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import useSocketContext from "../context/useSocketContext";

const ShareButtons = () => {
  const onCopyPostURL = () => {
    Promise.resolve(navigator.clipboard.writeText(window.location.href)).then(
      () => {
        toast("Link Copied", {
          icon: "📋",
          style: {
            borderRadius: "10px",
            background: "#333",
            color: "#fff",
          },
        });
      }
    );
  };

  return (
    <UncontrolledDropdown className="me-2">
      <DropdownToggle color="light">
        <div className="cursor-pointer">
          <ShareIcon style={{ width: "1.5rem", height: "1.5rem" }} />{" "}
        </div>
      </DropdownToggle>
      <DropdownMenu style={{ width: "198px" }} className="px-2">
        <span
          onClick={onCopyPostURL}
          className="btn menu-item"
          role="menuitem"
          tabIndex={0}
        >
          <LinkIcon style={{ width: "1.5rem", height: "1.5rem" }} />{" "}
          <span>Copy Link</span>
        </span>

        <DropdownItem divider />

        <FacebookShareButton
          url={"https://github.com/nygardk/react-share"}
          title={"Check out this cool website"}
          className="btn menu-item mb-2"
          role="menuitem"
          tabIndex={0}
        >
          <FacebookIcon size={24} round={true} /> Share on Facebook
        </FacebookShareButton>

        <TwitterShareButton
          url={"https://github.com/nygardk/react-share"}
          title={"Check out this cool website"}
          className="btn menu-item mb-2"
          role="menuitem"
          tabIndex={0}
        >
          <TwitterIcon size={24} round={true} /> Share on Twitter
        </TwitterShareButton>

        <LinkedinShareButton
          url={"https://github.com/nygardk/react-share"}
          title={"Check out this cool website"}
          className="btn menu-item"
          role="menuitem"
          tabIndex={0}
        >
          <LinkedinIcon size={24} round={true} /> Share on LinkedIn
        </LinkedinShareButton>
      </DropdownMenu>
    </UncontrolledDropdown>
  );
};

const buttonColors = [
  "primary",
  "secondary",
  "info",
  "danger",
  "warning",
  "black",
];

const PostDetail = () => {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [relatedPosts, setRelatedPosts] = useState([]);
  const { setAuth, auth} = useAuthStore((state) => state);
  const {onPostLikedRequestNotification} = useSocketContext();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPost = async () => {
      setLoading(true);

      await axiosInstance
        .get(`/posts/${id}`)
        .then(({ data: { post, relatedPosts } }) => {
          const { description, ...rest } = post;
          const blocksFromHTML = htmlToDraft(description);

          const contentState = ContentState.createFromBlockArray(
            blocksFromHTML.contentBlocks,
            blocksFromHTML.entityMap
          );

          const newEditorState = EditorState.createWithContent(contentState);

          setPost({ ...rest, description: newEditorState });

          setRelatedPosts(relatedPosts);

          setLoading(false);
        })
        .catch((error) => {
          toast.error("Couldn't fetch the post.");
        });
    };

    fetchPost();
  }, []);

  const onDeletePost = async () => {
    try {
      const deletePostPromise = axiosInstance.delete(`/posts/${id}`);

      toast.promise(deletePostPromise, {
        loading: "Deleting...",
        success: "Post Deleted Successfully...",
        error: "Couldn't delete the post.",
      });

      deletePostPromise.then(() => navigate("/"));
    } catch (error) {
      toast.error("Couldn't delete the post.");
    }
  };

  const onLikePost = async () => {
    try {
      const likePostPromise = axiosInstance.put(`/posts/${id}/like/`);

      toast.promise(likePostPromise, {
        loading: "Checking...",
        success: "Success...",
        error: "Couldn't accept your request...",
      });

      likePostPromise.then(({ data }) => {
        setPost((state) => ({ ...state, likes: data?.likes }));

        onPostLikedRequestNotification({
          liked: data?.likes.includes(auth?.id),
          postId: id,
          user: post?.user?._id,
        });
      });
    } catch (error) {
      return toast.error(" Couldn't accept your request... ");
    }
  };

  const onPostSaved = async () => {
    try {
      const body = {
        postId: id,
      };

      const savePostPromise = axiosInstance.put(`/featured-posts/`, body);

      toast.promise(savePostPromise, {
        loading: "Saving...",
        success: "Post Saved Successfully...",
        error: "Couldn't Save the post...",
      });

      savePostPromise.then(({ data: { featuredPosts } }) => {
        setAuth({ ...auth, featuredPosts });
      });
    } catch (error) {
      return toast.error(" Couldn't Save the post... ");
    }
  };

  const isPostSaved = useMemo(
    () => auth?.featuredPosts?.map(({ _id }) => _id).includes(id),
    [auth]
  );

  if (loading) return <Spinner />;

  return (
    <div>
      <article className="blog-post">
        <div className="d-flex justify-content-between">
          <div className="d-flex align-items-center my-3">
            {post?.user?.profile ? (
              <img
                src={getImageUrl(post?.user?.profile) || Avatar}
                alt=""
                width={42}
                height={42}
                className="object-fit-contain rounded-full cursor-pointer"
                onClick={() => navigate(`/${post?.user?.username}`)}
              />
            ) : null}
            <div className="mx-2">
              <div>
                <span>
                  {capitalizeString(post?.user?.firstName)}{" "}
                  {capitalizeString(post?.user?.lastName)}
                </span>{" "}
                {" - "} <span>@{capitalizeString(post?.user?.username)}</span>
              </div>
              <span className="blog-post-meta">
                {moment(post?.created_at).format("ll")}
              </span>
            </div>
          </div>
          {auth?.id === post?.user?._id ? (
            <UncontrolledDropdown className="me-2">
              <DropdownToggle caret color="light">
                <EllipsisVerticalIcon
                  style={{ width: "1.5rem", height: "1.5rem" }}
                />
              </DropdownToggle>
              <DropdownMenu>
                <DropdownItem>
                  <Link
                    className="cursor-pointer btn"
                    to={`/posts/${post?._id}/update/`}
                  >
                    <PencilIcon style={{ width: "1.5rem", height: "1.5rem" }} />{" "}
                    Edit
                  </Link>
                </DropdownItem>

                <DropdownItem>
                  <span className="cursor-pointer btn" onClick={onDeletePost}>
                    <TrashIcon style={{ width: "1.5rem", height: "1.5rem" }} />{" "}
                    Delete
                  </span>
                </DropdownItem>
              </DropdownMenu>
            </UncontrolledDropdown>
          ) : null}
        </div>

        <h2 className="blog-post-title mb-1">{post?.title}</h2>

        <Editor
          editorState={post?.description}
          toolbarHidden={true}
          readOnly={true}
        />

        <div className="mb-3">
          {post?.categories.map((category, key) => (
            <span
              className={`badge rounded-pill text-bg-${
                buttonColors[Math.floor(Math.random() * 6)]
              } text-white p-2`}
              key={key}
            >
              {category.label}
            </span>
          ))}
        </div>

        <section id="footer">
          <Row>
            <Col md="6" className="d-flex align-items-center gap-4">
              <div className={`cursor-pointer`}>
                {auth ? (
                  <HandThumbUpIcon
                    onClick={onLikePost}
                    style={{ width: "1.5rem", height: "1.5rem" }}
                    color={`${
                      post?.likes?.includes(auth?.id) ? "#0d6efd" : null
                    }`}
                  />
                ) : (
                  <Link
                    to="/login"
                    state={{ pathname: `posts/${id}` }}
                    className="text-dark"
                  >
                    <HandThumbUpIcon
                      style={{ width: "1.5rem", height: "1.5rem" }}
                      color={`${
                        post?.likes?.includes(auth?.id) ? "#0d6efd" : null
                      }`}
                    />
                  </Link>
                )}{" "}
                <span>{post?.likes?.length}</span>
              </div>
              <div className="cursor-pointer">
                <button
                  className="btn"
                  type="button"
                  data-bs-toggle="offcanvas"
                  data-bs-target="#demo"
                >
                  <ChatBubbleOvalLeftEllipsisIcon
                    style={{ width: "1.5rem", height: "1.5rem" }}
                  />{" "}
                  <span>{post?.comments?.length}</span>
                </button>
              </div>

              {post?.comments ? (
                <Comment comments={post?.comments} setPost={setPost} />
              ) : null}
            </Col>
            <Col
              md="6"
              className="d-flex align-items-center gap-4 justify-content-end"
            >
              <ShareButtons />

              <div className="cursor-pointer">
                {auth ? (
                  <BookmarkIcon
                    style={{
                      width: "1.5rem",
                      height: "1.5rem",
                      color: isPostSaved ? "#0d6efd" : null,
                    }}
                    onClick={() => (auth ? onPostSaved() : void 0)}
                  />
                ) : (
                  <Link
                    to="/login"
                    state={{ pathname: `posts/${id}` }}
                    className="text-dark"
                  >
                    <BookmarkIcon
                      style={{
                        width: "1.5rem",
                        height: "1.5rem",
                        color: isPostSaved ? "#0d6efd" : null,
                      }}
                    />
                  </Link>
                )}
              </div>
            </Col>
          </Row>
        </section>

        <section id="related-post">
          <hr />
          <div className="py-2">
            <h4 className="fst-italic">Related Posts</h4>

            <CardGroup className="pt-4 gap-2">
              {relatedPosts.map((post, key) => (
                <Card
                  key={key}
                  style={{
                    borderRadius: "24px 8px 24px 24px",
                    border: "1px solid rgba(57, 57, 57, 0.5)",
                  }}
                >
                  <div
                    className="d-flex position-relative"
                    style={{ minHeight: "156px" }}
                  >
                    <CardImg
                      alt="Card image cap"
                      src={getImageUrl(post.photo)}
                      top
                      width="100%"
                      style={{
                        maxHeight: "156px",
                        objectFit: "fill",
                        borderRadius: "24px 8px 24px 24px",
                      }}
                    />

                    <div
                      className="d-flex align-items-center position-absolute bottom-0 w-100 ps-3"
                      style={{
                        backgroundColor: "rgba(57, 57, 57, 0.5)",
                        borderRadius: "0 0 24px 24px",
                      }}
                    >
                      <img
                        src={getImageUrl(post?.user?.profile)}
                        width={36}
                        alt=""
                      />

                      <div className="ps-3 text-white">
                        <span>
                          <b>
                            {capitalizeString(
                              `${post?.user?.firstName} ${post?.user?.lastName}`
                            )}
                          </b>
                        </span>
                        <br />
                        <span>
                          <Link
                            to={`/${post?.user?.username}`}
                            className="text-decoration-none text-white"
                          >
                            - @{post?.user?.username}
                          </Link>
                        </span>
                      </div>
                    </div>
                  </div>

                  <Link
                    to={`/posts/${post._id}`}
                    target="_blank"
                    className="text-decoration-none text-dark"
                  >
                    <CardBody>
                      <CardSubtitle tag="h6">
                        {post.title.length > 48
                          ? `${post.title.substring(0, 48)}...`
                          : post.title}
                      </CardSubtitle>
                    </CardBody>
                  </Link>

                </Card>
              ))}
            </CardGroup>
          </div>
        </section>
      </article>
    </div>
  );
};

export default PostDetail;
