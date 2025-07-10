import * as yup from 'yup';

export const signUpValidator = yup.object().shape({
  email: yup.string().email('Invalid email').required('Email is require'),
  username: yup.string().required('Username is require'),
  password: yup
    .string()
    .required('Password is require')
    .min(6, 'Password must be at least 6 characters long'),
});
