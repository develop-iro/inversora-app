import { LinearGradient } from 'expo-linear-gradient';
import { cssInterop } from 'nativewind';
import { Image } from 'react-native';

/**
 * Registers third-party primitives so `className` maps to `style`.
 * Avoid `Pressable` here — it breaks function-style press feedback when combined
 * with dynamic background colors (e.g. HomeStarterCard).
 */
cssInterop(Image, { className: 'style' });
cssInterop(LinearGradient, { className: 'style' });