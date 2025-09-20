import { createRoot } from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { HmrLibrary } from "../hmrLibrary";

const HomeWidget = () => {
  return (
    <div>
      <h1>Main</h1>
      <BrowserRouter>
        <Routes>
          <Route path="hmr-library" element={<HmrLibrary />} />
          <Route path="*" element={<><HmrLibrary /></>} />
        </Routes>
      </BrowserRouter>
    </div>
  );
};

const container = document.getElementById("app");
if (container) {
  createRoot(container).render(<HomeWidget />);
}
