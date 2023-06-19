import moment from "moment";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardBody,
  CardSubtitle,
  CardText,
  CardTitle,
} from "reactstrap";
import { getLinesOfDescription } from "../../helper/common";

const Post = (props) => {
  const { _id: id, title, description, created_at } = props;
  const navigate = useNavigate();
  const [content, setContent] = useState("");

  useEffect(() => {
    const texts = getLinesOfDescription(description)

    if (texts.length > 0) {
      setContent(texts[0]);
    }
  }, []);

  return (
    <div className="post-card">
      <Card>
        <img alt="Sample" src="https://picsum.photos/300/200" />
        <CardBody>
          <CardTitle tag="h5">{title}</CardTitle>
          <CardSubtitle className="mb-2 text-muted" tag="h6">
            {moment(created_at).format("ll")}
          </CardSubtitle>
          <CardText>{content ? `${content}..` : null}</CardText>
          <span
            className="btn btn-primary"
            onClick={() => navigate(`/posts/${id}`)}
            color="info"
          >
            View
          </span>
        </CardBody>
      </Card>
    </div>
  );
};

export default Post;
