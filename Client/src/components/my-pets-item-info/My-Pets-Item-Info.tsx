import { Link } from "react-router";

const MyPetsItemInfo: React.FC = () => {
    return (
        <>
            <div className="my-pets-item-info-content">
                <h1 className="my-pets-item-info-h1">Bobo</h1>
                <img src="/images/general-check-up.png" alt="Bobo's image" />
                    <h2>General Information:</h2>
                    <p><i className="fa-solid fa-pen"></i> Name: Bobo</p>
                    <p><i className="fa-solid fa-calendar-days"></i> Age: 13 years</p>
                    <p><i className="fa-solid fa-paw"></i> Animal type: Dog</p>
                    <p><i className="fa-solid fa-scale-unbalanced"></i> Weight: 5.80kg</p>
                    <Link to="/my-pets" className="my-pets-item-info-back-link">← Back to My Pets</Link>
            </div>
        </>
    )
}

export default MyPetsItemInfo;