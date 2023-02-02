import React, { useState } from "react";
import { Container, Row, Col } from 'react-grid-system';
import Modal from 'react-overlays/Modal';
import styles from "./modal.module.css";

export default function EditModal({ persona, show, onHide, onSubmit }) {

  if (!persona) { return null; }

  const [includeChat, setIncludeChat] = React.useState(false);
  const handleCheckbox = () => {
    setIncludeChat(!includeChat);
  }
  
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


//***************************************************************************************************************** */
  
function sendMessage() {
    const messageInput = document.getElementById("messageInput");
    if (messageInput) {

      //Create new entry for initial prompt statement
      const newPrompt = personaData.prompt + " \nuser: "+ messageInput.value;// 

      if (includeChat){
      setPersonaData(prevPersonaData => {
        return {
          ...prevPersonaData,
          prompt: newPrompt
        };
      });}

      const chatMessage = {
        "From": "user",
        "Time": new Date().toLocaleString(),
        "Content": messageInput.value
      };

      setPersonaData(prevPersonaData => {
        return {
          ...prevPersonaData,
          chat: [...prevPersonaData.chat, chatMessage]
        };
      });
      const finalPrompt = newPrompt + " \nYou:";
      sendPrompt(finalPrompt); 
      console.log(personaData.prompt);
    }
  }

  //***************************************************************************************************************** */

  async function sendPrompt(prompt) {

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
   

    //******************************************** */
    if (response.status !== 200) {
        throw data.error || new Error(`Request failed with status ${response.status}`);
    }

    if (includeChat){
    const updatedPrompt = prompt +  data.result;
    
    setPersonaData(prevPersonaData => {
      return {
        ...prevPersonaData,
        prompt: updatedPrompt
      };
    });}

    

    //Create new message object
    const chatMessage = {
        "From": "bot",
        "Time": new Date().toLocaleString(),
        "Content": data.result
    };

    //Add new message object to chat array
    setPersonaData(prevPersonaData => {
      return {
        ...prevPersonaData,
        chat: [...prevPersonaData.chat, chatMessage]
      };
    }
  );   
}

//********************************** JSX Elements ******************************************************************************* */

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

            <Col lg={4} className={styles.modalContentRows} wrap="nowrap">
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
                      onChange={e => setName(e.target.value)} 
                      />
                  </Col>
                </div>
              </Row>
              <Row>
                <textarea
                  className={styles.promptInput}
                  value={personaData.prompt}
                  onChange={e => setPersonaData((prevPersonaData) => {
                    return { ...prevPersonaData, prompt: e.target.value }
                  })}>
                </textarea>
              </Row>

              <Row>              
                <div className={styles.inputContainer}>
                <label>Add new messages to prompt</label>
                <input type="checkbox" 
                      className={styles.input}
                      onChange={handleCheckbox}/>
                      </div>
              </Row>
            </Col>


            <Col lg={4} className={styles.modalContentRows} wrap="nowrap">
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


            <Col lg={4} className={styles.modalContentRows} wrap="nowrap">
              <h3>Chat</h3>
              <Row className={styles.inputContainer}>
                <Col>
                  <input className={styles.input} id="messageInput" type="text" placeholder="Type your message here" onChange={handleChange} />
                </Col>
                <Col>
                  <button className={`${styles.submit} ${styles.button}`} onClick={() => sendMessage()}>Send</button></Col>
              </Row>
              <Row>
                <div className={styles.chatContainer}>

                  {personaData.chat.map((message, index) => (
                   
                    <div key={index} className={`${styles.message} ${message.From === 'bot' ? styles.bot : styles.user}`}>
                      <div className={styles.messageMeta}>
                        <div className={styles.messageFrom}>{message.From}</div>
                        <div className={styles.messageTime}>{message.Time}</div>
                      </div>

                      
                      <div className={styles.messageContent}>
                        {message.Content.indexOf("*pic:") !== -1 ?
                        <div>
                          <div>
                            {message.Content.split("*pic:")[0]}
                          </div>
                          <img 
                          src={`${message.Content.split("*pic:")[1].split("*")[0]}`} 
                            alt="image not found" 
                            
                            className={styles.chatImage}/>
                            </div>
                          : message.Content}
                      </div>
                    </div>
                  ))}
                </div>
              </Row>
            </Col>
          </Row>
        </Container>
      </div>
    </Modal>
  );
}
