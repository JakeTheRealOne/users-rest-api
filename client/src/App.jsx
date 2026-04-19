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
  const [creatingError, setCreatingError] = useState(" ");
  const [creatingErrorVisible, setCreatingErrorVisible] = useState(false);
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
        <div className="login_page">
          <div className="creation_box">
            <div className="login_titleparagraph">
              <h2 className="creation_title">User deletion form</h2>
              <div className="deletion_admin_dual">
                <svg className="admin_error_svg" xmlns="http://www.w3.org/2000/svg" strokeWidth={2} style={{ "margin": `4px` }} viewBox="0 0 24 24"><path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z" /></svg>
                <span className="deletion_admin_paragraph">missing admin permission</span>
              </div>
            </div>
          </div>
        </div>
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

function UserDropMenu({ user }) {
  return (
    <>
      <div className="user_dropmenu">
        <UIcon admin={user.isadmin} big={false} />
        <p className="udm_label">{user.username}</p>
        {/* <strong>Username: </strong> {user.username}
        <strong>Email: </strong> {user.email}
        <strong>ID: </strong> {user.id}
        <strong>Is admin: </strong> {String(user.isadmin)} */}
        {/* <button onClick={logOut}>Log out</button> */}
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
          <svg xmlns="http://www.w3.org/2000/svg" strokeWidth={0.5} style={{ "margin": `${big ? '24px' : '16%'}` }} viewBox="0 0 24 24"><path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z" /></svg> :
          <svg xmlns="http://www.w3.org/2000/svg" strokeWidth={0.5} style={{ "margin": `${big ? '20px' : '16%'}` }} viewBox="0 0 24 24"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
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

function UserEntry({ user, searchLength }) {
  const [copyLabel, setCopyLabel] = useState("copy id");
  const [copy, setCopy] = useState(false);

  async function copyId() {
    await navigator.clipboard.writeText(user._id).then(() => {
      setCopyLabel("copied");
    });
  }

  return (
    <>
      <div className="user_entry" onMouseEnter={() => { setCopy(true) }} onMouseLeave={() => { setCopy(false); setCopyLabel("copy id") }}>
        <UIcon admin={user.isadmin} big={false} />
        <div className="tripial_entry">
          <div className="dual_entry">
            <UType admin={user.isadmin}></UType> <strong>{user.username}</strong> {user.email}
          </div>
          <div className="dual_entry">
            <span className="id_text">
              <strong>{user._id.slice(0, searchLength)}</strong>
              {user._id.slice(searchLength)}
            </span>
            <button className="copy_button" onClick={copyId}>{copy &&
              <>
                {(copyLabel === "copy id") &&
                  <svg className="copy_svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path d="M192 0c-35.3 0-64 28.7-64 64l0 256c0 35.3 28.7 64 64 64l192 0c35.3 0 64-28.7 64-64l0-200.6c0-17.4-7.1-34.1-19.7-46.2L370.6 17.8C358.7 6.4 342.8 0 326.3 0L192 0zM64 128c-35.3 0-64 28.7-64 64L0 448c0 35.3 28.7 64 64 64l192 0c35.3 0 64-28.7 64-64l0-16-64 0 0 16-192 0 0-256 16 0 0-64-16 0z" /></svg>
                }
                {(copyLabel === "copied") &&
                  <svg className="green_copy_svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path d="M434.8 70.1c14.3 10.4 17.5 30.4 7.1 44.7l-256 352c-5.5 7.6-14 12.3-23.4 13.1s-18.5-2.7-25.1-9.3l-128-128c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0l101.5 101.5 234-321.7c10.4-14.3 30.4-17.5 44.7-7.1z" /></svg>
                }
              </>
            }</button>
          </div>
        </div>
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
      setTimeout(() => {
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
          setUsersError("You are not an admin")
          setLoading(false);
        }
      }, 500);
    }
  }, [loading, isAdmin]);

  function loadAllUsers() {
    setLoading(true);

  }

  return (
    <>
      <div className="login_page">
        <div className="creation_box">
          <div className="login_titleparagraph">
            <h2 className="creation_title"></h2>
            <button className="login_button" onClick={loadAllUsers} disabled={loading || !isAdmin} >{loading ? <span className="spinner" /> : (Object.keys(users).length > 0) ? "Reload the list" : "List all users"}</button>
            {!isAdmin && <div className="deletion_admin_dual">
              <svg className="admin_error_svg" xmlns="http://www.w3.org/2000/svg" strokeWidth={2} style={{ "margin": `4px` }} viewBox="0 0 24 24"><path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z" /></svg>
              <span className="deletion_admin_paragraph">missing admin permission</span>
            </div>}
            {isAdmin && <input className={`search_input ${(Object.keys(users).length > 0) ? "" : "fade_out"}`} type="text" placeholder='Search by id' onChange={(e) => {
              setSearchTerm(e.target.value);
            }}></input>}
          </div>
          <div id="users_table">
            <p className="login_note_p login_failed_p">{usersError}</p>
            {users.map((user, index) => user._id.startsWith(searchTerm) && (
              <UserEntry key={user._id} user={user} searchLength={searchTerm.length} />
            )
            )}
          </div>
        </div>
      </div>
    </>
  )
}

