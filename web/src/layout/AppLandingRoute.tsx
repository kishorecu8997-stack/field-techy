import { absoluteUrls } from "@/config/urls";
import LoaderComponent from "@/shared/components/commonUI/LoaderComponent";
import useReady from "@/shared/hooks/useReady";
import { useUserSessionStore } from "@/shared/store/useUserSessionStore";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom"


/**
 * Landing route for the app.
 * @returns {JSX.Element} The landing route component.
 */
export default function AppLandingRoute() {
    const ready = useReady()
    const navigate = useNavigate()

    //TODO: add navigation based on routes and auth

    const userSession = useUserSessionStore(s => s.session);


    useEffect(() => {
        if (ready) {
            if (userSession) {
                navigate(absoluteUrls.client.home.dashboard, { replace: true })
            } else {
                navigate(absoluteUrls.client.auth.login, { replace: true })
            }
        }
    }, [userSession, ready])

    return <LoaderComponent />
}