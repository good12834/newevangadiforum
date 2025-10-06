import { useParams, Link } from "react-router-dom";
import styles from "./QuestionDetail.module.css"; // ✅ Updated import

const QuestionDetail = () => {
  const { questionId } = useParams();

  // Mock question data
  const question = {
    id: questionId,
    text: "This is a sample question",
    subText: "Additional info here",
    answers: [
      { username: "Alice", text: "This is an answer." },
      { username: "Bob", text: "Another answer." },
    ],
  };

  return (
    <div className={styles.questionContainer}>
      <header className={styles.navBar}>
        <h2 className={styles.logo}>EVANGADI</h2>
        <nav>
          <Link to="/">Home</Link>
          <button className={styles.logoutBtn}>LogOut</button>
        </nav>
      </header>

      <div className={styles.content}>
        <div className={styles.questionSection}>
          <h3>Question</h3>
          <p className={styles.questionText}>{question.text}</p>
          <small className={styles.subText}>{question.subText}</small>
        </div>

        <div className={styles.answerSection}>
          <h3>Answer From The Community</h3>
          {question.answers.length > 0 ? (
            question.answers.map((ans, index) => (
              <div className={styles.answerCard} key={index}>
                <div className={styles.userAvatar}>
                  <img
                    src="https://www.w3schools.com/howto/img_avatar.png"
                    alt="user avatar"
                  />
                </div>
                <div>
                  <p className={styles.username}>{ans.username}</p>
                  <p className={styles.answerText}>{ans.text}</p>
                </div>
              </div>
            ))
          ) : (
            <p>No answers yet.</p>
          )}
        </div>

        <div className={styles.answerForm}>
          <h3>Answer The Top Question</h3>
          <textarea
            placeholder="Your Answer..."
            className={styles.answerInput}
          ></textarea>
          <button className={styles.postBtn}>Post Your Answer</button>
        </div>
      </div>
    </div>
  );
};

export default QuestionDetail;
