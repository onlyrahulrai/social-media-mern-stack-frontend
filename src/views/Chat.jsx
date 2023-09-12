import React, { Component } from "react";
import { Body, Sidebar } from "../components";
import { Col, Row } from "reactstrap";
import { ChatConsumer } from "../context/useChatContext";

class Chat extends Component {
  render() {
    return (
      <ChatConsumer>
        {(props) => (
          <div style={{ minHeight: "70vh" }}>
            <Row>
              <Col md={3} className="p-0">
                <Sidebar />
              </Col>
              <Col md={9} className="p-0">
                <Body />
              </Col>
            </Row>
          </div>
        )}
      </ChatConsumer>
    );
  }
}

export default Chat;
