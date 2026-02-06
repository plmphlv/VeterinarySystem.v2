import React, { useState } from "react";
import { Link } from "react-router";
import { useGetUserData } from "../../hooks/useGetUserData";
import Spinner from "../spinner/Spinner";
import styles from "./Home.module.css";

const Home: React.FC = () => {
  const { userData, isLoading } = useGetUserData();

  return (
    <>
      {isLoading && (
        <div className={styles.spinnerOverlay}>
          <Spinner />
        </div>
      )}

      <section className={styles.container}>
        <article className={styles.card}>
          <header className={styles.cardHeader}>
            <div className={styles.iconCircle}>
              <i className="fa-solid fa-paw"></i>
            </div>
            {userData ? (
              <>
                <h1 className={styles.title}>Welcome back!</h1>
                <p className={styles.subtitle}>Ready to manage your pets?</p>
              </>
            ) : (
              <>
                <h1 className={styles.title}>Welcome to Veteriq</h1>
                <p className={styles.subtitle}>Your digital veterinary partner</p>
              </>
            )}
          </header>

          <div className={styles.content}>
            <p className={styles.description}>
              Keep your pets healthy and happy with Veteriq! Track appointments,
              monitor health, and stay connected with expert veterinarians—all in
              one easy-to-use platform.
            </p>

            <div className={styles.actionWrapper}>
              {userData ? (
                <Link to="/appointments" className={styles.primaryBtn}>
                <i className="fa-solid fa-share"></i> Get Started
                </Link>
              ) : (
                <Link to="/login" className={styles.primaryBtn}>
               <i className="fa-solid fa-share"></i> Get Started
                </Link>
              )}
            </div>
          </div>
        </article>
      </section>
    </>
  );
};

export default Home;