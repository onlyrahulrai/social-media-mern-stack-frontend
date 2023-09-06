import React, { Component } from "react";
import { UncontrolledCarousel } from "reactstrap";
import axiosInstance from "../../api/base";
import { getImageUrl, getLinesOfDescription } from "../../helper/common";

class Carousel extends Component {
  constructor(props) {
    super(props);

    this.state = {
      posts: [],
      loading: false,
      error: null,
    };
  }

  fetchPosts = async () => {
    this.setState({ loading: true });

    await axiosInstance
      .get("/latest-posts")
      .then((response) => {
        const posts = response.data.map((post) => {
          let content = "";

          const texts = getLinesOfDescription(post?.description);

          if (texts.length > 0) {
            content = texts[0]
          }

          return {
            key:post._id,
            caption:post.title,
            alt:content.length > 48 ? `${content.substring(0,48)}...` : content,
            src:getImageUrl(post?.photo)
          }
        });

        this.setState({ posts }, () => {
          this.setState({ loading: false });
        });
      })
      .catch((error) => {
        console.log(" Error ", error);
        this.setState({
          loading: false,
          error: "Couldn't fetch latest posts",
        });
      });
  };

  componentDidMount() {
    this.fetchPosts();
  }

  render() {
    return (
      <div className="mb-4 hero-carousel">
        <UncontrolledCarousel
          items={this.state.posts}
        />
      </div>
    );
  }
}

export default Carousel;
