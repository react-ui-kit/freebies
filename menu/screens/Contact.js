import React from 'react';
import { Block, Text } from 'expo-ui-kit';

export default ({ style }) => {
  return (
    <Block
      color="#41D5FB"
      style={{
        alignItems: 'center',
        justifyContent: 'center',
        ...style,
      }}>
      <Text h3 center>
        Contact me at
      </Text>
      <Text bold>contact@react-ui-kit.com</Text>
    </Block>
  );
};
