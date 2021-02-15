import "./App.css";
import { Navbar } from "./components";
import ManageMembers from "./pages/ManageMembers";
function App() {
  return (
    <div className="App">
      <Navbar />
      <ManageMembers />
    </div>
  );
}

export default App;
