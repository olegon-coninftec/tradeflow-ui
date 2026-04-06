import { Routes, Route } from "react-router-dom";
import DashboardPage from "./DashboardPage";
import GraphQLPage from "./GraphQLPage";

export default function App() {
  return (
      <Routes>
        <Route path="/"                  element={<DashboardPage />} />
        <Route path="/graphql-explorer"  element={<GraphQLPage />} />
      </Routes>
  );
}