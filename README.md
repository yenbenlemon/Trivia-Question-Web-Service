# Trivia-Question-Web-Service

Updated: 1/10/2020

The following program is used to make requests within a pseudo-database of
locally stored text files that include questions.

Through this program we can also create sessions for holding specific questions
and produce unique ID's for each session.

All data is locally stored.

###### Project Assets:

- Node.js
- XMLHttpRequest
- Express
- HTML
- JSON

## Instructions

- Download the project as a .zip
- Some browsers may flag the filees due to the javascript. Simply keep the files in order to continue.
- Run "npm i" in the cmd prompt while pointing to this folder. This will install all the required dependencies.
- Run "node requestserver.js"

Server runs on http://localhost:3000/

### GET /questions:

1. Set drop-down to "GET"

2. Input "questions" into the URL text box

3. You can use the following URL queries:
   - limit - Sets the amount of questions that will be produced (ex "?limit=10")
   - difficulty - Sets the difficulty of questions produced (ex "?difficulty=3")
     - 1 = easy
     - 2 = medium
     - 3 = hard
   - category - Sets the category of questions produced (ex "?category=3")
     - Try various numbers for different categories (ex 1-5)
   - token - A uuidv4 unique ID used to pull a session of questions (ex "?token=test")
     - Sessions are a saved set of questions
     - I have provided a session called "test" for easy access

These can be added in any order and are not required.
If negative values are added for limit/difficulty/etc, the program will use the default values

### POST /sessions:

1. Set drop-down to "POST"

2. Input "sessions" into the URL text box

3. A new JSON file will be created with a unique session ID

4. Sessions use uuidv4 and are stored as json files in the "sessions" folder
   - Question ids are stored as json array strings
   - The response body will contain the unique ID

5. These sessions are initially blank and need manual input to contain questions.
   - Use test.json for an example

### GET /sessions:

1. Set drop-down to "GET"

2. Input "sessions" into the URL text box

3. A JSON array will be outputted with all existing sessions

### DELETE /sessions/:sessionid:

  1. Set drop-down to "DELETE"

  2. Input "sessions" into the URL text box

  3. Include a sessionID in order to delete a corresponding session file
     - (ex sessions/1f1bb856-ecbb-4282-a0b4-20057362acc6)
