function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
import React, { forwardRef } from 'react';
import { ReorderableListCore } from './ReorderableListCore';
import { ScrollViewContainerContext } from '../contexts';
import { useContext } from '../hooks';
const NestedReorderableListWithRef = ({
  scrollable,
  ...rest
}, ref) => {
  const {
    scrollViewContainerRef,
    scrollViewScrollOffsetY,
    scrollViewPageY,
    scrollViewHeightY,
    scrollViewScrollEnabledProp,
    scrollViewCurrentScrollEnabled,
    outerScrollGesture
  } = useContext(ScrollViewContainerContext);
  return /*#__PURE__*/React.createElement(ReorderableListCore, _extends({}, rest, {
    ref: ref,
    scrollViewContainerRef: scrollViewContainerRef,
    scrollViewScrollOffsetY: scrollViewScrollOffsetY,
    scrollViewPageY: scrollViewPageY,
    scrollViewHeightY: scrollViewHeightY,
    outerScrollGesture: outerScrollGesture,
    scrollViewScrollEnabledProp: scrollViewScrollEnabledProp,
    scrollViewCurrentScrollEnabled: scrollViewCurrentScrollEnabled,
    scrollable: scrollable,
    nestedScrollEnabled: true
  }));
};
export const NestedReorderableList = /*#__PURE__*/forwardRef(NestedReorderableListWithRef);
//# sourceMappingURL=NestedReorderableList.js.map