# CampaignHub

CampaignHub is a crowdfunding platform that allows users to browse, create and contribute to campaigns.  There are two Solidity smart contracts named CampaignHub.sol and Campaign.sol 

Git Repository:
https://github.com/mvpratt/tree/master

## CAMPAIGNHUB 

CampaignHub is the registry of all Campaigns to be funded. FundingHub should have a constructor and the following functions:

`createCampaign()` - This function allows a user to add a new campaign to the CampaignHub. The function deploys a new campaign contract and keeps track of its address. The createcampaign() function accepts all constructor values that the campaign contract requires.

`contribute()` - This function allows users to contribute to a campaign identified by its address. contribute() calls the fund() function in the individual campaign contract and passes on all Ether value attached to the function call.


## CAMPAIGN 

campaign is the contract that stores all the data of each campaign. campaign has a constructor and a struct to store the following information:

* the address of the owner of the campaign
* the amount to be raised (eg 100000 wei)
* the deadline, i.e. the time before which the amount has to be raised
* Please also implement the following functions:

`fund()` - This is the function called when the CampaignHub receives a contribution. The function must keep track of each contributor and the individual amounts contributed. 
#### Rules: 
* If the contribution was sent after the deadline of the campaign passed, or the full amount has been reached, the function returns the value to the originator of the transaction 
* If the full funding amount has been reached, the owner may call payout() to retrieve funds.
* If the deadline has passed without the funding goal being reached, contributers may get their money back by calling refund().

`payout()` - This is the function that sends all funds received in the contract to the owner of the campaign.  Only the owner may receive the payout.

`refund()` - This function sends funds back to the contributer that requests them.  This is only permitted if deadline is reach and campaign is not fully funded.


## INTERFACE

A simple web interface allows users to browse active campaigns, create their own campaign, and dontribute to a campaign

#### Guidelines
* Deadline and duration are in units of  seconds
* campaign states are as follows: (0 - created, 1 - fully funded, 2 - paid out)
* This demonstation Dapp is limited to a maximum of 3 campaigns and 3 users.
* Whenever you take an action such as create, payout or refund, _make sure that the desired user selected_

#### How to test deadline
1. Create a campaign with duration of 1
2. Try to contribute to it, notice that contributions are rejected, because the deadline has already expired
3. Now, create a campaign with duration of 50
4. Contribute to it, the funds should be accepted.
5. Request a refund.  Notice that the refund request is rejected.
6. Now, fully fund the campaign
7. Request payout

## AUTOMATED TESTS

* `truffle test`

`fund_refund.js` - An automated test that covers the refund function in the campaign contract using the Truffle testing framework. 


## Installation

1. Run `testrpc` or `geth`  You must have web3.eth.accounts[0,1,2,3] unlocked, with a balance of ETH
2. `truffle compile` 
3. `truffle migrate --reset --network development` 
4. `truffle build --reset --network development`
5. In the build directory, run this command: `php -S 0.0.0.0:8000`
6. Connect to the page in Chrome

## Tool Versions 

 * Tuffle 2.1.1
 * Node.js 6.9.5
 * Solidity 0.4.2 and above
 * TestRPC 3.0.3
 * geth 1.5.8-stable-f58fb322
 * Google Chrome 



### Known Issues/bugs

* When contribution puts over the goal amount, the campaign accepts all the funds, the balance isn't capped automatically.  Contributers should be careful not to send funds more than the goal.


### Author:

mvpratt

### Screenshot:

https://github.com/mvpratt/blob/master/Screenshot.png


