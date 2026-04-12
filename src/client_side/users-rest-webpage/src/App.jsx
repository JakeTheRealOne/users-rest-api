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
  const [now, setNow] = useState(Date.now());
  const HOLD_DELAY = 1000; // 1sec

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
            if (response.return === 322500) {
              setConfirmeduser({
                "username": response.user.username,
                "email": response.user.email,
                "id": response.user._id,
                "isadmin": response.user.isadmin
              })
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
        setGetting(false);
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

  useEffect(() => {
    const interval = setInterval(() => {
      setNow(Date.now());
    }, 10);
    return () => clearInterval(interval);
  }, []);

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

  // source: https://stackoverflow.com/questions/68617984/long-press-button-in-react
  const [startpress, setStartpress] = useState(null);
  function deleteMouseDown() {
    setStartpress(Date.now());
  }
  function deleteMouseUp() {
    if (startpress && Date.now() - startpress > HOLD_DELAY) {
      setDeleting(true);
    }
    setStartpress(null);
  }
  const elapsed = startpress ? now - startpress : 0;
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
            <button style={{ "background": `linear-gradient(to right, red ${elapsed / HOLD_DELAY * 100}%, blue ${elapsed / HOLD_DELAY * 100}%)` }} onMouseDown={deleteMouseDown} onMouseUp={deleteMouseUp} disabled={deleting} >Confirm</button>
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

function AuthForm({ modToken, modUser, modCreating }) {
  const [candidate, setCandidate] = useState({
    "email": "",
    "password": ""
  });
  const [login, setLogin] = useState(false);
  const [authError, setAuthError] = useState("");
  const [authErrorVisible, setAuthErrorVisible] = useState(false);

  useEffect(() => {
    if (login) {
      // Send login request
      setAuthErrorVisible(false);

      const timeout = setTimeout(() => {
        if (candidate.email.length === 0) {
          changeError("Please provide an email address");
          setLogin(false);
        } else if (candidate.password.length === 0) {
          changeError("Please provide a password");
          setLogin(false);
        } else {
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
                changeErrorCode(response.return);
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
      }, 500);
    }
  }, [login]);

  function changeError(new_error) {
    setAuthErrorVisible(false);

    setTimeout(() => {
      setAuthError(new_error)
      setAuthErrorVisible(true);
    }, 150);
  };

  function changeErrorCode(new_error_code) {
    const errorTxt = (
      (new_error_code === 322501) ? "Server error" :
        (new_error_code === 322502) ? "Database error" :
          (new_error_code === 322503) ? "Authorization missing" :
            (new_error_code === 322504) ? "Invalid request" :
              (new_error_code === 322505) ? "Invalid password" :
                (new_error_code === 322506) ? "Email address already registered" :
                  (new_error_code === 322507) ? "Unknown email address" :
                    (new_error_code === 322508) ? "Unknown user id" :
                      (new_error_code === 322509) ? "Invalid password length" :
                        (new_error_code === 322510) ? "Expired web token" :
                          (new_error_code === 322510) ? "Edition permission missing" :
                            "Failed"
    )

    setAuthErrorVisible(false);

    setTimeout(() => {
      setAuthError(errorTxt)
      setAuthErrorVisible(true);
    }, 150);
  };

  function submitButtonClicked(e) {
    if (!login) {
      setLogin(true);
    }
    e.preventDefault();
  }

  return (
    <>
      <div className="login_page">
        <div className="big_main_title">
          <svg className="big_main_icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><title>account-box</title><path width={24} height={24} fill="#dadada" d="M6,17C6,15 10,13.9 12,13.9C14,13.9 18,15 18,17V18H6M15,9A3,3 0 0,1 12,12A3,3 0 0,1 9,9A3,3 0 0,1 12,6A3,3 0 0,1 15,9M3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V5A2,2 0 0,0 19,3H5C3.89,3 3,3.9 3,5Z" /></svg>
          <div className="big_main_dual">
            <h1>
              users-rest-api
            </h1>
            <h3 className="big_main_subtitle">
              IFT3225 Projet 2
            </h3>
          </div>
        </div>
        <form className="login_box" method='post'>
          <div className="login_titleparagraph">
            <h2 className="login_title">Welcome back</h2>
            <span className="login_paragraph">Don't have an account yet? <a className="login_a_signup" href="#" onClick={() => modCreating(true)}>Sign up</a></span>
          </div>
          <div className="login_labelandinput">
            {/* <label className="login_label">email</label> */}
            <input placeholder="email address" className="login_input" type="text" id="email" onChange={e => {
              setCandidate(prev => {
                return { ...prev, email: e.target.value }
              })
            }}></input>
          </div>
          <div className="login_labelandinput">
            {/* <label className="login_label">password</label> */}
            <input placeholder="password" className="login_input" type="password" id="password" onChange={e => {
              setCandidate(prev => {
                return { ...prev, password: e.target.value }
              })
            }}></input>
          </div>
          <button className="login_button" onClick={e => submitButtonClicked(e)} disabled={login} >{login ? <span className="spinner" /> : "Sign in"}</button>
          <p className={`login_failed_p ${authErrorVisible ? "" : "fade_out"}`}>{authError}</p>
        </form>
      </div>
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

function UserEntry({ user }) {
  const [copyLabel, setCopyLabel] = useState("copy id");

  async function copyId() {
    await navigator.clipboard.writeText(user._id).then(() => {
      setCopyLabel("copied");
    });
  }

  return (
    <>
      <div style={{ margin: "8px", background: "rgba(255, 255, 255, 0.1)" }}>
        <strong>{user.username}</strong> {user.email}
        <br />
        {user._id} <button onClick={copyId}>{copyLabel}</button> {user.isadmin ? "Admin" : "User"}
      </div>
    </>
  )
}

function ShowAllMenu({ token, isAdmin }) {
  const [loading, setLoading] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [users, setUsers] = useState([]);
  const [usersError, setUsersError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    if (!isAdmin) {
      setUsers([]);
      setLoaded(false);
    }

    if (loading) {
      setUsersError("");
      if (isAdmin) {
        fetch("http://localhost:3225/profils", {
          method: "GET",
          headers: {
            'Authorization': token
          }
        })
          .then((response) => response.json())
          .then((response) => {
            if (response.return === 322500) {
              setUsers(response.users);
            } else {
              setUsersError("Failed " + response.return);
            }
          })
          .catch(e =>
            console.log("Error: " + e)
          )
          .then(() => {
            setLoading(false);
          })
      } else {
        setUsersError("you are not an admin")
        setLoading(false);
      }
    }
  }, [loading, isAdmin]);

  function loadAllUsers() {
    setLoading(true);

  }

  return (
    <>
      <div id="asking_overlay">
        <button onClick={loadAllUsers} disabled={loading} >List all users</button>
        <br />
        <small>admin permission needed</small>
        <br />
        <small style={{ "color": "red" }}>{usersError}</small>
      </div>
      <div id="users_table">
        <input type="text" placeholder='Search by id' onChange={(e) => {
          setSearchTerm(e.target.value);
        }}></input>
        {users.map((user, index) => user._id.startsWith(searchTerm) && (
          <UserEntry key={user._id} user={user} />
        )
        )}
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

  if (creating) {
    return (
      <>
        <CreationForm token={token} modEnable={setCreating} />
      </>
    )
  } else if (token) {
    if (deleting) {
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
          <ShowAllMenu token={token} isAdmin={user.isadmin} />
        </>
      )
    }
  } else {
    return (
      <>
        <AuthForm modToken={setToken} modUser={setUser} modCreating={setCreating} />
      </>
    )
  }
}

export default App
