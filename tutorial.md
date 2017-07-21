# How to Build an Image Board with React and GraphQL

GraphQL and React are arguably the hottest pairing in programming today. The declarative nature of both languages makes them an obvious match and lifts the perceived complexity of fetching, storing and using data - no matter the quantity. GraphQL clients like Apollo also help diminish the gap between server and client-side functionality. That's why we've prepared a small project that introduces you to all three.

In this tutorial, you'll learn how to create a basic image board where users can view posts crafted by the community, as well as upload their own images. It will be built with `create-react-app`, Apollo Client and a GraphQL API provided by [Graphcool](https://www.graph.cool/).

<!-- Put gif here -->

### What you need for this tutorial
* [Node.js](https://nodejs.org/en/): We'll be running commands and installing multiple packages using `npm`  <br />
* [Graphcool Account](https://www.graph.cool/signup/): For the backend of our image board, we'll utilize the GraphQL API provided by Graphcool

### Steps
* Getting Started with `create-react-app`
* Building Our React Components
* Navigating the App with React Router
* Generating the GraphQL Endpoint and Initial Data
* Integrating Apollo Client
* Using Apollo Client for Queries and Mutations
* Conclusion

## Getting Started with `create-react-app`
#### Installation
If you haven't heard, `create-react-app` is basically magic. Instead of spending endless amounts of time arranging the right build tools for your local development environment, you can plunge straight into your code. This is because `create-react-app` comes equip with features, including a preconfigured [Webpack](https://github.com/webpack/webpack) and [Babel](https://babeljs.io/).

To install `create-react-app` on your machine, just enter the following command into your terminal:
```
npm install -g create-react-app
```
> Not sure if you've installed `create-react-app` before? It never hurts to do it twice!

#### Creating Our React App
Now that we have `create-react-app` installed, we can generate and run a new project from the command line:
```
create-react-app react-graphql-imageboard
cd react-graphql-imageboard
npm start # opens http://localhost:3000 in your browser
```
Here's what should be in your browser:

![screen shot 2017-07-21 at 08 52 55](https://user-images.githubusercontent.com/26869552/28474792-30f8bf52-6e4a-11e7-942d-2031f7705386.png)

Another perk of developing within `create-react-app` is that it comes baked in with [hot reloading](https://facebook.github.io/react-native/blog/2016/03/24/introducing-hot-reloading.html) and linting. That way, we can stay on top of errors and syntax issues as we build out our image board.

#### Additional React Features We'll Use
Additionally, we will be implementing [React Router](https://github.com/ReactTraining/react-router) to navigate through our app and [React Modal](https://github.com/reactjs/react-modal) to construct our upload page.

Let's install those now:
```
npm install react-router-dom --save
npm install react-modal --save
```
#### Setting Up Our HTML and CSS
With our dependencies installed, we can dive into the production files crafted by `create-react-app`.

To begin, navigate into `/public/index.html` and replace the existing code with this:
``` html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Image Board</title>
  </head>
  <body>
    <div id="root"></div>
  </body>
</html>

```

As for the styling of our app, we'll use the [Tachyons](http://tachyons.io/) CSS Toolkit for our initial design:
```
npm install tachyons --save
```

Once you have Tachyons installed, find your way to `/src/index.css` and substitute whatever is there with:
``` css
@import 'https://fonts.googleapis.com/css?family=Open+Sans:300,400';

body {
  margin: 0;
  padding: 0;
  font-family: 'Open Sans', sans-serif;
  background: rgba(0,0,0,.05);
}

.box {
  width: 350px;
  height: 452px;
}

.post .image {
  width: 350px;
  height: 350px;
  flex: 0 0 350px;
}

.post .description {
  flex: 1;
  padding-left: 25px;
  font-size: 25px;
}

.new-post {
  background-color: rgba(0,0,0,0.06);
}

.image {
    background-size: cover;
    background-position: center;
    padding-bottom: 100%;
}

.add-post {
    font-size: 150px;
}
```
Of course you're welcome to manipulate and customize the CSS - this is just something to get you started!

#### Deleting Unnecessary Files
If you click around our new project, you'll notice that `create-react-app` gives us _a lot_ of files. We don't really need all of these, so how about we declutter our directories by removing the following:
```
README.md

/public/manifest.json
/public/favicon.ico

/src/App.css
/src/App.js
/src/App.test.js
/src/logo.svg
/src/registerServiceWorker.js
```
And with that, our workspace is clean and everything's installed (well, _almost_ everything... but we'll get to that later). Let's start building!

## Building Our React Components
#### What We Need
These components are essentially the heart of our app since they'll hold most of the content and functionality. To stay organized, create the directory `/src/components/` that will house our components:

* `ImageFeed`: Lists all of the posts pulled from our backend
* `UploadImage`: Allows users to upload an image by pasting a url
* `Post`: Constructs the individual post elements shown by `ImageFeed`

#### What's Inside
`ImageFeed` in `src/components/ImageFeed.js`:

``` javascript
import React from 'react'
import { Link } from 'react-router-dom'

class ImageFeed extends React.Component {

  render() {
    return (
      <div className={'w-100 flex justify-center pa6'}>
        <div className='w-100 flex flex-wrap' style={{maxWidth: 1150}}>
          <Link to='/upload' className='ma3 box new-post br2 flex flex-column items-center justify-center ttu fw6 f20 black-30 no-underline'>
            <div className="add-post">&#43;</div>
          </Link>
          TODO: This is where our posts will display!
        </div>
      </div>
    )
  }
}

export default ImageFeed
```

`UploadImage` in `src/components/UploadImage`:

``` javascript
import React from 'react'
import { withRouter } from 'react-router-dom'
import Modal from 'react-modal'

class UploadImage extends React.Component {

  state = {
    description: '',
    imageUrl: '',
  }

  render() {
    return (
      <Modal isOpen className="h-400 flex justify-center bg-white" contentLabel='Upload Image' onRequestClose={this.props.history.goBack}>
        <div className='pa4 flex justify-center bg-white'>
          <div style={{maxWidth: 400}} className=''>
            <input className='w-100 pa3 mv2' value={this.state.imageUrl} placeholder='Image Url'
              onChange={e => this.setState({imageUrl: e.target.value})} autoFocus />
            <input className='w-100 pa3 mv2' value={this.state.description} placeholder='Description'
              onChange={e => this.setState({description: e.target.value})} />
            <button className='pa3 bg-black-10 bn dim ttu pointer' onClick={this.handlePost}>Upload</button>
          </div>
        </div>
      </Modal>
    )
  }

  handlePost = () => {
    // TODO: Upload the image to the backend before returning to ImageFeed
    console.log(this.state);
    this.props.router.push('/')
  }
}

export default withRouter(UploadImage)
```

`Post` in `src/components/Post.js`:

```javascript
import React from 'react'

class Post extends React.Component {

  render() {
    return (
        <div className='bg-white ma3 box post flex flex-column no-underline br2'>
          <div className='image' style={{
              backgroundImage: `url(${this.props.post.imageUrl})`
          }} />
          <div className='flex items-center black-80 fw3 description'>
              {this.props.post.description}
          </div>
        </div>
    )
  }
}

export default Post
```
## Navigating the App with React Router
#### Putting Together `index.js`
Our `/src/index.js` file acts as the central point for navigation and component rendering. This means that after this section, we'll finally be able to see something in the browser.

Remove the existing code and start by importing the necessary packages:
```javascript
import React from 'react'
import ReactDOM from 'react-dom'
import ImageFeed from './components/ImageFeed'
import UploadImage from './components/UploadImage'
import {BrowserRouter as Router, Route} from 'react-router-dom'
import 'tachyons'
// import './index.css’
```
> Note: In your document, the ` import './index.css'` shouldn't be commented out.

Next, we'll setup the routes for our app:
```javascript
const imageRouter = (
    <Router>
        <div>
            <Route path='/' component={ImageFeed} />
            <Route path='/upload' component={UploadImage} />
        </div>
    </Router>
)
```
Finally, we'll hook it to our `index.html`:
```javascript
ReactDOM.render(imageRouter, document.getElementById('root'));
```

By now, the entire file should look something like this:
```javascript
import React from 'react'
import ReactDOM from 'react-dom'
import ImageFeed from './components/ImageFeed'
import UploadImage from './components/UploadImage'
import {BrowserRouter as Router, Route} from 'react-router-dom'
import 'tachyons'
import './index.css'

const imageRouter = (
    <Router>
        <div>
            <Route path='/' component={ImageFeed} />
            <Route path='/upload' component={UploadImage} />
        </div>
    </Router>
)


ReactDOM.render(imageRouter, document.getElementById('root'));
```
And you should see this in your browser:

![screen shot 2017-07-21 at 12 31 17](https://user-images.githubusercontent.com/26869552/28474840-612abf36-6e4a-11e7-9c01-b9184cb387a5.png)

## Generating the GraphQL Endpoint and Initial Data
#### Meet Our Schema
The React elements of our project are in place, but something's still missing if we want to use Apollo to inject data into the frontend. Any guesses?

Yup, the actual _data._

 That's where our backend comes in and we'll be creating ours through the [Graphcool CLI](https://www.graph.cool/docs/reference/cli/overview-kie1quohli/). You can install this using npm:
 ```
npm install -g graphcool
 ```

 Using the Graphcool CLI, we can produce a fully-fledged GraphQL server from the command line by providing a schema as an input argument. This schema contains the data model for our application. For us, the data model only has one type called `Post` with two fields for that post - `description` and `imageUrl`.

Here's what our structured data looks like:
```
type Post {
    description: String!
    imageUrl: String!
}
```

To call the schema, we'll use a predetermined url with this command:
```
graphcool init --schema https://graphqlbin.com/instagram.graphql
```
> Don't be alarmed if your browser opens - It's just asking you to login to your Graphcool account to authenticate the console.

#### Your Unique GraphQL Endpoint
After initiating your Graphcool project, you should see the following prompt in your terminal:

![screen shot 2017-07-21 at 13 05 17](https://user-images.githubusercontent.com/26869552/28475341-02c15b24-6e4c-11e7-9424-239480132dad.png)

> Tip: Copy the endpoint for the Simple API and store it somewhere safe - you'll need it soon!

#### Crafting Graphcool Queries
An image board without any images is just, well... a board - and quite boring. So we should change that by exploiting the Graphcool API's capabilities to add our images!

To do this, we're going to open the [Graphcool Playground](https://www.graph.cool/docs/reference/console/playground-oe1ier4iej/). A playground is an interactive environment where you can script queries, access your complete data set and so much more.

Enter the subsequent command and you'll be transported to your project's browser-based playground:
```
graphcool playground
```

You're in! Let's make something happen.

First, we can write a query asking for all of the posts that we currently have in the database and their description:
```
{
    allPosts {
        description
        imageUrl
    }
}
```

Once you press play, you'll notice that the server returns an empty array because we don't have any posts yet.

![screen shot 2017-07-21 at 13 12 47](https://user-images.githubusercontent.com/26869552/28475938-7e1d8be2-6e4e-11e7-9656-3535a5bb5bff.png)

To create some data, open a new session in your playground. Below we've crafted an initial mutation to send where we provide a description and an image url, then ask for an id in return.
```
mutation {
    createPost(
        description: "The Worst Cat",
        imageUrl: "http://media2.s-nbcnews.com/i/streams/2014/September/140905/1D274906713956-today-pygmy-hippo-1a-140904.jpg"
    ) {
        id
    }
}
```
Press play and that's it! Our post was created and the image's id was returned.

![screen shot 2017-07-21 at 13 20 14](https://user-images.githubusercontent.com/26869552/28476132-275a57f8-6e4f-11e7-8839-6f95735e8aa4.png)

Now if we go back to the `allPosts` session and run it, it will spit back the details of the image we just posted.

![screen shot 2017-07-21 at 13 21 17](https://user-images.githubusercontent.com/26869552/28476248-9ed61290-6e4f-11e7-8242-83fa584e2dfe.png)

> Tip: Throughout development and once we're able to create posts in the browser, you can keep checking this playground to see your entire data set.

Great job! Our backend's done and have a bit of data to work with. So let's tie it all together and give our application full functionality.

## Integrating Apollo Client
#### What is Apollo Client?
[Apollo Client]((http://dev.apollodata.com/react/)) is a variation of [Apollo](http://www.apollodata.com/) and one of the most popular GraphQL clients at the moment. It manages server-side GraphQL data in your React app so you don't have to.

#### Installing the Dependencies
We'll need three dependencies to use Apollo Client in our project:
* `apollo-client`: Contains the general functionality of Apollo Client
* `react-apollo`: Implements React-specific bindings for Apollo
* `graphql-tag`: Provides functionality for parsing the [JavaScript template literals](http://exploringjs.com/es6/ch_template-literals.html) that will contain our GraphQL queries and mutations

Luckily for us, all three of these can be installed at once:
```
npm install apollo-client react-apollo graphql-tag --save
```

#### Connecting React Router with the Apollo Client
Alright we have our components, our data and our last installations done... but our posts still aren't rendering. This is because we have to merge the Apollo Client with our existing router.  

To begin with, we should make sure that the packages we just installed are imported. Navigate to `src/index.js` and add the following around line 8:
``` javascript
import {ApolloProvider, createNetworkInterface, ApolloClient} from 'react-apollo'
```

Next, let's create a new instance of Apollo Client directly below the import statements. This would be a good time to pull out that Simple API endpoint you saved earlier:
```javascript
const networkInterface = createNetworkInterface({
// The link replacing __SIMPLE_API_ENDPOINT__ should resemble: `https://api.graph.cool/simple/v1/<PROJECT_ID>`
  uri: '__SIMPLE_API_ENDPOINT__'
})

const client = new ApolloClient({networkInterface})
```

> Note: The uri that we have to pass to the `createNetworkInterface` call is the GraphQL endpoint we generated when we initiated our Graphcool project. <br />
<br />
Can't find your endpoint? No worries, you can always retrieve that endpoint from the [Graphcool console](https://console.graph.cool/) by selecting your project and then clicking the `ENDPOINTS` button in the lower lefthand corner.

Last step is to wrap our router with the `ApolloProvider`. This ensures that all of the child components will have access to the Apollo Client functionality like sending queries and mutations - and as a result, posting our images.
```javascript
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
```

By now, your `src/index.js` file should resemble the example below (but with your unique uri!) Your browser will still look the same, but that will change in the next step!
```javascript
import React from 'react'
import ReactDOM from 'react-dom'
import ImageFeed from './components/ImageFeed'
import UploadImage from './components/UploadImage'
import {BrowserRouter as Router, Route} from 'react-router-dom'
import {ApolloProvider, createNetworkInterface, ApolloClient} from 'react-apollo'
import 'tachyons'
import './index.css'

const networkInterface = createNetworkInterface({
  uri: 'https://api.graph.cool/simple/v1/cj5drdlkwcgwl0127voc14n55'
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
```

## Using Apollo Client for Queries and Mutations
Finally! Time to use Apollo in our components to interact with the GraphQL API. It's the last stretch - so let's get to it.

#### Querying All Posts in `ImageFeed`
To display all of our posts within the feed, we have to add two new imports to `src/components/ImageFeed.js` near line 3:
```javascript
import Post from '../components/Post' // Renders single post from src/components/Post.js
import { gql, graphql } from 'react-apollo'
```

There's something new here: `gql` and `graphql.gql`.
* `gql` is used to create queries and mutations.
* `graphql` is a higher-order component that takes a couple different input arguments: One or more queries/mutations created with `gql` and a React component. It then injects the data from either the query or mutation function into the component as a prop.

Before we dive into that, let's think about what our query will look like when we want to display our posts. We'll need to call our original `allPosts` and pass in the image's id, image url and description. The following won't go directly in our component file, but it provides a visualization of what our code will be asking for:
```
query allPosts {
    allPosts(orderBy: createdAt_DESC) {
        id
        imageUrl
        description
    }
}
```
> Note: `orderBy: createdAt_DESC` sorts the posts in descending order based on when they were uploaded, so the latest posts appear at the top of the feed.

Now to actually add code to our final. Towards the end of the file and outside of the `Post` class, we're adding a variable `FeedQuery`. This variable will contain `gql` that queries the information provided about our posts:
```javascript
const FeedQuery = gql`query allPosts {
  allPosts(orderBy: createdAt_DESC) {
    id
    imageUrl
    description
  }
}`

```

We also need to replace the current export statement with this one:
```javascript
export default graphql(FeedQuery)(ImageFeed)
```

This new export statement will inject a new prop called `data` back into the `ImageFeed` component. The new `data` prop allows us to first check if the data has been retrieved then render our feed based on that response.

To check if that data has already been loaded, we can use `this.props.data.loading` and place an `if` statement at the beginning of our render function like so:
```javascript
if (this.props.data.loading) {
  return (
    <div className='flex w-100 h-100 items-center justify-center pt7'>Loading...</div>
  )
}
```
If loading is set to false, we can then map over the existing data using `this.props.data.allPosts` to display them. Putting it all together, this is the render function you should end up with:
```javascript
render() {
  return (
    if (this.props.data.loading) {
      return (
        <div className='flex w-100 h-100 items-center justify-center pt7'>Loading...</div>
      )
    }

    <div className={'w-100 flex justify-center pa6'}>
      <div className='w-100 flex flex-wrap' style={{maxWidth: 1150}}>
        <Link to='/upload'>
          <div className="add-post">&#43;</div>
        </Link>
        {this.props.data.allPosts.map(post => (
          <Post key={post.id} post={post} refresh={() => this.props.data.refetch()} />
        ))}
        </div>
    </div>
  )
}
```

All you have to do is add `className='ma3 box new-post br2 flex flex-column items-center justify-center ttu fw6 f20 black-30 no-underline’` to your `Link` tag and then your posts will be looking good.

![screen shot 2017-07-21 at 14 00 33](https://user-images.githubusercontent.com/26869552/28478524-0b2ce92e-6e59-11e7-8c16-2e0ac576cd9e.png)

#### Creating Posts in `UploadImage`
Adding mutations to React components is similar to adding queries. Only difference is instead of injecting data, you're injecting functions that execute each mutation.

Here's what the mutation to create a new post looks like in its raw form. Remember, this is just for reference - not your code.
```
mutation addPost($description: String!, $imageUrl: String!) {
    createPost(description: $description, imageUrl: $imageUrl) {
        description
        imageUrl
    }
}
```

Because adding queries and adding mutations are alike, our process is also essentially the same. So first, let's import the Apollo dependencies at the top of `src/components/UploadImage.js` around line 4:
```javascript
import { gql, graphql} from 'react-apollo'
```

Then we'll create a variable to translate our `gql` mutation into JavaScript. This will happen near the bottom of our file and outside of the `UploadImage` class.
```javascript
const addMutation = gql`
  mutation addPost($description: String!, $imageUrl: String!) {
    createPost(description: $description, imageUrl: $imageUrl) {
      id
      description
      imageUrl
    }
  }
`
```

And then replace the existing export statement with this:
```javascript
const UploadImageWithMutation = graphql(addMutation, {name: 'addPost'})(UploadImage)
export default withRouter(UploadImageWithMutation)
```

Similar to `FeedQuery`, this new `UploadImageWithMutation` variable injects a new function into the props of `UploadImage` that we can access through `this.props.addPost`. This function takes a description and the image url as arguments to provide the necessary information to the backend.

With this in mind, we can implement the `handlePost` method of `UploadImage` to create our post.

Your `handlePost` should evolve from this comment-riddled mess:
```javascript
handlePost = () => {
  // TODO: Upload the image to the backend before returning to ImageFeed
  console.log(this.state);
  this.props.router.push('/')
}
}
```

To a fully-functioning helper method:
```javascript
handlePost = async () => {
  const {description, imageUrl} = this.state
  await this.props.addPost({variables: {description, imageUrl}})

  window.location.pathname = '/'
  }
}
```

## Conclusion
Congrats! You've just created your own image board using `create-react-app`, Apollo Client and Graphcool's GraphQL API. If you want to reference the example code, you can find it within this repo.

#### What's Next?
We're sure that you're itching to know more, so here are some resources to help you expand your learning:
* Dive into the intricacies of the Apollo Client with Graphcool's [Learn Apollo](https://www.learnapollo.com/) tutorials<br />
* Tackle some [Advanced GraphQL Features](https://www.graph.cool/docs/tutorials/advanced-features-eath7duf7d/)
* Keep your app secure with [Authorization and Permissions](https://www.graph.cool/docs/reference/auth/authorization-iegoo0heez/)
