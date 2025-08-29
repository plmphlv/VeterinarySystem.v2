import React from "react";
import { Link } from "react-router";

const Home: React.FC = () => {
  return (
    <>
      <div className="home-container">
        <div className="home-content">
          <h1>Welcome to Veteriq!</h1>
          <p>Keep your pets healthy and happy with Veteriq! Track appointments, monitor health, and stay connected with expert veterinarians—all in one easy-to-use platform.</p>
          <Link to="/services">Get Started</Link>
        </div>
      </div>
    </>
  );
};

export default Home;