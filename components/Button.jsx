import React from "react";
import { Button as Rnebutton } from "@rneui/themed";

const Button = ({ onPress, title  }) => {
    return (
        <Rnebutton 
            title={title}
            buttonStyle={{
                backgroundColor:'#ffb703',
                borderRadius: 20,
              }}
               
              onPress={onPress}
            />
    )
  }

  export default Button