import { Link } from "react-router";
import { useGetUserData } from "../../hooks/useGetUserData";
import AppointmentsItem from "./appointments-item/Appointments-Item";

const Appointments: React.FC = () => {

    const { userData, error } = useGetUserData();

    if (!userData) {
        return;
    }

    return (
        <>
            <h1 className="appointments-h1">My Appointment Requests:</h1>
            <AppointmentsItem />
            <Link to="/appointments/request-appointment" className="my-pets-request-appointment-btn">Request New Appointment</Link>

        </>
    )
}

export default Appointments;