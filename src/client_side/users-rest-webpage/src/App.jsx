import { useEffect, useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import heroImg from './assets/hero.png'
import './App.css'

function CreationForm() {
  return (
    <>
      <h1>Creation form</h1>
    </>
  )
}

function DeletionForm() {
  return (
    <>
      <h1>Deletion form</h1>
    </>
  )
}

function AuthForm({ modToken, modUser }) {
  const [candidate, setCandidate] = useState({
    "email": "",
    "password": ""
  });
  const [login, setLogin] = useState(false);
  const [authError, setAuthError] = useState("");

  useEffect(() => {
    if (login) {
      // Send login request
      setAuthError("");

      fetch("http://localhost:3225/connexion", {
        method: "POST",
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(candidate)
      })
        .then((response) => response.json())
        .then((response) => {
          if (response.return === 322500) {
            localStorage.setItem('jwt-token', response.token);
            modToken(localStorage.getItem('jwt-token'));
            modUser({ email: "", username: "", id: response.id });
          } else {
            setAuthError("Failed " + response.return);
          }
        })
        .catch((err) => {
          console.log("Error: " + err);
        })
        .then(setLogin(false));
    }
  }, [login]);

  function submitButtonClicked(e) {
    setLogin(true);
    e.preventDefault();
  }

  return (
    <>
      <h1>Login page</h1>
      <p>You need to connect to your user account</p>
      <form method='post'>
        <label>email</label>
        <input type="text" id="email" onChange={e => {
          setCandidate(prev => {
            return { ...prev, email: e.target.value }
          })
        }}></input>
        <label>password</label>
        <input type="password" id="password" onChange={e => {
          setCandidate(prev => {
            return { ...prev, password: e.target.value }
          })
        }}></input>
        <button onClick={e => submitButtonClicked(e)}>Connect</button>
        <p style={{ color: "red" }}>{authError}</p>
      </form>
    </>
  )
}

function UserDropMenu({ user }) {
  return (
    <>
      <div style={{ background: "#ffffff0e", margin: "8px" }}>
        <strong>Username: </strong> {user.username}
        <br />
        <strong>Email: </strong> {user.email}
        <br />
        <strong>ID: </strong> {user.id}
        <br />
        <strong>Is admin: </strong> {String(user.isadmin)}
      </div>
    </>
  )
}

function App() {
  const [token, setToken] = useState(localStorage.getItem('jwt-token'));
  const [user, setUser] = useState({
    "email": "",
    "username": "",
    "id": "",
    "isadmin": false,
  });
  const [getme, setGetme] = useState(false);


  useEffect(() => {
    if (token && !user.email && !getme) {
      if (user.id) {
        setGetme(true);
        fetch("http://localhost:3225/profils/" + user.id, {
          method: "GET",
          headers: {
            'Authorization': token
          }
        })
          .then((response) => response.json())
          .then((response) => {
            if (response.return === 322500) {
              setUser(
                {
                  username: response.user.username,
                  email: response.user.email,
                  id: response.user._id,
                  isadmin: response.user.isadmin
                }
              );
            }
          })
          .catch((err) => {
            console.log("Error: " + err);
          })
          .then(setGetme(false));
      } else {
        setGetme(true);
        fetch("http://localhost:3225/moi", {
          method: "GET",
          headers: {
            'Authorization': token
          }
        })
          .then((response) => response.json())
          .then((response) => {
            if (response.return === 322500) {
              setUser(
                {
                  id: response.id,
                }
              );
            }
          })
          .catch((err) => {
            console.log("Error: " + err);
          })
          .then(setGetme(false));
      }
    }

    if (false && getme) {
      console.log("getmeeee!")
      // Get user informations
      fetch("http://localhost:3225/profils/" + user.id, {
        method: "GET",
        headers: {
          'Authorization': token
        }
      })
        .then((response) => response.json())
        .then((response) => {
          if (response.return === 322500) {
            modUser(
              {
                username: response.user.username,
                email: response.user.email,
                id: response.user._id,
              }
            );
          }
        })
        .catch((err) => {
          console.log("Error: " + err);
        })
        .then(setGetme(false));
    }
  }, [token, user, getme]);

  function logOut() {
    setToken(null);
    localStorage.setItem('jwt-token', token);
  }

  if (token) {
    return (
      <>
        <h1>Home page</h1>
        <p>If you are seeing this, you are successfull connected as</p><strong>{user.email}</strong>
        <UserDropMenu user={user} />
        <button onClick={logOut}>Log out</button>
      </>
    )
  } else {
    return (
      <>
        <AuthForm modToken={setToken} modUser={setUser} />
      </>
    )
  }
}

export default App
