# Creating a React Application with Apollo and GraphQL

Start your GraphQL journey by creating an image board application.

Frontend: `create-react-app` with [Apollo Client](https://github.com/apollographql/apollo-client)<br />
Backend: GraphQL API provided by [Graphcool](https://www.graph.cool/)

<!-- Put gif here -->

## Quickstart
Here's how you can get up and running with this project in just 5 minutes. For a more in-depth tutorial, check out the `tutorial.md` file in the root of this repository.

#### 1. Clone this repository
```
git clone https://github.com/stranskycaro/graphql-react-tutorial.git
cd graphql-react-tutorial/
```
#### 2. Create GraphQL API with [`graphcool`](https://www.npmjs.com/package/graphcool)
```
# Install Graphcool CLI
npm install -g graphcool

# Create a new project based on the Instagram example schema
graphcool init --schema https://graphqlbin.com/instagram.graphql
```
This creates a GraphQL API for the following schema:
```
type Post {
    description: String!
    imageUrl: String!
}
```
#### 3. Connect the app with your GraphQL API
Copy the `Simple API` endpoint and paste it into `./src/index.js` as the `uri` argument in the `createNetworkInterface` call:
``` javascript
// replace `__SIMPLE_API_ENDPOINT__` with the endpoint
const networkInterface = createNetworkInterface({ uri: '__SIMPLE_API_ENDPOINT__' })
```
#### 4. Install dependencies and run locally
```
npm install
npm start # opens http://localhost:3000 in your browser
```
## What's Next?
* Dive into the intricacies of the Apollo Client with Graphcool's [Learn Apollo](https://www.learnapollo.com/) tutorials<br />
* Tackle some [Advanced GraphQL Features](https://www.graph.cool/docs/tutorials/advanced-features-eath7duf7d/)
* Keep your app secure with [Authorization and Permissions](https://www.graph.cool/docs/reference/auth/authorization-iegoo0heez/)
