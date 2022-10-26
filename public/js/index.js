/* eslint-disable */
import '@babel/polyfill';
import { showAlert } from './alert';
import { displayMap } from './mapbox';
import { login, logout, signup } from './login';
import { updateSettings } from './updateSetting';
import { bookTour } from './stripe';
//dom element
const mapBox = document.getElementById('map');
const loginForm = document.querySelector('.form--login');
const signupForm = document.querySelector('.form--signup');
const logOutBtn = document.querySelector('.nav__el--logout');
const userDataForm = document.querySelector('.form-user-data');
const userPasswordForm = document.querySelector('.form-user-password');
const bookBtn = document.getElementById('book-tour');
//delegation
if (mapBox) {
  const locations = JSON.parse(mapBox.dataset.locations);
  displayMap(locations);
}

if (loginForm) {
  loginForm.addEventListener('submit', e => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    login(email, password);
  });
}
if (logOutBtn) logOutBtn.addEventListener('click', logout, false);

if (userDataForm) {
  userDataForm.addEventListener('submit', async e => {
    e.preventDefault();
    document.querySelector('.btn--save-settings').textContent = 'Updating...'
    const form = new FormData();
    form.append('name', document.getElementById('name').value);
    form.append('email', document.getElementById('email').value);
    form.append('photo', document.getElementById('photo').files[0]);
    await updateSettings(form, 'data');
    document.querySelector('.btn--save-settings').textContent = 'Save settings'
    location.reload(true)
  });
}
if (userPasswordForm) {
  userPasswordForm.addEventListener('submit', async e => {
    e.preventDefault();
    document.querySelector('.btn--save-password').textContent = 'Updating...';
    const passwordCurrent = document.getElementById('password-current').value;
    const password = document.getElementById('password').value;
    const passwordConfirm = document.getElementById('password-confirm').value;
    if (passwordCurrent === password) {
      showAlert('error', 'Password is not same');
      return;
    }
    await updateSettings(
      { passwordCurrent, password, passwordConfirm },
      'password'
    );
    document.querySelector('.btn--save-password').textContent = 'Save Password';
    userPasswordForm.reset();
  });
}
//bookBtn response dataset
if (bookBtn) {
  bookBtn.addEventListener('click', e => {
    e.target.textContent = 'Processing...';
    const { tourId } = e.target.dataset;
    bookTour(tourId);
  });
}
//signup
if (signupForm) {
  signupForm.addEventListener('submit', async e => {
    e.preventDefault();
    const name1 = document.getElementById('name1').value;
    const email1 = document.getElementById('email1').value;
    const password1 = document.getElementById('password1').value;
    const password2 = document.getElementById('password2').value;
    await signup(name1, email1, password1, password2);
    console.log(name1, email1, password1, password2);
  });
}

