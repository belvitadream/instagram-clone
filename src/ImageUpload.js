import { Button } from '@mui/material'
import { useState } from 'react'
import { auth, db, storage } from './firebase'
import firebase from 'firebase'
import './ImageUpload.css'

const ImageUpload = ({ username }) => {
  const [caption, setCaption] = useState('')
  const [image, setImage] = useState('')
  const [progress, setProgress] = useState('')

  const handleChange = (e) => {
    if (e.target.files[0]) {
      setImage(e.target.files[0])
    }
  }
  const handleUpload = () => {
    const uploadTask = storage.ref(`images/${image.name}`).put(image)
    uploadTask.on(
      'state_changed',
      (snapshot) => {
        // progress function
        const progress = Math.round(
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        )

        setProgress(progress)
      },
      (error) => {
        // error function
        console.log(error)
        alert(error.message)
      },
      () => {
        // complete function
        storage
          .ref('images')
          .child(image.name)
          .getDownloadURL()
          .then((url) => {
            // post the image inside the database
            db.collection('posts').add({
              timestamp: firebase.firestore.FieldValue.serverTimestamp(),
              caption: caption,
              imageURL: url,
              username: username,
            })

            setProgress(0)
            setCaption('')
            setImage(null)
          })
      }
    )
  }

  return (
    <div className='imageupload'>
      <progress
        className='imageupload__progress'
        value={progress}
        max='100'
      ></progress>
      <input
        type='text'
        placeholder='Enter a caption'
        value={caption}
        onChange={(e) => setCaption(e.target.value)}
      />
      <input type='file' onChange={handleChange} />
      <Button className='imageupload__button' onClick={handleUpload}>
        Upload
      </Button>
    </div>
  )
}

export default ImageUpload
