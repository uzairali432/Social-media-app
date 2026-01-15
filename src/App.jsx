import { BrowserRouter, Route, Routes } from "react-router-dom";
import Login from "./pages/auth/Login";
import SignUp from "./pages/auth/SignUp";
import PrivateRoute from "./routes/PrivateRoute";
import Layout from "./layout/Layout";
import { route } from "./routes/route";
import Provider from "./context/Provider";
import './App.css'

const App = () => {
  return (
    <div>
      <Provider>
        <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          {route.map((currRoute) => (
            <Route
              path={currRoute.path}
              element={
                <PrivateRoute>
                  <Layout>
                    {currRoute.component}
                  </Layout>
                </PrivateRoute>
              }
            />
          ))}
        </Routes>
      </BrowserRouter>
      </Provider>
    </div>
  );
};

export default App;
