const express = require('express');
const path = require('path');
const ftmAPI = require('./ftmAPI');
const maplightAPI = require('./maplightAPI');
const storedToken = require('./token.json');
//init app 
const app = express();

//set up templates
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use('/public', express.static('public'));
app.set('json spaces', 2);

app.get('/api/:orgName', async (req, res) => {
    const orgName = req.params.orgName;
    let opensecrets = await ftmAPI.main(orgName, storedToken.ftmToken);
    let maplight = await maplightAPI.main(orgName, storedToken.maplightToken);
    res.send({opensecrets, maplight});
});

//PORT 
const port = process.env.PORT || 3000;
//Start server
app.listen(port, function(){
    console.log(`Server started on port ${port}...`);
});