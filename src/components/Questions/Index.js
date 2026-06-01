// Import React hooks.
// useState stores changing data.
// useEffect runs code when page loads.
// useRef is imported but currently not used.
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
  // Stores all added challenges/questions.
  const [questions, setquestions] = useState([]);


  // Controls loading message.
  const [loading, setLoading] = useState(true);


  // These states store challenge counts by development area.
  let [technology, settechnology] = useState(0);
  let [workforce, setworkforce] = useState(0);
  let [productivity, setproductivity] = useState(0);
  let [marketing, setmarketing] = useState(0);


  // Stores the development area with the highest number of challenges.
  const [maxArea, setmaxArea] = useState("");


  // Used to read navigation data from previous page.
  const location = useLocation();


  // Used to navigate to another page.
  const history = useHistory();


  // Stores current submission ID.
  // If null, this is a new submission.
  const [submissionId, setSubmissionId] = useState(null);


  // Stores page mode.
  // create = new submission
  // edit = edit draft
  // view = view completed submission
  const [mode, setMode] = useState("create");


  // If mode is view, user cannot edit.
  const isReadOnly = mode === "view";




  // This runs when page first loads.
  useEffect(() => {
    // Get data passed through navigation.
    const state = location.state || {};


    // If submissionId exists, load existing submission.
    if (state.submissionId) {
      setSubmissionId(state.submissionId);
      setMode(state.mode || "edit");
      loadSubmission(state.submissionId);
    } else {
      // If no submissionId, start a new submission.
      setquestions([]);
      setmaxArea("");
      setLoading(false);
    }


    // Clear navigation state.
    // WHY: prevents old state from being reused when using browser back/forward.
    history.replace({ ...location, state: {} });
  }, []);




  // Load one submission by ID.
  const loadSubmission = async (id) => {
    setLoading(true);


    try {
      // Get selected submission from backend.
      const res = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/admin/questions/${id}`
      );


      const doc = await res.json();


      // Convert backend questions into frontend table format.
      const flattened =
        (doc.questions || []).map((q, index) => ({
          _id: q._id || `${doc._id}-${index}`,
          dArea: q.dArea,
          body: q.body,
          disabled: false,
        })) || [];


      // Save questions to state.
      setquestions(flattened);


      // Find highest-priority development area.
      findMax(flattened);
    } catch (e) {
      console.error("Error loading submission:", e);
    } finally {
      setLoading(false);
    }
  };




  // This useEffect runs when submissionId or mode changes.
  useEffect(() => {
    // If create mode, start fresh.
    if (!submissionId || mode === "create") {
      setquestions([]);
      setmaxArea("");
      setLoading(false);
      return;
    }


    // If edit or view mode, load existing submission.
    const fetchOne = async () => {
      setLoading(true);


      try {
        const res = await fetch(
          `${process.env.REACT_APP_BACKEND_URL}/admin/questions/${submissionId}`
        );


        const doc = await res.json();


        if (!res.ok) throw new Error(doc.message || "Error loading submission");


        // Format backend question data.
        const flattened =
          Array.isArray(doc.questions) ?
            doc.questions.map((q, index) => ({
              _id: q._id || `${doc._id}-${index}`,
              body: q.body,
              dArea: q.dArea,


              // Disable editing if mode is view.
              disabled: isReadOnly,
            })) : [];


        setquestions(flattened);


        // Recalculate highest development area.
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




  // Add a new challenge/question.
  const handleAddQuestion = (newItem) => {
    // Create a new question object.
    const newQuestion = {
      _id: Date.now(),
      body: newItem.challenge,
      dArea: newItem.area,
      disabled: false,
    };


    // Add new question to list.
    // Functional setState is used to avoid old/stale state.
    setquestions((prev) => {
      const updatedList = [...prev, newQuestion];


      // Update highest development area after adding.
      findMax(updatedList);


      return updatedList;
    });
  };




  // Delete one question using question ID.
  const handleDeleteQuestion = (id) => {
    setquestions((prev) => {
      // Remove selected question.
      const updated = prev.filter((q) => q._id !== id);


      // Recalculate highest development area.
      findMax(updated);


      return updated;
    });
  };




  // Update one question.
  const handleUpdateQuestion = (id, updatedData) => {
    setquestions((prev) => {
      // Find matching question and update it.
      const updated = prev.map((q) =>
        q._id === id ? { ...q, ...updatedData } : q
      );


      // Recalculate highest development area.
      findMax(updated);


      return updated;
    });
  };




  // Build payload before saving draft or submitting.
  // WHY: Backend expects questions, creator, status, and maxArea.
  const buildPayload = (statusValue) => ({
    questions: questions.map((q) => ({
      dArea: q.dArea,
      body: q.body,
    })),
    createdBy: "Administrator",
    status: statusValue,
    maxArea: maxArea,
  });




  // Submit all challenges.
  const handleSubmitAll = async () => {
    // User must add at least one challenge.
    if (questions.length === 0) {
      alert("Please add at least one question!");
      return;
    }


    // Build submitted payload.
    const payload = buildPayload("submitted");


    try {
      let res;


      if (submissionId) {
        // If submission already exists, update it.
        res = await fetch(
          `${process.env.REACT_APP_BACKEND_URL}/admin/questions/${submissionId}`,
          {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          }
        );
      } else {
        // If this is first submit, create new submission.
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


      // Show success popup.
      returnModel(true, "Challenges submitted successfully!", false, () => {
        // Clear form after submit.
        setquestions([]);
        findMax([]);
        setSubmissionId(null);
        setMode("create");


        // Navigate to event page after submitting challenges.
        // WHY: After identifying maxArea, system can create meeting/event.
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




  // Save current challenge list as draft.
  const handleSaveDraft = async () => {
    // Cannot save empty draft.
    if (questions.length === 0) {
      alert("Please add at least one question before saving a draft!");
      return;
    }


    // Build draft payload.
    const payload = buildPayload("draft");


    try {
      let res;


      if (submissionId) {
        // If draft already exists, update it.
        res = await fetch(
          `${process.env.REACT_APP_BACKEND_URL}/admin/questions/${submissionId}`,
          {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          }
        );
      } else {
        // If new draft, create it.
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


      // If draft was newly created, store its ID.
      // WHY: Next Save Draft should update same draft, not create new one.
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




  // Breadcrumb path.
  // Currently breadcrumb is commented in JSX.
  const pathToPage = ["Home", "Admin", "Add Questions"];




  // Find development area with highest number of challenges.
  const findMax = (data_new) => {
    setLoading(true);
    console.log(data_new);


    // Count variables for each development area.
    let policy = 0;
    let randd = 0;
    let technology = 0;
    let workforce = 0;
    let productivity = 0;
    let marketing = 0;


    if (data_new != null) {
      // Loop through questions and count by development area.
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


      // Store all counts in one array.
      let dAreaArr = [
        policy,
        productivity,
        randd,
        technology,
        marketing,
        workforce,
      ];


      console.log(dAreaArr);


      // Assume first value is max.
      let max = dAreaArr[0];


      // Find highest count.
      dAreaArr.forEach((element) => {
        if (max < element) {
          max = element;
        }
      });


      // Set maxArea based on highest count.
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




  // Model state for success messages.
  const [model, setModel] = useState(null);


  // Reusable popup model function.
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




  // Show loading screen while data is loading.
  if (loading == true && maxArea == "") {
    return (
      <div className="text-center align-items-center">
        <h3 style={{ color: "GrayText" }}>
          Loading ...
        </h3>
        <div>
          {/* svg animation */}
        </div>
      </div>
    );
  } else {
    return (
      <div className="wrapper">
        {/* Show popup model */}
        {model}


        {/* Sidebar with questions menu active */}
        <SideBar questions={true} />


        <div className="main-panel">
          {/* Top navbar */}
          <NavbarDashboard
            title="Add Challenges"
            subtitle="Submit Challenges to Shape Smarter Decisions"
          />


          <div className="content">
            {/* <BreadCrum path={pathToPage} /> */}


            {/* Development area summary cards */}
            <Row className="mb-4 dev-cards-wrapper">
              {[
                { name: "Policy", color: "#f3c612" },
                { name: "R&D", color: "#0D97B9" },
                { name: "Technology", color: "#9c9b9b" },
                { name: "Workforce", color: "#7FD858" },
                { name: "Productivity", color: "#CB6CE6" },
                { name: "Marketing", color: "#54DDFE" },
              ].map((area) => {
                // Count challenges for this development area.
                const count = questions.filter((q) => q.dArea === area.name).length;


                // Check whether this area is currently highest.
                const isMaxArea = questions.length > 0 && area.name === maxArea;


                return (
                  <Col key={area} md={2}>
                    <div
                      className={`p-3 text-center rounded dev-card ${isMaxArea ? "dev-card-active" : ""
                        }`}
                      style={{
                        // Highlight highest-priority development area.
                        border: isMaxArea
                          ? `1px solid ${area.color}`
                          : "0.0625rem solid #e9ecef "
                      }}
                    >
                      {/* Show count */}
                      <h3 className="m-0">{count}</h3>


                      {/* Show area name */}
                      <h6 className="m-0">{area.name}</h6>
                    </div>
                  </Col>
                );
              })}
            </Row>


            {/* Main challenge section */}
            <AdminCard title="Insert Questions">
              <div style={{ minHeight: "350px" }}>


                {/* Add challenge form.
                   Disabled when mode is view. */}
                <AddQuestion
                  onAdd={handleAddQuestion}
                  disabled={mode === "view"}
                />


                {/* Display added challenges.
                   Delete/update disabled in view mode. */}
                <ViewQuestion
                  questions={questions}
                  onDelete={mode === "view" ? undefined : handleDeleteQuestion}
                  onUpdate={mode === "view" ? undefined : handleUpdateQuestion}
                  readOnly={mode === "view"}
                />


                {/* Show buttons only if not view mode */}
                {mode !== "view" && (
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "flex-end",
                      gap: "10px",
                      marginTop: "20px"
                    }}
                  >
                    {/* Save as draft */}
                    <Button
                      variant=""
                      className="btn-secondary"
                      type="button"
                      onClick={handleSaveDraft}
                    >
                      Save Draft
                    </Button>


                    {/* Submit challenges */}
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


            {/* Footer */}
            <Footer />
          </div>
        </div>
      </div>
    );
  }
}

export default Index;



