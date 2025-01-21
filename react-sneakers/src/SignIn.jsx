import React from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import axios from "axios";
import { useStore } from "./store";

const SignInPage = () => {
  // React Hook Form for handling form state and validation
  const {
    setError, // Used to manually set errors
    register, // Registers input fields for validation
    handleSubmit, // Handles form submission
    formState: { errors }, // Access validation errors
  } = useForm({
    defaultValues: {
      email: '', // Default value for email input
      password: '', // Default value for password input
    },
  });

  const navigate = useNavigate(); // Used for navigation after successful login
  const { setUser, setFavorites, setCart } = useStore(); // Store functions for updating user data

  // Form submission handler
  const onSubmit = (data) => {
    axios.post(`${process.env.REACT_APP_SERVER_URL}/auth/login`, data, {
      withCredentials: true, // Include cookies in the request
    }).then((res) => {
      // On successful login, navigate to the home page and set user data
      navigate('/');
      setUser(res.data.user); // Update user state
      setFavorites(res.data.user.favorite); // Update favorites state
      setCart(res.data.user.cart); // Update cart state
    }).catch((error) => {
      console.log(error); // Log errors to the console
    });
  };

  return (
    <div className="h-screen w-screen flex items-center justify-center">
      {/* Form wrapper */}
      <form
        className="bg-white rounded-xl p-10 relative"
        onSubmit={handleSubmit(onSubmit)} // Use handleSubmit to validate and submit form
      >
        {/* Back button */}
        <div className={'absolute top-5 left-5 text-zinc-400'}>
          <Link to={'/'}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="lucide lucide-chevron-left"
            >
              <path d="m15 18-6-6 6-6" />
            </svg>
          </Link>
        </div>
        {/* Header */}
        <div>
          <h2 className={'text-2xl font-bold mb-1 text-center'}>Sign In</h2>
          <p className={'text-center text-zinc-500 text-md mb-5'}>
            Welcome back!
          </p>
        </div>
        {/* Email input */}
        <div className="flex flex-col mb-3 w-80">
          <label className={'text-zinc-400 font-semibold mb-1 text-sm'}>
            Email
          </label>
          <input
            type="email"
            name="email"
            placeholder="Enter email..."
            {...register('email')} // Register input for validation
          />
        </div>
        {/* Password input */}
        <div className="flex flex-col w-full mb-3">
          <label className={'text-zinc-400 font-semibold mb-1 text-sm'}>
            Password
          </label>
          <input
            type="password"
            name="password"
            placeholder="Enter password..."
            {...register('password')} // Register input for validation
          />
        </div>
        {/* Sign-up link */}
        <div className={'text-center mt-6'}>
          <p className={'text-sm text-zinc-400'}>
            Don`t have account?{' '}
            <Link to={'/SignUp'}>
              <span
                className={
                  'text-sky-500 transition hover:underline cursor-pointer'
                }
              >
                Sign up!
              </span>
            </Link>
          </p>
        </div>
        {/* Submit button */}
        <div className={'w-full'}>
          <button
            type={'submit'}
            className="w-full bg-sky-400 text-white py-3 rounded-lg mt-7 hover:bg-sky-500 transition"
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  );
};

export default SignInPage;

