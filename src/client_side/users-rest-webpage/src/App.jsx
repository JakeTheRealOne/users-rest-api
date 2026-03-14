import { useEffect, useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import heroImg from './assets/hero.png'
import './App.css'

function CreationForm({ token, modEnable }) {
  const [user, setUser] = useState({
    "email": "",
    "username": "",
    "password": "",
    "isadmin": false,
  });
  const [creating, setCreating] = useState(false);
  const [creatingError, setCreatingError] = useState("");
  const [formKey, setFormKey] = useState(0);
  const [pwTooltip, setPwTooltip] = useState(false);

  useEffect(() => {
    if (creating) {
      // Send login request
      setCreatingError("");

      fetch("http://localhost:3225/profils", {
        method: "POST",
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': token
        },
        body: JSON.stringify(user)
      })
        .then((response) => response.json())
        .then((response) => {
          if (response.return === 322500) {
            setUser({
              "email": "",
              "username": "",
              "password": "",
              "isadmin": false,
            });
            setFormKey(formKey + 1); // Clear the form
          } else {
            setCreatingError("Failed " + response.return);
          }
        })
        .catch((err) => {
          console.log("Error: " + err);
        })
        .then(() => {
          setCreating(false);
        });
    }
  }, [creating]);

  function submitButtonClicked(e) {
    if (!creating) {
      setCreating(true);
    }
    e.preventDefault();
  }

  function gobackButtonClicked(e) {
    modEnable(false);
  }

  function diceButtonClicked(e) {
    setPwTooltip(true);
  }

  return (
    <>
      <h1>Creation page</h1>
      <p>Create another account here</p>
      <form method='post' key={formKey}>
        <label>username</label>
        <br />
        <input type="text" id="username" onChange={e => {
          setUser(prev => {
            return { ...prev, username: e.target.value }
          })
        }}></input>
        <br />
        <label>email</label>
        <br />
        <input type="text" id="email" onChange={e => {
          setUser(prev => {
            return { ...prev, email: e.target.value }
          })
        }}></input>
        <br />
        <label>password</label>
        <br />
        <input type="password" id="password" onChange={e => {
          setUser(prev => {
            return { ...prev, password: e.target.value }
          })
        }}></input>
        <button onClick={e => submitButtonClicked(e)} disabled={creating} >Dice</button>
        <br />
        <label>administrator permissions</label>
        <br />
        <input type="checkbox" id="isadmin" onChange={e => {
          setUser(prev => {
            return { ...prev, isadmin: e.target.value === "on" }
          })
        }}></input>
        <br />
        <button onClick={e => submitButtonClicked(e)} disabled={creating} >Create</button>
        <br />
        <button onClick={e => gobackButtonClicked(e)} disabled={creating} >Go Back</button>
        <br />
        <p style={{ color: "red" }}>{creatingError}</p>
      </form>
    </>
  )
}

