function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
import React, { forwardRef } from 'react';
import { ReorderableListCore } from './ReorderableListCore';
const ReorderableListWithRef = (props, ref) => /*#__PURE__*/React.createElement(ReorderableListCore, _extends({}, props, {
  ref: ref,
  scrollViewContainerRef: undefined,
  scrollViewScrollOffsetY: undefined,
  scrollViewPageY: undefined,
  scrollViewHeightY: undefined,
  outerScrollGesture: undefined,
  scrollViewScrollEnabledProp: undefined,
  scrollViewCurrentScrollEnabled: undefined,
  scrollable: true
}));
export const ReorderableList = /*#__PURE__*/forwardRef(ReorderableListWithRef);
//# sourceMappingURL=ReorderableList.js.map