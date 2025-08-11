import { Link } from "react-router";

const MyPetItem: React.FC = () => {
    return (
        <>
            <section className="my-pets-item-section">
                <div className="my-pets-item-card">
                    <img src="/images/general-check-up.png" alt="Bobo's image" />
                    <div className="content">
                        <h2>Bobo</h2>
                        <p><i className="fa-solid fa-paw"></i> Animal type: Dog</p>
                        <p><i className="fa-solid fa-calendar-days"></i> Age: 13 years</p>
                        <Link to="/my-pet/info" className="my-pets-item-more-info-btn">→ More Info</Link>
                    </div>
                </div>
            </section>
        </>
    )
}

export default MyPetItem;