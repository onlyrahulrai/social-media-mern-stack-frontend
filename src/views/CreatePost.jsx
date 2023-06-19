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
  const auth = useAuthStore((state) => state.auth)

  useEffect(() => {
    const fetchPost = () => {
      setLoading(true);
      getPost(id)
        .then(({ data }) => {
          const { title, description } = data;

          if(auth?.id !== data?.user?._id){
            toast.error(" Your aren't allowed to edit this post!")

            return navigate("/")
          }

          const blocksFromHTML = htmlToDraft(description);

          const contentState = ContentState.createFromBlockArray(
            blocksFromHTML.contentBlocks,
            blocksFromHTML.entityMap
          );

          const newEditorState = EditorState.createWithContent(contentState);

          setState((state) => ({
            ...state,
            title,
            description: newEditorState,
          }));
          setLoading(false);
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

      if (!title || content.getPlainText().length === 0)
        return toast.error("Please fill out all the required fields.");

      setLoading(true);

      const contentRaw = convertToRaw(content);

      const createPostPromise = id
        ? axiosInstance.put(`/posts/${id}/`, {
            title,
            description: draftToHtml(contentRaw),
          })
        : axiosInstance.post(`/posts/`, {
            title,
            description: draftToHtml(contentRaw),
          });

      toast.promise(createPostPromise, {
        loading: "Creating...",
        success: `Post ${id ? "Updated" : "Created"} Successfully`,
        error: "Couldn't create post.",
      });

      createPostPromise.then(({ data: { id } }) => {
        setLoading(false);
        navigate(`/posts/${id}`);
      });
    } catch (error) {
      setLoading(false);
      toast.error("Couldn't create post.");
    }
  };

  if (loading && id) return <Spinner style={{ minHeight: "68vh" }} />;

  return (
    <Card className="my-5">
      <CardBody>
        <h3 className="text-center">{id ? "Update " : "Create " } Post</h3>
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
