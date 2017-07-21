import React from 'react'
import { Link } from 'react-router-dom'
import Post from '../components/Post'
import { gql, graphql } from 'react-apollo'

class ImageFeed extends React.Component {

  render() {
    if (this.props.data.loading) {
      return (
        <div className='flex w-100 h-100 items-center justify-center pt7'>Loading...</div>
      )
    }

    return (
      <div className={'w-100 flex justify-center pa6'}>
        <div className='w-100 flex flex-wrap' style={{maxWidth: 1150}}>
          <Link to='/upload' className='ma3 box new-post br2 flex flex-column items-center justify-center ttu fw6 f20 black-30 no-underline'>
            <div className="add-post">&#43;</div>
          </Link>
          {this.props.data.allPosts.map(post => (
            <Post key={post.id} post={post} refresh={() => this.props.data.refetch()} />
          ))}
        </div>
      </div>
    )
  }
}

const FeedQuery = gql`query allPosts {
  allPosts(orderBy: createdAt_DESC) {
    id
    imageUrl
    description
  }
}`

export default graphql(FeedQuery)(ImageFeed)
