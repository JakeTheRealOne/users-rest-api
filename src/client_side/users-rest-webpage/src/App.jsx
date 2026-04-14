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
                (code === 322507) ? "Invalid email address" :
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
  const [rgp, setRgp] = useState(false);
  const [errortype, setErrorType] = useState(false);

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
      setTimeout(() => {
        if (!user.email) {
          setErrorType(false);
          changeError("Please provide an email address");
          setCreating(false);
        } else if (!user.password) {
          setErrorType(false);
          changeError("Please provide a password");
          setCreating(false);
        } else if (!user.username) {
          setErrorType(false);
          changeError("Please provide a username");
          setCreating(false);
        } else {
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
                const registered_email = user.email || "user";
                setUser({
                  "email": "",
                  "username": "",
                  "password": "",
                  "isadmin": false,
                });
                setFormKey(formKey + 1); // Clear the form
                setErrorType(true);
                changeError(registered_email + " successfully created");
              } else {
                setErrorType(false);
                changeErrorCode(response.return);
              }
            })
            .catch((err) => {
              console.log("Error: " + err);
              if (err.message.includes("NetworkError")) {
                setErrorType(false);
                changeError("Network error");
              } else {
                setErrorType(false);
                changeError("Error");
              }
            })
            .then(() => {
              setCreating(false);
            })
        }
      }, 500);
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
            <h2 className="creation_title">User creation form</h2>
            <span className="login_paragraph">This form insert a new user into the database.</span>
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
          {/* <button className="cancel_button" onClick={e => gobackButtonClicked(e)} disabled={creating || generating} >Go back to documentation</button> */}
          <p className={`login_note_p ${errortype ? "login_success_p" : "login_failed_p"} ${creatingErrorVisible ? "" : "fade_out"}`}>{creatingError}</p>
        </form>
      </div>
    </>
  )
}

