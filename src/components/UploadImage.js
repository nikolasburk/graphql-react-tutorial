import React from 'react'
import { withRouter } from 'react-router-dom'
import Modal from 'react-modal'
import { gql, graphql} from 'react-apollo'

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

  handlePost = async () => {
    const {description, imageUrl} = this.state
    await this.props.addPost({variables: {description, imageUrl}})

    window.location.pathname = '/'
  }
}

const addMutation = gql`
  mutation addPost($description: String!, $imageUrl: String!) {
    createPost(description: $description, imageUrl: $imageUrl) {
      id
      description
      imageUrl
    }
  }
`

const UploadImageWithMutation = graphql(addMutation, {name: 'addPost'})(UploadImage)

export default withRouter(UploadImageWithMutation)
