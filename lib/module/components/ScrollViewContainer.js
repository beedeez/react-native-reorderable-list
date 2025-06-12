function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
import React, { forwardRef, useCallback, useMemo } from 'react';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, { measure, runOnUI, useAnimatedRef, useAnimatedScrollHandler, useComposedEventHandler, useSharedValue } from 'react-native-reanimated';
import { ScrollViewContainerContext } from '../contexts';
import { usePropAsSharedValue } from '../hooks';
const ScrollViewContainerWithRef = ({
  onLayout,
  onScroll,
  ...rest
}, ref) => {
  const scrollEnabled = rest.scrollEnabled ?? true;
  const scrollViewScrollEnabledProp = usePropAsSharedValue(scrollEnabled);
  const scrollViewCurrentScrollEnabled = useSharedValue(scrollEnabled);
  const scrollViewContainerRef = useAnimatedRef();
  const scrollViewScrollOffsetY = useSharedValue(0);
  const scrollViewPageY = useSharedValue(0);
  const scrollViewHeightY = useSharedValue(0);
  const handleRef = useCallback(value => {
    scrollViewContainerRef(value);
    if (typeof ref === 'function') {
      ref(value);
    } else if (ref) {
      ref.current = value;
    }
  }, [scrollViewContainerRef, ref]);
  const outerScrollGesture = useMemo(() => Gesture.Native(), []);
  const handleScroll = useAnimatedScrollHandler(e => {
    scrollViewScrollOffsetY.value = e.contentOffset.y;
  }, [scrollViewScrollOffsetY]);
  const composedScrollHandler = useComposedEventHandler([handleScroll, onScroll || null]);
  const contextValue = useMemo(() => ({
    scrollViewContainerRef,
    scrollViewPageY,
    scrollViewHeightY,
    scrollViewScrollOffsetY,
    scrollViewScrollEnabledProp,
    scrollViewCurrentScrollEnabled,
    outerScrollGesture
  }), [scrollViewContainerRef, scrollViewPageY, scrollViewHeightY, scrollViewScrollOffsetY, scrollViewScrollEnabledProp, scrollViewCurrentScrollEnabled, outerScrollGesture]);
  const handleLayout = useCallback(e => {
    scrollViewHeightY.value = e.nativeEvent.layout.height;

    // measuring pageY allows wrapping nested lists in other views
    runOnUI(() => {
      const measurement = measure(scrollViewContainerRef);
      if (!measurement) {
        return;
      }
      scrollViewPageY.value = measurement.pageY;
    })();
    onLayout === null || onLayout === void 0 || onLayout(e);
  }, [onLayout, scrollViewContainerRef, scrollViewHeightY, scrollViewPageY]);
  return /*#__PURE__*/React.createElement(ScrollViewContainerContext.Provider, {
    value: contextValue
  }, /*#__PURE__*/React.createElement(GestureDetector, {
    gesture: outerScrollGesture
  }, /*#__PURE__*/React.createElement(Animated.ScrollView, _extends({}, rest, {
    ref: handleRef,
    onScroll: composedScrollHandler,
    onLayout: handleLayout
  }))));
};
export const ScrollViewContainer = /*#__PURE__*/forwardRef(ScrollViewContainerWithRef);
//# sourceMappingURL=ScrollViewContainer.js.map