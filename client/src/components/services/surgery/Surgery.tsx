import type React from "react";
import { Link } from "react-router";

const Surgery: React.FC = () => {
    return (
        <>
            <div className="service">
                <div className="service-content">
                    <h1 className="service-h1">Surgery</h1>
                    <img src="/images/surgery.png" alt="Surgery" />
                    <h2>Expert Veterinary Surgery</h2>
                    <p>Our state-of-the-art surgical suite allows us to perform a wide range of soft tissue and orthopedic
                        procedures with safety and compassion.</p>
                    <h2>Common Surgical Services:</h2>
                    <p>We offer spaying and neutering, tumor removal, wound repair, and emergency surgeries. Each procedure is
                        carefully planned and executed by experienced veterinary surgeons.</p>
                    <h2>What You Can Expect:</h2>
                    <ul>
                        <li>Pre-operative exams and bloodwork;</li>
                        <li>Safe anesthesia and pain management;</li>
                        <li>Detailed post-op instructions and support.</li>
                    </ul>
                    <Link to="/services" className="back-link">← Back to Services</Link>
                </div>
            </div>
        </>
    )

}

export default Surgery;