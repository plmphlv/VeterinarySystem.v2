import React from "react";
import { Link } from "react-router";
import { useGetUserData } from "../../hooks/useGetUserData";

const Home: React.FC = () => {
  const { userData, isLoading, error } = useGetUserData();
  return (
    <>
      <div className="home-container">
        <div className="home-content">
          {userData ? (
            <>
              <h1>Welcome back to Veteriq!</h1>
              <p>Keep your pets healthy and happy with Veteriq! Track appointments, monitor health, and stay connected with expert veterinarians—all in one easy-to-use platform.</p>
              <Link to="/appointments">Get Started</Link>
            </>
          ) : (
            <>
              <h1>Welcome to Veteriq!</h1>
              <p>Keep your pets healthy and happy with Veteriq! Track appointments, monitor health, and stay connected with expert veterinarians—all in one easy-to-use platform.</p>
              <Link to="/login">Get Started</Link>
            </>
          )}
        </div>
      </div >
    </>
  );
};

export default Home;