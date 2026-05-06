# FreeAPI Auth

A simple authentication application that integrates with the [FreeAPI](https://freeapi.app) user management system. This app provides user registration, login, profile viewing, and logout functionality.

## Features

- User registration with username, email, password, and role selection
- User login with username and password
- View user profile information
- Secure logout functionality
- Automatic session management and authentication status checking
- Responsive UI with Tailwind CSS
- Loading states and error handling


## Project Structure

```
Auth-App/
├── index.html      # Main HTML file with UI structure
├── api.js          # API service layer for FreeAPI integration
├── app.js          # Application logic and UI management
└── README.md       # This file
```


## API Endpoints Used

This app uses the following FreeAPI endpoints:

- `POST /users/register` - Register new user
- `POST /users/login` - Authenticate user
- `POST /users/logout` - End user session
- `GET /users/current-user` - Fetch authenticated user info

## How It Works

1. **Authentication State**: On page load, the app checks if a user session exists using the `getCurrentUser()` API call
2. **Login/Register**: Forms capture user credentials and send them to the FreeAPI via the API service layer
3. **Session Management**: The FreeAPI uses cookies to maintain sessions. The `credentials: 'include'` option ensures cookies are sent with requests
4. **UI Updates**: Based on authentication state, the app shows either login, register, or profile views

