import React from 'react';
import {createBrowserRouter, RouterProvider} from "react-router-dom";
import Layout from "../layout/layout/Layout";
import Root from "../layout/root/Root";
import AlertModal from '../components/alertModal/AlertModal';

const AppRoute = () => {

    const router = createBrowserRouter([
        {
            element: <Layout/>,
            children: [
                {
                    path: "/",
                    element: <Root/>
                }
            ]
        }
    ]);

    return (
        <>
            <AlertModal/>
            <RouterProvider router={router}/>
        </>
    );
};

export default AppRoute;