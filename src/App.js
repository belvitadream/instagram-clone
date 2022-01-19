import './App.css'
import React, { useState, useEffect } from 'react'
import Post from './Post'
// import data from './data'
import { auth, db } from './firebase'
import { Input, Modal } from '@mui/material'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Form from './Form'
import ImageUpload from './ImageUpload'

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
}

function App() {
  const [posts, setPosts] = useState([])
  const [open, setOpen] = useState(false)
  const handleOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [email, setEmail] = useState('')
  const [user, setUser] = useState(null)
  const [openLogin, setOpenLogin] = useState(false)

  const signUp = (e) => {
    e.preventDefault()
    auth
      .createUserWithEmailAndPassword(email, password)
      .then((authUser) => {
        return authUser.user.updateProfile({
          displayName: username,
        })
      })
      .catch((error) => alert(error.message))
  }

  const login = (e) => {
    e.preventDefault()
    auth
      .signInWithEmailAndPassword(email, password)
      .catch((error) => alert(error.message))

    setOpenLogin(false)
  }

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((authUser) => {
      if (authUser) {
        // user has logged in
        console.log(authUser)
        console.log(authUser.displayName)
        setUser(authUser)
      } else {
        // usedr has logged out
        setUser(null)
      }
    })

    return () => {
      // perform some cleanup function
      unsubscribe()
    }
  }, [user, username])

  // when the useEffect [] is empty, this means it will run only once.
  // and [posts] means when posts are changed, this callback function inside useEffect is run
  useEffect(() => {
    db.collection('posts')
      .orderBy('timestamp', 'desc')
      .onSnapshot((snapshot) => {
        setPosts(
          snapshot.docs.map((doc) => {
            return {
              post: doc.data(),
              id: doc.id,
            }
          })
        )
      })
  }, [])

  return (
    <div className='app'>
      <div className='app__header'>
        <img
          className='app__headerImage'
          src='https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png'
          alt='Instagram logo'
        />

        <div className='app__header__info'>
          {user ? (
            <div className='app__header__info'>
              <h4>You are logged in as: {user.displayName}</h4>
              <Button onClick={() => auth.signOut()}>Logout</Button>
            </div>
          ) : (
            <div className='app_loginContainer'>
              <Button onClick={() => setOpenLogin(true)}>Login</Button>
              <Button onClick={handleOpen}>Sign Up</Button>
            </div>
          )}

          <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby='modal-modal-title'
            aria-describedby='modal-modal-description'
          >
            <Box sx={style}>
              <img
                className='app__headerImage'
                src='https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png'
                alt='Instagram logo'
              />

              {/* <h3>SIGN UP</h3> */}
              <Form
                username={username}
                password={password}
                email={email}
                setUsername={setUsername}
                setPassword={setPassword}
                setEmail={setEmail}
                signUp={signUp}
              />
            </Box>
          </Modal>

          <Modal
            open={openLogin}
            onClose={() => setOpenLogin(false)}
            aria-labelledby='modal-modal-title'
            aria-describedby='modal-modal-description'
          >
            <Box sx={style}>
              <img
                className='app__headerImage'
                src='https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png'
                alt='Instagram logo'
              />
              {/* <h3>LOGIN</h3> */}

              <form id='app__signup'>
                <Input
                  placeholder='email'
                  type='text'
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />

                <Input
                  pl
                  aceholder='password'
                  type='password'
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <Button onClick={login}>Login</Button>
              </form>
            </Box>
          </Modal>
        </div>
      </div>

      <div className='app__posts'>
        {posts.map(({ id, post }) => {
          return <Post key={id} postID={id} user={user} {...post}></Post>
        })}
      </div>

      {user?.displayName ? (
        <ImageUpload username={user.displayName}></ImageUpload>
      ) : (
        <h3>Sorry you need to login to upload</h3>
      )}
    </div>
  )
}

export default App
