import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import Spinner from "../../spinner/Spinner";
import Dialog from "../../dialog/Dialog";
import { useDeleteAppointment } from "../../../api/staffAppointmentsAPI";

const AppointmentsDelete: React.FC = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { deleteAppointment, cancelDeleteAppointment } = useDeleteAppointment();
    const [isLoading, setLoading] = useState(false);
    const [dialog, setDialog] = useState<{ message: string; type: "success" | "error" } | null>(null);

    useEffect(() => {
        if (!id) {
            navigate("/appointments");
            return;
        }

        const doDelete = async () => {
            const confirmed = window.confirm("Are you sure you want to delete this appointment?");
            if (!confirmed) {
                navigate(`/appointments/${id}/info`);
                return;
            }

            try {
                setLoading(true);
                await deleteAppointment({ id: Number(id) });
                setDialog({ message: "Appointment deleted successfully.", type: "success" });
            } catch (err) {
                setDialog({ message: "Failed to delete appointment.", type: "error" });
            } finally {
                setLoading(false);
                navigate(`/appointments`);
            }
        };

        doDelete();
    }, []);

    useEffect(() => {
        return () => {
            cancelDeleteAppointment();
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

export default AppointmentsDelete;
