type Queries={
    [key:string]:string
}


export const apiList={
    auth:{
        createSession:{method:'POST',url:'/v3/sessions/'},
        deleteSession:{method:'DELETE',url:'/v3/sessions/'}
    },
    events:{
        getAllEvents:{method:'GET',url:'/v3/events/'}

    },
    markets:{method:'GET',url:(queries:Queries)=>`/v3/events/${queries.event_ids}/markets/`},
    contracts:{method:'GET',url:(queries:Queries)=>` /v3/markets/${queries.market_ids}/contracts/`},
    prices:{method:'GET',url:(queries:Queries)=>`/v3/markets/${queries.market_ids}/quotes/`}
}

