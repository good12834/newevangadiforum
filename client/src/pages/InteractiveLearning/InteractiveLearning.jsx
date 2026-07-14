import React from 'react';
import styles from "./InteractiveLearning.module.css";

const InteractiveLearning = () => {
  return (
    <div className={styles.container}>
      <div className={styles.intro}>
        <h1>Interactive Learning</h1>
        <p><span>Engage in meaningful discussions </span> and learn through hands-on collaboration with peers, guided workshops, and real-world projects.</p>
      </div>

      <div className={styles.partition}>
        <h2>Pair Programming Sessions</h2>
        <p>Collaborate in real-time with fellow developers to solve problems, build features, and learn new techniques together.</p>
        <ul>
          <li>Real-time code sharing and collaborative editing</li>
          <li>Driver-navigator rotation for balanced learning</li>
          <li>Focus on clean code, testing, and best practices</li>
          <li>Build confidence by working through challenges together</li>
        </ul>
      </div>

      <div className={styles.partition}>
        <h2>Hands-on Workshops & Learning Paths</h2>
        <p>Follow structured project-based learning paths designed to take you from beginner to proficient in your chosen technology stack.</p>
        <ul>
          <li>Step-by-step guided projects with real-world applications</li>
          <li>Workshops covering frontend, backend, and full-stack development</li>
          <li>Progress tracking with milestone checkpoints</li>
          <li>Certificate of completion for finished learning paths</li>
        </ul>
      </div>

      <div className={styles.partition}>
        <h2>Interactive Q&A with Industry Experts</h2>
        <p>Get your questions answered directly by experienced professionals who have worked on large-scale systems and shipped products used by millions.</p>
        <ul>
          <li>Live AMA (Ask Me Anything) sessions with industry leaders</li>
          <li>Deep-dive technical discussions on specific topics</li>
          <li>Portfolio review sessions for constructive feedback</li>
          <li>Networking opportunities with peers and mentors</li>
        </ul>
      </div>

      <div className={styles.partition}>
        <h2>Community-Driven Projects</h2>
        <p>Build your portfolio through collaborative open-source projects where you can contribute, learn version control, and showcase your work.</p>
        <ul>
          <li>Team-based projects that simulate real work environments</li>
          <li>Git workflow practice with pull requests and code reviews</li>
          <li>Build production-ready features for real applications</li>
          <li>Showcase completed projects in your developer portfolio</li>
        </ul>
      </div>

      <hr />
      <div className={styles.tip}>
        <p>💡 Tip: The best way to learn is by teaching. Share what you've learned with others through discussions, code reviews, or by mentoring new members!</p>
      </div>
    </div>
  );
}

export default InteractiveLearning;