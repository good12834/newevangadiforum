import React from 'react';
import styles from "./LatestTechnology.module.css";

const LatestTechnology = () => {
  return (
    <div className={styles.container}>
      <div className={styles.intro}>
        <h1>Latest Technology</h1>
        <p><span>Stay updated with cutting-edge technologies </span> and industry trends through real-time discussions, curated resources, and insights from engineers at top tech companies.</p>
      </div>

      <div className={styles.partition}>
        <h2>AI, Web3, Cloud & DevOps Trends</h2>
        <p>Stay ahead of the curve with real-time coverage of the most transformative technologies shaping the industry today.</p>
        <ul>
          <li>Deep dives into machine learning and artificial intelligence advancements</li>
          <li>Blockchain, smart contracts, and decentralized application development</li>
          <li>Cloud architecture best practices across AWS, Azure, and GCP</li>
          <li>CI/CD pipelines, containerization, and infrastructure as code</li>
        </ul>
      </div>

      <div className={styles.partition}>
        <h2>Weekly Tech Talks & Live Coding</h2>
        <p>Join our weekly live sessions where community experts demonstrate real-world coding techniques and share their knowledge.</p>
        <ul>
          <li>Live coding walkthroughs of popular frameworks and libraries</li>
          <li>Architecture decision discussions with senior engineers</li>
          <li>Interactive Q&A during and after each session</li>
          <li>Recorded sessions available for on-demand viewing</li>
        </ul>
      </div>

      <div className={styles.partition}>
        <h2>Curated Resources for Modern Stacks</h2>
        <p>Access hand-picked learning materials, tutorials, and documentation for the most in-demand programming languages and frameworks.</p>
        <ul>
          <li>React, Next.js, and modern frontend development</li>
          <li>Python for data science, automation, and backend development</li>
          <li>Go and Rust for high-performance systems programming</li>
          <li>Comprehensive guides for full-stack and mobile development</li>
        </ul>
      </div>

      <div className={styles.partition}>
        <h2>Industry Insights from Top Engineers</h2>
        <p>Learn from engineers working at leading technology companies who share their experiences, challenges, and best practices.</p>
        <ul>
          <li>Guest sessions from engineers at FAANG and top startups</li>
          <li>Real-world case studies of large-scale system design</li>
          <li>Career advice and interview preparation tips</li>
          <li>Insights into emerging technologies and market trends</li>
        </ul>
      </div>

      <hr />
      <div className={styles.tip}>
        <p>💡 Tip: Set aside 30 minutes each day to explore a new technology. Consistent learning is the key to staying relevant in the ever-evolving tech landscape!</p>
      </div>
    </div>
  );
}

export default LatestTechnology;