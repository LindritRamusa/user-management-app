import { Routes, Route } from "react-router-dom";
import UsersList from "./components/UsersList.jsx";
import UserDetails from "./components/UserDetails.jsx";
function App() {
  return (
    <Routes>
      <Route path="/" element={UsersList()} />
      <Route path="/user/:id" element={UserDetails()} />
    </Routes>
  );
}

export default App;
