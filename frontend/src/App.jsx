import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/Login";
import Home from "./pages/user/Home";
import Dashboard from "./pages/Admin/Dashboard";
import BookDetails from "./pages/user/BookDetails";
import About from "./pages/user/About";
import Contact from "./pages/user/Contact";
import Explore from "./pages/user/Explore";
import Categories from "./pages/user/Categories";
import AdminRoute from "./components/AdminRoute";
import Register from "./pages/Register";
import MyLibrary from "./pages/user/MyLibrary";

function HomeRedirect() {
  const token = localStorage.getItem("adminToken");
  const storedUser = localStorage.getItem("adminUser");

  if (token && storedUser) {
    try {
      const user = JSON.parse(storedUser);


      if (user.role === "admin") {
        return <Navigate to="/admin" replace />;
      }
    } catch {
      // Invalid user data: show the public homepage
    }


  }

  return <Home />;
}

function App() {
  return (<BrowserRouter> <Routes>
    <Route path="/login" element={<Login />} />
    <Route path="/register" element={<Register />} />


    {/* Redirect admins to their dashboard */}
    <Route path="/" element={<HomeRedirect />} />

    <Route path="/book/:id" element={<BookDetails />} />
    <Route path="/about" element={<About />} />
    <Route path="/contact" element={<Contact />} />
    <Route path="/explore" element={<Explore />} />
    <Route path="/categories" element={<Categories />} />
    <Route path="/library" element={<MyLibrary />} />

    {/* Protected Admin Routes */}
    <Route element={<AdminRoute />}>
      <Route path="/admin" element={<Dashboard />} />
    </Route>
  </Routes>
  </BrowserRouter>


  );
}

export default App;
