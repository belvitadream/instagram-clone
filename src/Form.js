import { Button, Input } from '@mui/material'

const Form = ({
  username,
  email,
  password,
  setEmail,
  setUsername,
  setPassword,
  signUp,
}) => {
  return (
    <div>
      <form id='app__signup'>
        <Input
          placeholder='username'
          type='text'
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        <Input
          placeholder='email'
          type='text'
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <Input
          placeholder='password'
          type='password'
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <Button onClick={signUp}>Sign Up</Button>
      </form>
    </div>
  )
}

export default Form
