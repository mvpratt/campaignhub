
var accounts;  // array of all accounts

var campaign;      // Test Campaign
var campaignhub;   // Main contract
 

function setStatus(message) {
  var status = document.getElementById("status");
  status.innerHTML = message;
}

function logTimestamp(message) {
    console.log("Log Timestamp: " + web3.eth.getBlock(web3.eth.blockNumber).timestamp + "  Log: " + message);
}

function showUserBalances() {

  console.log("Alice (coinbase): balance : " + web3.fromWei(web3.eth.getBalance(accounts[1]), "ether") + " ETH");
  console.log("Bob             : balance : " + web3.fromWei(web3.eth.getBalance(accounts[2]), "ether") + " ETH");
  console.log("Carol           : balance : " + web3.fromWei(web3.eth.getBalance(accounts[3]), "ether") + " ETH");
}


function createCampaign () {

  var amount_goal = web3.toWei(document.getElementById("i_amount_goal").value, "ether");
  var duration = document.getElementById("i_duration").value;
  var user_index = Number(document.getElementById("i_user").value);
  var user_addr = accounts[user_index];

  campaignhub.createCampaign(user_addr, amount_goal, duration, {from: user_addr, gas: 4500000})
  .then(function(){
    return campaignhub.getNumCampaigns.call();
  })
  .then(function(num){
    return refreshCampaignTable(num);    
  })
  .then(function(){
    return refreshUserTable(user_index);    
  }) 
  .then(function(){
    setStatus("Finished creating Campaign");
    logTimestamp("Campaign creation finished");
  })
  .catch(function(e) {
    console.log(e);
    setStatus("Error creating Campaign; see log.");
  });
}

function refreshCampaignTable(index){

  return new Promise(function(resolve,reject){

  campaignhub.getCampaignAddress.call(index)
  .then(function(addr){
    console.log("Campaign index: " + index);
    console.log("Campaign address: " + addr);
    var state_element = document.getElementById("Campaign_address_"+index);
    state_element.innerHTML = addr;
    return Campaign.at(addr);
  })
  .then(function(instance){
    campaign = instance;  
    return campaign.getState.call();
  }) 
  .then(function(value) {
    var state_element = document.getElementById("state_"+index);
    state_element.innerHTML = value.valueOf();
    return campaign.getAmountGoal.call();
  })
  .then(function(value) {
    var refill_element = document.getElementById("amount_goal_"+index);
    refill_element.innerHTML = web3.fromWei(value.valueOf(), "ether");
    return campaign.getDeadline.call();
  })
  .then(function(value) {
    console.log("Campaign deadline: " + value);
    var refill_element = document.getElementById("deadline_"+index);
    refill_element.innerHTML = value.valueOf();
    return campaign.getDuration.call();
  })
  .then(function(value) {
    console.log("Campaign duration: " + value);    
    var state_element = document.getElementById("duration_"+index);
    state_element.innerHTML = value.valueOf();
    return campaign.getAmountRaised.call();
  })  
  .then(function(value) {
    var refill_element = document.getElementById("amount_raised_"+index);
    refill_element.innerHTML = web3.fromWei(value.valueOf(), "ether");
    return;
  })
  .catch(function(e) {
    console.log(e);
    setStatus("Error creating Campaign; see log.");
  });

  resolve(true);

  });
}


function refreshUserTable(index){

  return new Promise(function(resolve,reject){

    var refill_element = document.getElementById("user_address_"+index);
    refill_element.innerHTML = accounts[index];

    var refill_element = document.getElementById("user_balance_"+index);
    refill_element.innerHTML = web3.fromWei(web3.eth.getBalance(accounts[index]), "ether");

    resolve(true);

  })
}

function contribute() {

  var amount_contribute = web3.toWei(document.getElementById("contrib_amount").value, "ether");
  var campaign_index = Number(document.getElementById("i_Campaign_num").value);
  var user_index = Number(document.getElementById("i_user").value);
  var user_addr = accounts[user_index];

  campaignhub.contribute(campaign_index, user_addr, {from: user_addr, value: amount_contribute, gas: 4500000})
  .then(function(){
    setStatus("Contributed " + web3.fromWei(amount_contribute, "ether") + " ETH from user " + user_index + "!" );
    return refreshCampaignTable(campaign_index);    
  })
  .then(function(){
    return refreshUserTable(user_index);    
  })
  .then(function(){
    logTimestamp("Contribution finished");
  })  
  .catch(function(e) {
    console.log(e);
    setStatus("Error funding Campaign; see log.");
  });
}


function requestPayout() {

  var campaign_index = Number(document.getElementById("i_Campaign_num").value);
  var user_index = Number(document.getElementById("i_user").value);
  var user_addr = accounts[user_index];

  campaignhub.getCampaignAddress.call(campaign_index)
  .then(function(addr){
    return Campaign.at(addr);
  })
  .then(function(instance){
    campaign = instance;  
    return campaign.payout({from: user_addr})
  })
  .then(function(){
    setStatus("Payout sent!");
    return refreshCampaignTable(campaign_index); 
  })
  .then(function(){
    return refreshUserTable(user_index);    
  })
  .then(function(){
    logTimestamp("Payout request finished");
  })       
  .catch(function(e) {
    console.log(e);
    setStatus("Error getting payout; see log.");
  });
}


function requestRefund() {

  var campaign_index = Number(document.getElementById("i_Campaign_num").value);
  var user_index = Number(document.getElementById("i_user").value);
  var user_addr = accounts[user_index];

  campaignhub.getCampaignAddress.call(campaign_index)
  .then(function(addr){
    return Campaign.at(addr);
  })
  .then(function(instance){
    campaign = instance;  
    return campaign.refund({from: user_addr})
  })
  .then(function(){
    setStatus("Refund sent!");
    return refreshCampaignTable(campaign_index); 
  })
  .then(function(){
    return refreshUserTable(user_index);    
  })
  .then(function(){
    logTimestamp("Request refund finished");
  })     
  .catch(function(e) {
    console.log(e);
    setStatus("Error getting refund; see log.");
  });
}



function LogContribute() {  
  campaignhub.OnContribute()
    .watch(function(e, value) {
      if (e)
        console.error(e);
      else
        console.log("@Timestamp: " + value.args.timestamp + "," + web3.fromWei(value.args.amount, "ether") + " ether contributed from " + value.args.contrib);
    });
}    

window.onload = function() {
  web3.eth.getAccounts(function(err, accs) {
    if (err != null) {
      alert("There was an error fetching your accounts.");
      return;
    }

    if (accs.length == 0) {
      alert("Couldn't get any accounts! Make sure your Ethereum client is configured correctly.");
      return;
    } 

    accounts = accs;

    showUserBalances();

    campaignhub = CampaignHub.deployed();
  
    campaignhub.getVersion.call()
    .then(function(value) {
      console.log("CampaignHub version: " + value);
      console.log("CampaignHub address: " + campaignhub.address);
      LogContribute();
    })
    .catch(function(e) {
      console.log(e);
      setStatus("Error getting version; see log.");
    });
  });
}


