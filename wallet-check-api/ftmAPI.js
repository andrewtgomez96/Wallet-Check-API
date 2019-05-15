var rp = require('request-promise');
//var storedCompany = require('./company.json');

donations = [];
token = null;

    getOrgId = (org_Given) => {
        return rp({
            "method":"GET", 
            "uri": `https://www.opensecrets.org/api/?method=getOrgs&output=json&org=${org_Given}&apikey=${token}`,
            "json": true
        })
        .catch(function(err){
            return {"reponse": organization = ["none"]}
        });
    },
  
    getOrgIdArray = async (response) => {
        let orgId = [];
        
        //console.log(response.response.organization.length);
        if(response.response.organization instanceof Array){
            let limit = (response.response.organization.length > 10) ? 10: response.response.organization.length;
            for(let i = 0; i < limit; i++) {
                //orgId[i] = await searchOrg(response.response.organization[i]['@attributes'].orgid);
                //console.log(`org Info: ${orgId[i]}`);
                orgId[i] = searchOrg(response.response.organization[i]['@attributes'].orgid);
            }
            data = await Promise.all(orgId);
            return data;

        } else {
            orgId[0] = await searchOrg(response.response.organization['@attributes'].orgid);
            console.log(`org Info: ${orgId[0]}`);
        }
        return orgId;
    },
  
    searchOrg = (orgId) =>  {
        return rp({
            "method": "GET",
            "uri": `https://www.opensecrets.org/api/?method=orgSummary&id=${orgId}&output=json&apikey=${token}`, 
            "json": true,

        }).then(function(response) {
            
            donations = {
                "Company Name": response.response.organization['@attributes'].orgname,
                "Super Pac Donation": response.response.organization['@attributes'].gave_to_pac,
                "Democratic Party Donations": response.response.organization['@attributes'].dems,
                "Republican Party Donations": response.response.organization['@attributes'].repubs,
                "Lobbyist Donations": response.response.organization['@attributes'].lobbying
            };
            /*donations["Super Pac Donation"] = response.response.organization['@attributes'].gave_to_pac;
            donations["Democratic Party Donations"] = response.response.organization['@attributes'].dems;
            donations["Republican Party Donations"] = response.response.organization['@attributes'].repubs;
            donations["Lobbyist Donations"] = response.response.organization['@attributes'].lobbying;
            */
            return donations;
        })
        .catch(function(err){
            //fill in later
        });
    }
  
    //This is the main functions declaration that takes in a access token and then calls the API links hiarchically based off eachother
    async function main(orgName, storedToken) {
        token = storedToken;
        let orgIdJson = await getOrgId(orgName)
        if(orgIdJson.response == null ) return orgIdJson;
        return getOrgIdArray(orgIdJson);
        //return searchOrg(orgId);
            /*.then((donations) => {
                console.log(donations);
                donations = this.donations;
            });
            return donations;*/
    }

    //export main function to be called by object.main()
    module.exports.main = main;

