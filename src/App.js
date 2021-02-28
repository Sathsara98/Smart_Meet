import React from "react";
import "./App.css";
import { Navbar } from "./components";
import HomePage from "./components/Home/Index";
import AddQuestion from "./components/Admin/Index";
import ManageMembers from "./pages/ManageMembers";
function App() {
  return (
    <div className="App">
      <Navbar />
      <ManageMembers />
      {/* <AddQuestion /> */}
      {/* <HomePage /> */}
    </div>
  );
}

export default App;
