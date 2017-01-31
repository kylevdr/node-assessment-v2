var express = require('express');
var bodyParser = require('body-parser');
var accounts = require('./accounts.json');

var app = express();

app.use(bodyParser.json());

app.listen(3000, () => {
  console.log('Listening on port 3000');
});

app.get('/api/accounts', (req, res) => {
  let results = [];
  if (req.query.cardtype) {
    results = accounts.filter(account => account.card_type === req.query.cardtype);
  } else if (req.query.firstname) {
    results = accounts.filter(account => account.first_name === req.query.firstname);
  } else if (req.query.lastname) {
    results = accounts.filter(account => account.last_name === req.query.lastname);
  } else if (req.query.balance) {
    results = accounts.filter(account => account.balance === req.query.balance);
  } else {
    results = accounts;
  }
  res.status(200).send(results);
});

app.get('/api/accounts/:id', (req, res) => {
  let results = accounts.filter((account) => { return (account.id === Number(req.params.id)) });
  if (results.length === 0) {
    res.status(404).send('account could not be found');
  } else {
    res.status(200).send(results[0]);
  }
});

app.post('/api/accounts', (req, res) => {
  let new_user = {
    id: accounts.length + 1,
    first_name: req.body.first_name,
    last_name: req.body.last_name,
    card_type: req.body.card_type,
    balance: req.body.balance,
    approved_states: [req.body.approved_states]
  }
  accounts.push(new_user);
  res.status(200).send(new_user);
});

app.post('/api/accounts/cardtype/:id', (req, res) => {
  let index = accounts.findIndex(account => account.id === Number(req.params.id));
  accounts[index].card_type = req.body.card_type;
  res.status(200).send(accounts[index]);
});

app.post('/api/accounts/approvedstates/:id', (req, res) => {
  let index = accounts.findIndex(account => account.id === Number(req.params.id));
  accounts[index].approved_states.push(req.body.add);
  res.status(200).send(accounts[index]);
});

app.delete('/api/accounts/approvedstates/:id', (req, res) => {
  let index = accounts.findIndex(account => account.id === Number(req.params.id));
  let stateIndex = accounts[index].approved_states.indexOf(req.query.state);
  accounts[index].approved_states.splice(stateIndex, 1);
  res.status(200).send(accounts[index]);
});

app.delete('/api/accounts/:id', (req, res) => {
  let index = accounts.findIndex(account => account.id === Number(req.params.id));
  accounts.splice(index, 1);
  res.status(200).send('Successfully deleted account');
});

app.put('/api/accounts/:id', (req, res) => {
  let index = accounts.findIndex(account => account.id === Number(req.params.id));
  for (property in req.body) {
    accounts[index][property] = req.body[property];
  }
  res.status(200).send(accounts[index]);
});

module.exports = app;