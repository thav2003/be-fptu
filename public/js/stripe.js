/* eslint-disable */
import {showAlert} from './alert';
import axios from 'axios';
export const bookTour = async (tourId) => {
    const stripe = Stripe('pk_test_51KYSCuDkmaL7GnZZPqsOgnTImn5BKAHx88XYS9t5tiWeIUkuKzGqyogl0zg8VzHxtKmZVvWCqffb4GPxfydp06PV00HAVvUcT2');
    try {
        // 1) Get checkout session from API
        const session = await axios(`http://localhost:3000/api/v1/bookings/checkout-session/${tourId}`);
        console.log(session);
        // 2) Create checkout form + charge credit card
        await stripe.redirectToCheckout({
        sessionId: session.data.session.id
        });
    } catch (err) {
        console.log(err);
        showAlert('error', err);
    }
};