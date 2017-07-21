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
