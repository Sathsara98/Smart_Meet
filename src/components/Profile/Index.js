import React, { useEffect, useState, useRef } from "react";
import Model from "../../components/Model";
import axios from "axios";
import Auth from "../../authentication/Auth";
import { useForm } from "react-hook-form";
import TimeTable from "../NotAvailable/TimeTable";
import {
  BreadCrum,
  SideBar,
  Navbar,
  AdminCard,
  NavbarDashboard
} from "../../components";
import Footer from "../Footer/Footer";

export default function Index() {
  // Create a reference to the hidden file input element
  const hiddenFileInput = React.useRef(null);
  const [isEdit, setIsEdit] = useState(false);
  const [editImg, setEditImg] = useState(false);
  const [user, setUser] = useState({});
  const [selectedFiles, setSelectedFiles] = useState(null);
  const [currentFile, setCurrentFile] = useState(undefined);
  const [isImgUploading, setIsImgUploading] = useState(false);
  const [currentFileShow, setCurrentFileShow] = useState(undefined);
  const [workplace, setWorkplace] = useState("");
  const [preFileShow, setPreFileShow] = useState("");
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    name: "hi",
    email: "",
    phone: "",
    sector: "",
    workplace: "",
    password: "",
  });
  const workPlaces = {
    public: [
      <option value="Ministry of industries">Ministry of industries</option>,
      <option value="Ministry of transport">Ministry of transport</option>,
      <option value="Ministry of vocational training and skills development">
        Ministry of vocational training and skills development
      </option>,
      <option value="Ministry of plantation">Ministry of plantation</option>,
      <option value="Department of sri lanka custome">
        Department of sri lanka custome
      </option>,
      <option value="Department of import export control">
        Department of import export control
      </option>,
      <option value="Department of trade and tariff">
        Department of trade and tariff
      </option>,
      <option value="Sri Lanka standard institute">
        Sri Lanka standard institute
      </option>,
      <option value="Industrial development board">
        Industrial development board{" "}
      </option>,
      <option value="Export development board">
        Export development board
      </option>,
      <option value="Board of investment">Board of investment</option>,
    ],
    Association: [
      <option value="Sri Lanka Automotive Component Manufacturers Association">
        Sri Lanka Automotive Component Manufacturers Association
      </option>,
    ],
    private: [
      <option value="CEAT-Kelani International Tyres (Pvt) Ltd">
        CEAT-Kelani International Tyres (Pvt) Ltd
      </option>,
      <option value="Kelani cables PLC">Kelani cables PLC</option>,
      <option value="Laugfs Lanka">Laugfs Lanka</option>,
      <option value="ACL cable">ACL cable</option>,
      <option value="Global rubber industries">
        Global rubber industries
      </option>,
      <option value="Rigid tyre corporation"> Rigid tyre corporation</option>,
      <option value="Micro cars (Pvt) Ltd">Micro cars (Pvt) Ltd</option>,
      <option value="United Motors">United Motors</option>,
      <option value="IDL motors">IDL motors</option>,
      <option value="Sierra cables">Sierra cables</option>,
    ],
    Academic: [
      <option value="University of Moratuwa">University of Moratuwa</option>,
      <option value="Ceylon German Technical Institute">
        Ceylon German Technical Institute
      </option>,
    ],
    Administration: [
      <option key="1" value="Ministry of Industry">
        Ministry of Industries{" "}
      </option>,
      <option key="2" value="Ceylon German Technical Institute">
        Ministry of transport
      </option>,
    ],
  };
  useEffect(() => {
    loadUser();
  }, []);
  //model
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

  const handleChangeWork = (e) => {
    console.log(e.target.value);
    setWorkplace(e.target.value);
  };
  const loadUser = async () => {
    fetch(`${process.env.REACT_APP_BACKEND_URL}/users/register/` + Auth.getUserId(), {
      method: "GET",
      headers: new Headers({
        Accept: "application/vnd.github.cloak-preview",
        token: Auth.getToken(),
      }),
    })
      .then((res) => res.json())
      .then((response) => {
        setUser(response);
        if (response.userImage != null) {
          setCurrentFileShow(`${process.env.REACT_APP_BACKEND_URL}/` + response.userImage);
        }

        setPreFileShow(response.userImage);
        setValue("name", response.name);
        setValue("email", response.email);
        setValue("phone", response.tel);
        setValue("sector", response.sector);
        setWorkplace(response.sector);
        setValue("workplace", response.workplace);
        setValue("password", response.password);
      })
      .catch((error) => console.log(error));
  };
  const handleClick = (event) => {
    if (editImg) {
      setIsImgUploading(true);
      let userId = Auth.getUserId();
      const sinfile = new FormData();
      sinfile.append("userImg", currentFile);
      sinfile.append("userID", userId);
      sinfile.append("previousImg", preFileShow);

      console.log("handleClick: Starting image upload, userId=", userId, "currentFile=", currentFile);
      axios
        .put(`${process.env.REACT_APP_BACKEND_URL}/users/user-image`, sinfile)
        .then((res) => {
          console.log("handleClick: Upload successful, response=", res.data);
          setEditImg(false);
          setIsImgUploading(false);
          setPreFileShow(res.data.userImage);
        })
        .catch((error) => {
          console.error("handleClick: Upload failed, error=", error);
          console.error("Error response data:", error.response?.data);
          console.error("Full error object:", JSON.stringify(error.response?.data, null, 2));
          console.error("Error status:", error.response?.status);
          console.error("Error message:", error.message);
          setIsImgUploading(false);
        });
    } else {
      console.log("handleClick: Opening file picker");
      hiddenFileInput.current.click();
      setEditImg(true);
    }
  };
  const upload = (event) => {
    if (event.target.files.length != 0) {
      console.log(event.target.files);
      setSelectedFiles(event.target.files);
      let selected = event.target.files;
      let currentFile = selected[0];
      setCurrentFile(currentFile);
      setCurrentFileShow(URL.createObjectURL(currentFile));
    } else {
      setSelectedFiles(null);
      setEditImg(false);
    }
  };
  const onSubmit = async (data) => {
    try {
      const requestOptions = {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: Auth.getUserId(),
          name: data.name,
          email: data.email,
          tel: data.phone,
          sector: data.sector,
          workplace: data.workplace,
          password: data.password,
        }),
      };
      const res = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/users/register`,
        requestOptions
      )
        .then((res) => res.json())
        .then((res) => {
          returnModel(true, "Updated Successfully", false, () => {
            setIsEdit(false);
            setUser(res);
          });
        });
    } catch (e) {
      console.log(e);
    }
  };
  var printWorkplaces;

  if (workplace == "Public") {
    printWorkplaces = workPlaces.public;
  } else if (workplace == "Private") {
    printWorkplaces = workPlaces.Association;
  } else if (workplace == "Academic") {
    printWorkplaces = workPlaces.Academic;
  } else if (workplace == "Association") {
    printWorkplaces = workPlaces.Association;
  } else if (workplace == "Administration") {
    printWorkplaces = workPlaces.Administration;
  }
  const pathToPage = ["Home", "User", "Profile"];
  return (
    <div className="wrapper">
      {model}
      <SideBar profile={true} />
      <div className="main-panel">
        <NavbarDashboard title="Profile" subtitle="Manage Your Profile" />
        <div className="content content-profile">
          {/* <BreadCrum path={pathToPage} /> */}
          <AdminCard title="">
            <div className="row">
              <div className="col-lg-4">
                <div className="card">
                  <div className="card-body">
                    <div className="d-flex flex-column align-items-center text-center">
                      <input
                        className=" px-3 py-2 text-sm  text-gray-700  rounded-full  appearance-none focus:outline-none focus:shadow-outline "
                        ref={hiddenFileInput}
                        onChange={(e) => upload(e)}
                        name="docBr"
                        type="file"
                        style={{ display: "none" }}
                      />
                      <img
                        src={
                          currentFileShow
                            ? currentFileShow
                            : `${process.env.PUBLIC_URL}/assets/img/default-avatar.png`
                        }
                        alt="Admin"
                        className="rounded-circle p-1 bg-light"
                        width="210"
                        height="210"
                        style={{ objectFit: "cover" }}
                      />
                      {editImg ? (
                        <>
                          {isImgUploading ? (
                            <img
                              className="position-absolute p-4"
                              style={{ width: "210px" }}
                              src={`${process.env.PUBLIC_URL}/assets/img/pre_loader.svg`}
                            />
                          ) : (
                            <div
                              className="position-absolute d-flex justify-content-center w-100"
                              style={{ top: "180px" }}
                            >
                              <div
                                className=" px-1 mx-0 d-flex justify-content-between  "
                                style={{ width: "250px" }}
                              >
                                <div>
                                  <button
                                    className="btn btn-link rounded-pill border border-light"
                                    onClick={() => {
                                      setEditImg(false);
                                    }}
                                  >
                                    <i className="fa fa-times"></i>
                                  </button>
                                </div>
                                <div>
                                  <button
                                    className="btn btn-link rounded-pill border border-light"
                                    onClick={handleClick}
                                  >
                                    <i className="fa fa-save"></i>
                                  </button>
                                </div>
                              </div>
                            </div>
                          )}
                        </>
                      ) : (
                        <div
                          className="position-absolute d-flex justify-content-center  w-100"
                          style={{ top: "180px" }}
                        >
                          <div
                            className="px-0 mx-0 d-flex justify-content-between "
                            style={{ width: "250px" }}
                          >
                            <div className="w-50 mr-5"></div>
                            <div className="w-25 pl-3">
                              <button
                                className="btn btn-link rounded-pill border border-light"
                                onClick={handleClick}
                              >
                                <i className="fa fa-pencil-alt"></i>
                              </button>
                            </div>
                          </div>
                        </div>
                      )}

                      <div className="mt-3">
                        <h4 className="mb-1">{user.name}</h4>

                        <p className="text-muted font-size-lg m-0 pt-0">
                          {user.sector}
                        </p>
                        <h4 className="text-muted">{user.workplace}</h4>
                      </div>
                    </div>
                    {/* <hr className="my-4" /> */}
                  </div>
                </div>
              </div>
              <div className="col-lg-8">
                <div className="card">
                  <form onSubmit={handleSubmit(onSubmit)} className="profile-form">
                    <div className="card-body">
                      <div className="row mb-3">
                        <div className="col-sm-3">
                          <h6 className="mb-0">Name</h6>
                        </div>
                        <div className="col-sm-9 text-secondary">
                          <input
                            style={{
                              backgroundColor: "transparent",
                              color: "#37474F",
                            }}
                            type="text"
                            className="form-control"
                            disabled={!isEdit}
                            {...register("name", {
                              required: true,
                            })}
                          />
                        </div>
                      </div>
                      <div className="row mb-3">
                        <div className="col-sm-3">
                          <h6 className="mb-0">Email</h6>
                        </div>
                        <div className="col-sm-9 text-secondary">
                          <input
                            style={{
                              backgroundColor: "transparent",
                              color: "#37474F",
                            }}
                            type="text"
                            className="form-control"
                            disabled={!isEdit}
                            {...register("email", {
                              required: true,
                            })}
                          />
                        </div>
                      </div>
                      <div className="row mb-3">
                        <div className="col-sm-3">
                          <h6 className="mb-0">Phone</h6>
                        </div>
                        <div className="col-sm-9 text-secondary">
                          <input
                            style={{
                              backgroundColor: "transparent",
                              color: "#37474F",
                            }}
                            type="text"
                            className="form-control"
                            disabled={!isEdit}
                            {...register("phone", {
                              required: true,
                            })}
                          />
                        </div>
                      </div>

                      <div className="row mb-3">
                        <div className="col-sm-3">
                          <h6 className="mb-0">Sector</h6>
                        </div>
                        <div className="col-sm-9 text-secondary">
                          <select
                            style={{
                              backgroundColor: "transparent",
                              color: "#37474F",
                            }}
                            onChange={(e) => handleChangeWork(e)}
                            className="form-control"
                            disabled={!isEdit}
                            {...register("sector", {
                              required: true,
                            })}
                          >
                            <option value="">Select Sector</option>
                            <option key="1" value="Public">
                              Public
                            </option>
                            <option key="2" value="Private">
                              Private
                            </option>
                            <option key="3" value="Academic">
                              Academic
                            </option>
                            <option key="4" value="Administration">
                              Administration
                            </option>
                            <option key="5" value="Association">
                              Association
                            </option>
                          </select>
                        </div>
                      </div>
                      <div className="row mb-3">
                        <div className="col-sm-3">
                          <h6 className="mb-0">Workplace</h6>
                        </div>
                        <div className="col-sm-9 text-secondary">
                          <select
                            style={{
                              backgroundColor: "transparent",
                              color: "#37474F",
                            }}
                            type="text"
                            className="form-control"
                            disabled={!isEdit}
                            {...register("workplace", {
                              required: true,
                            })}
                          >
                            <option>Select Office</option>
                            {printWorkplaces}
                          </select>
                        </div>
                      </div>
                      <div className="row mb-3">
                        <div className="col-sm-3">
                          <h6 className="mb-0">Password</h6>
                        </div>
                        <div className="col-sm-9 text-secondary">
                          <div
                            style={{
                              backgroundColor: "transparent",
                              color: "#37474F",
                            }}
                            className=" d-flex justify-content-between form-control"
                            disabled={!isEdit}
                          >
                            <input
                              style={{
                                backgroundColor: "transparent",
                                color: "#37474F",
                                fontSize: "1.3em",
                                outline: "0 none",
                              }}
                              id="password"
                              type="password"
                              className="w-100 border-0"
                              disabled={!isEdit}
                              {...register("password", {
                                required: true,
                              })}
                            />
                            <span
                              type="button"
                              style={{ width: "25px", zIndex: "+10" }}
                              className=" overflow-hidden"
                              onClick={(e) => {
                                if (e.target.id === "show") {
                                  document.getElementById("password").type =
                                    "text";
                                  e.target.id = "hide";
                                  e.target.innerHTML =
                                    '<svg  xmlns="http://www.w3.org/2000/svg"   fill="none" stroke="black">' +
                                    '<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}  d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" /></svg>';
                                } else if (e.target.id === "hide") {
                                  document.getElementById("password").type =
                                    "password";
                                  e.target.id = "show";
                                  e.target.innerHTML =
                                    '<svg  xmlns="http://www.w3.org/2000/svg"  fill="none" stroke="black"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />' +
                                    '<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>';
                                }
                              }}
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="m-0  hover:text-opacity-30"
                                id="show"
                                fill="none"
                                stroke="black"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={1}
                                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                                />
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={1}
                                  d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                                />
                              </svg>
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="row btn-row">
                        <div className="col-sm-12">
                          {isEdit ? (
                            <button
                              type="submit"
                              className="btn  px-4 btn-primary"
                            >
                              Save Changes
                            </button>
                          ) : (
                            <input
                              onClick={() => setIsEdit(true)}
                              type="button"
                              className="btn  btn-primary"
                              value="Edit"
                            ></input>
                          )}
                        </div>
                        {/* <div className="col-sm-9 text-secondary"></div> */}
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            </div>
            <div className="row">

              <div className="card timeline-card-wrap">
                <div className="card-body p-0">
                  <h4 className="availability-title">My Weekly Availability</h4>
                  <TimeTable />
                </div>
              </div>

            </div>

          </AdminCard>
          <Footer />
          {/* <AdminCard>
            <div className="row">

              <div className="card timeline-card-wrap">
                <div className="card-body">
                  <TimeTable />
                </div>
              </div>

            </div>
          </AdminCard> */}
        </div>
      </div>

    </div>

  );
}