"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ScrollViewContainer = void 0;
var _react = _interopRequireWildcard(require("react"));
var _reactNativeGestureHandler = require("react-native-gesture-handler");
var _reactNativeReanimated = _interopRequireWildcard(require("react-native-reanimated"));
var _contexts = require("../contexts");
var _hooks = require("../hooks");
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function (e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const ScrollViewContainerWithRef = ({
  onLayout,
  onScroll,
  ...rest
}, ref) => {
  const scrollEnabled = rest.scrollEnabled ?? true;
  const scrollViewScrollEnabledProp = (0, _hooks.usePropAsSharedValue)(scrollEnabled);
  const scrollViewCurrentScrollEnabled = (0, _reactNativeReanimated.useSharedValue)(scrollEnabled);
  const scrollViewContainerRef = (0, _reactNativeReanimated.useAnimatedRef)();
  const scrollViewScrollOffsetY = (0, _reactNativeReanimated.useSharedValue)(0);
  const scrollViewPageY = (0, _reactNativeReanimated.useSharedValue)(0);
  const scrollViewHeightY = (0, _reactNativeReanimated.useSharedValue)(0);
  const handleRef = (0, _react.useCallback)(value => {
    scrollViewContainerRef(value);
    if (typeof ref === 'function') {
      ref(value);
    } else if (ref) {
      ref.current = value;
    }
  }, [scrollViewContainerRef, ref]);
  const outerScrollGesture = (0, _react.useMemo)(() => _reactNativeGestureHandler.Gesture.Native(), []);
  const handleScroll = (0, _reactNativeReanimated.useAnimatedScrollHandler)(e => {
    scrollViewScrollOffsetY.value = e.contentOffset.y;
  }, [scrollViewScrollOffsetY]);
  const composedScrollHandler = (0, _reactNativeReanimated.useComposedEventHandler)([handleScroll, onScroll || null]);
  const contextValue = (0, _react.useMemo)(() => ({
    scrollViewContainerRef,
    scrollViewPageY,
    scrollViewHeightY,
    scrollViewScrollOffsetY,
    scrollViewScrollEnabledProp,
    scrollViewCurrentScrollEnabled,
    outerScrollGesture
  }), [scrollViewContainerRef, scrollViewPageY, scrollViewHeightY, scrollViewScrollOffsetY, scrollViewScrollEnabledProp, scrollViewCurrentScrollEnabled, outerScrollGesture]);
  const handleLayout = (0, _react.useCallback)(e => {
    scrollViewHeightY.value = e.nativeEvent.layout.height;

    // measuring pageY allows wrapping nested lists in other views
    (0, _reactNativeReanimated.runOnUI)(() => {
      const measurement = (0, _reactNativeReanimated.measure)(scrollViewContainerRef);
      if (!measurement) {
        return;
      }
      scrollViewPageY.value = measurement.pageY;
    })();
    onLayout === null || onLayout === void 0 || onLayout(e);
  }, [onLayout, scrollViewContainerRef, scrollViewHeightY, scrollViewPageY]);
  return /*#__PURE__*/_react.default.createElement(_contexts.ScrollViewContainerContext.Provider, {
    value: contextValue
  }, /*#__PURE__*/_react.default.createElement(_reactNativeGestureHandler.GestureDetector, {
    gesture: outerScrollGesture
  }, /*#__PURE__*/_react.default.createElement(_reactNativeReanimated.default.ScrollView, _extends({}, rest, {
    ref: handleRef,
    onScroll: composedScrollHandler,
    onLayout: handleLayout
  }))));
};
const ScrollViewContainer = exports.ScrollViewContainer = /*#__PURE__*/(0, _react.forwardRef)(ScrollViewContainerWithRef);
//# sourceMappingURL=ScrollViewContainer.js.map