import React from 'react';
import { FlatList, ScrollView } from 'react-native';
import { NativeGesture } from 'react-native-gesture-handler';
import { SharedValue } from 'react-native-reanimated';
import { ReorderableListProps } from '../types';
interface ReorderableListCoreProps<T> extends ReorderableListProps<T> {
    scrollViewContainerRef: React.RefObject<ScrollView> | undefined;
    scrollViewPageY: SharedValue<number> | undefined;
    scrollViewHeightY: SharedValue<number> | undefined;
    scrollViewScrollOffsetY: SharedValue<number> | undefined;
    scrollViewScrollEnabledProp: SharedValue<boolean> | undefined;
    scrollViewCurrentScrollEnabled: SharedValue<boolean> | undefined;
    outerScrollGesture: NativeGesture | undefined;
    scrollable: boolean | undefined;
}
declare const MemoizedReorderableListCore: <T>(props: ReorderableListCoreProps<T> & {
    ref?: React.ForwardedRef<FlatList<T> | null> | undefined;
}) => React.ReactElement;
export { MemoizedReorderableListCore as ReorderableListCore };
//# sourceMappingURL=ReorderableListCore.d.ts.map