function Documentation({isAdmin}) {
  return (
    <>
      <div className="_page">
        <div className="docu_page">
          <h1 className="documentation_title">Documentation</h1>
          <p className="documentation_paragraph"><strong>USERS-REST-API</strong> is an app developed with the MERN stack to offer basic CRUD operations for a user database. Its database is freely hosted on mongodb.com. The context of this project is the course IFT3225 "Technologie de l'Internet" at Université de Montréal.</p>
          <div className="route_summary">
            <h1 className="documentation_title2">Endpoints</h1>
            <h2 className="documentation_subtitle"><p className="method_box">GET</p> /motdepasse/{"{"}length{"}"}</h2>
            <p className="documentation_paragraph">Generate an alphanumerical random password of a given length</p>
            <p className="curl_box">curl http://localhost:3225/motdepasse/10 --header "Content-Type: application/json" --request GET</p>
            <p className="documentation_paragraph">Return {"{"}return: number, password: string{"}"}</p>
          </div>
          <div className="route_summary">
            <h2 className="documentation_subtitle"><p className="method_box">POST</p> /profils</h2>
            <p className="documentation_paragraph">Insert a new user in the database</p>
            <p className="curl_box">curl http://localhost:3225/profils --header "Content-Type: application/json" --request POST -d '{"{"}"email": "axel.seguin@umontreal.ca", "password": "abc123", "username": "axel", "isadmin": true{"}"}'</p>
            <p className="documentation_paragraph">Body {"{"}email: string, username: string, password: string, isadmin: boolean{"}"}</p>
            <p className="documentation_paragraph">Return {"{"}return: number{"}"}</p>
          </div>
          <div className="route_summary">
            <h2 className="documentation_subtitle"><p className="method_box">POST</p> /connexion</h2>
            <p className="documentation_paragraph">Retrieve a web token for the account</p>
            <p className="curl_box">curl http://localhost:3225/connexion --header "Content-Type: application/json" --request POST -d '{"{"}"email": "axel.seguin@umontreal.ca", "password": "abc123"{"}"}'</p>
            <p className="documentation_paragraph">Body {"{"}email: string, password: string{"}"}</p>
            <p className="documentation_paragraph">Return {"{"}return: number, id: string, token: string{"}"}</p>
            <p className="documentation_paragraph">Note that the token returned by this request has to be used for all the requests below, we suggest you to store it in the <strong>$token</strong> variable for all those curl commands.</p>
          </div>
          <div className="route_summary">
            <h2 className="documentation_subtitle"><p className="method_box">GET</p> /self</h2>
            <p className="documentation_paragraph">Retrieve my id</p>
            <p className="curl_box">curl http://localhost:3225/self --header "Authorization: <strong>$token</strong>" --header "Content-Type: application/json" --request GET</p>
            <p className="documentation_paragraph">Return {"{"}return: number, id: string{"}"}</p>
          </div>
          {isAdmin && <div className="route_summary">
            <h2 className="documentation_subtitle"><p className="method_box">DELETE</p> /profils/{"{"}id{"}"}</h2>
            <p className="documentation_paragraph">Delete a user from the database with its id</p>
            <p className="curl_box">curl http://localhost:3225/profils/69e3e4ce147de6a8ec51a87a --header "Authorization: <strong>$token</strong>" --header "Content-Type: application/json" --request DELETE</p>
            <p className="documentation_paragraph">Return {"{"}return: number{"}"}</p>
            <p className="documentation_paragraph">Only an administrator can execute this request</p>
          </div>}
          <div className="route_summary">
            <h2 className="documentation_subtitle"><p className="method_box">GET</p> /profils/{"{"}id{"}"}</h2>
            <p className="documentation_paragraph">Get a user information from the database with its id</p>
            <p className="curl_box">curl http://localhost:3225/profils/69e3e4ce147de6a8ec51a87a --header "Authorization: <strong>$token</strong>" --header "Content-Type: application/json" --request GET</p>
            <p className="documentation_paragraph">Return {"{"}return: number, user: {"{"}email: string, username: string, isadmin: boolean, _id: string, created: Date, lastmodified: Date{"}"}{"}"}</p>
            <p className="documentation_paragraph">Only yourself or an administrator can execute this request</p>
          </div>
          {isAdmin && <div className="route_summary">
            <h2 className="documentation_subtitle"><p className="method_box">GET</p> /profils</h2>
            <p className="documentation_paragraph">Get all user information from the database</p>
            <p className="curl_box">curl http://localhost:3225/profils --header "Authorization: <strong>$token</strong>" --header "Content-Type: application/json" --request GET</p>
            <p className="documentation_paragraph">Return {"{"}return: number, users: Array{"}"}</p>
            <p className="documentation_paragraph">Only an administrator can execute this request</p>
          </div>}
          <div className="route_summary">
            <h2 className="documentation_subtitle"><p className="method_box">PUT</p> /profils/{"{"}id{"}"}</h2>
            <p className="documentation_paragraph">Edit user information in the database</p>
            <p className="curl_box">curl http://localhost:3225/profils/69e3e97f147de6a8ec51a88e --header "Authorization: <strong>$token</strong>" --header "Content-Type: application/json" --request PUT -d '{"}"}"username": "axelS"{"}"}'</p>
            <p className="documentation_paragraph">Body {"{"}email?: string, username?: string, isadmin?: boolean{"}"}</p>
            <p className="documentation_paragraph">Return {"{"}return: number{"}"}</p>
            <p className="documentation_paragraph">Only yourself or an administrator can execute this request</p>
          </div>
          <h1 className="documentation_title2 extra_margin">Return codes</h1>
          <p className="documentation_paragraph">Every API response has a return field precising if the request was a success or the kind of error that occured.</p>
          <table>
            <thead>
              <tr>
                <th>Code</th>
                <th>Description</th>
              </tr>
            </thead>
            <tbody><tr>
              <td>322500</td>
              <td>Success</td>
            </tr>
              <tr>
                <td>322501</td>
                <td>Server internal error</td>
              </tr>
              <tr>
                <td>322502</td>
                <td>Database internal error</td>
              </tr>
              <tr>
                <td>322503</td>
                <td>Not authorized</td>
              </tr>
              <tr>
                <td>322504</td>
                <td>Bad json input</td>
              </tr>
              <tr>
                <td>322505</td>
                <td>Invalid password</td>
              </tr>
              <tr>
                <td>322506</td>
                <td>Email already registered</td>
              </tr>
              <tr>
                <td>322507</td>
                <td>Invalid email</td>
              </tr>
              <tr>
                <td>322508</td>
                <td>Unkown user id</td>
              </tr>
              <tr>
                <td>322509</td>
                <td>Password length should be between 1 and 60</td>
              </tr>
              <tr>
                <td>322510</td>
                <td>Invalid web token</td>
              </tr>
              <tr>
                <td>322511</td>
                <td>Only a user may change its informations</td>
              </tr>
            </tbody></table>
          <div className="github_div">
            <svg xmlns="http://www.w3.org/2000/svg" className="github_svg" viewBox="0 0 24 24"><title>github</title><path fill="#fff" d="M12,2A10,10 0 0,0 2,12C2,16.42 4.87,20.17 8.84,21.5C9.34,21.58 9.5,21.27 9.5,21C9.5,20.77 9.5,20.14 9.5,19.31C6.73,19.91 6.14,17.97 6.14,17.97C5.68,16.81 5.03,16.5 5.03,16.5C4.12,15.88 5.1,15.9 5.1,15.9C6.1,15.97 6.63,16.93 6.63,16.93C7.5,18.45 8.97,18 9.54,17.76C9.63,17.11 9.89,16.67 10.17,16.42C7.95,16.17 5.62,15.31 5.62,11.5C5.62,10.39 6,9.5 6.65,8.79C6.55,8.54 6.2,7.5 6.75,6.15C6.75,6.15 7.59,5.88 9.5,7.17C10.29,6.95 11.15,6.84 12,6.84C12.85,6.84 13.71,6.95 14.5,7.17C16.41,5.88 17.25,6.15 17.25,6.15C17.8,7.5 17.45,8.54 17.35,8.79C18,9.5 18.38,10.39 18.38,11.5C18.38,15.32 16.04,16.16 13.81,16.41C14.17,16.72 14.5,17.33 14.5,18.26C14.5,19.6 14.5,20.68 14.5,21C14.5,21.27 14.66,21.59 15.17,21.5C19.14,20.16 22,16.42 22,12A10,10 0 0,0 12,2Z" /></svg>
            <a className="login_a_signup" href="https://github.com/JakeTheRealOne/users-rest-api">Also available on GitHub</a>
          </div>
          <div className="spacer"></div>
        </div>
      </div>
    </>
  )
}

