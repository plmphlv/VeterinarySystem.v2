import type React from "react";
import { Link } from "react-router";


const GeneralCheckup: React.FC = () => {
    return (
        <>
            <h1 className="service-h1">General Check-up</h1>

            <div className="service-content">
                <img src="/images/general-check-up.png" alt="General Check-up" />

                    <h2>What is a General Check-up?</h2>
                    <p>A General Check-up is a routine health examination for your pet to ensure they are happy, healthy, and
                        thriving. It allows our veterinarians to assess overall wellness, identify potential health issues
                        early, and provide guidance on care, nutrition, and preventative treatment.</p>

                    <h2>What to Expect During the Visit:</h2>
                    <p>During the check-up, we examine your pet’s vital signs, skin, coat, eyes, ears, mouth, heart, lungs,
                        joints, and abdomen. We also check for parasites and may recommend routine tests such as bloodwork or
                        urinalysis depending on your pet's age and history.</p>

                    <h2>Benefits of Regular Check-ups:</h2>
                    <ul>
                        <li>Early detection of health problems;</li>
                        <li>Preventative care recommendations;</li>
                        <li>Improved long-term health and quality of life;</li>
                        <li>Personalized advice for nutrition and behavior.</li>
                    </ul>

                    <Link to="/services" className="back-link">← Back to Services</Link>
            </div>
        </>
    )
}

export default GeneralCheckup;