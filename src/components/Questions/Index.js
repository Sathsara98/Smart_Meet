import React, { useEffect, useState } from "react";
import AddQuestion from "./AddQuestions";
import ViewQuestion from "./ViewQuestions";
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

function Index() {
  const [questions, setquestions] = useState([]);
  const [loading, setLoading] = useState(true);
  let [policy, setpolicy] = useState(0);
  let [randd, setrandd] = useState(0);
  let [technology, settechnology] = useState(0);
  let [workforce, setworkforce] = useState(0);
  let [productivity, setproductivity] = useState(0);
  let [marketing, setmarketing] = useState(0);
  const [maxArea, setmaxArea] = useState("");

  useEffect(() => {
    fetchQuestions();
  }, []);

  const fetchQuestions = async () => {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:5000/admin/questions")
        .then(function (response) {
          return response.json();
        })
        .then((res) => {
          console.log(res);
          let promise = res.map(async (que) => {
            const requestOptions = {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                text: que.body,
              }),
            };

            const res1 = await fetch(
              "http://localhost:5000/admin/developing-area",
              requestOptions
            );
            const data1 = await res1.json();
            return {
              _id: que._id,
              body: que.body,
              dArea: data1.SVM,
              disabled: false,
            };
          });
          console.log(res);
          return Promise.all(promise);
        })
        .then((res) => {
          console.log(res);
          setquestions(res);

          findMax(res);
        });
    } catch (e) {
      //if failed to communicate with api this code block will run
      console.log(e);
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
        } else if (element.dArea == "Work force") {
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
  if (loading == true && maxArea == "") {
    return (
      <div className="text-center align-items-center">
        <h3>Connecting to the ML Server ...</h3>
      </div>
    );
  } else {
    return (
      <div className="wrapper">
        <SideBar questions={true} />
        <div className="main-panel">
          <NavbarDashboard title="Questions" />
          <div className="content">
            <BreadCrum path={pathToPage} />
            <AdminCard title="Insert Questions">
              <Alert variant={"secondary"}>
                <Row>
                  <Container as={Col}>
                    <h4 className="text-center p-0 m-0">
                      <strong>Developing area - {maxArea}</strong>
                    </h4>
                  </Container>
                </Row>
              </Alert>
              <AddQuestion onChange={fetchQuestions}></AddQuestion>
              <ViewQuestion
                questions={questions}
                onChange={fetchQuestions}
                loading={loading}
              ></ViewQuestion>
            </AdminCard>
          </div>
        </div>
      </div>
    );
  }
}

export default Index;
