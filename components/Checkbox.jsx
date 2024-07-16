import React from "react";
import { Pressable } from "react-native";
import { Ionicons } from '@expo/vector-icons';

const CheckBox = ({ onChange, checked  }) => {
    return (
      <Pressable
        checked={value}
        onPress={onChange}
      >
        {checked && <Ionicons name="checkmark" size={24} color="black" />}
      </Pressable>
    )
  }

  export default CheckBox