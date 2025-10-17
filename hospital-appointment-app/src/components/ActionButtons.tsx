import React from "react";
import { View } from "react-native";
import { commonStyles } from "../styles/commonStyles";
import Button from "./Button";

interface Props {
  onBack: () => void;
  onNext: () => void;
  backLabel?: string;
  nextLabel?: string;
  backColor?: string;
  nextColor?: string;
  backTextColor?: string;
  nextTextColor?: string;
}

const ActionButtons: React.FC<Props> = ({
  onBack,
  onNext,
  backLabel = "Go Back",
  nextLabel = "Next",
  backColor,
  nextColor,
  backTextColor = "#FFF",
  nextTextColor = "#FFF",
}) => {
  return (
    <View style={commonStyles.buttonRow}>
      <Button
        title={backLabel}
        onPress={onBack}
        color={backColor || "#373232ff"}
        textColor={backTextColor}
      />
      <Button
        title={nextLabel}
        onPress={onNext}
        color={nextColor || "#182f48ff"}
        textColor={nextTextColor}
      />
    </View>
  );
};

export default ActionButtons;
