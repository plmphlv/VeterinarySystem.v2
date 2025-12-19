import { useEffect, useState } from "react";
import { useDeleteAnimalType } from "../../../../api/animalTypesAPI";
import { useNavigate, useParams } from "react-router";
import Spinner from "../../../spinner/Spinner";
import Dialog from "../../../dialog/Dialog";

const AnimalsTypeDelete: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { deleteAnimalType, cancelDeleteAnimalType } = useDeleteAnimalType();
  const [isLoading, setLoading] = useState(false);
  const [dialog, setDialog] = useState<{ message: string; type: "success" | "error" } | null>(null);

  useEffect(() => {
    if (!id) {
      navigate("/staff-area/animal-types");
      return;
    }

    const doDelete = async () => {
      const confirmed = window.confirm("Are you sure you want to delete this animal type?");
      if (!confirmed) {
        return;
      }

      try {
        setLoading(true);
        
        await deleteAnimalType({ id: Number(id) });
        setDialog({ message: "Animal type deleted successfully.", type: "success" });
      } catch (err) {
        setDialog({ message: "Failed to delete animal type.", type: "error" });
      } finally {
        setLoading(false);
        setTimeout(() => navigate(`/staff-area/animal-types`), 1500);
      }
    };

    doDelete();
  }, []);

  useEffect(() => {
    return () => {
      cancelDeleteAnimalType();
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

export default AnimalsTypeDelete;
