# PersonaBot
## A management tool for ChatGPT-based Chatbots

![UI](/public/PersBotUI.png)

### About

Easily create and configure Chatbots based on ChatGPT. PersonaBot gives you easy access to all settings and features without having to touch the code.
Get in contact with virtual people you need in your life!

Here are some suggestions:

- You want to apply for a job and need someone to prepare for interview questions? Set up a virtual boss.
- You plan on writing a book and need someone to help you? Create a co-writer.
- You know an elderly person who is lonely? How about a virtual grandchild that has unlimited time?
- You feel lonely and need someone to talk to? Create a best friend or loving partner who is really interested in you.

The possibilities are only limited by your imagination!

### HowTo

Click on a bot to open its features window:

![UI](/public/Modal.png)

The initial prompt in the left column explains the bot who he/she is. Change it to your likings.
In the middle column, you can try out different settings. Remember to paste in your OpenAI API key!
In the right column, you can enter a new message to the bot. Underneath, your chat history will be displayed.

Quitting:
"Close and Discard" will do just that.
"Close and Save" will close the edit window and update all data.

IMPORTANT: As of now, changes will not be persisted and only be available as long as the application runs.


### Prerequisites

If you want to use this application, you'll need an [OpenAI API-key] (https://beta.openai.com/docs/quickstart)

### Setup

This application can be run as a webservice or locally in your browser.

1. If you don’t have Node.js installed, [install it from here](https://nodejs.org/en/)

2. Clone this repository

3. Navigate into the project directory

4. Install the requirements

   ```bash
   $ npm install
   $ npm install react-grid-system
   $ npm install react-overlays
   ```
5. Run the app
 ```bash
   $ npm run dev
   ```
Open your browser and navigate to  http://localhost:3000

### Technology

This project uses

- [Next.js](https://nextjs.org/) framework with [React](https://reactjs.org/). 
