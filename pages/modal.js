import React, { useState } from "react";
import { Container, Row, Col } from 'react-grid-system';
import Modal from 'react-overlays/Modal';
import styles from "./modal.module.css";

export default function EditModal({ persona, show, onHide, onSubmit }) {

  if (!persona) { return null; }

  //Since the bot's name is outside of the data-array and is used to identify individual bots,
  //We're creating a separate hook for its data
  const [name, setName] = useState(persona.name);
  
  //Called when the edit is finished
  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ ...persona, name: name, data: [personaData] });
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

  function initialPrompt(info)
  {
    const prompt = "Your name is "+ persona.name + ". " + info;
    sendPrompt(prompt);
  }


  function sendMessage(){
    const messageInput = document.getElementById("messageInput");
    if (messageInput) {
    const prompt = messageInput.value;
    sendPrompt(prompt);

    const chatMessage = {
      "From": "user",
      "Time": new Date().toLocaleString(),
      "Content": prompt
  };
  setPersonaData({ ...personaData, chat: chatMessage})
  //personaData.chat.push(chatMessage);
  }
}

  async function sendPrompt(prompt) {

    console.log(prompt);
    const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            prompt: prompt,
            technical: personaData.technical
        }),
    });
    const data = await response.json();
    console.log(data.result);
    if (response.status !== 200) {
        throw data.error || new Error(`Request failed with status ${response.status}`);
    }
    const chatMessage = {
        "From": "Bot",
        "Time": new Date().toLocaleString(),
        "Content": data.result
    };
    setPersonaData({ ...personaData, chat: chatMessage})
    //personaData.chat.push(chatMessage);
    
}


  return (
    <Modal show={show} onHide={onHide}>
      <div className={styles.modal} >
        <Container fluid>

          <Row className={styles.modalHeader}>
            <Col>
              <button className={styles.submit} onClick={() => onHide(persona)}>Close and Discard</button>
            </Col>
            <Col>
              <button className={styles.submit} onClick={handleSubmit}>Close and Save</button>
            </Col>
          </Row>

          <Row className={styles.modalContent} wrap="nowrap">

            <Col className={styles.modalContentRows} wrap="nowrap">

              <h3>Persona</h3>
              <Row>
                <div className={styles.inputContainer}>
                  <Col>
                    <label>Name:</label></Col>
                  <Col>
                    <input
                      className={styles.input}
                      type="text"
                      value={name}
                      onChange={e => setName(e.target.value)} /></Col>
                </div>
              </Row>
              <Row>
                <textarea
                  className={styles.promptInput}
                  value={personaData.prompt}
                  onChange={e => setPersonaData({ ...personaData, prompt: e.target.value })}
                >
                </textarea>
              </Row>

              <Row>
                <button className={styles.submit} onClick={() => initialPrompt(personaData.prompt)}>Init Persona with Prompt</button>
              </Row>
            </Col>

            <Col className={styles.modalContentRows} wrap="nowrap">
              <h3>Technical</h3>
              {Object.entries(personaData.technical).map(([key, value]) => (
                <div key={key} className={styles.inputContainer}>

                  <label>{key}:</label>


                  <input
                    className={styles.input}
                    type="text" value={value}
                    onChange={e => setPersonaData({
                      ...personaData, technical: { ...personaData.technical, [key]: e.target.value }
                    })} />
                </div>))}
            </Col>

            <Col className={styles.modalContentRows} wrap="nowrap">
              <h3>Chat</h3>
              <Row className={styles.inputContainer}>

                <Col>
                  <input className={styles.input} id="messageInput" type="text" placeholder="Type your message here" onChange={handleChange} />
                </Col>
                <Col>
                  <button className={`${styles.submit} ${styles.button}`} onClick={()=>sendMessage()}>Send</button></Col>
              </Row>

              <div className={styles.chatContainer} wrap="nowrap">

                {personaData.chat.map((message, index) => (
                  <div key={index} className={`${styles.message} ${message.From === 'Bot' ? styles.leftAligned : styles.rightAligned}`}>
                    <div className={styles.messageMeta}>
                      <div className={styles.messageFrom}>{message.From}</div>
                      <div className={styles.messageTime}>{message.Time}</div>
                    </div>
                    <div className={styles.messageContent}>{message.Content}</div>
                  </div>
                ))}
              </div>
            </Col>
          </Row>
        </Container>
      </div>
    </Modal>
  );
}
