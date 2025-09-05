import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import Spinner from "../../spinner/Spinner";
import Dialog from "../../dialog/Dialog";
import { useDeleteAppointmentRequest } from "../../../api/userAppointmentsAPI";

const AppointmentsDeleteRequest: React.FC = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { deleteAppointmentRequest, cancelDeleteAppointmentRequest } = useDeleteAppointmentRequest();
    const [isLoading, setLoading] = useState(false);
    const [dialog, setDialog] = useState<{ message: string; type: "success" | "error" } | null>(null);

    useEffect(() => {
        if (!id) {
            navigate("/appointments");
            return;
        }

        const doDelete = async () => {
            const confirmed = window.confirm("Are you sure you want to delete this appointment request?");
            if (!confirmed) {
                navigate(`/appointments/${id}/details`);
                return;
            }

            try {
                setLoading(true);
                await deleteAppointmentRequest({ id: Number(id) });
                setDialog({ message: "Appointment request deleted successfully.", type: "success" });
            } catch (err) {
                setDialog({ message: "Failed to delete appointment request.", type: "error" });
            } finally {
                setLoading(false);
                navigate(`/appointments`);
            }
        };

        doDelete();
    }, []);

    useEffect(() => {
        return () => {
            cancelDeleteAppointmentRequest();
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
        </>
    );
};

export default AppointmentsDeleteRequest;
