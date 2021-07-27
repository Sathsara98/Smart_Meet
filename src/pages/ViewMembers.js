import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import { useParams } from "react-router";
import { Table, Container } from "react-bootstrap";
import {
  BreadCrum,
  SideBar,
  Navbar,
  AdminCard,
  NavbarDashboard,
} from "../components";
import Auth from '../authentication/Auth'

function ViewMembers(props) {
  const { type } = useParams();
  console.log(type);
  const [page, setPage] = useState(1);
  const [memberList, setMemberList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const tableDATA = memberList.map((p, index) => {
    return (
      <tr key={index}>
        <td>{index + 1}</td>
        <td></td>
        <td>{p.name}</td>
        <td>{p.email}</td>
        <td>{p.tel}</td>
        <td>{p.gender}</td>
        <td>{p.workplace}</td>
        {Auth?.getUserLevel()!=="Committee Member"&& Auth?.getUserLevel()!=="Committee Secretary" ?(<td>
          <button className="btn btn-danger" onClick={()=>deleteMember(p._id)}>Delete</button>
        </td>):null}
        
      </tr>
    );
  });

   const deleteMember = async (event) => {
    // event.preventDefault();
    
    console.log(event);
    try {
      const requestOptions = {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
           token: Auth.getToken()},
        body: JSON.stringify({
          id: event,
        }),
      };
      const res = await fetch(
        "http://localhost:5000/users/delete",
        requestOptions
      );

      const data = await res.json();

      console.log(data);
      loadMembers();
      // if (data.hasOwnProperty("error")) {
      //   setShow(true);
      // } else {
      //   setShow(true);
      // }
    } catch (e) {
      console.log(e);
    }
   }
  
  const loadMembers = ()=>{
     fetch(`http://localhost:5000/users/register/` + type, {
      method: "GET",
      headers: new Headers({
        Accept: "application/vnd.github.cloak-preview",
      }),
    })
      .then((res) => res.json())
      .then((response) => {
        setMemberList(response);
        setIsLoading(false);
        console.log(response);
      })
      .catch((error) => console.log(error));
  }

  useEffect(() => {
    loadMembers();
  }, [page]);
  return (
    <div className="wrapper">
      <SideBar members={true} viewmembers={true} />
      <div className="main-panel">
        <NavbarDashboard title="Members" />
        <div className="content">
          <BreadCrum path={["Home", "Users", "View Members"]} />
          <AdminCard title="View Members">
            <table id="example" className="table table-bordered">
              <thead>
                <tr>
                  <th>No</th>
                  <th>Image</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Mobile No</th>
                  <th>Gender</th>
                  <th>Ofiice</th>
                  {Auth?.getUserLevel()!=="Committee Member"&& Auth?.getUserLevel()!=="Committee Secretary" ?(<th>Action</th>):null}
                  
                </tr>
              </thead>
              <tbody>{tableDATA}</tbody>
            </table>
          </AdminCard>
        </div>
      </div>
    </div>
  );
}

export default ViewMembers;
