import React from 'react';
import { View } from 'react-native';

const BiasBar = ({ biasEvaluation }) => {

  const { left, center, right } = biasEvaluation;

  const total = left + center + right;
  const leftPercentage = (left / total) * 100;
  const centralPercentage = (center / total) * 100;
  const rightPercentage = (right / total) * 100;

  return (
    <View className="absolute right-3 bottom-24 flex-row h-3 rounded-sm overflow-hidden border border-black w-1/3 ">
      <View style={{ flex: leftPercentage }} className="bg-blue-500" />
      <View style={{ flex: centralPercentage }} className="bg-white" />
      <View style={{ flex: rightPercentage }} className="bg-red-500" />
    </View>
  );
};

export default BiasBar;
