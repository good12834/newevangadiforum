import React from 'react';
import styles from "./CommunitySupport.module.css";

const CommunitySupport = () => {
  return (
    <div className={styles.container}>
      <div className={styles.intro}>
        <h1>Community Support</h1>
        <p><span>Get help from experienced developers </span> and share your knowledge in a collaborative environment where everyone grows together.</p>
      </div>

      <div className={styles.partition}>
        <h2>24/7 Peer-to-Peer Assistance</h2>
        <p>Our community is always active. Whether you're stuck on a bug at 2 AM or need advice on architecture, senior developers from around the world are ready to help.</p>
        <ul>
          <li>Post questions and get answers within minutes</li>
          <li>Tag relevant technologies to reach the right experts</li>
          <li>Upvote helpful responses to highlight quality content</li>
        </ul>
      </div>

      <div className={styles.partition}>
        <h2>Dedicated Mentorship Programs</h2>
        <p>Accelerate your career growth through structured mentorship. Our experienced mentors provide personalized guidance tailored to your goals.</p>
        <ul>
          <li>One-on-one mentoring sessions with industry veterans</li>
          <li>Career path planning and skill gap analysis</li>
          <li>Resume reviews and interview preparation support</li>
        </ul>
      </div>

      <div className={styles.partition}>
        <h2>Code Review Sessions</h2>
        <p>Improve your coding skills through constructive code reviews from peers and experts who provide actionable feedback.</p>
        <ul>
          <li>Submit your code for review in dedicated channels</li>
          <li>Learn best practices and design patterns</li>
          <li>Understand performance optimizations and security considerations</li>
        </ul>
      </div>

      <div className={styles.partition}>
        <h2>Active Discussion Forums</h2>
        <p>With 200+ daily participants, our forums are buzzing with productive conversations across a wide range of topics.</p>
        <ul>
          <li>Category-based forums for organized discussions</li>
          <li>Threaded conversations for easy follow-ups</li>
          <li>Notification system to stay updated on replies</li>
        </ul>
      </div>

      <hr />
      <div className={styles.tip}>
        <p>💡 Tip: The more you help others, the more you learn. Contributing to discussions reinforces your own understanding and builds your reputation in the community!</p>
      </div>
    </div>
  );
}

export default CommunitySupport;