function DeletionForm({ modEnable, token, isAdmin }) {
  const [user, setUser] = useState({
    "id": null
  });
  const [confirmeduser, setConfirmeduser] = useState({
    "id": "",
    "email": "",
    "username": "",
    "isadmin": false
  })

  const [getting, setGetting] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [deletingError, setDeletingError] = useState("");
  const [formKey, setFormKey] = useState(0);

  useEffect(() => {
    if (getting) {
      // Get user informations for deletion confirmation
      setDeletingError("");

      if (user.id) {
        fetch("http://localhost:3225/profils/" + user.id, {
          method: "GET",
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': token
          },
        })
          .then((response) => response.json())
          .then((response) => {
            console.log("get: " + JSON.stringify(response));
            if (response.return === 322500) {
              setConfirmeduser({
                "username": response.user.username,
                "email": response.user.email,
                "id": response.user._id,
                "isadmin": response.user.isadmin
              })
              console.log("got: " + JSON.stringify(response.user));
            } else {
              setDeletingError("Failed " + response.return);
            }
          })
          .catch((err) => {
            console.log("Error: " + err);
          })
          .then(() => {
            setGetting(false);
          });
      } else {
        setDeletingError("No id given");
      }
    }

    if (deleting) {
      // Send deletion request
      setDeletingError("");

      if (confirmeduser.id) {
        fetch("http://localhost:3225/profils/" + confirmeduser.id, {
          method: "DELETE",
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': token
          },
        })
          .then((response) => response.json())
          .then((response) => {
            if (response.return === 322500) {
              setUser({
                "id": ""
              });
              setFormKey(formKey + 1); // Clear the form
            } else {
              setDeletingError("Failed " + response.return);
            }
          })
          .catch((err) => {
            console.log("Error: " + err);
          })
          .then(() => {
            setDeleting(false);
            setConfirmeduser({
              "id": "",
              "email": "",
              "username": "",
              "isadmin": false
            });
          });
      }
    }
  }, [getting, deleting]);

  function submitButtonClicked(e) {
    if (!getting) {
      setGetting(true);
    }
    e.preventDefault();
  }

  function gobackButtonClicked(e) {
    modEnable(false);
  }

  function cancelButtonClicked(e) {
    setConfirmeduser({
      "id": "",
      "email": "",
      "username": "",
      "isadmin": false
    });
  }

  function confirmButtonClicked(e) {
    setDeleting(true);
  }

  if (isAdmin) {
    return (
      <>
        <h1>Deletion form</h1>
        <p>Delete another account here</p>
        <form method='post' key={formKey}>
          <label>id</label>
          <br />
          <input type="text" id="id" onChange={e => {
            setUser(prev => {
              return { ...prev, id: e.target.value }
            })
          }}></input>
          <br />
          <button onClick={e => submitButtonClicked(e)} disabled={getting} >Delete</button>
          <br />
          <button onClick={e => gobackButtonClicked(e)} disabled={getting} >Go Back</button>
          <br />
          <p style={{ color: "red" }}>{deletingError}</p>
        </form>
        {confirmeduser.email &&
          <div style={{ "position": "fixed" }}>
            <h2>Do you really want to delete ?</h2>
            <br />
            <UserBox user={confirmeduser}></UserBox>
            <br />
            <button onClick={e => cancelButtonClicked(e)} disabled={deleting} >Cancel</button>
            <br />
            <button style={{ "background": "red" }} onClick={e => confirmButtonClicked(e)} disabled={deleting} >Confirm</button>
          </div>
        }
      </>
    );
  } else {
    return (
      <>
        <h1>Deletion form</h1>
        <p>You need administrator permission to access this form</p>
        <button onClick={e => gobackButtonClicked(e)}>Go Back</button>
      </>
    );
  }
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

          return
        })
        .catch((err) => {
          console.log("Error: " + err);

          return
        })
        .then(() => {
          setLogin(false);
        });
    }
  }, [login]);

  function submitButtonClicked(e) {
    if (!login) {
      setLogin(true);
    }
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
        <button onClick={e => submitButtonClicked(e)} disabled={login} >Connect</button>
        <p style={{ color: "red" }}>{authError}</p>
      </form>
    </>
  )
}

function UserDropMenu({ user, logOut }) {
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
        <br />
        <button onClick={logOut}>Log out</button>
      </div>
    </>
  )
}

function UserBox({ user }) {
  return (
    <>
      <div style={{ background: "#ff3d3d0e", margin: "8px" }}>
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
  const [creating, setCreating] = useState(false);
  const [deleting, setDeleting] = useState(false);

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
          .then(() => { setGetme(false) });
      } else {
        setGetme(true);
        fetch("http://localhost:3225/self", {
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
            } else {
              logOut()
            }
          })
          .catch((err) => {
            console.log("Error: " + err);
          })
          .then(() => { setGetme(false) });
      }
    }
  }, [token, user, getme]);

  function logOut() {
    setToken("");
    localStorage.setItem('jwt-token', "");
  }

  function gotoCreationForm() {
    setCreating(true);
  }

  function gotoDeletionForm() {
    setDeleting(true);
  }

  if (token) {
    if (creating) {
      return (
        <>
          <CreationForm token={token} modEnable={setCreating} />
        </>
      )
    } else if (deleting) {
      return (
        <>
          <DeletionForm modEnable={setDeleting} token={token} isAdmin={user.isadmin} />
        </>
      )
    } else {
      return (
        <>
          <h1>Home page</h1>
          <p>If you are seeing this, you are successfull connected as</p><strong>{user.email}</strong>
          <UserDropMenu user={user} logOut={logOut} />
          <button onClick={gotoCreationForm} >Create user</button>
          <button onClick={gotoDeletionForm} >Delete user</button>
        </>
      )
    }
  } else {
    return (
      <>
        <AuthForm modToken={setToken} modUser={setUser} />
      </>
    )
  }
}

export default App
