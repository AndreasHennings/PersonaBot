import Head from "next/head";
import { useState } from "react";
import styles from "./index.module.css";
import { Container, Row, Col } from 'react-grid-system';
import EditModal from './modal'

export default function Home() {

  //import all bot data
  const personaeData = require('./personae.json');
   
  // state for controlling the modal
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [selectedPersona, setSelectedPersona] = useState(null);
  const [personae, setPersonae] = useState(personaeData.personae);
  
  // function for opening and closing the modal
  const toggleModal = (persona) => {
    setSelectedPersona(persona);
    setModalIsOpen(!modalIsOpen);
  }

  // function for updating the persona: If the persona returned from the modal already exists, update the data.
  // else: create a new persona and add it to the personae list.
  const updatePersona = (updatedPersona) => {
    let newPersonae = [...personae];
    let existingPersonaIndex = newPersonae.findIndex(p => p.name === updatedPersona.name);
    if (existingPersonaIndex !== -1) {
        newPersonae[existingPersonaIndex] = updatedPersona;
    } else {
        newPersonae.push(updatedPersona);
    }
    setPersonae(newPersonae);
    setSelectedPersona(null);
    setModalIsOpen(false);
    //savePersonaeToJSON(newPersonae);
}

  return (
    <div>
      <Head>
        <title>PersonaBot</title> 
      </Head>
         
      <div className={styles.main}>
        
       <Container fluid>

          <Row className={styles.header}>
          <Col lg={12}>
            <h1>PersonaBot</h1>
            <h3>Here are some amazing people you can talk to:</h3>
            </Col>
          </Row>

          <Row className={styles.cardHolder} wrap='nowrap'>
            {personae.map (persona => (
                <Col lg={2} className={styles.card} onClick={() => toggleModal(persona)}>
                  <Row>
                    <img className={styles.cardImage} src={persona.data[0].personal.img} />
                  </Row>
                  <Row>
                    <div className={styles.cardName}>{persona.name}</div>
                  </Row>
                  <Row>
                    <div className={styles.cardRole}>{persona.data[0].personal.role}</div>
                  </Row>
                </Col>
              ))}
          </Row>

          <Row className={styles.footer}> 
            	<Col lg={12}>Chat</Col>
          </Row>
        </Container>

        <EditModal 
          persona={selectedPersona} 
          show={modalIsOpen} 
          onHide={toggleModal} 
          onSubmit={updatePersona}/>
        </div>
    </div>
  );
}