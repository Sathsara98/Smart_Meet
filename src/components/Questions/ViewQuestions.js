import React, {
  useState,
  useEffect,
  forwardRef,
  useImperativeHandle,
} from "react";
import { Card, Form, Col, Row, Button, Container } from "react-bootstrap";

const ViewQuestions = forwardRef((props, ref) => {
  const [questions, setquestions] = useState(props.questions);
  const [delId, setDelId] = useState(null);
  useEffect(() => {
    setquestions(props.questions);
  }, []);
  useEffect(() => {
    console.log(props.reaction);
    setquestions(props.questions);
  }, [props.questions]);

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
  // useImperativeHandle(ref, (prop) => ({
  //   delete(prop) {
  //     deleteComment(null, prop);
  //   },
  // }));
  async function deleteComment(id) {
    props.show(
      true,
      "This step can not be undone!",
      true,
      async function (res) {
        if (res == true) {
          try {
            const requestOptions = {
              method: "DELETE",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ id: id }),
            };
            await fetch(
              "http://localhost:5000/admin/questions",
              requestOptions
            );

            props.onChange();
          } catch (e) {
            console.log(e);
          }
        }
      }
    );
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
      await fetch("http://localhost:5000/admin/questions", requestOptions);
      props.show(true, "Question has updated!", false, function (res) {});
      editComment(ques[0]._id);
    } catch (e) {
      console.log(e);
    }
  }
  if (props.loading == true) {
    return <h1>Loading..</h1>;
  }
  return (
    <div>
      <br />
      {questions.map((que, key) => (
        <Card
          key={que._id}
          style={{ marginTop: "2%", backgroundColor: "#eefbfd" }}
        >
          <Card.Body>
            <Card.Title style={{ fontWeight: "bolder" }}>
              QUESTION {key + 1} - {que.dArea}
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
                  color: "#37474F",
                  fontSize: "1em",
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
});

export default ViewQuestions;
