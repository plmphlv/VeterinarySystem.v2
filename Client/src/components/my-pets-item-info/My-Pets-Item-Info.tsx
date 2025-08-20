import { Link, useParams } from "react-router";
import { useGetAnimalDetails } from "../../api/animalsAPI";
import type { Animal, GetAnimalDetailsErrors, GetAnimalDetailsResponse } from "../../types";
import { useEffect, useState } from "react";
import Spinner from "../spinner/Spinner";
import Dialog from "../dialog/Dialog";

const MyPetsItemInfo: React.FC = () => {
    const { id } = useParams();
    const { getAnimalDetails, cancelGetAnimalDetails } = useGetAnimalDetails();
    // const [errors, setErrors] = useState<GetAnimalDetailsErrors>({});

    const [dialog, setDialog] = useState<{ message: string; type: "success" | "error" } | null>(null);

    const [animalDetails, setAnimalDetails] = useState<GetAnimalDetailsResponse>();
    const [isLoading, setLoading] = useState(true);

    useEffect(() => {
        if (!id) {
            return;
        }

        const fetchAnimalDetails = async () => {
            try {
                // setErrors({});
                setLoading(true)

                const animalDetails = await getAnimalDetails(Number(id));

                setAnimalDetails(animalDetails || undefined);

            } catch (err: any) {
                setDialog({ message: err.title || "An error occurred while fetching animal details.", type: "error" });
                // setErrors(err);
                return;
            } finally {
                setLoading(false);
            }
        };

        fetchAnimalDetails();
    }, [id]);

    useEffect(() => {
        return () => {
            cancelGetAnimalDetails();
        };
    }, []);

    return (
        <>
            {isLoading && (
                <div className="spinner-overlay">
                    <Spinner />
                </div>
            )}
            <div className="my-pets-item-info-content">
                <h1 className="my-pets-item-info-h1">{animalDetails?.name}</h1>
                {/* <img src="/images/general-check-up.png" alt={animalDetails?.name} /> */}
                <h2>General Information:</h2>
                <p><i className="fa-solid fa-pen"></i> Name: {animalDetails?.name}</p>
                <p><i className="fa-solid fa-calendar-days"></i> Age: {animalDetails?.age} years</p>
                <p><i className="fa-solid fa-paw"></i> Animal type: {animalDetails?.animalType}</p>
                <p><i className="fa-solid fa-weight"></i> Weight: {animalDetails?.weight}kg</p>
                <div className="pet-action-btns">
                    <Link to={`/my-pets/${id}/edit`} className="my-pets-item-info-edit">Edit</Link>
                    <Link to={`/my-pets/${id}/delete`} className="my-pets-item-info-delete">Delete</Link>
                </div>
                <Link to="/my-pets" className="my-pets-item-info-back-link">← Back to My Pets</Link>
            </div>

            {dialog && (
                <Dialog
                    message={dialog.message}
                    type={dialog.type}
                    onClose={() => setDialog(null)}
                />
            )}
        </>
    )
}

export default MyPetsItemInfo;