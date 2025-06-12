import React from 'react';
import { ScrollView } from 'react-native';
import { NativeGesture } from 'react-native-gesture-handler';
import { SharedValue } from 'react-native-reanimated';
interface ScrollViewContainerContextData {
    scrollViewContainerRef: React.RefObject<ScrollView>;
    scrollViewPageY: SharedValue<number>;
    scrollViewHeightY: SharedValue<number>;
    scrollViewScrollOffsetY: SharedValue<number>;
    scrollViewScrollEnabledProp: SharedValue<boolean>;
    scrollViewCurrentScrollEnabled: SharedValue<boolean>;
    outerScrollGesture: NativeGesture;
}
export declare const ScrollViewContainerContext: React.Context<ScrollViewContainerContextData | undefined>;
export {};
//# sourceMappingURL=ScrollViewContainerContext.d.ts.map