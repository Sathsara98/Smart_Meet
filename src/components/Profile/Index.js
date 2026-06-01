// Import React hooks.
// useEffect = run code when page loads.
// useState = store changing data.
// useRef is imported, but here React.useRef is used directly.
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


// Profile page component.
export default function Index() {

  // Reference for hidden file input.
  // WHY: When user clicks pencil icon, we can open file picker manually.
  const hiddenFileInput = React.useRef(null);

  // Controls whether profile details are editable.
  const [isEdit, setIsEdit] = useState(false);

  // Controls whether profile image is in edit mode.
  const [editImg, setEditImg] = useState(false);

  // Stores logged-in user details.
  const [user, setUser] = useState({});

  // Stores selected file list from file input.
  const [selectedFiles, setSelectedFiles] = useState(null);

  // Stores selected image file.
  const [currentFile, setCurrentFile] = useState(undefined);

  // Shows loading while image is uploading.
  const [isImgUploading, setIsImgUploading] = useState(false);

  // Stores image preview URL.
  const [currentFileShow, setCurrentFileShow] = useState(undefined);

  // Stores selected sector.
  // WHY: Workplace dropdown changes based on sector.
  const [workplace, setWorkplace] = useState("");

  // Stores previous image path.
  // WHY: Backend may need it to replace/delete old image.
  const [preFileShow, setPreFileShow] = useState("");

  // useForm handles profile form values and validation.
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: "hi",
      nic: "",
      email: "",
      phone: "",
      sector: "",
      workplace: "",
      password: "",
    },
  });

  // Workplace options grouped by sector.
  // WHY: When user selects sector, only related workplaces should display.
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

  // Load logged-in user details when profile page opens.
  useEffect(() => {
    loadUser();
  }, []);

  // Model state for success popup.
  const [model, setModel] = useState(null);

  // Reusable function to show popup model.
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


  // Runs when sector dropdown changes.
  // WHY: Workplace dropdown needs to update according to selected sector.
  const handleChangeWork = (e) => {
    console.log(e.target.value);
    setWorkplace(e.target.value);
  };


  // Load logged-in user's profile details from backend.
  const loadUser = async () => {
    fetch(`${process.env.REACT_APP_BACKEND_URL}/users/register/` + Auth.getUserId(), {
      method: "GET",
      headers: new Headers({
        Accept: "application/vnd.github.cloak-preview",

        // Token proves the user is logged in.
        token: Auth.getToken(),
      }),
    })
      .then((res) => res.json())
      .then((response) => {
        // Store user details.
        setUser(response);

        // If user has uploaded image, show that image.
        if (response.userImage != null) {
          setCurrentFileShow(`${process.env.REACT_APP_BACKEND_URL}/` + response.userImage);
        }

        // Store previous image path.
        setPreFileShow(response.userImage);

        // Fill form values with loaded user details.
        setValue("name", response.name);
        setValue("nic", response.nic);
        setValue("email", response.email);
        setValue("phone", response.tel);
        setValue("sector", response.sector);

        // Set workplace dropdown group based on sector.
        setWorkplace(response.sector);

        setValue("workplace", response.workplace);
        setValue("password", response.password);
      })
      .catch((error) => console.log(error));
  };


  // Handles profile image button click.
  // Logic:
  // 1. If image is already selected, upload it.
  // 2. If image is not selected, open file picker.
  const handleClick = (event) => {
    if (editImg) {
      // Start upload loading.
      setIsImgUploading(true);

      let userId = Auth.getUserId();

      // FormData is used because image file is being uploaded.
      const sinfile = new FormData();
      sinfile.append("userImg", currentFile);
      sinfile.append("userID", userId);
      sinfile.append("previousImg", preFileShow);

      console.log("handleClick: Starting image upload, userId=", userId, "currentFile=", currentFile);

      // Send image to backend.
      axios
        .put(`${process.env.REACT_APP_BACKEND_URL}/users/user-image`, sinfile)
        .then((res) => {
          console.log("handleClick: Upload successful, response=", res.data);

          // Close image edit mode.
          setEditImg(false);

          // Stop loading.
          setIsImgUploading(false);

          // Save new image path as previous image.
          setPreFileShow(res.data.userImage);
        })
        .catch((error) => {
          console.error("handleClick: Upload failed, error=", error);
          console.error("Error response data:", error.response?.data);
          console.error("Full error object:", JSON.stringify(error.response?.data, null, 2));
          console.error("Error status:", error.response?.status);
          console.error("Error message:", error.message);

          // Stop loading if upload fails.
          setIsImgUploading(false);
        });
    } else {
      // Open hidden file input.
      console.log("handleClick: Opening file picker");
      hiddenFileInput.current.click();

      // Set image edit mode.
      setEditImg(true);
    }
  };


  // Runs after user selects image file.
  const upload = (event) => {
    if (event.target.files.length != 0) {
      console.log(event.target.files);

      // Store selected files.
      setSelectedFiles(event.target.files);

      let selected = event.target.files;
      let currentFile = selected[0];

      // Store selected image file.
      setCurrentFile(currentFile);

      // Create temporary preview URL.
      setCurrentFileShow(URL.createObjectURL(currentFile));
    } else {
      // If no file selected, reset image edit state.
      setSelectedFiles(null);
      setEditImg(false);
    }
  };


  // Runs when profile form is submitted.
  const onSubmit = async (data) => {
    try {
      // Prepare update request.
      const requestOptions = {
        method: "PUT",
        headers: { "Content-Type": "application/json" },

        // Send updated user details to backend.
        body: JSON.stringify({
          id: Auth.getUserId(),
          name: data.name,

          // NIC is converted to uppercase and trimmed before saving.
          nic: data.nic.toUpperCase().trim(),
          nic: data.nic.toUpperCase().trim(),

          email: data.email,
          tel: data.phone,
          sector: data.sector,
          workplace: data.workplace,
          password: data.password,
        }),
      };

      // Send update request.
      const res = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/users/register`,
        requestOptions
      )
        .then((res) => res.json())
        .then((res) => {
          // Show success popup.
          returnModel(true, "Updated Successfully", false, () => {
            // Disable edit mode after update.
            setIsEdit(false);

            // Update user state with response.
            setUser(res);
          });
        });
    } catch (e) {
      console.log(e);
    }
  };


  // printWorkplaces stores workplace options based on selected sector.
  var printWorkplaces;

  // Select workplace list according to selected sector.
  if (workplace == "Public") {
    printWorkplaces = workPlaces.public;
  } else if (workplace == "Private") {
    // Note: This currently uses Association options for Private.
    printWorkplaces = workPlaces.Association;
  } else if (workplace == "Academic") {
    printWorkplaces = workPlaces.Academic;
  } else if (workplace == "Association") {
    printWorkplaces = workPlaces.Association;
  } else if (workplace == "Administration") {
    printWorkplaces = workPlaces.Administration;
  }

  // Breadcrumb path.
  // Currently breadcrumb display is commented.
  const pathToPage = ["Home", "User", "Profile"];

  return (
    <div className="wrapper">
      {/* Show popup model */}
      {model}

      {/* Sidebar with profile menu active */}
      <SideBar profile={true} />

      <div className="main-panel">
        {/* Top navbar */}
        <NavbarDashboard title="Profile" subtitle="Manage Your Profile" />

        <div className="content content-profile">
          {/* <BreadCrum path={pathToPage} /> */}

          <AdminCard title="">
            <div className="row">

              {/* Left side profile image section */}
              <div className="col-lg-4 pl-0">
                <div className="card">
                  <div className="card-body p-0">
                    <div className="d-flex flex-column align-items-center text-center">

                      {/* Hidden file input.
                         It opens when pencil button is clicked. */}
                      <input
                        className=" px-3 py-2 text-sm  text-gray-700  rounded-full  appearance-none focus:outline-none focus:shadow-outline "
                        ref={hiddenFileInput}
                        onChange={(e) => upload(e)}
                        name="docBr"
                        type="file"
                        style={{ display: "none" }}
                      />

                      {/* Profile image preview */}
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

                      {/* If image is in edit mode, show save/cancel buttons */}
                      {editImg ? (
                        <>
                          {isImgUploading ? (
                            // Show loader while image is uploading.
                            <img
                              className="position-absolute p-4"
                              style={{ width: "210px" }}
                              src={`${process.env.PUBLIC_URL}/assets/img/pre_loader.svg`}
                            />
                          ) : (
                            // Show cancel and save image buttons.
                            <div
                              className="position-absolute d-flex justify-content-center w-100"
                              style={{ top: "180px" }}
                            >
                              <div
                                className=" px-1 mx-0 d-flex justify-content-between  "
                                style={{ width: "250px" }}
                              >
                                <div>
                                  {/* Cancel image edit */}
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
                                  {/* Save/upload selected image */}
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
                        // If not editing image, show pencil button.
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

                      {/* Show user name, sector, and workplace */}
                      <div className="mt-3">
                        <h4 className="mb-1">{user.name}</h4>

                        <p className="text-muted font-size-lg m-0 pt-0">
                          {user.sector}
                        </p>
                        <h4 className="text-muted">{user.workplace}</h4>
                      </div>
                    </div>
                  </div>
                </div>
              </div>


              {/* Right side profile details form */}
              <div className="col-lg-8 pr-0 user-detail-wrapper">
                <div className="card">

                  {/* Form submission handled by react-hook-form */}
                  <form onSubmit={handleSubmit(onSubmit)} className="profile-form">
                    <div className="card-body p-0">

                      {/* Name field */}
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

                            // Field can edit only when isEdit is true.
                            disabled={!isEdit}

                            // Register field with validation.
                            {...register("name", {
                              required: true,
                            })}
                          />
                        </div>
                      </div>

                      {/* NIC field */}
                      <div className="row mb-3">
                        <div className="col-sm-3">
                          <h6 className="mb-0">NIC</h6>
                        </div>

                        <div className="col-sm-9 text-secondary">
                          <input
                            style={{
                              backgroundColor: "transparent",
                              color: "#37474F",
                            }}
                            type="text"

                            // Add invalid style if NIC has error.
                            className={`form-control ${errors.nic ? "is-invalid" : ""}`}

                            disabled={!isEdit}

                            // NIC validation.
                            {...register("nic", {
                              required: "NIC is required",
                              pattern: {
                                value: /^([0-9]{9}[vVxX]|[0-9]{12})$/,
                                message: "Enter valid NIC. Example: 123456789V or 200012345678",
                              },
                            })}
                          />

                          {/* Show NIC validation error */}
                          {errors.nic && (
                            <div className="invalid-feedback">
                              {errors.nic.message}
                            </div>
                          )}
                        </div>
                      </div>


                      {/* Email field */}
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

                            // Email validation.
                            {...register("email", {
                              required: "Email is required",
                              pattern: {
                                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                                message: "Enter a valid email address",
                              },
                            })}
                          />

                          {/* Show email validation error */}
                          {errors.email && (
                            <div className="invalid-feedback d-block">
                              {errors.email.message}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Phone field */}
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

                            // Phone must be exactly 10 digits.
                            {...register("phone", {
                              required: "Phone number is required",
                              pattern: {
                                value: /^[0-9]{10}$/,
                                message: "Phone number must have 10 digits",
                              },
                            })}
                          />

                          {/* Show phone validation error */}
                          {errors.phone && (
                            <div className="invalid-feedback d-block">
                              {errors.phone.message}
                            </div>
                          )}
                        </div>
                      </div>


                      {/* Sector dropdown */}
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

                            // Change workplace options when sector changes.
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

                      {/* Workplace dropdown */}
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

                            {/* Show workplace options based on selected sector */}
                            {printWorkplaces}
                          </select>
                        </div>
                      </div>

                      {/* Password field */}
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

                            {/* Show/hide password icon */}
                            <span
                              type="button"
                              style={{ width: "25px", zIndex: "+10" }}
                              className=" overflow-hidden"
                              onClick={(e) => {
                                // If current icon is show, change password to text.
                                if (e.target.id === "show") {
                                  document.getElementById("password").type =
                                    "text";
                                  e.target.id = "hide";

                                  // Change icon to hide icon.
                                  e.target.innerHTML =
                                    '<svg  xmlns="http://www.w3.org/2000/svg"   fill="none" stroke="black">' +
                                    '<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}  d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" /></svg>';
                                } else if (e.target.id === "hide") {
                                  // If current icon is hide, change password back to password type.
                                  document.getElementById("password").type =
                                    "password";
                                  e.target.id = "show";

                                  // Change icon back to show icon.
                                  e.target.innerHTML =
                                    '<svg  xmlns="http://www.w3.org/2000/svg"  fill="none" stroke="black"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />' +
                                    '<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>';
                                }
                              }}
                            >
                              {/* Default eye icon */}
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

                      {/* Edit / Save button */}
                      <div className="row btn-row">
                        <div className="col-sm-12">
                          {isEdit ? (
                            // If edit mode is on, show Save Changes button.
                            <button
                              type="submit"
                              className="btn  px-4 btn-primary"
                            >
                              Save Changes
                            </button>
                          ) : (
                            // If edit mode is off, show Edit button.
                            <input
                              onClick={() => setIsEdit(true)}
                              type="button"
                              className="btn  btn-primary"
                              value="Edit"
                            ></input>
                          )}
                        </div>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            </div>

            {/* Weekly availability section */}
            <div className="row">
              <div className="card timeline-card-wrap">
                <div className="card-body p-0">
                  <h4 className="availability-title">My Weekly Availability</h4>

                  {/* TimeTable allows user to mark availability */}
                  <TimeTable />
                </div>
              </div>
            </div>
          </AdminCard>

          {/* Footer */}
          <Footer />
        </div>
      </div>
    </div>
  );
}

