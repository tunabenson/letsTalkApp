
# LetsTalk App

Welcome to the LetsTalk app! This guide will help you set up and run the project on your local machine.

## Prerequisites

Before you begin, ensure you have the following installed:
- Node.js (Download [here](https://nodejs.org/))
- Expo CLI (`npm install -g expo-cli`)
     or if using MacOS install locally:
```bash
cd letsTalkApp/LetsTalk
npm i expo-cli
```

## Setup

Follow these steps to get your development environment set up:

1. **Clone the Repository**
   ```bash
   git clone https://github.com/tunabenson/letsTalkApp.git
   cd letsTalkApp/LetsTalk
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Firebase Configuration**
   - The app requires a Firebase configuration to connect to Firebase services.
   - You will receive an error related to Firebase connection on initial startup.
   - To resolve this, please email `katz.ofek23@gmail.com` to request the Firebase configuration file.
   - Once you receive the configuration, paste it into the `LetsTalk/api/firebaseConfig.js` file in the project directory.

4. **Start the Application**
   ```bash
   npx expo start
   ```
   This command will start the Expo developer tools in console.

## Running the App

Once you start the application with Expo, you can:
- **Run on iOS Simulator/Android Emulator**: Click on `Run on iOS simulator` or `Run on Android emulator` in the Expo developer tools.
- **Run on Your Device**: Scan the QR code with the Expo Go app (available in the App Store and Google Play) on your iOS or Android device.

## Troubleshooting

If you encounter any issues during installation or running the app, please check the following:
- Ensure your Node.js and Expo CLI versions are up to date.
- Verify that the `firebaseConfig.js` file is correctly set up with the configuration you received by email.

For further help, feel free to contact the project maintainers at `katz.ofek23@gmail.com`.

## Contributing

We welcome contributions to the LetsTalk App. Please feel free to fork the repository, make changes, and submit pull requests.

Thank you for contributing to the LetsTalk App development!
