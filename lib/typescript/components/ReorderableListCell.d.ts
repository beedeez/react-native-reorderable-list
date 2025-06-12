import React from 'react';
import { CellRendererProps } from 'react-native';
import { SharedValue } from 'react-native-reanimated';
interface ReorderableListCellProps<T> extends Omit<CellRendererProps<T>, 'cellKey'> {
    startDrag: (index: number) => void;
    itemOffset: SharedValue<number[]>;
    itemHeight: SharedValue<number[]>;
    dragY: SharedValue<number>;
    draggedIndex: SharedValue<number>;
    animationDuration: SharedValue<number>;
}
export declare const ReorderableListCell: React.MemoExoticComponent<(<T>({ index, startDrag, children, onLayout, itemOffset, itemHeight, dragY, draggedIndex, animationDuration, }: ReorderableListCellProps<T>) => React.JSX.Element)>;
export {};
//# sourceMappingURL=ReorderableListCell.d.ts.map