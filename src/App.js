import { Routes, Route, Navigate } from "react-router-dom";
import ListView from "./pages/ListView";
import DetailView from "./pages/DetailView";


function App() {
  return (
    <Routes>
      <Route path="/" element={<ListView />} />
      <Route path="/detail/:id" element={<DetailView />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
