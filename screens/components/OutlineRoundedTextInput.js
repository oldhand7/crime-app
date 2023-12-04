import React from 'react';
import { StyleSheet, View, Text, TextInput } from 'react-native';

const OutlineRoundedTextInput = (props) => {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>{props.label}</Text>
      <View style={styles.textInputContainer}>
        <TextInput
          style={styles.textInput}
          placeholder={props.placeholder}
          placeholderTextColor={props.placeholderTextColor}
          onChangeText={props.onChangeText}
          value={props.value}
          secureTextEntry={props.secureTextEntry}
          keyboardType={props.keyboardType}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'transparent',
    marginBottom: 20,
  },
  label: {
    color: '#aaa',
    fontSize: 12,
    marginBottom: 5,
  },
  textInputContainer: {
    backgroundColor: 'transparent',
    borderRadius: 50,
    borderWidth: 2,
    borderColor: '#aaa',
    paddingVertical: 5,
    paddingHorizontal: 15,
  },
  textInput: {
    color: '#333',
    fontSize: 16,
  },
});

export default OutlineRoundedTextInput;