/* eslint-disable */
import {showAlert} from './alert';
import axios from 'axios';
export const login = async (email,password) => {
    console.log(email,password);
    try{
        const res = await axios({
            method: 'POST',
            url: 'http://localhost:3000/api/v1/users/login',
            data: {
                email,
                password
            }
        });
        if (res.data.status === 'success') {
            showAlert('success', 'Logged in successfully!');
            window.setTimeout(() => {
              location.assign('/');
            }, 1500);
        }
    }
    catch(err) {
        showAlert('error', err.response.data.message);
     }
  };
  // exports func logout
export const logout = async () => {
    try{
        const res = await axios({
            method: 'GET',
            url: 'http://localhost:3000/api/v1/users/logout',
        });
       if((res.data.status = "success")) location.reload(true) 
       showAlert('success', 'logout success');
    }
    catch(err) {
        showAlert('error', 'login failed, please try again');
     }
}
//const signup
export const signup = async (name,email,password,passwordConfirm) => {
    try{
        const res = await axios({
            method: 'POST',
            url: 'http://localhost:3000/api/v1/users/signup',
            data: {
                name,
                email,
                password,
                passwordConfirm
            }
        });
        if (res.data.status === 'success') {
            showAlert('success', 'Signup success');
            window.setTimeout(() => {
              location.assign('/');
            }, 1500);
        }
    }
    catch(err) {
        showAlert('error', err.response.data.message);
     }
}
