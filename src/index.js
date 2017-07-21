import React from 'react'
import ReactDOM from 'react-dom'
import ImageFeed from './components/ImageFeed'
import UploadImage from './components/UploadImage'
import {BrowserRouter as Router, Route} from 'react-router-dom'
import {ApolloProvider, createNetworkInterface, ApolloClient} from 'react-apollo'
import 'tachyons'
import './index.css'

const networkInterface = createNetworkInterface({
// The link replacing __SIMPLE_API_ENDPOINT__ should look like this: `https://api.graph.cool/simple/v1/<PROJECT_ID>`
  uri: '__SIMPLE_API_ENDPOINT__'
})

const client = new ApolloClient({networkInterface})

const imageRouter = (
    <ApolloProvider client={client}>
        <Router>
            <div>
                <Route path='/' component={ImageFeed} />
                <Route path='/upload' component={UploadImage} />
            </div>
        </Router>
    </ApolloProvider>
)


ReactDOM.render(imageRouter, document.getElementById('root'));
