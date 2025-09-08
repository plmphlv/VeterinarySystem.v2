import type React from "react";
import { Link } from "react-router";

const PetNutritionCounseling: React.FC = () => {
    return (
        <>
            <div className="service">
                <div className="service-content">
                    <h1 className="service-h1">Pet Nutrition Counseling</h1>
                    <img src="/images/pet-nutrition-counseling.png" alt="Pet Nutrition Counseling" />

                    <h2>Personalized Nutrition for Your Pet</h2>
                    <p>Proper nutrition is the foundation of your pet’s health. Our nutrition counseling services help you choose
                        the right diet to support your pet’s age, weight, activity level, and medical conditions.</p>

                    <h2>What We Offer:</h2>
                    <p>We provide guidance on commercial pet foods, homemade diets, supplements, and special dietary plans for pets
                        with diabetes, kidney disease, allergies, and obesity. Our veterinarians work closely with you to ensure
                        your pet’s nutritional needs are fully met.</p>

                    <h2>Benefits of Nutrition Counseling:</h2>
                    <ul>
                        <li>Improved energy levels and coat quality;</li>
                        <li>Better weight management;</li>
                        <li>Support for chronic health conditions;</li>
                        <li>Tailored plans for different life stages.</li>
                    </ul>

                    <Link to="/services" className="back-link">← Back to Services</Link>
                </div>
            </div>
        </>
    )
}

export default PetNutritionCounseling;