import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import Option from '../../components/utility/Option'; 
import SettingsHandler from './SettingsHandler'; 

const SettingsPage = () => {
  return (
    <ScrollView className="flex-1 bg-lightblue-500">
      {/* Profile Settings */}
      <View className='mt-10 p-3'></View>
      <Option 
        style="p-2 mt-2 flex-row bg-white rounded-xl border border-b-4 border-red-600 "
        handler={SettingsHandler.handleEditProfile}
        icon={<FontAwesome name="user" size={24} color="gray" />}
        text="Edit Profile"
        textStyle="text-gray-600 text-xl font-semibold ml-2"
      />
      <Option 
        style="p-2 mt-2 flex-row bg-white rounded-xl border border-b-4 border-red-600 "
        handler={SettingsHandler.handleAccountManagement}
        icon={<FontAwesome name="gear" size={24} color="gray" />}
        text="Account Management"
        textStyle="text-gray-600 text-xl font-semibold ml-2"
      />

      {/* Notifications */}
      <Option 
        style="p-2 mt-2 flex-row bg-white rounded-xl border border-b-4 border-red-600 "
        handler={SettingsHandler.handlePushNotifications}
        icon={<FontAwesome name="bell" size={24} color="gray" />}
        text="Push Notifications"
        textStyle="text-gray-600 text-xl font-semibold ml-2"
      />
      <Option 
        style="p-2 mt-2 flex-row bg-white rounded-xl border border-b-4 border-red-600 "
        handler={SettingsHandler.handleEmailNotifications}
        icon={<FontAwesome name="envelope" size={24} color="gray" />}
        text="Email Notifications"
        textStyle="text-gray-600 text-xl font-semibold ml-2"
      />

      {/* Privacy and Security */}
      <Option 
        style="p-2 mt-2 flex-row bg-white rounded-xl border border-b-4 border-red-600 "
        handler={SettingsHandler.handleBlockList}
        icon={<FontAwesome name="ban" size={24} color="gray" />}
        text="Block List"
        textStyle="text-gray-600 text-xl font-semibold ml-2"
      />
      <Option 
        style="p-2 mt-2 flex-row bg-white rounded-xl border border-b-4 border-red-600 "
        handler={SettingsHandler.handlePrivacyControls}
        icon={<FontAwesome name="lock" size={24} color="gray" />}
        text="Privacy Controls"
        textStyle="text-gray-600 text-xl font-semibold ml-2"
      />

      {/* Communication Preferences */}
      <Option 
        style="p-2 mt-2 flex-row bg-white rounded-xl border border-b-4 border-red-600 "
        handler={SettingsHandler.handleMessagingSettings}
        icon={<FontAwesome name="comments" size={24} color="gray" />}
        text="Messaging Settings"
        textStyle="text-gray-600 text-xl font-semibold ml-2"
      />
      <Option 
        style="p-2 mt-2 flex-row bg-white rounded-xl border border-b-4 border-red-600 "
        handler={SettingsHandler.handleLanguage}
        icon={<FontAwesome name="globe" size={24} color="gray" />}
        text="Language"
        textStyle="text-gray-600 text-xl font-semibold ml-2"
      />

      {/* Accessibility */}
      <Option 
        style="p-2 mt-2 flex-row bg-white rounded-xl border border-b-4 border-red-600 "
        handler={SettingsHandler.handleTextSize}
        icon={<FontAwesome name="text-height" size={24} color="gray" />}
        text="Text Size"
        textStyle="text-gray-600 text-xl font-semibold ml-2"
      />
      <Option 
        style="p-2 mt-2 flex-row bg-white rounded-xl border border-b-4 border-red-600 "
        handler={SettingsHandler.handleContrastModes}
        icon={<FontAwesome name="adjust" size={24} color="gray" />}
        text="Contrast Modes"
        textStyle="text-gray-600 text-xl font-semibold ml-2"
      />

      {/* App Information */}
      <Option 
        style="p-2 mt-2 flex-row bg-white rounded-xl border border-b-4 border-red-600 "
        handler={SettingsHandler.handleHelpSupport}
        icon={<FontAwesome name="info-circle" size={24} color="gray" />}
        text="Help/Support"
        textStyle="text-gray-600 text-xl font-semibold ml-2"
      />
      <Option 
        style="p-2 mt-2 flex-row bg-white rounded-xl border border-b-4 border-red-600 "
        handler={SettingsHandler.handleAbout}
        icon={<FontAwesome name="book" size={24} color="gray" />}
        text="About"
        textStyle="text-gray-600 text-xl font-semibold ml-2"
      />

      {/* Themes and Customization */}
      <Option 
        style="p-2 mt-2 flex-row bg-white rounded-xl border border-b-4 border-red-600 "
        handler={SettingsHandler.handleSignOut}
        icon={<FontAwesome name="sign-out" size={24} color="gray" />}
        text="Sign Out"
        textStyle="text-gray-600 text-xl font-semibold ml-2"
      />
    </ScrollView>
  );
};

export default SettingsPage;
