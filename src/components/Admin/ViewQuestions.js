import React, { useState, useEffect, H1 } from "react";
import { Card, Form, Col, Row, Button, Container } from "react-bootstrap";

function ViewQuestions(props) {
  const [questions, setquestions] = useState([]);

  useEffect(() => {
    setquestions(props.questions);
  }, [props.questions, questions]);

  function editComment(id) {
    console.log(id);

    const items = [...questions];
    items.map((item) => {
      if (item._id === id) {
        if (item.disabled == false) {
          item.disabled = true;
        } else {
          item.disabled = false;
        }
      }
    });
    setquestions(items);
  }
  function handleChange(index, event) {
    const val = event.target.value;
    const items = [...questions];
    items.map((item) => {
      if (item._id === index) {
        item.body = val;
      }
      setquestions(items);
    });
  }
  async function deleteComment(id) {
    try {
      const requestOptions = {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: id }),
      };
      await fetch("http://localhost:5000/questions", requestOptions);
      alert("Deleted");
      props.onChange();
    } catch (e) {
      console.log(e);
    }
  }

  async function updateComment(id) {
    try {
      const items = [...questions];
      let ques = items
        .filter((item) => item._id == id)
        .map((item) => {
          return item;
        });

      const requestOptions = {
        method: "PUT",
        headers: { "Content-Type": "application/json" },

        body: JSON.stringify({
          id: ques[0]._id,
          message: ques[0].body,
        }),
      };
      await fetch("http://localhost:5000/questions", requestOptions);
      alert("Updated");
      editComment(ques[0]._id);
    } catch (e) {
      console.log(e);
    }
  }
  if (questions == null) {
    return <H1>Loading Table...</H1>;
  }
  return (
    <div>
      <br />
      {questions.map((que, key) => (
        <Card key={que._id} style={{ marginTop: "2%" }}>
          <Card.Body>
            <Card.Title>
              Question {key + 1}{" "}
              <span style={{ float: "right" }}>
                {!que.disabled ? (
                  <i
                    onClick={() => editComment(que._id)}
                    className="far fa-edit "
                  />
                ) : (
                  <i
                    onClick={() => updateComment(que._id)}
                    className="fas fa-check "
                  />
                )}
                &emsp;
                <i
                  onClick={(e) => {
                    if (
                      window.confirm(
                        "Are you sure you wish to delete this item?"
                      )
                    )
                      deleteComment(que._id);
                  }}
                  className="far fa-trash-alt "
                ></i>
                &emsp;
              </span>
            </Card.Title>

            <Card.Text>
              <Form.Control
                style={{
                  backgroundColor: "transparent",
                }}
                name="question"
                placeholder=""
                as="textarea"
                rows={3}
                value={que.body}
                required
                onChange={(e) => handleChange(que._id, e)}
                disabled={que.disabled ? "" : "disabled"}
              />
            </Card.Text>
          </Card.Body>
        </Card>
      ))}
    </div>
  );
}

export default ViewQuestions;
