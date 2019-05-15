const rp = require('request-promise');


let token = "";
 
const getOrgId = (companyName) => {
    return rp({
        uri: `http://classic.maplight.org/services_open_api/map.organization_search_v1.json?apikey=${token}&search=${companyName}`,
        qs: {
            access_token: 'xxxxx xxxxx' // -> uri + '?access_token=xxxxx%20xxxxx'
        },
        headers: {
            'User-Agent': 'Request-Promise'
        },
            json: true // Automatically parses the JSON string in the response
        })
        /*
        .then(function (repos) {
            console.log('User has %d repos', repos.length);
        })
        */
        .catch(function (err) {
            // API call failed...
        });
}

//body is not coded up at all yet
const getAllOrgsPositions = async (orgArray) => {
    let orgId = [];
    
    //console.log(orgArray);
        
        let limit = (orgArray.length > 10) ? 10: orgArray.length;
        for(let i = 0; i < limit; i++) {
            
            orgId[i] = {
                "name": orgArray[i].name,
                "positions" : await getBillPositions(orgArray[i].organization_id)
            }
            //console.log(`org name: ${orgArray[i].name}`);
            //console.log(`org Info: ${orgId[i]}`);
        }
        return orgId;
}

 
const getBillPositions = (companyId) => {
    return rp({
        uri: `http://classic.maplight.org/services_open_api/map.organization_positions_v1.json?apikey=${token}&jurisdiction=us&organization_id=${companyId}`,
        qs: {
            access_token: 'xxxxx xxxxx' // -> uri + '?access_token=xxxxx%20xxxxx'
        },
        headers: {
            'User-Agent': 'Request-Promise'
        },
        json: true // Automatically parses the JSON string in the response
    })
    .then(function (response) {
        return response.positions;
    })
    .catch(function (err) {
        // API call failed...
    });
}


//This is the main functions declaration that takes in a access token and then calls the API links hiarchically based off eachother
async function main(orgName, storedToken) {
    token = storedToken;
    let jsonO = await getOrgId(orgName);
    if(jsonO.organizations.length == 0) return {"Org": "No org found"};
    return getAllOrgsPositions(jsonO.organizations);
    //console.log(`HEREEEEE IS NAME ${jsonO.organizations[0].name}`);
    //return getBillPositions(jsonO.organizations[0].organization_id);
    
}

//export main function to be called by object.main()
module.exports.main = main;

