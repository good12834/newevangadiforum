import React from "react";
import { Link } from "react-router-dom";
import styles from "./LandingPage.module.css";

const LandingPage = () => {
  return (
    <div className={styles.landingPage}>
      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.heroBg}>
          <div className={styles.gradientOrb}></div>
          <div className={styles.gradientOrb2}></div>
          <div className={styles.gridPattern}></div>
        </div>

        <div className={styles.heroContent}>
          <div className={styles.textDiv}>
            <div className={styles.badge}>
              <span className={styles.badgeDot}></span>
              Empowering Developers Worldwide
            </div>

            <h1 className={styles.heroTitle}>
              Where{" "}
              <span className={styles.highlight}>Developers</span>
              <br />
              Learn & Grow Together
            </h1>

            <p className={styles.heroSubtitle}>
              Join 10,000+ developers in an interactive community. Ask
              questions, share knowledge, and accelerate your career in tech.
            </p>

            <div className={styles.ctaSection}>
              <Link to="/users/register" className={styles.createAccount}>
                Get Started Free
                <svg className={styles.ctaArrow} width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path d="M4.16666 10H15.8333M15.8333 10L11.6667 5.83333M15.8333 10L11.6667 14.1667" stroke="currentColor" strokeWidth="1.67" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </Link>
              <Link to="/users/login" className={styles.signIn}>
                Sign In
              </Link>
            </div>

            <div className={styles.socialProof}>
              <div className={styles.avatarGroup}>
                <div className={styles.avatar}>T</div>
                <div className={styles.avatar}>A</div>
                <div className={styles.avatar}>D</div>
                <div className={styles.avatar}>+</div>
              </div>
              <div className={styles.socialProofText}>
                <span className={styles.socialProofNumber}>1,200+</span> developers joined this month
              </div>
            </div>
          </div>

          {/* Hero Visual */}
          <div className={styles.heroVisual}>
            <div className={styles.heroCard}>
              <div className={styles.cardHeader}>
                <div className={styles.cardDots}>
                  <span className={styles.cardDot}></span>
                  <span className={styles.cardDot}></span>
                  <span className={styles.cardDot}></span>
                </div>
                <span className={styles.cardTitle}>question.js</span>
              </div>
              <div className={styles.cardBody}>
                <div className={styles.codeLine}>
                  <span className={styles.codeComment}>// How to optimize React?</span>
                </div>
                <div className={styles.codeLine}>
                  <span className={styles.codeKeyword}>const</span>
                  <span className={styles.codeText}> App = () ={">"} {"{"}</span>
                </div>
                <div className={styles.codeLine}>
                  <span className={styles.codeIndent}></span>
                  <span className={styles.codeKeyword}>const</span>
                  <span className={styles.codeText}> [data, setData] = </span>
                  <span className={styles.codeFunction}>useState</span>
                  <span className={styles.codeText}>([])</span>
                </div>
                <div className={styles.codeLine}>
                  <span className={styles.codeIndent}></span>
                  <span className={styles.codeKeyword}>return</span>
                  <span className={styles.codeText}> (</span>
                </div>
                <div className={styles.codeLine}>
                  <span className={styles.codeDoubleIndent}></span>
                  <span className={styles.codeTag}>{"<div>"}</span>
                </div>
                <div className={`${styles.codeLine} ${styles.codeResponseLine}`}>
                  <span className={styles.codeDoubleIndent}></span>
                  <span className={styles.codeResponse}>Need help with hooks? →</span>
                </div>
                <div className={styles.codeLine}>
                  <span className={styles.codeDoubleIndent}></span>
                  <span className={styles.codeTag}>{"</div>"}</span>
                </div>
                <div className={`${styles.codeLine} ${styles.codeLineActive}`}>
                  <span className={styles.codeCursor}></span>
                </div>
              </div>
            </div>

            {/* Floating elements */}
            <div className={styles.floatingBadge1}>
              <span className={styles.floatingIcon}>💬</span>
              <div className={styles.floatingBadgeContent}>
                <strong>Live Discussions</strong>
                <span>200+ active now</span>
              </div>
            </div>
            <div className={styles.floatingBadge2}>
              <span className={styles.floatingIcon}>⚡</span>
              <div className={styles.floatingBadgeContent}>
                <strong>Fast Responses</strong>
                <span>Avg. 5 minutes</span>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className={styles.scrollIndicator}>
          <span>Scroll to explore</span>
          <div className={styles.scrollMouse}>
            <div className={styles.scrollWheel}></div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className={styles.statsSection}>
        <div className={styles.container}>
          <div className={styles.statsGrid}>
            <div className={styles.statCard}>
              <div className={styles.statIcon}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                  <circle cx="9" cy="7" r="4"></circle>
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                  <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                </svg>
              </div>
              <div className={styles.statNumber}>10K+</div>
              <div className={styles.statLabel}>Active Users</div>
            </div>
            <div className={styles.statCard}>
              <div className={styles.statIcon}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 20h9"></path>
                  <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>
                </svg>
              </div>
              <div className={styles.statNumber}>50K+</div>
              <div className={styles.statLabel}>Questions Solved</div>
            </div>
            <div className={styles.statCard}>
              <div className={styles.statIcon}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                </svg>
              </div>
              <div className={styles.statNumber}>100+</div>
              <div className={styles.statLabel}>Topics Covered</div>
            </div>
            <div className={styles.statCard}>
              <div className={styles.statIcon}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 12a9 9 0 1 1-6.219-8.56"></path>
                  <path d="M21 3v5h-5"></path>
                </svg>
              </div>
              <div className={styles.statNumber}>99.9%</div>
              <div className={styles.statLabel}>Uptime</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className={styles.features}>
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <span className={styles.sectionTag}>Features</span>
            <h2 className={styles.sectionTitle}>
              Everything you need to <span className={styles.highlightText}>succeed</span>
            </h2>
            <p className={styles.sectionSubtitle}>
              A comprehensive platform designed to help you grow as a developer
            </p>
          </div>

          <div className={styles.featuresGrid}>
            <div className={styles.featureCard}>
              <div className={styles.featureCardBg}></div>
              <div className={styles.featureIconWrapper}>
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                  <circle cx="9" cy="7" r="4"></circle>
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                  <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                </svg>
              </div>
              <h3 className={styles.featureTitle}>Community Support</h3>
              <p className={styles.featureDescription}>
                Get help from experienced developers and share your knowledge in a collaborative environment.
              </p>
              <ul className={styles.featureList}>
                <li className={styles.featureListItem}>
                  <svg className={styles.featureListIcon} width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M13.3 4.3L6 11.6L2.7 8.3" stroke="#818cf8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <span>24/7 peer-to-peer assistance from senior developers</span>
                </li>
                <li className={styles.featureListItem}>
                  <svg className={styles.featureListIcon} width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M13.3 4.3L6 11.6L2.7 8.3" stroke="#818cf8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <span>Dedicated mentorship programs for career growth</span>
                </li>
                <li className={styles.featureListItem}>
                  <svg className={styles.featureListIcon} width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M13.3 4.3L6 11.6L2.7 8.3" stroke="#818cf8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <span>Code review sessions to improve your coding skills</span>
                </li>
                <li className={styles.featureListItem}>
                  <svg className={styles.featureListIcon} width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M13.3 4.3L6 11.6L2.7 8.3" stroke="#818cf8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <span>Active discussion forums with 200+ daily participants</span>
                </li>
              </ul>
              <Link to="/community-support" className={styles.featureLink}>
                Learn more
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M6 12L10 8L6 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </Link>
            </div>

            <div className={styles.featureCard}>
              <div className={styles.featureCardBg}></div>
              <div className={styles.featureIconWrapper}>
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>
                </svg>
              </div>
              <h3 className={styles.featureTitle}>Latest Technology</h3>
              <p className={styles.featureDescription}>
                Stay updated with cutting-edge technologies and industry trends through real-time discussions.
              </p>
              <ul className={styles.featureList}>
                <li className={styles.featureListItem}>
                  <svg className={styles.featureListIcon} width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M13.3 4.3L6 11.6L2.7 8.3" stroke="#818cf8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <span>Real-time coverage of AI, Web3, Cloud & DevOps trends</span>
                </li>
                <li className={styles.featureListItem}>
                  <svg className={styles.featureListIcon} width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M13.3 4.3L6 11.6L2.7 8.3" stroke="#818cf8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <span>Weekly tech talks and live coding demonstrations</span>
                </li>
                <li className={styles.featureListItem}>
                  <svg className={styles.featureListIcon} width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M13.3 4.3L6 11.6L2.7 8.3" stroke="#818cf8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <span>Curated resources for React, Python, Go, Rust & more</span>
                </li>
                <li className={styles.featureListItem}>
                  <svg className={styles.featureListIcon} width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M13.3 4.3L6 11.6L2.7 8.3" stroke="#818cf8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <span>Industry insights from engineers at top tech companies</span>
                </li>
              </ul>
              <Link to="/latest-technology" className={styles.featureLink}>
                Learn more
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M6 12L10 8L6 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </Link>
            </div>

            <div className={styles.featureCard}>
              <div className={styles.featureCardBg}></div>
              <div className={styles.featureIconWrapper}>
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 20h9"></path>
                  <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>
                </svg>
              </div>
              <h3 className={styles.featureTitle}>Interactive Learning</h3>
              <p className={styles.featureDescription}>
                Engage in meaningful discussions and learn through hands-on collaboration with peers.
              </p>
              <ul className={styles.featureList}>
                <li className={styles.featureListItem}>
                  <svg className={styles.featureListIcon} width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M13.3 4.3L6 11.6L2.7 8.3" stroke="#818cf8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <span>Pair programming sessions with real-time collaboration</span>
                </li>
                <li className={styles.featureListItem}>
                  <svg className={styles.featureListIcon} width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M13.3 4.3L6 11.6L2.7 8.3" stroke="#818cf8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <span>Hands-on workshops and project-based learning paths</span>
                </li>
                <li className={styles.featureListItem}>
                  <svg className={styles.featureListIcon} width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M13.3 4.3L6 11.6L2.7 8.3" stroke="#818cf8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <span>Interactive Q&A sessions with industry experts</span>
                </li>
                <li className={styles.featureListItem}>
                  <svg className={styles.featureListIcon} width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M13.3 4.3L6 11.6L2.7 8.3" stroke="#818cf8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <span>Build your portfolio through community-driven projects</span>
                </li>
              </ul>
              <Link to="/interactive-learning" className={styles.featureLink}>
                Learn more
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M6 12L10 8L6 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className={styles.testimonials}>
        <div className={styles.testimonialsBg}>
          <div className={styles.testimonialOrb}></div>
          <div className={styles.testimonialOrb2}></div>
        </div>
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <span className={styles.sectionTag}>Testimonials</span>
            <h2 className={styles.sectionTitle}>
              Loved by developers <span className={styles.highlightText}>everywhere</span>
            </h2>
            <p className={styles.sectionSubtitle}>
              Hear from developers who transformed their careers
            </p>
          </div>

          <div className={styles.testimonialsGrid}>
            <div className={styles.testimonialCard}>
              <div className={styles.testimonialStars}>
                <svg width="18" height="18" viewBox="0 0 18 18" fill="#fbbf24">
                  <polygon points="9 2 11.09 7.26 17 7.27 12.5 10.97 14.18 16.02 9 12.77 3.82 16.02 5.5 10.97 1 7.27 6.91 7.26 9 2"/>
                </svg>
                <svg width="18" height="18" viewBox="0 0 18 18" fill="#fbbf24">
                  <polygon points="9 2 11.09 7.26 17 7.27 12.5 10.97 14.18 16.02 9 12.77 3.82 16.02 5.5 10.97 1 7.27 6.91 7.26 9 2"/>
                </svg>
                <svg width="18" height="18" viewBox="0 0 18 18" fill="#fbbf24">
                  <polygon points="9 2 11.09 7.26 17 7.27 12.5 10.97 14.18 16.02 9 12.77 3.82 16.02 5.5 10.97 1 7.27 6.91 7.26 9 2"/>
                </svg>
                <svg width="18" height="18" viewBox="0 0 18 18" fill="#fbbf24">
                  <polygon points="9 2 11.09 7.26 17 7.27 12.5 10.97 14.18 16.02 9 12.77 3.82 16.02 5.5 10.97 1 7.27 6.91 7.26 9 2"/>
                </svg>
                <svg width="18" height="18" viewBox="0 0 18 18" fill="#fbbf24">
                  <polygon points="9 2 11.09 7.26 17 7.27 12.5 10.97 14.18 16.02 9 12.77 3.82 16.02 5.5 10.97 1 7.27 6.91 7.26 9 2"/>
                </svg>
              </div>
              <p className={styles.testimonialText}>
                "Evangadi Forum has been instrumental in my learning journey. The community is incredibly supportive and always ready to help!"
              </p>
              <div className={styles.testimonialAuthor}>
                <div className={styles.authorAvatar} style={{background: 'linear-gradient(135deg, #667eea, #764ba2)'}}>T</div>
                <div className={styles.authorInfo}>
                  <strong>Tzewodu</strong>
                  <span>Full Stack Developer</span>
                </div>
              </div>
            </div>

            <div className={styles.testimonialCard}>
              <div className={styles.testimonialStars}>
                <svg width="18" height="18" viewBox="0 0 18 18" fill="#fbbf24">
                  <polygon points="9 2 11.09 7.26 17 7.27 12.5 10.97 14.18 16.02 9 12.77 3.82 16.02 5.5 10.97 1 7.27 6.91 7.26 9 2"/>
                </svg>
                <svg width="18" height="18" viewBox="0 0 18 18" fill="#fbbf24">
                  <polygon points="9 2 11.09 7.26 17 7.27 12.5 10.97 14.18 16.02 9 12.77 3.82 16.02 5.5 10.97 1 7.27 6.91 7.26 9 2"/>
                </svg>
                <svg width="18" height="18" viewBox="0 0 18 18" fill="#fbbf24">
                  <polygon points="9 2 11.09 7.26 17 7.27 12.5 10.97 14.18 16.02 9 12.77 3.82 16.02 5.5 10.97 1 7.27 6.91 7.26 9 2"/>
                </svg>
                <svg width="18" height="18" viewBox="0 0 18 18" fill="#fbbf24">
                  <polygon points="9 2 11.09 7.26 17 7.27 12.5 10.97 14.18 16.02 9 12.77 3.82 16.02 5.5 10.97 1 7.27 6.91 7.26 9 2"/>
                </svg>
                <svg width="18" height="18" viewBox="0 0 18 18" fill="#fbbf24">
                  <polygon points="9 2 11.09 7.26 17 7.27 12.5 10.97 14.18 16.02 9 12.77 3.82 16.02 5.5 10.97 1 7.27 6.91 7.26 9 2"/>
                </svg>
              </div>
              <p className={styles.testimonialText}>
                "I found solutions to complex problems in minutes. This platform is a game-changer for developers at any level."
              </p>
              <div className={styles.testimonialAuthor}>
                <div className={styles.authorAvatar} style={{background: 'linear-gradient(135deg, #f093fb, #f5576c)'}}>A</div>
                <div className={styles.authorInfo}>
                  <strong>Abe</strong>
                  <span>Frontend Developer</span>
                </div>
              </div>
            </div>

            <div className={styles.testimonialCard}>
              <div className={styles.testimonialStars}>
                <svg width="18" height="18" viewBox="0 0 18 18" fill="#fbbf24">
                  <polygon points="9 2 11.09 7.26 17 7.27 12.5 10.97 14.18 16.02 9 12.77 3.82 16.02 5.5 10.97 1 7.27 6.91 7.26 9 2"/>
                </svg>
                <svg width="18" height="18" viewBox="0 0 18 18" fill="#fbbf24">
                  <polygon points="9 2 11.09 7.26 17 7.27 12.5 10.97 14.18 16.02 9 12.77 3.82 16.02 5.5 10.97 1 7.27 6.91 7.26 9 2"/>
                </svg>
                <svg width="18" height="18" viewBox="0 0 18 18" fill="#fbbf24">
                  <polygon points="9 2 11.09 7.26 17 7.27 12.5 10.97 14.18 16.02 9 12.77 3.82 16.02 5.5 10.97 1 7.27 6.91 7.26 9 2"/>
                </svg>
                <svg width="18" height="18" viewBox="0 0 18 18" fill="#fbbf24">
                  <polygon points="9 2 11.09 7.26 17 7.27 12.5 10.97 14.18 16.02 9 12.77 3.82 16.02 5.5 10.97 1 7.27 6.91 7.26 9 2"/>
                </svg>
                <svg width="18" height="18" viewBox="0 0 18 18" fill="#fbbf24">
                  <polygon points="9 2 11.09 7.26 17 7.27 12.5 10.97 14.18 16.02 9 12.77 3.82 16.02 5.5 10.97 1 7.27 6.91 7.26 9 2"/>
                </svg>
              </div>
              <p className={styles.testimonialText}>
                "The discussions here are incredibly insightful and help me stay updated with the latest tech trends and best practices."
              </p>
              <div className={styles.testimonialAuthor}>
                <div className={styles.authorAvatar} style={{background: 'linear-gradient(135deg, #4facfe, #00f2fe)'}}>D</div>
                <div className={styles.authorInfo}>
                  <strong>Davis</strong>
                  <span>DevOps Engineer</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className={styles.ctaSectionWrapper}>
        <div className={styles.container}>
          <div className={styles.ctaCard}>
            <div className={styles.ctaCardBg}></div>
            <div className={styles.ctaContent}>
              <h2 className={styles.ctaTitle}>
                Ready to accelerate your <span className={styles.highlightText}>career?</span>
              </h2>
              <p className={styles.ctaDescription}>
                Join 10,000+ developers already learning and growing together. Start your journey today.
              </p>
              <div className={styles.ctaButtons}>
                <Link to="/users/register" className={styles.primaryCta}>
                  Create Free Account
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path d="M4.16666 10H15.8333M15.8333 10L11.6667 5.83333M15.8333 10L11.6667 14.1667" stroke="currentColor" strokeWidth="1.67" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </Link>
                <Link to="/how-it-works" className={styles.secondaryCta}>
                  How it works
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;