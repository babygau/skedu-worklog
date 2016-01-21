var path = require('path');
var express = require('express');

var app = express();

app.set('port', (process.env.PORT || 3000));

app.use(express.static(__dirname));

app.get('/*', function(req, res) {
  res.sendFile(path.join(__dirname, 'index.html'));
});
 
app.listen(app.get('port'), function(err) {
  console.log('Node app is running on port', app.get('port'));
});

