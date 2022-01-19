import React, { useEffect, useState } from 'react'
import { db } from './firebase'
import './Post.css'
import firebase from 'firebase'

const Post = ({ username, imageURL, caption, postID, user }) => {
  const [comments, setComments] = useState([])
  const [comment, setComment] = useState('')

  useEffect(() => {
    let unsubscribe
    if (postID) {
      unsubscribe = db
        .collection('posts')
        .doc(postID)
        .collection('comments')
        .orderBy('timestamp', 'asc')
        .onSnapshot((snapshot) => {
          setComments(snapshot.docs.map((doc) => doc.data()))
        })
    }

    return () => {
      unsubscribe()
    }
  }, [postID])

  const postComment = (e) => {
    e.preventDefault()
    db.collection('posts').doc(postID).collection('comments').add({
      text: comment,
      username: user.displayName,
      timestamp: firebase.firestore.FieldValue.serverTimestamp(),
    })
    setComment('')
  }

  return (
    <div className='post'>
      <div className='post__header'>
        <img className='post__avatar' src={imageURL} alt='avatar' />
        <h3>{username}</h3>
      </div>

      <img className='post__image' src={imageURL} alt='' />
      <h4 className='post__text'>
        <strong>{username}: </strong>
        {caption}
      </h4>

      <div className='post__comments'>
        {comments.map((comment) => (
          <p>
            <b>{comment.username}:</b> {comment.text}
          </p>
        ))}
      </div>

      {user && (
        <form className='post__commentBox'>
          <input
            className='post__input'
            placeholder='Add a comment...'
            type='text'
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />

          <button
            className='post__button'
            disabled={!comment}
            type='submit'
            onClick={postComment}
          >
            Post
          </button>
        </form>
      )}
    </div>
  )
}

export default Post
