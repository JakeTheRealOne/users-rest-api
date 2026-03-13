import { useEffect, useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import heroImg from './assets/hero.png'
import './App.css'

// function App() {
//   const [count, setCount] = useState(0)

//   return (
//     <>
//       <section id="center">
//         <div className="hero">
//           <img src={heroImg} className="base" width="170" height="179" alt="" />
//           <img src={reactLogo} className="framework" alt="React logo" />
//           <img src={viteLogo} className="vite" alt="Vite logo" />
//         </div>
//         <div>
//           <h1>Get started</h1>
//           <p>
//             Edit <code>src/App.jsx</code> and save to test <code>HMR</code>
//           </p>
//         </div>
//         <button
//           className="counter"
//           onClick={() => setCount((count) => count + 1)}
//         >
//           Count is {count}
//         </button>
//       </section>

//       <div className="ticks"></div>

//       <section id="next-steps">
//         <div id="docs">
//           <svg className="icon" role="presentation" aria-hidden="true">
//             <use href="/icons.svg#documentation-icon"></use>
//           </svg>
//           <h2>Documentation</h2>
//           <p>Your questions, answered</p>
//           <ul>
//             <li>
//               <a href="https://vite.dev/" target="_blank">
//                 <img className="logo" src={viteLogo} alt="" />
//                 Explore Vite
//               </a>
//             </li>
//             <li>
//               <a href="https://react.dev/" target="_blank">
//                 <img className="button-icon" src={reactLogo} alt="" />
//                 Learn more
//               </a>
//             </li>
//           </ul>
//         </div>
//         <div id="social">
//           <svg className="icon" role="presentation" aria-hidden="true">
//             <use href="/icons.svg#social-icon"></use>
//           </svg>
//           <h2>Connect with us</h2>
//           <p>Join the Vite community</p>
//           <ul>
//             <li>
//               <a href="https://github.com/vitejs/vite" target="_blank">
//                 <svg
//                   className="button-icon"
//                   role="presentation"
//                   aria-hidden="true"
//                 >
//                   <use href="/icons.svg#github-icon"></use>
//                 </svg>
//                 GitHub
//               </a>
//             </li>
//             <li>
//               <a href="https://chat.vite.dev/" target="_blank">
//                 <svg
//                   className="button-icon"
//                   role="presentation"
//                   aria-hidden="true"
//                 >
//                   <use href="/icons.svg#discord-icon"></use>
//                 </svg>
//                 Discord
//               </a>
//             </li>
//             <li>
//               <a href="https://x.com/vite_js" target="_blank">
//                 <svg
//                   className="button-icon"
//                   role="presentation"
//                   aria-hidden="true"
//                 >
//                   <use href="/icons.svg#x-icon"></use>
//                 </svg>
//                 X.com
//               </a>
//             </li>
//             <li>
//               <a href="https://bsky.app/profile/vite.dev" target="_blank">
//                 <svg
//                   className="button-icon"
//                   role="presentation"
//                   aria-hidden="true"
//                 >
//                   <use href="/icons.svg#bluesky-icon"></use>
//                 </svg>
//                 Bluesky
//               </a>
//             </li>
//           </ul>
//         </div>
//       </section>

//       <div className="ticks"></div>
//       <section id="spacer"></section>
//     </>
//   )
// }

function FormAuth({ modToken }) {
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
          } else {
            setAuthError("failed " + response.return);
          }
          setLogin(false);
        })
        .catch((err) => {
          console.log("err: " + err);
          setLogin(false);
        });
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

function App() {
  const [token, setToken] = useState(localStorage.getItem('jwt-token'));
  const [user, setUser] = useState({
    "email": "",
    "username": "",
    "id": ""
  });

  function logOut() {
    setToken(null);
  }

  if (token) {
    return (
      <>
        <h1>Home page</h1>
        <p>If you are seeing this, you are successfull connected as {user.email}</p>
        <p>token: {token}</p>
        <button onClick={logOut}>Log out</button>
      </>
    )
  } else {
    return (
      <>
        <FormAuth modToken={setToken} />
      </>
    )
  }
}

export default App
