import React, { useEffect, useState } from "react";
import AddQuestion from "./AddQuestions";
import ViewQuestion from "./ViewQuestions";
import { AdminHeader, Wrapper, SideBar } from "../../components";
import {
  Container,
  Form,
  Col,
  Row,
  Button,
  Alert,
  Spinner,
} from "react-bootstrap";

function Index() {
  const [questions, setquestions] = useState([]);

  useEffect(() => {
    fetchQuestions();
  }, []);

  const fetchQuestions = async () => {
    try {
      const res = await fetch("http://localhost:5000/admin/questions");
      const data = await res.json();
      //updateing state with lastest data
      console.log(data);
      data.map((que) => {
        que.disabled = false;
      });

      setquestions(data);
    } catch (e) {
      //if failed to communicate with api this code block will run
      console.log(e);
    }
  };

  return (
    <Wrapper>
      <SideBar />
      <Container>
        <AdminHeader active="/problems" />
        <Alert variant={"primary"}>
          <Row>
            <Container as={Col}>
              <h6 className="text-center ">Developing area - Policy</h6>
            </Container>
          </Row>
        </Alert>
        <AddQuestion onChange={fetchQuestions}></AddQuestion>
        <ViewQuestion
          questions={questions}
          onChange={fetchQuestions}
        ></ViewQuestion>
      </Container>
    </Wrapper>
  );
}

export default Index;
