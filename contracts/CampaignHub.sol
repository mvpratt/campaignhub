pragma solidity ^0.4.2;

import "Campaign.sol";


contract CampaignHub {

// HOW TO: track a bunch of Campaigns
//  And array (address -> index), store array size, Campaign name?
//  A mapping (address -> owner)

// HOW TO: Call a function and send it ETH
//address.func.value(amount)(arg1, arg2, arg3)


  address[4] public myCampaigns;       // Array of Campaigns 
  address    public CampaignDeployed;  // Last Campaign deployed

  Campaign campaign;

  uint8 public num_Campaigns     = 0;
  uint8 constant public version = 1;


    event OnContribute(uint timestamp, address contrib, uint amount);

	// Constructor function
	function CampaignHub() {
	}


    function createCampaign(address owner, uint funding_goal, uint duration) {

        CampaignDeployed = new Campaign(owner, funding_goal, duration);
        num_Campaigns = num_Campaigns + 1;
        myCampaigns[num_Campaigns] = CampaignDeployed;
    }


    function contribute(uint index, address contrib) payable {

      campaign = Campaign(myCampaigns[index]);
      campaign.fund.value(msg.value)(contrib); 
      OnContribute(now, contrib, msg.value);
    }


    function getCampaignAddress(uint8 index) constant returns(address) {
        return myCampaigns[index];
    }


    function getNumCampaigns() constant returns(uint8) {
        return num_Campaigns;
    }


    function getIndexLastDeployedCampaign() constant returns(uint8) {
        return num_Campaigns;
    }


    function getAddressLastDeployedCampaign() constant returns(address) {
        return myCampaigns[num_Campaigns];
    }


    function getVersion() constant returns (uint8) {
        return version;
    }

}
