import React, { useState } from "react";
import Modal from 'react-overlays/Modal';
import styles from "./index.module.css";

export default function EditModal({ persona, show, onHide, onSubmit }) {

  if (!persona) {
    return null;
  }
  const [name, setName] = useState(persona.name);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(name);
  };



  return (
    <Modal show={show} onHide={onHide}>
      <div className={styles.modal}>
        <form onSubmit={handleSubmit}>
          <label>
            Name:
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </label>
          <button type="submit">Save</button>
        </form>
      </div>
    </Modal>
  );
}
