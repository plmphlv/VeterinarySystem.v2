import { useEffect, useState } from "react";
import { useDeleteAnimal } from "../../../api/animalsAPI";
import { useNavigate, useParams } from "react-router";
import Spinner from "../../spinner/Spinner";
import Dialog from "../../dialog/Dialog";

const MyPetsDelete: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { deleteAnimal, cancelDeleteAnimal } = useDeleteAnimal();
  const [isLoading, setLoading] = useState(false);
  const [dialog, setDialog] = useState<{ message: string; type: "success" | "error" } | null>(null);

  useEffect(() => {
    if (!id) {
      navigate("/my-pets");
      return;
    }

    const doDelete = async () => {
      const confirmed = window.confirm("Are you sure you want to delete this animal?");
      if (!confirmed) {
        navigate(`/my-pets/${id}/details`);
        return;
      }

      try {
        setLoading(true);
        await deleteAnimal({ id: Number(id) });
        setDialog({ message: "Animal deleted successfully.", type: "success" });
      } catch (err) {
        setDialog({ message: "Failed to delete animal.", type: "error" });
      } finally {
        setLoading(false);
        setTimeout(() => navigate(`/my-pets`), 1500);
      }
    };

    doDelete();
  }, []);

  useEffect(() => {
    return () => {
      cancelDeleteAnimal();
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

export default MyPetsDelete;
