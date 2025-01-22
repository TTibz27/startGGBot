auth = require('./auth.js')

var msg = 'Hello World';
console.log(msg);


let query = /* GraphQL */ `
query getEventId($slug: String) {
  event(slug: $slug) {
    id
    name
    startAt
  }
},

`;


let variables = {
    "slug": "tournament/the-jeekly-42/event/guilty-gear-strive-hosted-by-the-jeekly"
  }


let placementQuery = `query EventStandings($eventId: ID!, $page: Int!, $perPage: Int!) {
  event(id: $eventId) {
    id
    name
    standings(query: {
      perPage: $perPage,
      page: $page
    }){
      nodes {
        placement
        entrant {
          id
          name
        }
      }
    }
  }
}`;

let placementVars = 
{
  "eventId": null,
  "page": 1,
  "perPage": 8
}



fetch('https://api.start.gg/gql/alpha', {
    method: 'POST',
    headers: 
    { 
         "Authorization": "Bearer " + auth.token
    }
    ,
    body:JSON.stringify({ query, variables}),
  })
    .then((r) => r.json())
    .then((rsp) => {
        console.log(rsp);

        
        console.log('getting data from event :', rsp.data?.event?.name);
        let date = Date(rsp.data.event.startAt);
        console.log(date.toString());
        placementVars.eventId =rsp.data.event.id;


        console.log('----------------retrieving placements--------------');


        fetch('https://api.start.gg/gql/alpha', {
            method: 'POST',
            headers: 
            { 
                 "Authorization": "Bearer " + auth.token
            }
            ,
            body: JSON.stringify({ query: placementQuery, variables: placementVars}) ,
          })
            .then((r) => r.json())
            .then((rsp) => {
                if(rsp.data?.event?.standings?.nodes?.length > 0)
                    for (const entry of rsp.data.event.standings.nodes){
                        console.log(entry.entrant.name + ' placed '+ entry.placement + '!');
                    }
            });
        
    });