function TopBar({ user, logOut, documentation, setDocumentation, creating, setCreating, deleting, setDeleting, editing, setEditing, showingall, setShowingall }) {
  function showDocumentation() {
    setDocumentation(true)
    setCreating(false)
    setDeleting(false)
    setEditing(false)
    setShowingall(false)
  }

  function showCreation() {
    setDocumentation(false)
    setCreating(true)
    setDeleting(false)
    setEditing(false)
    setShowingall(false)
  }

  function showDeletion() {
    setDocumentation(false)
    setCreating(false)
    setDeleting(true)
    setEditing(false)
    setShowingall(false)
  }

  function showEdition() {
    setDocumentation(false)
    setCreating(false)
    setDeleting(false)
    setEditing(true)
    setShowingall(false)
  }

  function showShowall() {
    setDocumentation(false)
    setCreating(false)
    setDeleting(false)
    setEditing(false)
    setShowingall(true)
  }

  return (
    <>
      <div className="top_bar">
        <div className="big_main_title">
          <svg className="big_main_icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><title>account-box</title><path width={24} height={24} fill="#dadada" d="M6,17C6,15 10,13.9 12,13.9C14,13.9 18,15 18,17V18H6M15,9A3,3 0 0,1 12,12A3,3 0 0,1 9,9A3,3 0 0,1 12,6A3,3 0 0,1 15,9M3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V5A2,2 0 0,0 19,3H5C3.89,3 3,3.9 3,5Z" /></svg>
          <div className="big_main_dual">
            <h1 className="big_main_h1">
              users-rest-api
            </h1>
            <h3 className="big_main_subtitle">
              IFT3225 Projet 2
            </h3>
          </div>
        </div>
        <div className="nav_box">
          <p className={`nav ${documentation ? "selected_nav" : "unselected_nav"}`} onClick={showDocumentation}>Documentation</p>
          <p className={`nav ${creating ? "selected_nav" : "unselected_nav"}`} onClick={showCreation}>Creation form</p>
          <p className={`nav ${deleting ? "selected_nav" : "unselected_nav"}`} onClick={showDeletion}>Deletion form</p>
          <p className={`nav ${showingall ? "selected_nav" : "unselected_nav"}`} onClick={showShowall}>Show all users</p>
        </div>

        <div className="dropdown">
          <button className="dropbtn"><UserDropMenu user={user} /></button>

          <div className="dropdown-content">
            <button className="option" onClick={showEdition}>
              <svg xmlns="http://www.w3.org/2000/svg" className="option_svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" stroke-linejoin="round"><path d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z" /><path d="m15 5 4 4" /></svg>
              Profile</button>
            <button className="option red_option" onClick={logOut}>
              <svg xmlns="http://www.w3.org/2000/svg" className="red_svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m16 17 5-5-5-5" /><path d="M21 12H9" /><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /></svg> Log out</button>
          </div>
        </div>
      </div>
    </>
  )
}

