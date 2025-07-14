import type React from "react";
import { Link } from "react-router";

const Vaccinations: React.FC = () => {
    return (
        <>
            <h1 className="service-h1">Vaccinations</h1>

            <div className="service-content">
                <img src="/images/vaccinations.png" alt="Vaccinations" />
                    <h2>Why Vaccinate Your Pet?</h2>
                    <p>Vaccinations are a crucial part of preventive healthcare. They help protect your pet from serious and
                        potentially fatal diseases, such as rabies, parvovirus, and distemper.</p>
                    <h2>What We Offer:</h2>
                    <p>We provide a full schedule of core and non-core vaccinations tailored to your pet's age, lifestyle, and risk
                        exposure. Our team ensures each shot is safely administered and recorded for future needs.</p>
                    <h2>Benefits of Regular Vaccination:</h2>
                    <ul>
                        <li>Protection against common infectious diseases;</li>
                        <li>Compliance with legal requirements (e.g. rabies vaccination);</li>
                        <li>Long-term cost savings by preventing illness.</li>
                    </ul>
                    <Link to="/services" className="back-link">← Back to Services</Link>
            </div>
        </>
    )
}

export default Vaccinations;