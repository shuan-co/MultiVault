import React from 'react';
import { Link } from 'react-router-dom';

const ErrorPage = ({ code, message, description }) => {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col justify-center items-center">
      <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full text-center">
        <h1 className="text-6xl font-bold text-gray-800 mb-4">{code}</h1>
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">{message}</h2>
        <p className="text-gray-600 mb-6">{description}</p>
        <Link 
          to="/"
          className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded"
        >
          Return Home
        </Link>
      </div>
    </div>
  );
};

export const Error404 = () => (
  <ErrorPage
    code="404"
    message="Page Not Found"
    description="The page you're looking for doesn't exist or has been moved."
  />
);

export const Error403 = () => (
  <ErrorPage
    code="403"
    message="Access Denied"
    description="You don't have permission to access this resource."
  />
);

export const Error500 = () => (
  <ErrorPage
    code="500"
    message="Server Error"
    description="Something went wrong on our end. Please try again later."
  />
);

export default ErrorPage;