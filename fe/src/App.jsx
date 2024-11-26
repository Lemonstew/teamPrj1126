import axios from "axios";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { RootLayout } from "./page/root/RootLayout.jsx";
import { Index } from "./page/Index.jsx";
import PlanAdd from "./page/plan/PlanAdd.jsx";
import CommunityWrite from "./page/community/CommunityWrite.jsx";
import CommunityView from "./page/community/CommunityView.jsx";
import CommunityList from "./page/community/CommunityList.jsx";
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
// import './App.css'

// axios 인터셉터 설정
axios.interceptors.request.use(function (config) {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// react router 설정
const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      // 메인 화면
      {
        index: true,
        element: <Index />,
      },
      {
        path: "plan/add",
        element: <PlanAdd />,
      },
      {
        path: "community/write",
        element: <CommunityWrite />,
      },
      {
        path: "community/view/:id",
        element: <CommunityView />,
      },
      {
        path: "community/list",
        element: <CommunityList />,
      },
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
