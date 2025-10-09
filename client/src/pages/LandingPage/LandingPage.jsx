import React from "react";
import { Link } from "react-router-dom";
import styles from "./LandingPage.module.css";

const LandingPage = () => {
  return (
    <div className={styles.landingPage}>
      <div className={styles.textDiv}>
        <h2>
          Together We Code, <br />
          Together We Grow
        </h2>

        <h3>
          From Questions to Solutions, <br />
          Powered by the Community
        </h3>

        <p>
          Step into the Digital Era. Ask, learn, and grow with the Evangadi Tech
          Community. Join us to share knowledge, solve problems, and connect
          with fellow African developers.
        </p>

        <div className={styles.linkDiv}>
          <Link to="/users/register" className={styles.createAccount}>
            Create Account
          </Link>
          <Link to="/users/login" className={styles.signIn}>
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
