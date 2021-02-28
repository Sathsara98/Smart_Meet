import React, { useEffect, useState } from "react";
import AddQuestion from "./AddQuestions";
import ViewQuestion from "./ViewQuestions";
import { AdminHeader } from "../../components";
import { Container, Form, Col, Row, Button } from "react-bootstrap";

function Index() {
  const [questions, setquestions] = useState([]);

  useEffect(() => {
    fetchQuestions();
  }, []);

  const fetchQuestions = async () => {
    try {
      const res = await fetch("http://localhost:5000/questions");
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
    <Container>
      <AdminHeader active="/problems" />
      <AddQuestion onChange={fetchQuestions}></AddQuestion>
      <ViewQuestion
        questions={questions}
        onChange={fetchQuestions}
      ></ViewQuestion>
    </Container>
  );
}

export default Index;
