import {useState, useRef} from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {  createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../firebase_files/config';

import { formatEmailToId } from "../../redux/reducers/dataReducer";
 
export default function LoginSignup(){
    const navigate = useNavigate();
 
    const [email, setEmail] = useState('rihanna@gmail.com')
    const [password, setPassword] = useState('rihanna');
    const [isSignupPage, setIsSignupPage] = useState(false);
    const emailInputRef = useRef();
    const passwordInputRef = useRef();

    function handleSignin(e){
        e.preventDefault();
        signInWithEmailAndPassword(auth, emailInputRef.current.value, passwordInputRef.current.value)
        .then((userCredential) => {
            // Signed in
            // console.log("signed in")
            const user = userCredential.user;
            //chatApp todo set session user details
            navigate("/chatApp/home");
            console.log("signed in user", user.email);
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            console.log("LOGINSIGNUP",errorCode, errorMessage)
        });
        
    }

    async function handleSignup(e){
        e.preventDefault();
        await createUserWithEmailAndPassword(auth, emailInputRef.current.value, passwordInputRef.current.value)
        .then((userCredential) => {
            // Signed in
            // console.log("signed up")

            // "beyonce" : {
            //     id : "beyonce",
            //     img : url+"/images/artist2.webp",
            //     user_name : "Beyonce",
            //     is_online : false,
            //     conversations_duo : [],
            //     conversations_groups : ["convo_gid1"],
            //     friends : ["taylorswift","rihanna", "edsheeran", "katyperry"]
            // }

            //chatApp todo collect username and photo too and add user to  firestore with intial data 
            // id is mailid
            const user = userCredential.user;
            console.log(user, "email", user.email);
            const user_id = formatEmailToId(user.email)
            const user_data = {
                id : user_id,
                img: "",
                user_name: "",
                is_online: false,
                conversations_duo : [],
                conversations_groups : [],
                friends : ["taylorswift","rihanna", "edsheeran", "katyperry"]
            }

            setIsSignupPage(false);
            // navigate("/login")xw
            // ...
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            console.log("LOGINSIGNUP",errorCode, errorMessage);
            // ..
        });
    }

 
 
   
 
  return (
    <div className='Signup'>                                                                                        
        <form onSubmit={(e) => {isSignupPage ? handleSignup(e) : handleSignin(e)}}>                                                                                            
            <label htmlFor="email-address">Email address</label>
            <input
                type="email"
                id="email-address"
                label="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}  
                ref={emailInputRef}
                required                                    
                placeholder="Email address"                                
            />
            <label htmlFor="password">Password</label>
            <input
                type="password"
                label="Create password"
                id='password'
                value={password}
                onChange={(e) => setPassword(e.target.value)} 
                ref={passwordInputRef}
                required                                 
                placeholder="Password"              
            />                                           
            
            { isSignupPage ? <button type="submit"> Sign up </button> : 
                <button type="submit"> Sign in </button>
            }

        </form>
    
        { <p> {!isSignupPage ? "Don't" : "Already"} have an account?&nbsp;&nbsp;
        <NavLink onClick={() => setIsSignupPage(!isSignupPage)}>
        {!isSignupPage ? "Sign Up" : "Sign In"} 
        </NavLink></p>}            
    </div>
  )
}