import React, { useEffect, useState } from "react";
import { Container, Form, Col, Row, Button } from "react-bootstrap";
function AddQuestions(props) {
  const [errormessage, setErrormessage] = useState("");
  const [question, setQuestion] = useState("");

  const myChangeHandler = (event) => {
    let val = event.target.value;
    let name = event.target.name;
    setQuestion(val);
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    let err;
    if (question == "") {
      err = <strong style={{ color: "red" }}>Please enter something!</strong>;
      setErrormessage(err);
    } else {
      try {
        const requestOptions = {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            question: question,
          }),
        };
        await fetch("http://localhost:5000/admin/new-question", requestOptions);

        setQuestion("");
        props.onChange();
      } catch (e) {
        console.log(e);
      }
    }
  };

  return (
    <>
      <Form noValidate>
        <Form.Row>
          <Form.Group as={Col}>
            <Form.Label>Enter your query in the following area</Form.Label>

            <Form.Control
              className="inputBackground "
              name="question"
              placeholder=""
              as="textarea"
              rows={3}
              value={question}
              required
              onChange={myChangeHandler}
              style={{ border: "none", backgroundColor: "#eefbfd" }}
            />
            {errormessage}
          </Form.Group>
        </Form.Row>
        <Button variant="info" type="submit" onClick={onSubmit}>
          Submit
        </Button>
      </Form>
    </>
  );
}

export default AddQuestions;
