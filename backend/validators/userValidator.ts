import * as yup from 'yup';

export const signUpValidator = yup.object().shape({
  email: yup.string().email('Invalid email').required('Email is require'),
  username: yup.string().required('Username is require'),
  password: yup
    .string()
    .required('Password is require')
    .min(6, 'Password must be at least 6 characters long'),
});

export const verifyEmailValidator = yup.object().shape({
  email: yup.string().email('Invalid email').required('Email is require'),
  token: yup.string().required('Token is require'),
});

export const loginValidator = yup.object().shape({
  email: yup.string().email('Invalid email').required('Email is require'),
  password: yup.string().required('Password is require'),
});

export const updateUserValidator = yup.object().shape({
  firstName: yup.string().notRequired(),
  lastName: yup.string().notRequired(),
  bio: yup.string().notRequired(),
  avatarUrl: yup.string().notRequired(),
  password: yup.string().required('Password is require'),
  currentPassword: yup.string().required("Current password is require"),
});
