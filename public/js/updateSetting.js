/* eslint-disable */
import { showAlert } from './alert';
import axios from 'axios';

//export const update DataUser
export const updateSettings = async (data , type) => {
  try {
    const url = type === "password" ? "http://localhost:3000/api/v1/users/updateMyPassword" 
    : "http://localhost:3000/api/v1/users/updateMe";
    const res = await axios({
      method: 'PATCH',
      url,
      data
    });
    if (res.data.status === 'success') {
      showAlert('success', `${type.toLowerCase()} update success`);
      // location.reload(true) 
    }
  } catch (err) {
    console.log(err.response);
    showAlert('error', 'login failed, please try again');
  }
};
