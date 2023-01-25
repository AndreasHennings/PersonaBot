import React, { useState } from "react";
import Modal from 'react-overlays/Modal';
import styles from "./index.module.css";

export default function EditModal({ persona, show, onHide, onSubmit }) {

  if (!persona) {return null;}

  //Since the bot's name is outside of the data-array and is used to identify individual bots,
  //We're creating a separate hook for its data
  const [name, setName] = useState(persona.name);

  //Called when the edit is finished
  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({...persona, name: name, data: [personaData]});
  };
  
  //Create hook for all of the bot's data
  const [personaData, setPersonaData] = useState(persona.data[0]);
  
  //Make input fields editable by updating data
  const handleChange = (e, key) => {
    setPersonaData((prevPersonaData) => {
        return {
            ...prevPersonaData,
            [key]: e.target.value
        }
    });
};

  return (
    <Modal show={show} onHide={onHide}>
      <div className={styles.modal} >

        <div className={styles.modalHeader}>
          <h3 className={styles.cancel} onClick={() => onHide(persona)}>Cancel</h3>
          <h3 className={styles.title}>Edit Persona: </h3>
          <h3 className={styles.submit} onClick={handleSubmit}>Submit</h3>
        </div>

        <div className={styles.modalContent}>

          <div className={styles.modalContentRows}>
            <h3>Personal</h3>
            <div className={styles.inputContainer}>
              <label>Name:</label>
              <input
                className={styles.input}
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}/>
            </div>

            {Object.entries(personaData.personal).map(([key, value]) => (
              <div key={key} className={styles.inputContainer}>
                <label>{key}:</label>
                <input 
                  className={styles.input} 
                  type="text" value={value} 
                  onChange={e => setPersonaData({...personaData, personal: {...personaData.personal,[key]: e.target.value}
                })}/>
              </div>))}
          </div>

          <div className={styles.modalContentRows}>
            <h3>Technical</h3>
            {Object.entries(personaData.technical).map(([key, value]) => (
              <div key={key} className={styles.inputContainer}>
                <label>{key}:</label>
                <input 
                  className={styles.input} 
                  type="text" value={value} 
                  onChange={e => setPersonaData({...personaData, technical: {...personaData.technical,[key]: e.target.value}
                })}/>
              </div>))}
          </div>

          <div className={styles.modalContentRows}>
            <h3>Prompt</h3>
            <textarea
              className={styles.prompt}
              value={personaData.prompt}
              onChange={e => setPersonaData({ ...personaData, prompt: e.target.value })}>
            </textarea>
          </div>
        </div>
      </div>
    </Modal>
  );
}
