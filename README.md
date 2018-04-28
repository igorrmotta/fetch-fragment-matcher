(Information collected from [here](https://github.com/apollographql/apollo-client/issues/1555#issuecomment-295834774) and [here](https://www.apollographql.com/docs/react/recipes/fragment-matching.html))

# Problem
Using union (or interface) ObjectTypes, requires providing a custom fragmentMatcher property to the constructor options of apolloClient.

# Solution
The solution is to provide a custom fragmentMatcher argument to the options for your apolloClient.

Right now, this is something you'll need to do by hand – i.e. if you revise your ObjectTypes on your server, you'll need to keep this in sync on your client.


# How to use this?

1) Run `fetch-fragment-matcher` with the arguments: 
    
    [Input - one of the two options]
    
    * `fetch --e` (--endpoint): The graphql server endpoint
    * `get --d` (--directory): The folder directory that contains `.gql | .graphql` type definitions 

    [Output]

    * --o (--output): The output directory (or to set full path use --output-file)

2) Set the fragment matcher in apollo-client

```js
import { ApolloClient } from 'apollo-client';
import { InMemoryCache, IntrospectionFragmentMatcher } from 'apollo-cache-inmemory';

const introspectionQueryResultData = require('./fragmentTypes.json');
const fragmentMatcher = new IntrospectionFragmentMatcher({
    introspectionQueryResultData
});

const client = new ApolloClient({
    cache: new InMemoryCache({ fragmentMatcher })
});
```
