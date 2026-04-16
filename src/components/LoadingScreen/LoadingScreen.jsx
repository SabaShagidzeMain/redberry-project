import styles from "./LoadingScreen.module.css";

export default function LoadingScreen({ text = "Loading..." }) {
  return (
    <div className={styles.overlay}>
      <div className={styles.loader} />
      <p className={styles.text}>{text}</p>
    </div>
  );
}
