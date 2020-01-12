// Get our dependencies
const express = require('express');
const uuidv4 = require('uuid/v4');
const fs = require('fs');

// Set our app
let app = express();

// Set our directories
app.use(express.static("public"));
app.use(express.static("questions"));
app.use(express.static("sessions"));
app.use(express.json());

// Route Handlers

// 404 Checking
app.get('/', function (req, res)
{
  console.log("404");
  res.status(404);
});

// Question grabbing
app.get('/questions', function (req, res)
{
  // Our response JSON object
  let rObj = {status: 0, results: []};

  // Get our queries
  let limit = req.query.limit;
  let desc  = req.query.difficulty;
  let cat   = req.query.category;
  let token = req.query.token;

  // Used for sessions and tokens
  let fileName  = null;
  let qIdObj    = null;

  if (limit == null || limit < 0) { limit = 10; }

  if(token != null) // If a token was provided
  {
    // Read the files in the directory
    fs.readdir('./sessions', (err, files) =>
  	{
      // If the filename matches our token, set the fileName
      files.forEach(file => { if(token == file.slice(0, -5)) { fileName = file; } });

      // If a token was provided, but doesn't match anything, set status to 2
      if(fileName != null) { qIdObj = JSON.parse(fs.readFileSync('./sessions/' + fileName, 'utf8')); }
      else{ rObj.status = 2; }
    });
  }

  // Read the files in the directory
  fs.readdir('./questions', (err, files) =>
	{
    if(rObj.status != 2) // If token wasn't invalid or it didn't exist
    {
      let qArr = [];
      let index = 0;

      // Add a question based on various criteria
    	files.forEach(file =>
  		{
        // Get the question data from the file
        let jObj = JSON.parse(fs.readFileSync('./questions/' + file, 'utf8'));

        // Our duplicate checker for sessions
        let duplicate = false;

        // If a difficult ID was not provided
        // Or ID matches question, or a negative value was given
        if(jObj.difficulty_id == desc || desc < 0 || desc == null)
        {
          // Same check as difficulty, but for categories
          if(jObj.category_id == cat || cat < 0 || cat == null)
          {
            if(qIdObj != null) // If we are currently in a session
            {
              // For each question ID in a session
              qIdObj.qIDs.forEach(id =>
              {
                // If the ID matches the current question
                // It is a duplicate and can be ignored
                if(id == jObj.question_id) { duplicate = true; }
              });
            }

            // If no duplicates, we can add the question to our array
            if(!duplicate) { qArr.push(jObj); }
          }
        }
    	});

      // If the amount of valid questions is higher than or equal to our limit
      if(qArr.length >= limit)
      {
        // Randomly select questions from 0-qArr.length-1
        for(let i = 0; i < limit; i++)
        {
          // Get random value for index
          index = Math.floor(Math.random() * qArr.length);
          rObj.results.push(qArr[index]);

          // If a session, push the questionID to the session array
          if(qIdObj != null) { qIdObj.qIDs.push(qArr[index].question_id); }
          qArr.splice(index, 1); // Remove the used question and start again
        }
      }
      else{ rObj.status = 1; } // Not enough questions, status 1

      if(qIdObj != null) // Another null check for our session
      {
        // Write the questionID data to the session file
        let content = JSON.stringify(qIdObj);
        fs.writeFileSync('./sessions/' + fileName, content)
      }
    }
    res.send(JSON.stringify(rObj));
	});
});

// Session creation
app.post('/sessions', function (req, res)
{
  // Create a unique ID and JSON object to hold IDs as an array
  let uuid = uuidv4();
  let content = JSON.stringify({qIDs: []});

  // Create the file using the uuid as a name
  fs.writeFileSync('./sessions/' + uuid + '.json', content);
  res.status(201).send(uuid);
});

// Session grabbing
app.get('/sessions', function (req, res)
{
  let idArr = [] // Array of IDs we grab

  fs.readdir('./sessions', (err, files) =>
	{
    // Grab the ID from the file name and add to array
    files.forEach(file => { idArr.push(file.slice(0, -5)); });
    res.status(200).send(idArr);
  });
});

// Session file deletion
app.delete('/sessions/:sessionid', function (req, res)
{
  let status = 404;               // Default to 404
  let sID = req.params.sessionid; // Get ID from query

  fs.readdir('./sessions', (err, files) =>
  {
    files.forEach(file =>
    {
      if (sID == file.slice(0, -5)) // If the query ID matches the file ID
      {
        // Delete the file and set status to 200
        fs.unlinkSync('./sessions/' + file);
        status = 200;
      }
    });
    res.sendStatus(status);
  });
});

app.listen(3000);
console.log("Server listening at http://localhost:3000");
