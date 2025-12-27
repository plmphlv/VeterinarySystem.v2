import { Link, useParams } from "react-router";
import { useEffect, useState } from "react";
import { useGetAnimalDetails } from "../../../api/animalsAPI";
import type { GetAnimalDetailsErrors, GetAnimalDetailsResponse } from "../../../types";
import Spinner from "../../spinner/Spinner";
import Dialog from "../../dialog/Dialog";
import styles from "./My-Pets-Item-Details.module.css";

const MyPetsItemDetails: React.FC = () => {
    const { id } = useParams();
    const { getAnimalDetails, cancelGetAnimalDetails } = useGetAnimalDetails();
    const [errors, setErrors] = useState<GetAnimalDetailsErrors>({});
    const [dialog, setDialog] = useState<{ message: string; type: "success" | "error" } | null>(null);
    const [animalDetails, setAnimalDetails] = useState<GetAnimalDetailsResponse>();
    const [isLoading, setLoading] = useState(true);

    useEffect(() => {
        if (!id) return;

        const fetchAnimalDetails = async () => {
            try {
                setErrors({});
                setLoading(true);

                const details = await getAnimalDetails(Number(id));
                setAnimalDetails(details || undefined);
            } catch (err: any) {
                setDialog({ message: err.title || "An error occurred while fetching animal details.", type: "error" });
                setErrors(err);
            } finally {
                setLoading(false);
            }
        };

        fetchAnimalDetails();
    }, [id]);

    useEffect(() => () => cancelGetAnimalDetails(), []);

    return (
        <>
            {isLoading && (
                <div className="spinner-overlay">
                    <Spinner />
                </div>
            )}

            <h1 className={styles["my-pets-item-details-h1"]}>My Pet Details:</h1>

            <div className={styles["my-pets-item-details"]}>
                <div className={styles["my-pets-item-details-content"]}>
                    <h1 className={styles["my-pets-item-details-content-h1"]}>{animalDetails?.name}</h1>
                    {/* <img src="/images/general-check-up.png" alt={animalDetails?.name} /> */}
                    <h2>General Information:</h2>
                    <p><i className="fa-solid fa-pen"></i> Name: {animalDetails?.name}</p>
                    {animalDetails?.age && <p><i className="fa-solid fa-calendar-days"></i> Age: {animalDetails?.age} years</p>}
                    <p><i className="fa-solid fa-paw"></i> Animal type: {animalDetails?.animalType}</p>
                    <p><i className="fa-solid fa-weight"></i> Weight: {animalDetails?.weight}kg</p>
                    {animalDetails?.passportNumber && <p><i className="fa-solid fa-passport"></i> Passport Number: {animalDetails?.passportNumber}</p>}
                    {animalDetails?.chipNumber && <p><i className="fa-solid fa-microchip"></i> Chip Number: {animalDetails?.chipNumber}</p>}

                    <div className={styles["my-pets-item-details-action-btns"]}>
                        <Link to={`/my-pets/${id}/edit`} className={styles["my-pets-item-details-edit-btn"]}>Edit</Link>
                        <Link to={`/my-pets/${id}/delete`} className={styles["my-pets-item-details-delete-btn"]}>Delete</Link>
                    </div>
                    <Link to="/my-pets" className={styles["my-pets-item-details-back-link"]}>← Back to My Pets</Link>
                </div>
            </div>

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

export default MyPetsItemDetails;