import { Control, Controller, FieldErrors } from "react-hook-form";
import { TextInput, Text, View, StyleSheet } from "react-native";
import React from "react";
import { CoinForm } from "@/app/(tabs)/add-coin";

type Names = "name" | "rarity" | "value" | "quantity";

const Input = ({
  name,
  placeholder,
  control,
  errors,
}: {
  name: Names;
  placeholder: string;
  control: Control<CoinForm>;
  errors: FieldErrors<CoinForm>;
}) => {
  return (
    <View>
      <Text>{placeholder}</Text>
      <Controller
        control={control}
        rules={{
          required: true,
        }}
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            style={styles.input}
            placeholder={placeholder}
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
          />
        )}
        name={name}
      />
      {errors.name && <Text>This is required.</Text>}
    </View>
  );
};

export default Input;

const styles = StyleSheet.create({
  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
  },
});
