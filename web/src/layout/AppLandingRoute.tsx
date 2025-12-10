import { absoluteUrls } from "@/config/urls";
import { Navigate } from "react-router-dom"


/**
 * Landing route for the app.
 * @returns {JSX.Element} The landing route component.
 */
export default function AppLandingRoute() {

    //TODO: add navigation based on routes and auth


    return (
        <Navigate to={absoluteUrls.client.auth.login} replace />   
    );
}