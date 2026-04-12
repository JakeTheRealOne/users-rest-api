import { useEffect, useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import heroImg from './assets/hero.png'
import './App.css'

function getErrorMessage(code) {
  return (
    (code === 322501) ? "Server error" :
      (code === 322502) ? "Database error" :
        (code === 322503) ? "Authorization missing" :
          (code === 322504) ? "Invalid request" :
            (code === 322505) ? "Invalid password" :
              (code === 322506) ? "Email address already registered" :
                (code === 322507) ? "Unknown email address" :
                  (code === 322508) ? "Unknown user id" :
                    (code === 322509) ? "Invalid password length" :
                      (code === 322510) ? "Expired web token" :
                        (code === 322510) ? "Edition permission missing" :
                          "Failed"
  )
}

function CreationForm({ token, modEnable }) {
  const [user, setUser] = useState({
    "email": "",
    "username": "",
    "password": "",
    "isadmin": false,
  });
  const [creating, setCreating] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [creatingError, setCreatingError] = useState("");
  const [creatingErrorVisible, setCreatingErrorVisible] = useState("");
  const [formKey, setFormKey] = useState(0);
  const [pwTooltip, setPwTooltip] = useState(false);
  const [pwLength, setPWLength] = useState(15);
  const [rgp, setRgp] = useState(false)

  useEffect(() => {
    if (generating) {
      setCreatingErrorVisible(false);
      setTimeout(() => {
        console.log("pw: " + pwLength);
        fetch("http://localhost:3225/motdepasse/" + pwLength, {
          method: "GET",
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          }
        })
          .then((response) => response.json())
          .then((response) => {
            if (response.return === 322500) {
              setUser(prev => ({ ...prev, "password": response.password }));
              setRgp(true);
              setPwTooltip(false);
            } else {
              changeErrorCode(response.return);
            }
          })
          .catch((err) => {
            console.log("Error: " + err);
            if (err.message.includes("NetworkError")) {
              changeError("Network error");
            } else {
              changeError("Error");
            }
          })
          .then(() => {
            setGenerating(false);
          })
      }, 500);
    }

    if (creating) {
      // Send login request
      setCreatingErrorVisible(false);
      // setCreatingError("");
      setTimeout(() =>
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
              changeErrorCode(response.return);
            }
          })
          .catch((err) => {
            console.log("Error: " + err);
            if (err.message.includes("NetworkError")) {
              changeError("Network error");
            } else {
              changeError("Error");
            }
          })
          .then(() => {
            setCreating(false);
          }), 500);
    }
  }, [creating, generating]);

  function changeError(new_error) {
    setCreatingErrorVisible(false);

    setTimeout(() => {
      setCreatingError(new_error)
      setCreatingErrorVisible(true);
    }, 150);
  };

  function changeErrorCode(new_error_code) {
    const errorTxt = getErrorMessage(new_error_code)

    setCreatingErrorVisible(false);

    setTimeout(() => {
      setCreatingError(errorTxt)
      setCreatingErrorVisible(true);
    }, 150);
  };

  function submitButtonClicked(e) {
    if (!creating) {
      setCreating(true);
    }
    e.preventDefault();
  }

  function showRandomTooltip(e) {
    setPwTooltip(!pwTooltip)
    e.preventDefault();
  }

  function gobackButtonClicked(e) {
    modEnable(false);
  }

  function generateButtonClicked(e) {
    console.log("generating");
    setGenerating(true);
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

        <form className="creation_box" method='post' key={formKey}>
          <div className="login_titleparagraph">
            <h2 className="login_title">User creation form</h2>
            {/* <span className="login_paragraph">Create a user with this form</span> */}
          </div>
          <div className="login_labelandinput">
            <label className="login_label">username</label>
            <input className="creation_input" placeholder="craig" type="text" id="username" onChange={e => {
              setUser(prev => {
                return { ...prev, username: e.target.value }
              })
            }}></input>
          </div>
          <div className="login_labelandinput">
            <label className="login_label">email</label>
            <input className="creation_input" placeholder="craig@example.com" type="text" id="email" onChange={e => {
              setUser(prev => {
                return { ...prev, email: e.target.value }
              })
            }}></input>
          </div>
          <div className="login_labelandinput">
            <label className="login_label">password</label>
            <div className="creation_pw_input">
              <input className="inner_pw_input" value={user.password} placeholder="a strong one" type={rgp ? "text" : "password"} id="password" onChange={e => {
                setRgp(false);
                setUser(prev => {
                  return { ...prev, password: e.target.value }
                })
              }}></input>
              <div className="wrapper">
                {pwTooltip && (
                  <div className="tooltip">
                    <label className="pw_title">random password</label>
                    <div className="pw_range_box">
                      <input
                        type="range"
                        min="1" max="60"
                        value={pwLength}
                        onChange={(e) => setPWLength(e.target.value)}
                      />
                      <label className="pw_value">{pwLength}</label>
                    </div>
                    <button className="gen_button" onClick={e => {
                      generateButtonClicked(e)
                    }} disabled={creating || generating}>{generating ? <span className="spinner" /> : "Generate"}</button>

                    {/* caret */}
                    <div className="tooltip-arrow-outline" />
                    <div className="tooltip-arrow" />
                  </div>
                )}

                {/* Target div */}
                <button className="dice_btn" onClick={e => showRandomTooltip(e)} >
                  <svg className="dice_svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M141.4 2.3C103-8 63.5 14.8 53.3 53.2L2.5 242.7C-7.8 281.1 15 320.6 53.4 330.9l189.5 50.8c38.4 10.3 77.9-12.5 88.2-50.9l50.8-189.5c10.3-38.4-12.5-77.9-50.9-88.2L141.4 2.3zm23 205.7a32 32 0 1 1 55.4-32 32 32 0 1 1 -55.4 32zM79.2 220.3a32 32 0 1 1 32 55.4 32 32 0 1 1 -32-55.4zm185 96.4a32 32 0 1 1 -32-55.4 32 32 0 1 1 32 55.4zm9-208.4a32 32 0 1 1 32 55.4 32 32 0 1 1 -32-55.4zm-121 14.4a32 32 0 1 1 -32-55.4 32 32 0 1 1 32 55.4zM418 192L377.4 343.2c-17.2 64-83 102-147 84.9l-38.3-10.3 0 30.2c0 35.3 28.7 64 64 64l192 0c35.3 0 64-28.7 64-64l0-192c0-35.3-28.7-64-64-64L418 192z" /></svg>
                </button>
              </div>
              {/* <button className="dice_btn" onClick={e => showRandomTooltip(e)} >
                <svg className="dice_svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M141.4 2.3C103-8 63.5 14.8 53.3 53.2L2.5 242.7C-7.8 281.1 15 320.6 53.4 330.9l189.5 50.8c38.4 10.3 77.9-12.5 88.2-50.9l50.8-189.5c10.3-38.4-12.5-77.9-50.9-88.2L141.4 2.3zm23 205.7a32 32 0 1 1 55.4-32 32 32 0 1 1 -55.4 32zM79.2 220.3a32 32 0 1 1 32 55.4 32 32 0 1 1 -32-55.4zm185 96.4a32 32 0 1 1 -32-55.4 32 32 0 1 1 32 55.4zm9-208.4a32 32 0 1 1 32 55.4 32 32 0 1 1 -32-55.4zm-121 14.4a32 32 0 1 1 -32-55.4 32 32 0 1 1 32 55.4zM418 192L377.4 343.2c-17.2 64-83 102-147 84.9l-38.3-10.3 0 30.2c0 35.3 28.7 64 64 64l192 0c35.3 0 64-28.7 64-64l0-192c0-35.3-28.7-64-64-64L418 192z" /></svg>
              </button> */}
            </div>
          </div>
          <div className="admincheck_box">
            <label className="login_label">administrator</label>

            <label className="admin_switch">
              <input className="admin_checkbox" type="checkbox" id="isadmin" onChange={e => {
                setUser(prev => {
                  return { ...prev, isadmin: e.target.value === "on" }
                })
              }}></input>
              <span className="slider round"></span>
            </label>


          </div>
          <button className="login_button" onClick={e => submitButtonClicked(e)} disabled={creating || generating} >{creating ? <span className="spinner" /> : "Create"}</button>
          <button className="cancel_button" onClick={e => gobackButtonClicked(e)} disabled={creating || generating} >Cancel</button>
          <p className={`login_failed_p ${creatingErrorVisible ? "" : "fade_out"}`}>{creatingError}</p>
        </form>
      </div>
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

      setTimeout(() => {
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
              if (err.message.includes("NetworkError")) {
                changeError("Network error");
              } else {
                changeError("Error");
              }
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
    const errorTxt = getErrorMessage(new_error_code)

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
