import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router";
import { useDeleteAnimal, useGetAnimalDetails } from "../../../api/animalsAPI";
import type { GetAnimalDetailsErrors, GetAnimalDetailsResponse } from "../../../types";
import Spinner from "../../spinner/Spinner";
import Dialog from "../../dialog/Dialog";
import styles from "./My-Pets-Item-Details.module.css";

const MyPetsItemDetails: React.FC = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    
    const { getAnimalDetails, cancelGetAnimalDetails } = useGetAnimalDetails();
    const { deleteAnimal, cancelDeleteAnimal } = useDeleteAnimal();

    const [animalDetails, setAnimalDetails] = useState<GetAnimalDetailsResponse>();
    const [isLoading, setLoading] = useState(true);
    const [deleting, setDeleting] = useState(false);
    const [dialog, setDialog] = useState<{ message: string; type: "success" | "error" } | null>(null);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [errors, setErrors] = useState<GetAnimalDetailsErrors>({});

    useEffect(() => {
        if (!id) return;

        const fetchAnimalDetails = async () => {
            try {
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
        return () => cancelGetAnimalDetails();
    }, [id]);

    useEffect(() => () => cancelDeleteAnimal(), []);

    const handleDelete = async () => {
        if (!id) return;

        const confirmed = window.confirm("Are you sure you want to remove this pet?");
        if (!confirmed) return;

        try {
            setDeleting(true);
            await deleteAnimal({ id: Number(id) });
            setDialog({ message: "Pet removed successfully.", type: "success" });
            setTimeout(() => navigate("/my-pets"), 1500);
        } catch {
            setDialog({ message: "Failed to remove pet.", type: "error" });
        } finally {
            setDeleting(false);
        }
    };

    return (
        <div className={styles.container}>
            {isLoading && (
                <div className={styles.spinnerOverlay}>
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

            <div className={styles.navWrapper}>
                <Link to="/my-pets" className={styles.backLink}>
                    &larr; Back to My Pets
                </Link>
            </div>

            {animalDetails && (
                <article className={styles.card}>
                    <header className={styles.cardHeader}>
                        <div className={styles.avatarWrapper}>
                             <i className="fa-solid fa-paw"></i>
                        </div>
                        <h1 className={styles.petName}>{animalDetails.name}</h1>
                        <span className={styles.petType}>{animalDetails.animalType}</span>
                    </header>

                    <div className={styles.cardBody}>
                        <div className={styles.detailRow}>
                            <div className={styles.iconBox}>
                                <i className="fa-solid fa-calendar-days"></i>
                            </div>
                            <div className={styles.detailText}>
                                <span className={styles.label}>Age</span>
                                <span className={styles.value}>
                                    {animalDetails.age ? `${animalDetails.age} years old` : "Not specified"}
                                </span>
                            </div>
                        </div>

                        <div className={styles.detailRow}>
                            <div className={styles.iconBox}>
                                <i className="fa-solid fa-weight-scale"></i>
                            </div>
                            <div className={styles.detailText}>
                                <span className={styles.label}>Weight</span>
                                <span className={styles.value}>
                                    {animalDetails.weight ? `${animalDetails.weight} kg` : "Not specified"}
                                </span>
                            </div>
                        </div>

                        {animalDetails.passportNumber && (
                            <div className={styles.detailRow}>
                                <div className={styles.iconBox}>
                                    <i className="fa-solid fa-passport"></i>
                                </div>
                                <div className={styles.detailText}>
                                    <span className={styles.label}>Passport Number</span>
                                    <span className={styles.value}>{animalDetails.passportNumber}</span>
                                </div>
                            </div>
                        )}

                        {animalDetails.chipNumber && (
                            <div className={styles.detailRow}>
                                <div className={styles.iconBox}>
                                    <i className="fa-solid fa-microchip"></i>
                                </div>
                                <div className={styles.detailText}>
                                    <span className={styles.label}>Chip Number</span>
                                    <span className={styles.value}>{animalDetails.chipNumber}</span>
                                </div>
                            </div>
                        )}
                    </div>

                    <footer className={styles.cardFooter}>
                        <Link to={`/my-pets/${id}/edit`} className={styles.editBtn}>
                            <i className="fa-solid fa-pen-to-square"></i> Edit Pet
                        </Link>
                        <button onClick={handleDelete} className={styles.deleteBtn} disabled={deleting}>
                            <i className="fa-solid fa-trash"></i> {deleting ? "Removing..." : "Remove Pet"}
                        </button>
                    </footer>
                </article>
            )}
        </div>
    );
};

export default MyPetsItemDetails;