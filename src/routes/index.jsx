import {Home, Configuration} from "../pages";

import config from "../configs/routeConfig";

import { createBrowserRouter } from "react-router-dom";

const publicRoutes = [
  {
    path: config.home,
    element: <Home></Home>,
  },
  {
    path: config.about,
    element: <Configuration></Configuration>,
  },
];

export const publicRouter = createBrowserRouter(publicRoutes);