import { Link, useParams } from "react-router";
import { useEffect, useState } from "react";
import { useGetAppointmentDetails } from "../../../../api/appointmentsAPI";
import type { GetAppointmentDetailsErrors, GetAppointmentDetailsResponse } from "../../../../types";
import Spinner from "../../../spinner/Spinner";
import Dialog from "../../../dialog/Dialog";
import { formatDate, formatStatus, formatTime } from "../../../../utils/formatAppointmentDetails";

const StaffAppointmentsItemDetails: React.FC = () => {
    const { id } = useParams();
    const { getAppointmentDetails, cancelGetAppointmentDetails } = useGetAppointmentDetails();
    const [errors, setErrors] = useState<GetAppointmentDetailsErrors>({});

    const [dialog, setDialog] = useState<{ message: string; type: "success" | "error" } | null>(null);

    const [appointmentDetails, setAppointmentDetails] = useState<GetAppointmentDetailsResponse>();
    const [isLoading, setLoading] = useState(true);

    useEffect(() => {
        if (!id) {
            return;
        }

        const fetchAppointmentDetails = async () => {
            try {
                setErrors({});
                setLoading(true)

                const appointmentDetails = await getAppointmentDetails({ id: Number(id) });

                setAppointmentDetails(appointmentDetails || undefined);

            } catch (err: any) {
                setDialog({ message: err.title || "An error occurred while fetching appointment details.", type: "error" });
                setErrors(err);
                return;
            } finally {
                setLoading(false);
            }
        };

        fetchAppointmentDetails();
    }, [id]);

    useEffect(() => {
        return () => {
            cancelGetAppointmentDetails();
        };
    }, []);

    return (
        <>
            {isLoading && (
                <div className="spinner-overlay">
                    <Spinner />
                </div>
            )}

            {dialog && (
                <Dialog
                    message={dialog.message}
                    type={dialog.type}
                    onClose={() => setDialog(null)}
                />
            )}

            {appointmentDetails ? (
                <>
                <h1 className="appointments-h1">Appointment Request Details:</h1>

                    <section className="appointments">
                        <div className="appointment-card" key={appointmentDetails?.id}>
                            <div className="content">
                                <h2><i className="fa-solid fa-calendar-days"></i> {formatDate(appointmentDetails.date)}</h2>
                                <p><i className="fa-solid fa-clock"></i> Hour: {formatTime(appointmentDetails.date)}</p>
                                <p><i className="fa-solid fa-pen"></i> Status: {formatStatus(appointmentDetails.appointmentStatus)}</p>
                                <p><i className="fa-solid fa-user"></i> Animal Owner: {appointmentDetails.animalOwnerName}</p>
                                {/* <p><i className="fa-solid fa-pen"></i> Staff Member ID: {appointmentDetails.staffMemberId}</p>
                            <p><i className="fa-solid fa-pen"></i> Staff Member Name: {appointmentDetails.staffMemberName}</p> */}
                                <p><i className="fa-solid fa-comment"></i> Description: {appointmentDetails.description}</p>

                                <div className="appointment-actions">
                                    <Link to={`/staff-area/appointments/${id}/update-request`} className="edit-request">Update</Link>
                                    <Link to={`/staff-area/appointments/${id}/delete-request`} className="delete-request">Delete</Link>
                                </div>
                                <Link to="/staff-area/appointments" className="my-pets-item-info-back-link">← Back to All Appointments</Link>
                            </div>
                        </div>
                    </section>
                </>
            ) : (
                // <h1 className="no-user-data">No appointment details found, please try again later.</h1>
                null
            )}

            {/* {error && showError && (
                <Dialog
                    message={error}
                    type="error"
                    onClose={() => setShowError(false)}
                />
            )} */}
        </>
    )
}

export default StaffAppointmentsItemDetails;