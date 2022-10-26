/* eslint-disable */

// hide alert element
export const hideAlert = () => {
    const alert = document.querySelector('.alert');
    if (alert) {
        alert.remove();
    }
};

// create showAlert function have type "success" and "error"
export const showAlert = (type, message) => {
    hideAlert();
    const markup = `<div class="alert alert--${type}">${message}</div>`;
    document.querySelector('body').insertAdjacentHTML('afterbegin', markup);
    window.setTimeout(hideAlert,5000);
}