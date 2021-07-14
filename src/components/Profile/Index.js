import React, { useEffect, useState, useRef } from "react";
import Model from "../../components/Model";
import axios from "axios";
import Auth from "../../authentication/Auth";
import {
  BreadCrum,
  SideBar,
  Navbar,
  AdminCard,
  NavbarDashboard,
} from "../../components";

export default function Index() {
  // Create a reference to the hidden file input element
  const hiddenFileInput = React.useRef(null);
  const [isEdit, setIsEdit] = useState(false);
  const [editImg, setEditImg] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState(null);
  const [currentFile, setCurrentFile] = useState(undefined);
  const [currentFileShow, setCurrentFileShow] = useState(undefined);
  useEffect(() => {}, []);

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
  const handleClick = (event) => {
    if (editImg) {
      let userId = Auth.getUserId();
      const sinfile = new FormData();
      sinfile.append("userImg", currentFile);
      sinfile.append("userID", userId);

      console.log(currentFile);
      axios
        .put("http://localhost:5000/users/user-image", sinfile)
        .then((res) => {
          console.log(res);
        })
        .catch((error) => {
          console.log(error);
        });
    } else {
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
  const pathToPage = ["Home", "User", "Profile"];
  return (
    <div className="wrapper">
      {model}
      <SideBar questions={true} />
      <div className="main-panel">
        <NavbarDashboard title="Profile" />
        <div className="content">
          <BreadCrum path={pathToPage} />
          <AdminCard title="">
            <div class="row">
              <div class="col-lg-4">
                <div class="card">
                  <div class="card-body">
                    <div class="d-flex flex-column align-items-center text-center">
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
                            : "https://bootdey.com/img/Content/avatar/avatar6.png"
                        }
                        alt="Admin"
                        class="rounded-circle p-1 bg-primary"
                        width="210"
                        height="210"
                        style={{ objectFit: "cover" }}
                      />
                      {editImg ? (
                        <div className="position-relative">
                          <button
                            className="btn rounded-pill"
                            onClick={() => setEditImg(false)}
                          >
                            Cancel
                          </button>
                          <button
                            className="btn rounded-pill"
                            onClick={handleClick}
                          >
                            Save
                          </button>
                        </div>
                      ) : (
                        <div className="position-relative">
                          <button
                            className="btn rounded-pill"
                            onClick={handleClick}
                          >
                            Edit
                          </button>
                        </div>
                      )}

                      <div class="mt-3">
                        <h4>John Doe</h4>
                        <p class="text-secondary mb-1">Full Stack Developer</p>
                        <p class="text-muted font-size-sm">
                          Bay Area, San Francisco, CA
                        </p>
                      </div>
                    </div>
                    <hr class="my-4" />
                  </div>
                </div>
              </div>
              <div class="col-lg-8">
                <div class="card">
                  <div class="card-body">
                    <div class="row mb-3">
                      <div class="col-sm-3">
                        <h6 class="mb-0">Full Name</h6>
                      </div>
                      <div class="col-sm-9 text-secondary">
                        <input
                          type="text"
                          class="form-control"
                          value="John Doe"
                          disabled={!isEdit}
                        />
                      </div>
                    </div>
                    <div class="row mb-3">
                      <div class="col-sm-3">
                        <h6 class="mb-0">Email</h6>
                      </div>
                      <div class="col-sm-9 text-secondary">
                        <input
                          type="text"
                          class="form-control"
                          value="john@example.com"
                          disabled={!isEdit}
                        />
                      </div>
                    </div>
                    <div class="row mb-3">
                      <div class="col-sm-3">
                        <h6 class="mb-0">Phone</h6>
                      </div>
                      <div class="col-sm-9 text-secondary">
                        <input
                          type="text"
                          class="form-control"
                          value="(239) 816-9029"
                          disabled={!isEdit}
                        />
                      </div>
                    </div>
                    <div class="row mb-3">
                      <div class="col-sm-3">
                        <h6 class="mb-0">Gender</h6>
                      </div>
                      <div class="col-sm-9 text-secondary">
                        <input
                          type="text"
                          class="form-control"
                          value="(320) 380-4539"
                          disabled={!isEdit}
                        />
                      </div>
                    </div>
                    <div class="row mb-3">
                      <div class="col-sm-3">
                        <h6 class="mb-0">Sector</h6>
                      </div>
                      <div class="col-sm-9 text-secondary">
                        <input
                          type="text"
                          class="form-control"
                          value="Bay Area, San Francisco, CA"
                          disabled={!isEdit}
                        />
                      </div>
                    </div>
                    <div class="row mb-3">
                      <div class="col-sm-3">
                        <h6 class="mb-0">Workplace</h6>
                      </div>
                      <div class="col-sm-9 text-secondary">
                        <input
                          type="text"
                          class="form-control"
                          value="Bay Area, San Francisco, CA"
                          disabled={!isEdit}
                        />
                      </div>
                    </div>
                    <div class="row">
                      <div class="col-sm-3">
                        {isEdit ? (
                          <input
                            type="button"
                            class="btn btn-primary px-4"
                            value="Save Changes"
                          />
                        ) : (
                          <button
                            onClick={() => setIsEdit(true)}
                            className="btn btn-info "
                          >
                            Edit
                          </button>
                        )}
                      </div>
                      <div class="col-sm-9 text-secondary"></div>
                    </div>
                  </div>
                </div>
                <div class="row">
                  <div class="col-sm-12">
                    <div class="card"></div>
                  </div>
                </div>
              </div>
            </div>
          </AdminCard>
        </div>
      </div>
    </div>
  );
}
