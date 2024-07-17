import { signOut } from "firebase/auth";
import { auth } from "../../api/firebaseConfig";

const SettingsHandler = {
    handleEditProfile: () => {
      console.log("Edit Profile Clicked");
    },
    handleAccountManagement: () => {
      console.log("Account Management Clicked");
    },
    handlePushNotifications: () => {
      console.log("Push Notifications Clicked");
    },
    handleEmailNotifications: () => {
      console.log("Email Notifications Clicked");
    },
    handleBlockList: () => {
      console.log("Block List Clicked");
    },
    handlePrivacyControls: () => {
      console.log("Privacy Controls Clicked");
    },
    handleMessagingSettings: () => {
      console.log("Messaging Settings Clicked");
    },
    handleLanguage: () => {
      console.log("Language Clicked");
    },
    handleTextSize: () => {
      console.log("Text Size Clicked");
    },
    handleContrastModes: () => {
      console.log("Contrast Modes Clicked");
    },
    handleHelpSupport: () => {
      console.log("Help/Support Clicked");
    },
    handleAbout: () => {
      console.log("About Clicked");
    },
    handleColorThemes: () => {
      console.log("Color Themes Clicked");
    },
    handleSignOut: () => {
      signOut(auth);
    }
  };
  
  export default SettingsHandler;
  