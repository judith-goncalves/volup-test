import React from "react";
import { Pressable, Text } from "react-native";
import { commonStyles } from "../styles/commonStyles";

interface Props {
  title: string;
  onPress: () => void;
  color?: string;
  textColor?: string;
  closeList?: boolean;
}

const Button: React.FC<Props> = ({
  title,
  onPress,
  color,
  textColor,
  closeList,
}) => (
  <Pressable
    style={[
      closeList ? commonStyles.closeButton : commonStyles.optionsButton,
      { backgroundColor: color || "#0d4565ff" },
    ]}
    onPress={onPress}
  >
    <Text style={[commonStyles.optionsText, { color: textColor || "#fff" }]}>
      {title}
    </Text>
  </Pressable>
);

export default Button;
