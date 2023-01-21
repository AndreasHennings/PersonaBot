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


  const createState = (obj) => {
    const state = {};
    Object.entries(obj).forEach(([key, value]) => {
        state[key] = useState(value);
    });
    return state;
};

const personaState = createState(persona);




  return (
    <Modal show={show} onHide={onHide}>
      <div className={styles.modal} >

        <div className={styles.modalHeader}>
          <h3 className={styles.cancel}>Cancel</h3>
          <h3 className={styles.title}>Edit Persona</h3>
          <h3 className={styles.submit}>Submit</h3>
        </div>

        <div className={styles.modalContent}>

          <div className={styles.modalContentRows}>
            <h3>Personal</h3>
            {Object.entries(persona.data[0].personal).map(([key, value]) => (
              <div key={key} className={styles.inputContainer}>
                <label>{key}:</label>
                <input className={styles.input} type="text" value={value} />
              </div>))}
          </div>

          <div className={styles.modalContentRows}>
            <h3>Technical</h3>
            {Object.entries(persona.data[0].technical).map(([key, value]) => (
              <div key={key} className={styles.inputContainer}>
                <label>{key}:</label>
                <input type="text"value={value} />
              </div>))}
          </div>

          <div className={styles.modalContentRows}>
            <h3>Prompt</h3>       
            <textarea className={styles.prompt} value={persona.data[0].prompt}>
            </textarea>
          </div>
        </div>

      </div>
    </Modal>
  );
}
