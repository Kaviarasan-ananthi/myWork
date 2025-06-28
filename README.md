# my Work
1. Project Architecture & Design Decisions

React Native: Chosen for cross-platform development and strong community support.

React Navigation (@react-navigation/*): Provides flexible and modular navigation, including stack, tab, drawer, and material top tabs.

Redux Toolkit & React Redux: For efficient and scalable state management with reduced boilerplate.

Axios: For handling API requests with interceptors and global configurations.

RNEUI (React Native Elements): Used for prebuilt UI components to speed up development.

React Native Vector Icons: For scalable, customizable icons across platforms.

Image Picker: Simplifies camera and gallery integration.

Snackbar & Safe Area Context: For user feedback and UI safety on notched devices.

Linear Gradient: Used to enhance UI aesthetics with gradient backgrounds.

2. Folder Structure & Architecture
I followed a modular feature-based structure to maintain scalability:
/src
  /components    # Reusable UI components
  /screens       # Individual screens for navigation
  /redux         # Slices, store, and selectors
  /services      # API service logic (using Axios)
  /utils         # Helper functions and constants
  /assets        # Images, fonts, etc.
This separation helps with code reusability, easy testing, and collaboration across teams.

3. Trade-offs / Shortcuts Due to Time
Skipped unit testing for all components due to time constraints.
Used inline styles in some components instead of extracting to StyleSheet.create().
Used basic error handling in API responses; a more comprehensive solution like middleware can be added later.
Used console.log for debugging instead of full logging infrastructure.