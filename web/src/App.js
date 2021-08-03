import React from "react"
import { ApolloClient, ApolloProvider, InMemoryCache } from "@apollo/client"
import Pages from "./pages"

const uri = "http://localhost:5000/api"
const cache = new InMemoryCache()

const client = new ApolloClient({
    uri,
    cache,
    connectToDevTools: true,
})

const App = () => {
    return (
        <ApolloProvider client={client}>
            <Pages />
        </ApolloProvider>
    )
}

export default App
