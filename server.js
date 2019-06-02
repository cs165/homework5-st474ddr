const express = require('express');
const bodyParser = require('body-parser');
const googleSheets = require('gsa-sheets');

const key = require('./privateSettings.json');

// TODO(you): Change the value of this string to the spreadsheet id for your
// GSA spreadsheet. See HW5 spec for more information.
const SPREADSHEET_ID = '1vH6d6BvwVtveQugDMNF_0SsSduIUfxeHwQU0r6YJpH4';

const app = express();
const jsonParser = bodyParser.json();
const sheet = googleSheets(key.client_email, key.private_key, SPREADSHEET_ID);

app.use(express.static('public'));

async function onGet(req, res) {
  const result = await sheet.getRows();
  const rows = result.rows;
  console.log(rows);
  //console.log(JSON.stringify(rows));
  // TODO(you): Finish onGet.
  var pre = [];

  for (var i = 1; i < rows.length; i++) 
  {
    let json_result = {};
    for (var j = 0; j < rows[0].length; j++) 
	{
      json_result[rows[0][j]] = rows[i][j];
    }
    pre.push(json_result);
  }
  res.json(pre);
}
app.get('/api', onGet);

async function onPost(req, res) {
  const messageBody = req.body;
  //console.log(messageBody);
  // TODO(you): Implement onPost.
  const result = await sheet.getRows();
  const rows = result.rows;
  const key = Object.keys(messageBody);
  var value = Object.values(messageBody);
  var newData = [];
  //console.log(rows[0]);
  //console.log(key.length);
  if (key.length == rows[0].length) 
  {
    for (var i = 0; i < rows.length; i++) 
      for (var j = 0; j < rows[0].length; j++) 
        if (key[j] == rows[0][i]) 
          newData[i] = value[j];
  //console.log(newData);
	await sheet.appendRow(newData);
  }
  res.json( { "response": "success"} );
}
app.post('/api', jsonParser, onPost);

async function onPatch(req, res) {
  const column  = req.params.column;
  const value  = req.params.value;
  const messageBody = req.body;

  // TODO(you): Implement onPatch.

  res.json( { status: 'unimplemented'} );
}
app.patch('/api/:column/:value', jsonParser, onPatch);

async function onDelete(req, res) {
  const column  = req.params.column;
  const value  = req.params.value;
  //console.log(column);
  //console.log(value);
  // TODO(you): Implement onDelete.
  const result = await sheet.getRows();
  const rows = result.rows;
  for (let i = 0; i < rows.length; i++) 
  {
	//console.log(i,rows[i][0],rows[i][1]);
	//console.log(column,value);
	if(rows[0][i] == column)
	{
		for(let j = 0; j < rows.length; j++)
		{
			if(rows[j][i] == value)
			{
				await sheet.deleteRow(j);
				break;
			}
		}
		break;
	}		  
  }
  res.json( { "response": "success"} );
}
app.delete('/api/:column/:value',  onDelete);


// Please don't change this; this is needed to deploy on Heroku.
const port = process.env.PORT || 3000;

app.listen(port, function () {
  console.log(`CS193X: Server listening on port ${port}!`);
});