function AccountMenu({ token, user, setUser }) {
  const [newuser, setNewUser] = useState({
    "email": user.email,
    "username": user.username,
    "isadmin": user.isadmin,
    "password": user.password
  });
  const [editing, setEditing] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [changes, setChanges] = useState(false);
  const [editingError, setEditingError] = useState("");
  const [editingErrorVisible, setEditingErrorVisible] = useState("");
  const [pwTooltip, setPwTooltip] = useState(false);
  const [pwLength, setPWLength] = useState(15);
  const [rgp, setRgp] = useState(false);
  const [errortype, setErrorType] = useState(false);

  useEffect(() => {
    if (generating) {
      setEditingErrorVisible(false);
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
              setNewUser(prev => ({ ...prev, "password": response.password }));
              setRgp(true);
              setPwTooltip(false);
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
            setGenerating(false);
          })
      }, 500);
    }

    if (editing) {
      setEditingErrorVisible(false);
      setTimeout(() => {
        fetch("http://localhost:3225/profils/" + user.id, {
          method: "PUT",
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': token
          },
          body: JSON.stringify(newuser)
        })
          .then((response) => response.json())
          .then((response) => {
            if (response.return === 322500) {
              setUser(prev => {
                return { ...prev, email: newuser.email, username: newuser.username, isadmin: newuser.isadmin }
              })
              setErrorType(true);
              changeError("User information successfully edited");
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
            setEditing(false);
          })
      }, 500);
    }
  }, [editing, generating]);

  function changeError(new_error) {
    setEditingErrorVisible(false);

    setTimeout(() => {
      setEditingError(new_error)
      setEditingErrorVisible(true);
    }, 150);
  };

  function changeErrorCode(new_error_code) {
    const errorTxt = getErrorMessage(new_error_code)

    setEditingErrorVisible(false);

    setTimeout(() => {
      setEditingError(errorTxt)
      setEditingErrorVisible(true);
    }, 150);
  };

  function showRandomTooltip(e) {
    setPwTooltip(!pwTooltip)
    e.preventDefault();
  }

  function generateButtonClicked(e) {
    console.log("generating");
    setGenerating(true);
    e.preventDefault();
  }


  function edit() {
    if (changes) {
      setEditing(true);
    }
  }


  return (
    <>
      <div className="am_page">
        <div className="am_box">
          <div className="am_div">
            <div className="am_icondiv">
              <UIcon admin={newuser.isadmin} big={true} />
              {/* <label className="login_label">administrator</label> */}

              <label className="admin_switch">
                <input className="admin_checkbox" type="checkbox" id="isadmin" checked={newuser.isadmin} onChange={() => {
                  setChanges(true)
                  setNewUser(prev => {
                    return { ...prev, isadmin: !prev.isadmin }
                  })
                }} disabled={editing}></input>
                <span className="slider round"></span>
              </label>
            </div>
            <div className="am_inputdiv">
              <div className="login_labelandinput">
                {/* <label className="login_label">id</label> */}
                <input className="editing_id_input" type="text" id="id" value={user.id} disabled={true}></input>
              </div>
              <div className="login_labelandinput">
                <label className="login_label">username</label>
                <input className="editing_input" type="text" id="amusername" value={newuser.username} onChange={e => {
                  setChanges(true)
                  setNewUser(prev => {
                    return { ...prev, username: e.target.value }
                  })
                }} disabled={editing}></input>
              </div>
              <div className="login_labelandinput">
                <label className="login_label">email</label>
                <input className="editing_input" type="text" id="amemail" value={newuser.email} onChange={e => {
                  setChanges(true)
                  setNewUser(prev => {
                    return { ...prev, email: e.target.value }
                  })
                }} disabled={editing}></input>
              </div>
              <div className="login_labelandinput">
                <label className="login_label">password</label>
                <div className="editing_pw_input">
                  <input className="inner_pw_input" disabled={editing} value={newuser.password} placeholder="a strong one" type={rgp ? "text" : "password"} id="ampassword" onChange={e => {
                    setChanges(true)
                    setRgp(false);
                    setNewUser(prev => {
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
                            disabled={editing}
                          />
                          <label className="pw_value">{pwLength}</label>
                        </div>
                        <button className="gen_button" onClick={e => {
                          generateButtonClicked(e)
                        }} disabled={editing || generating}>{generating ? <span className="spinner" /> : "Generate"}</button>

                        {/* caret */}
                        <div className="tooltip-arrow-outline" />
                        <div className="tooltip-arrow" />
                      </div>
                    )}

                    <button disabled={editing} className="dice_btn" onClick={e => showRandomTooltip(e)} >
                      <svg className="dice_svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M141.4 2.3C103-8 63.5 14.8 53.3 53.2L2.5 242.7C-7.8 281.1 15 320.6 53.4 330.9l189.5 50.8c38.4 10.3 77.9-12.5 88.2-50.9l50.8-189.5c10.3-38.4-12.5-77.9-50.9-88.2L141.4 2.3zm23 205.7a32 32 0 1 1 55.4-32 32 32 0 1 1 -55.4 32zM79.2 220.3a32 32 0 1 1 32 55.4 32 32 0 1 1 -32-55.4zm185 96.4a32 32 0 1 1 -32-55.4 32 32 0 1 1 32 55.4zm9-208.4a32 32 0 1 1 32 55.4 32 32 0 1 1 -32-55.4zm-121 14.4a32 32 0 1 1 -32-55.4 32 32 0 1 1 32 55.4zM418 192L377.4 343.2c-17.2 64-83 102-147 84.9l-38.3-10.3 0 30.2c0 35.3 28.7 64 64 64l192 0c35.3 0 64-28.7 64-64l0-192c0-35.3-28.7-64-64-64L418 192z" /></svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <button className="green_login_button" onClick={edit} disabled={!changes || editing} >{editing ? <span className="green_spinner" /> : "Confirm changes"}</button>
          <p className={`login_note_p ${errortype ? "login_success_p" : "login_failed_p"} ${editingErrorVisible ? "" : "fade_out"}`}>{editingError}</p>
        </div>
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
  const [editing, setEditing] = useState(false);
  const [showingall, setShowingall] = useState(false);
  const [documentation, setDocumentation] = useState(true);

  useEffect(() => {
    document.title = "Users REST API";
  }, []);

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
    return (
      <>
        <div className="home_div">
          <TopBar user={user} logOut={logOut} documentation={documentation} creating={creating} deleting={deleting} showingall={showingall} editing={editing} setDocumentation={setDocumentation} setDeleting={setDeleting} setCreating={setCreating} setEditing={setEditing} setShowingall={setShowingall} />
          {documentation &&
            <Documentation isAdmin={user.isadmin} />
          }
          {creating &&
            <CreationForm token={token} modEnable={setCreating} />
          }
          {deleting &&
            <DeletionForm modEnable={setDeleting} token={token} isAdmin={user.isadmin} />
          }
          {showingall &&
            <ShowAllMenu token={token} isAdmin={user.isadmin} />
          }
          {editing &&
            <AccountMenu token={token} user={user} setUser={setUser} />
          }
        </div>
      </>
    )
  } else {
    return (
      <>
        <AuthForm modToken={setToken} modUser={setUser} modCreating={setSignuping} />
      </>
    )
  }
}

export default App