function SignupForm({ token, modToken, modUser, modEnable }) {
  const [user, setUser] = useState({
    "email": "",
    "username": "",
    "password": "",
    "isadmin": false,
  });
  const [authing, setAuthing] = useState(false);
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
              const candidate = {
                "email": user.email,
                "password": user.password
              }
              return fetch("http://localhost:3225/connexion", {
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
                    modEnable(false);
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
                });
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
            <h2 className="login_title">Create your account</h2>
            <span className="login_paragraph">This form signs you up by inserting a new user into the database.</span>
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
          <button className="green_login_button" onClick={e => submitButtonClicked(e)} disabled={creating || generating} >{creating ? <span className="green_spinner" /> : "Sign up"}</button>
          <button className="cancel_button" onClick={e => gobackButtonClicked(e)} disabled={creating || generating} >Cancel</button>
          <p className={`login_note_p login_failed_p ${creatingErrorVisible ? "" : "fade_out"}`}>{creatingError}</p>
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
  const [holding, setHolding] = useState(false);
  const [deletingError, setDeletingError] = useState("");
  const [deletingErrorVisible, setDeletingErrorVisible] = useState(false);
  const [errortype, setErrorType] = useState(false);
  const [formKey, setFormKey] = useState(0);
  const [now, setNow] = useState(Date.now());
  const HOLD_DELAY = 1000; // 1sec
  const COMPLISH_DELAY = 50; // 50ms (for completion feeling)

  useEffect(() => {
    if (getting) {
      // Get user informations for deletion confirmation
      setDeletingErrorVisible(false);
      setTimeout(() => {
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
                setErrorType(false);
                changeErrorCode(response.return);
              }
            })
            .catch((err) => {
              console.log("Error: " + err);
              setErrorType(false);
              if (err.message.includes("NetworkError")) {
                changeError("Network error");
              } else {
                changeError("Error");
              }
            })
            .then(() => {
              setGetting(false);
            });
        } else {
          changeError("Please provide an id");
          setGetting(false);
        }
      }, 500);
    }

    if (deleting) {
      // Send deletion request
      setDeletingErrorVisible(false);

      setTimeout(() => {
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
                setErrorType(true);
                changeError("User deleted successfully");
              } else {
                setErrorType(false);
                changeErrorCode(response.return);
              }
            })
            .catch((err) => {
              console.log("Error: " + err);
              setErrorType(false);
              if (err.message.includes("NetworkError")) {
                changeError("Network error");
              } else {
                changeError("Error");
              }
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
        } else {
          changeError("Please provide an id");
          setGetting(false);
        }
      }, 500);
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

  function changeError(new_error) {
    setDeletingErrorVisible(false);

    setTimeout(() => {
      setDeletingError(new_error)
      setDeletingErrorVisible(true);
    }, 150);
  };

  function changeErrorCode(new_error_code) {
    const errorTxt = getErrorMessage(new_error_code)

    setDeletingErrorVisible(false);

    setTimeout(() => {
      setDeletingError(errorTxt)
      setDeletingErrorVisible(true);
    }, 150);
  };

  function gobackButtonClicked(e) {
    modEnable(false);
  }

  function cancelButtonClicked(e) {
    setHolding(false);
    setDeleting(false);
    setGetting(false);
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
    setHolding(true);
  }
  function deleteMouseUp() {
    setHolding(false);
    if (startpress && Date.now() - startpress > (HOLD_DELAY + COMPLISH_DELAY)) {
      setDeleting(true);
    }
    setStartpress(null);
  }
  const elapsed = startpress ? now - startpress : 0;
  if (isAdmin) {
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
          <form method='post' className="creation_box" key={formKey}>
            <div className="login_titleparagraph">
              <h2 className="creation_title">User deletion form</h2>
              <span className="login_paragraph">This form remove a user from the database.</span>
            </div>
            <div className="login_labelandinput">
              <label className="login_label">id</label>
              <input className="creation_input" placeholder="69dc1..." type="text" id="id" onChange={e => {
                setUser(prev => {
                  return { ...prev, id: e.target.value }
                })
              }}></input>
            </div>
            <button className="red_login_button" onClick={e => submitButtonClicked(e)} disabled={getting || deleting || holding} >{getting ? <span className="red_spinner" /> : "Delete"}</button>
            {/* <button onClick={e => gobackButtonClicked(e)} disabled={getting} >Go Back</button> */}
            <p className={`login_note_p ${errortype ? "login_success_p" : "login_failed_p"} ${deletingErrorVisible ? "" : "fade_out"}`}>{deletingError}</p>
          </form>
          {confirmeduser.email &&
            <div className="confirm_popup_overall">
              <div className="confirm_popup">
                <span className="login_paragraph">You are about to delete the user:</span>
                <UserBox user={confirmeduser}></UserBox>
                <button className={`red_login_button`} style={{ "background": `linear-gradient(to right, #73133d ${elapsed / HOLD_DELAY * 100}%, #2d0e19 ${elapsed / HOLD_DELAY * 100}%)` }} onMouseDown={deleteMouseDown} onMouseLeave={deleteMouseUp} onMouseUp={deleteMouseUp} disabled={deleting || getting} >{deleting ? <span className="red_spinner" /> : <p className={`${holding ? "trembling" : ""}`}>{holding ? "Hold" : "Confirm"}</p>}</button>
                <button className="nevermind_button" onClick={e => cancelButtonClicked(e)} disabled={deleting} >Cancel</button>
              </div>
            </div>
          }
        </div>
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
          <p className={`${authErrorVisible ? "" : "fade_out"} login_failed_p login_note_p`}>{authError}</p>
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

function UIcon({ admin, big }) {
  return (
    <>
      <div className={`uicon ${admin ? "admin_uicon" : "user_uicon"} ${big ? "big_uicon" : "small_uicon"}`}>
        {/* {admin ? } */}
        {admin ?
          <svg xmlns="http://www.w3.org/2000/svg" strokeWidth={0.5} style={{ "margin": "24px" }} viewBox="0 0 24 24"><path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z" /></svg> :
          <svg xmlns="http://www.w3.org/2000/svg" strokeWidth={0.5} style={{ "margin": "20px" }} viewBox="0 0 24 24"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
        }

      </div>
    </>
  )
}

function UType({ admin }) {
  return (
    <>
      <div className={`utype ${admin ? "admin_utype" : "user_utype"}`}>
        {admin ? "admin" : "user"}
      </div>
    </>
  )
}

function UserBox({ user }) {
  return (
    <>
      <div className="user_box">
        <UIcon admin={user.isadmin} big={true} ></ UIcon>
        <div className="dual_popup_del">
          <p className="strong_label">{user.username}</p>
          <UType admin={user.isadmin}></UType>
        </div>
        <p className="weak_label">{user.email}</p>
        {/* <strong>ID: </strong> {user.id}
        <strong>Is admin: </strong> {String(user.isadmin)} */}
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
  const [signuping, setSignuping] = useState(false);
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

  if (signuping) {
    return (
      <>
        <SignupForm token={token} modToken={setToken} modEnable={setSignuping} modUser={setUser} />
      </>
    )
  } else if (token) {
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
          <ShowAllMenu token={token} isAdmin={user.isadmin} />
        </>
      )
    }
  } else {
    return (
      <>
        <AuthForm modToken={setToken} modUser={setUser} modCreating={setSignuping} />
      </>
    )
  }
}

export default App
