import React from "react";
import { Link } from "react-router-dom";
import styles from "./LandingPage.module.css";

const LandingPage = () => {
  return (
    <div className={styles.landingPage}>
      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <div className={styles.textDiv}>
            <h1 className={styles.heroTitle}>
              Welcome to{" "}
              <span className={styles.highlight}>Evangadi Forum</span>
              <br />
              Dive into the Digital Revolution!
            </h1>

            <p className={styles.heroSubtitle}>
              Before us is a golden opportunity, demanding us to take a bold
              step forward and join the new digital era. Connect, learn, and
              grow with a community of passionate developers.
            </p>

            <div className={styles.ctaSection}>
              <Link to="/users/register" className={styles.createAccount}>
                Get Started Free
                <span className={styles.ctaArrow}>→</span>
              </Link>
              <Link to="/users/login" className={styles.signIn}>
                Already a Member?
              </Link>
            </div>
          </div>

          {/* Hero Visual */}
          <div className={styles.heroVisual}>
            <div className={styles.floatingCard}>
              <div className={styles.cardContent}>
                <div className={styles.cardIcon}>💬</div>
                <h4>Join 10K+ Developers</h4>
                <p>Start your journey today</p>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className={styles.scrollIndicator}>
          <span>Explore More</span>
          <div className={styles.scrollArrow}></div>
        </div>
      </section>

      {/* Stats Section */}
      <section className={styles.statsSection}>
        <div className={styles.container}>
          <div className={styles.stats}>
            <div className={styles.stat}>
              <div className={styles.statNumber}>10K+</div>
              <div className={styles.statLabel}>Active Users</div>
              <div className={styles.statBar}></div>
            </div>
            <div className={styles.stat}>
              <div className={styles.statNumber}>50K+</div>
              <div className={styles.statLabel}>Questions Answered</div>
              <div className={styles.statBar}></div>
            </div>
            <div className={styles.stat}>
              <div className={styles.statNumber}>100+</div>
              <div className={styles.statLabel}>Topics Covered</div>
              <div className={styles.statBar}></div>
            </div>
            <div className={styles.stat}>
              <div className={styles.statNumber}>24/7</div>
              <div className={styles.statLabel}>Community Support</div>
              <div className={styles.statBar}></div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className={styles.features}>
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Why Choose Evangadi Forum?</h2>
            <p className={styles.sectionSubtitle}>
              Experience the difference with our comprehensive learning platform
            </p>
          </div>

          <div className={styles.featuresGrid}>
            <div className={styles.featureCard}>
              <div className={styles.featureIcon}>🤝</div>
              <h3 className={styles.featureTitle}>Community Support</h3>
              <p className={styles.featureDescription}>
                Get help from experienced developers and share your knowledge in
                a collaborative environment.
              </p>
            </div>

            <div className={styles.featureCard}>
              <div className={styles.featureIcon}>🚀</div>
              <h3 className={styles.featureTitle}>Latest Tech</h3>
              <p className={styles.featureDescription}>
                Stay updated with cutting-edge technologies and industry trends
                through real-time discussions.
              </p>
            </div>

            <div className={styles.featureCard}>
              <div className={styles.featureIcon}>💡</div>
              <h3 className={styles.featureTitle}>Interactive Learning</h3>
              <p className={styles.featureDescription}>
                Engage in meaningful discussions and learn through hands-on
                collaboration with peers.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className={styles.testimonials}>
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>What Our Community Says</h2>
            <p className={styles.sectionSubtitle}>
              Hear from developers who transformed their careers
            </p>
          </div>

          <div className={styles.testimonialsGrid}>
            <div className={styles.testimonialCard}>
              <div className={styles.quoteIcon}>❝</div>
              <p className={styles.testimonialText}>
                "Evangadi Forum has been instrumental in my learning journey.
                The community is incredibly supportive and always ready to
                help!"
              </p>
              <div className={styles.testimonialAuthor}>
                <div className={styles.authorAvatar}>T</div>
                <div className={styles.authorInfo}>
                  <strong>Tzewodu</strong>
                  <span>Full Stack Developer</span>
                </div>
              </div>
            </div>

            <div className={styles.testimonialCard}>
              <div className={styles.quoteIcon}>❝</div>
              <p className={styles.testimonialText}>
                "I found solutions to complex problems in minutes. This platform
                is a game-changer for developers at any level."
              </p>
              <div className={styles.testimonialAuthor}>
                <div className={styles.authorAvatar}>A</div>
                <div className={styles.authorInfo}>
                  <strong>Abe</strong>
                  <span>Frontend Developer</span>
                </div>
              </div>
            </div>

            <div className={styles.testimonialCard}>
              <div className={styles.quoteIcon}>❝</div>
              <p className={styles.testimonialText}>
                "The discussions here are incredibly insightful and help me stay
                updated with the latest tech trends and best practices."
              </p>
              <div className={styles.testimonialAuthor}>
                <div className={styles.authorAvatar}>D</div>
                <div className={styles.authorInfo}>
                  <strong>Davis</strong>
                  <span>DevOps Engineer</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className={styles.finalCta}>
        <div className={styles.container}>
          <div className={styles.ctaContent}>
            <h2 className={styles.ctaTitle}>Ready to Join Our Community?</h2>
            <p className={styles.ctaDescription}>
              Start your journey today and become part of 10,000+ developers
              shaping the future of technology.
            </p>
            <div className={styles.ctaButtons}>
              <Link to="/users/register" className={styles.primaryCta}>
                Create Your Account
              </Link>
              <Link to="/about" className={styles.secondaryCta}>
                Learn More
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
