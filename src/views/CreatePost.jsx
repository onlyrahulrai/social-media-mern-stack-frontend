import React, { useEffect, useState } from "react";
import { Button, Card, CardBody, FormGroup, Input, Label } from "reactstrap";
import { Form } from "reactstrap";
import { Editor } from "react-draft-wysiwyg";
import { ContentState, EditorState, convertToRaw } from "draft-js";
import { toast } from "react-hot-toast";
import axiosInstance from "../api/base";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useAuthStore, useLayoutStore } from "../store/store";
import draftToHtml from "draftjs-to-html";
import { getPost } from "../helper/helper";
import htmlToDraft from "html-to-draftjs";
import Spinner from "../components/Spinner";
import DummyImage from "../assets/posts/1.jpg";
import { convertToBase64 } from "../helper/convert";

const initalState = {
  title: "",
  description: EditorState.createEmpty(),
};

const CreatePost = () => {
  const { id } = useParams();
  const location = useLocation();
  const [state, setState] = useState(initalState);
  const { loading, setLoading } = useLayoutStore((state) => state);
  const navigate = useNavigate();
  const { auth,socket } = useAuthStore((state) => state);
  const [photo, setPhoto] = useState(null);
  const [displayImage, setDisplayImage] = useState(null);

  console.log(" Auth ",auth)

  useEffect(() => {
    const fetchPost = () => {
      setLoading(true);
      getPost(id)
        .then(({ data }) => {
          const { title, description, photo } = data;

          if (Object.keys(auth).length && auth?.id !== data?.user?._id) {
            toast.error(" Your aren't allowed to edit this post!");

            return navigate("/");
          }

          const blocksFromHTML = htmlToDraft(description);

          const contentState = ContentState.createFromBlockArray(
            blocksFromHTML.contentBlocks,
            blocksFromHTML.entityMap
          );

          const newEditorState = EditorState.createWithContent(contentState);

          setDisplayImage(`${process.env.REACT_APP_STATIC_BASE_URL}/${photo}`);

          Promise.resolve(
            setState((state) => ({
              ...state,
              title,
              description: newEditorState,
            }))
          ).then(() => setLoading(false));
        })
        .catch((error) => toast.error(error));
    };
    if (id) {
      fetchPost();
    } else {
      setState(initalState);
    }
  }, [location]);

  const onEditorStateChange = (content) => {
    setState((state) => ({ ...state, description: content }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    try {
      const { title, description } = state;

      const content = description.getCurrentContent();

      if (!title || content.getPlainText().length === 0 || !displayImage)
        return toast.error("Please fill out all the required fields.");

      setLoading(true);

      const contentRaw = convertToRaw(content);

      const formData = new FormData();

      formData.append("title", title);
      formData.append("description", draftToHtml(contentRaw));

      if (photo) {
        formData.append("photo", photo);
      }

      const createPostPromise = id
        ? axiosInstance.put(`/posts/${id}/`, formData)
        : axiosInstance.post(`/posts/`, formData);

      toast.promise(createPostPromise, {
        loading: "Creating...",
        success: `Post ${id ? "Updated" : "Created"} Successfully`,
        error: "Couldn't create post.",
      });

      createPostPromise
        .then(({ data }) => {
          setLoading(false);

          if(!id){
            socket.emit("onCreatePostRequest",{post:data?.id})
          }

          navigate(`/posts/${data?.id}`);
        })
        .catch((error) => {
          setLoading(false);
        });
    } catch (error) {
      setLoading(false);
      toast.error("Couldn't create post.");
    }
  };

  const onSelectImage = async (e) => {
    const photo = e.target.files[0];

    Promise.resolve(setDisplayImage(await convertToBase64(photo))).then(() =>
      setPhoto(photo)
    );
  };

  const onDeselectImage = () => {
    Promise.resolve(setDisplayImage(null)).then(() => setPhoto(null));
  };

  console.log(" Loading ",loading && id)

  if (loading && id) return <Spinner style={{ minHeight: "68vh" }} />;

  return (
    <Card className="my-5">
      <CardBody>
        <h3 className="text-center">{id ? "Update " : "Create "} Post</h3>
        <Form className="mt-5" onSubmit={onSubmit}>
          <FormGroup>
            <Label for="title">Title</Label>
            <Input
              plaintext
              placeholder="Write something here..."
              value={state.title}
              onChange={(e) =>
                setState((state) => ({ ...state, title: e.target.value }))
              }
            />
          </FormGroup>
          <FormGroup>
            <Label htmlFor="Image">Thumbnail</Label>
            <div className="d-flex align-items-center">
              {displayImage ? (
                <img
                  src={displayImage}
                  alt="profile"
                  className="img-fluid object-fit rounded"
                  width="356px"
                  height="auto"
                />
              ) : null}

              <div>
                {displayImage ? (
                  <span
                    className="btn btn-outline-danger mx-4"
                    onClick={onDeselectImage}
                  >
                    Remove Image
                  </span>
                ) : (
                  <input
                    onChange={onSelectImage}
                    type="file"
                    id="profile"
                    name="profile"
                  />
                )}
              </div>
            </div>
          </FormGroup>
          <FormGroup>
            <Label for="description">Description</Label>
            <Card>
              <CardBody>
                <Editor
                  editorState={state.description}
                  wrapperClassName="wrapper-class"
                  editorClassName="editor-class"
                  toolbarClassName="toolbar-class"
                  onEditorStateChange={onEditorStateChange}
                  editorStyle={{ minHeight: "298px" }}
                />
              </CardBody>
            </Card>
          </FormGroup>
          <Button color="primary" type="submit" disabled={loading}>
            {id ? "Update" : "Create"}
          </Button>
        </Form>
      </CardBody>
    </Card>
  );
};

export default CreatePost;
