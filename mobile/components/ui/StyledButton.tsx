import React from 'react';
import {
  Pressable,
  Text,
  StyleSheet,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { Colors, Radius, FontSize, FontWeight } from '@/constants/theme';

interface StyledButtonProps {
  onPress?: () => void;
  title: string;
  loading?: boolean;
  disabled?: boolean;
  variant?: 'primary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  style?: ViewStyle;
}

const StyledButton: React.FC<StyledButtonProps> = ({
  onPress,
  title,
  loading = false,
  disabled = false,
  variant = 'primary',
  size = 'md',
  style,
}) => {
  const isDisabled = disabled || loading;

  return (
    <Pressable
      onPress={onPress}
      disabled={isDisabled}
      style={({ pressed }) => [
        styles.base,
        styles[variant],
        styles[`size_${size}` as keyof typeof styles],
        pressed && styles.pressed,
        isDisabled && styles.disabled,
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator
          size="small"
          color={variant === 'primary' ? Colors.bg : Colors.text}
        />
      ) : (
        <Text style={[styles.label, styles[`label_${variant}` as keyof typeof styles], styles[`labelSize_${size}` as keyof typeof styles]]}>
          {title}
        </Text>
      )}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  base: {
    borderRadius: Radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  primary: {
    backgroundColor: Colors.accent,
  },
  ghost: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  danger: {
    backgroundColor: Colors.errorBg,
    borderWidth: 1,
    borderColor: Colors.errorBorder,
  },
  size_sm: { paddingVertical: 8, paddingHorizontal: 14, height: 36 },
  size_md: { paddingVertical: 11, paddingHorizontal: 18, height: 44 },
  size_lg: { paddingVertical: 14, paddingHorizontal: 22, height: 52 },
  pressed: { opacity: 0.75 },
  disabled: { opacity: 0.4 },
  label: {
    fontWeight: FontWeight.semibold,
  },
  label_primary: { color: Colors.bg },
  label_ghost: { color: Colors.text },
  label_danger: { color: Colors.error },
  labelSize_sm: { fontSize: FontSize.xs },
  labelSize_md: { fontSize: FontSize.sm },
  labelSize_lg: { fontSize: FontSize.base },
});

export default StyledButton;
