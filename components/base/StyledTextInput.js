import React from "react";
import { View, TextInput, StyleSheet, Text } from "react-native";
import { Controller } from "react-hook-form";

const StyledTextInput = ({
  rules = {},
  name,
  control,
  placeholder,
  secureTextEntry,
  numberOfLines,
  multiline,
}) => {
  return (
    <Controller
      control={control}
      name={name}
      rules={rules}
      render={({
        field: { value, onChange, onBlur },
        fieldState: { error },
      }) => (
        <>
          <View
            style={[
              styles.container,
              { borderColor: error ? "red" : "#e8e8e8" },
            ]}
          >
            <TextInput
              placeholder={placeholder}
              value={value}
              onBlur={onBlur}
              onChangeText={onChange}
              multiline={multiline}
              style={styles.input}
              numberOfLines={numberOfLines | 1}
              secureTextEntry={secureTextEntry}
            />
          </View>
          {error && (
            <Text style={{ color: "red", alignSelf: "stretch" }}>
              {error.message || "Error"}
            </Text>
          )}
        </>
      )}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    width: "100%",
    borderColor: "#e8e8e8",
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 10,
    marginVertical: 5,
  },
  input: {
    height: 40,
  },
});

export default StyledTextInput;
