import Modal from "../../Modal/Modal";
import styles from "./ConfirmModal.module.css";

export default function ConfirmModal({
  title = "Are you sure?",
  message,
  confirmText = "Continue",
  cancelText = "Cancel",
  onConfirm,
  onCancel,
}) {
  return (
    <Modal onClose={onCancel}>
      <div className={styles.wrapper}>
        <h3 className={styles.title}>{title}</h3>

        {message && <p className={styles.message}>{message}</p>}

        <div className={styles.actions}>
          <button className={styles.cancel} onClick={onCancel}>
            {cancelText}
          </button>

          <button className={styles.confirm} onClick={onConfirm}>
            {confirmText}
          </button>
        </div>
      </div>
    </Modal>
  );
}
