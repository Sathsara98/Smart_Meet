import React, { useEffect, useState, useRef } from "react";
import AddQuestion from "./AddQuestions";
import ViewQuestion from "./ViewQuestions";
import Model from "../../components/Model";
import "./Question.css";
import {
  BreadCrum,
  SideBar,
  Navbar,
  AdminCard,
  NavbarDashboard,
} from "../../components";
import {
  Container,
  Form,
  Col,
  Row,
  Button,
  Alert,
  Spinner,
} from "react-bootstrap";

import { useLocation, useHistory } from "react-router-dom";
import Footer from "../Footer/Footer";

function Index() {
  // const childRef = useRef();
  const [questions, setquestions] = useState([]);
  const [loading, setLoading] = useState(true);

  let [technology, settechnology] = useState(0);
  let [workforce, setworkforce] = useState(0);
  let [productivity, setproductivity] = useState(0);
  let [marketing, setmarketing] = useState(0);
  const [maxArea, setmaxArea] = useState("");

  const location = useLocation();
  const history = useHistory();

  const [submissionId, setSubmissionId] = useState(null);
  const [mode, setMode] = useState("create"); // 'create' | 'edit' | 'view'

  // const submissionId = location.state?.submissionId || null;
  // const mode = location.state?.mode || "create"; 

  const isReadOnly = mode === "view";

  useEffect(() => {
    const state = location.state || {};

    if (state.submissionId) {
      setSubmissionId(state.submissionId);
      setMode(state.mode || "edit");
      loadSubmission(state.submissionId);
    } else {
      // new submission
      setquestions([]);
      setmaxArea("");
      setLoading(false);
    }

    // optional: clear navigation state so back/forward doesn’t replay it
    history.replace({ ...location, state: {} });
  }, []);

  // load a single submission by id
  const loadSubmission = async (id) => {
    setLoading(true);
    try {
      const res = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/admin/questions/${id}`
      );
      const doc = await res.json();
      // flatten doc.questions into your table structure
      const flattened =
        (doc.questions || []).map((q, index) => ({
          _id: q._id || `${doc._id}-${index}`,
          dArea: q.dArea,
          body: q.body,
          disabled: false,
        })) || [];

      setquestions(flattened);
      findMax(flattened);
    } catch (e) {
      console.error("Error loading submission:", e);
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    // create mode → start fresh
    if (!submissionId || mode === "create") {
      setquestions([]);
      setmaxArea("");
      setLoading(false);
      return;
    }

    // edit or view → load existing submission
    const fetchOne = async () => {
      setLoading(true);
      try {
        const res = await fetch(
          `${process.env.REACT_APP_BACKEND_URL}/admin/questions/${submissionId}`
        );
        const doc = await res.json();
        if (!res.ok) throw new Error(doc.message || "Error loading submission");

        const flattened =
          Array.isArray(doc.questions) ?
            doc.questions.map((q, index) => ({
              _id: q._id || `${doc._id}-${index}`,
              body: q.body,
              dArea: q.dArea,
              disabled: isReadOnly,
            })) : [];

        setquestions(flattened);
        findMax(flattened);
      } catch (e) {
        console.error(e);
        alert("Error loading submission: " + e.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOne();
  }, [submissionId, mode]);


  // const handleAddQuestion = (newItem) => {
  //   const newQuestion = {
  //     _id: Date.now(),
  //     body: newItem.challenge,
  //     dArea: newItem.area,
  //     disabled: false,
  //   };
  //   setquestions((prev) => [...prev, newQuestion]);
  //   findMax([...questions, newQuestion]); 
  // };
  const handleAddQuestion = (newItem) => {
    const newQuestion = {
      _id: Date.now(),
      body: newItem.challenge,
      dArea: newItem.area,
      disabled: false,
    };

    // use functional setState to avoid stale state
    setquestions((prev) => {
      const updatedList = [...prev, newQuestion];
      findMax(updatedList);
      return updatedList;
    });

  };
  // DELETE one question
  const handleDeleteQuestion = (id) => {
    setquestions((prev) => {
      const updated = prev.filter((q) => q._id !== id);
      findMax(updated);
      return updated;
    });
  };

  // UPDATE one question
  const handleUpdateQuestion = (id, updatedData) => {
    setquestions((prev) => {
      const updated = prev.map((q) =>
        q._id === id ? { ...q, ...updatedData } : q
      );
      findMax(updated);
      return updated;
    });
  };

  // 🔹 Build payload for draft or submit
  const buildPayload = (statusValue) => ({
    questions: questions.map((q) => ({
      dArea: q.dArea,
      body: q.body,
    })),
    createdBy: "Sathsara",
    status: statusValue,
    maxArea: maxArea,
  });



  const handleSubmitAll = async () => {
    if (questions.length === 0) {
      alert("Please add at least one question!");
      return;
    }

    const payload = buildPayload("submitted");

    try {
      let res;
      if (submissionId) {
        // submit existing draft
        res = await fetch(
          `${process.env.REACT_APP_BACKEND_URL}/admin/questions/${submissionId}`,
          {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          }
        );
      } else {
        // first-time submit
        res = await fetch(
          `${process.env.REACT_APP_BACKEND_URL}/admin/new-question`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          }
        );
      }

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Server Error");

      returnModel(true, "Challenges submitted successfully!", false, () => {
        // after submitting clear form and open Add Event modal to create an event
        setquestions([]);
        findMax([]);
        setSubmissionId(null);
        setMode("create");

        // navigate to ManageEvents and open AddEvents modal, passing submission data
        try {
          const newSubmissionId = data?.data?._id || data?._id || null;
          history.push("/events/true", {
            submissionId: newSubmissionId,
            questions: payload.questions,
            maxArea: payload.maxArea,
          });
        } catch (navErr) {
          console.warn("Navigation after submit failed:", navErr);
        }
      });
    } catch (err) {
      console.error("❌ Error submitting challenges:", err);
      alert("Error submitting challenges: " + err.message);
    }
  };




  const handleSaveDraft = async () => {
    if (questions.length === 0) {
      alert("Please add at least one question before saving a draft!");
      return;
    }

    const payload = buildPayload("draft");

    try {
      let res;
      if (submissionId) {
        // ✏️ editing existing draft -> UPDATE
        res = await fetch(
          `${process.env.REACT_APP_BACKEND_URL}/admin/questions/${submissionId}`,
          {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          }
        );
      } else {
        // 🆕 new draft -> CREATE
        res = await fetch(
          `${process.env.REACT_APP_BACKEND_URL}/admin/new-question`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          }
        );
      }

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Server Error");

      // if we just created it, remember its id so next save becomes UPDATE
      if (!submissionId && data.data && data.data._id) {
        setSubmissionId(data.data._id);
        setMode("edit");
      }

      returnModel(true, "Draft saved successfully!", false, () => { });
    } catch (err) {
      console.error("❌ Error saving draft:", err);
      alert("Error saving draft: " + err.message);
    }
  };








  const pathToPage = ["Home", "Admin", "Add Questions"];
  const findMax = (data_new) => {
    setLoading(true);
    console.log(data_new);
    let policy = 0;
    let randd = 0;
    let technology = 0;
    let workforce = 0;
    let productivity = 0;
    let marketing = 0;

    if (data_new != null) {
      for (let index = 0; index < data_new.length; index++) {
        const element = data_new[index];
      }
      const saman = data_new;
      data_new.forEach((element) => {
        if (element.dArea == "Policy") {
          policy++;
        } else if (element.dArea == "R&D") {
          randd++;
        } else if (element.dArea == "Technology") {
          technology++;
        } else if (element.dArea == "Work force" || element.dArea == "Workforce") {
          workforce++;
        } else if (element.dArea == "Productivity") {
          productivity++;
        } else if (element.dArea == "Marketing") {
          marketing++;
        }
      });

      let dAreaArr = [
        policy,
        productivity,
        randd,
        technology,
        marketing,
        workforce,
      ];
      console.log(dAreaArr);
      let max = dAreaArr[0];
      dAreaArr.forEach((element) => {
        if (max < element) {
          max = element;
        }
      });
      if (max == policy) {
        setmaxArea("Policy");
      } else if (max == randd) {
        setmaxArea("R&D");
      } else if (max == productivity) {
        setmaxArea("Productivity");
      } else if (max == technology) {
        setmaxArea("Technology");
      } else if (max == marketing) {
        setmaxArea("Marketing");
      } else if (max == workforce) {
        setmaxArea("Workforce");
      }
    }
    setLoading(false);
  };

  const [model, setModel] = useState(null);
  const returnModel = (show, body, confirmation, callback) => {
    setModel(
      <Model
        show={show}
        confirmation={confirmation}
        body={body}
        handleClose={() => {
          returnModel(false, "", null);
        }}
        handleClick={(e) => {
          callback(e);
          returnModel(false, "", null);
        }}
      />
    );
  };
  if (loading == true && maxArea == "") {
    return (
      <div className="text-center align-items-center">
        <h3 style={{ color: "GrayText" }}>
          Loading ...
        </h3>
        <div>
          {" "}
          {/* svg animation */}

        </div>
      </div>
    );
  } else {
    return (
      <div className="wrapper">
        {model}
        <SideBar questions={true} />
        <div className="main-panel">
          <NavbarDashboard title="Add Challenges" subtitle="Submit Challenges to Shape Smarter Decisions" />
          <div className="content">
            {/* <BreadCrum path={pathToPage} /> */}
            <Row className="mb-4 dev-cards-wrapper">
              {[
                { name: "Policy", color: "#f3c612" },
                { name: "R&D", color: "#0D97B9" },
                { name: "Technology", color: "#9c9b9b" },
                { name: "Workforce", color: "#7FD858" },
                { name: "Productivity", color: "#CB6CE6" },
                { name: "Marketing", color: "#54DDFE" },
              ].map((area) => {

                const count = questions.filter((q) => q.dArea === area.name).length;
                const isMaxArea = questions.length > 0 && area.name === maxArea;
                return (
                  <Col key={area} md={2}>
                    <div
                      className={`p-3 text-center rounded dev-card ${isMaxArea ? "dev-card-active" : ""
                        }`}
                      style={{ border: isMaxArea ? `1px solid ${area.color}` : "0.0625rem solid #e9ecef " }}
                    >

                      <h3 className="m-0">{count}</h3>
                      <h6 className="m-0">{area.name}</h6>

                    </div>
                  </Col>
                );
              })}
            </Row>
            <AdminCard title="Insert Questions" >
              <div style={{ minHeight: "350px" }}>


                {/* <Alert variant={"secondary"}>
                <Row>
                  <Container as={Col}>
                    <h4 className="text-center p-0 m-0">
                      {questions.length > 0 ? (
                        <strong>Developing area - {maxArea}</strong>) : null
                      }
                    </h4>
                  </Container>
                </Row>
              </Alert> */}



                <AddQuestion onAdd={handleAddQuestion} disabled={mode === "view"} />
                <ViewQuestion
                  questions={questions}
                  onDelete={mode === "view" ? undefined : handleDeleteQuestion}
                  onUpdate={mode === "view" ? undefined : handleUpdateQuestion}
                  readOnly={mode === "view"}
                />

                {/* Table Section */}
                {/* <table className="table mt-4">
                  <thead>
                    <tr>
                      <th>Development Area</th>
                      <th>Challenge</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {questions.map((q, i) => (
                      <tr key={i}>
                        <td>{q.dArea}</td>
                        <td>{q.body}</td>

                        
                        <td className="text-center">

                         
                          <i
                            className="far fa-edit mr-3"
                            style={{ cursor: "pointer", fontSize: "18px" }}
                            onClick={() => childRef.current?.editComment?.(q._id)}
                          ></i>

                          
                          <i
                            className="far fa-trash-alt"
                            style={{ cursor: "pointer", fontSize: "18px", color: "red" }}
                            onClick={() => childRef.current?.deleteComment?.(q._id)}
                          ></i>

                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
*/}

                {/* <ViewQuestion
                  questions={questions}
                  onChange={fetchQuestions}
                  loading={loading}
                  show={(e, ee, ss, eee) => returnModel(e, ee, ss, eee)}
                  ref={childRef}
                ></ViewQuestion> */}
                {mode !== "view" && (
                  <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px", marginTop: "20px" }}>
                    <Button
                      variant=""
                      className="btn-secondary"
                      type="button"
                      onClick={handleSaveDraft}
                    >
                      Save Draft
                    </Button>
                    <Button
                      variant=""
                      className="btn-primary"
                      type="button"
                      onClick={handleSubmitAll}
                    >
                      Submit
                    </Button>
                  </div>
                )}
              </div>
            </AdminCard>
            <Footer />
          </div>
        </div>
      </div>
    );
  }
}

export default Index;