"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ReorderableListCore = void 0;
var _react = _interopRequireWildcard(require("react"));
var _reactNative = require("react-native");
var _reactNativeGestureHandler = require("react-native-gesture-handler");
var _reactNativeReanimated = _interopRequireWildcard(require("react-native-reanimated"));
var _contexts = require("../contexts");
var _types = require("../types");
var _constants = require("./constants");
var _ReorderableListCell = require("./ReorderableListCell");
var _hooks = require("../hooks");
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function (e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const AnimatedFlatList = _reactNativeReanimated.default.createAnimatedComponent(_reactNative.FlatList);
const ReorderableListCore = ({
  autoscrollThreshold = 0.1,
  autoscrollThresholdOffset,
  autoscrollSpeedScale = 1,
  autoscrollDelay = _constants.AUTOSCROLL_CONFIG.delay,
  autoscrollActivationDelta = 5,
  animationDuration = 200,
  onLayout,
  onReorder,
  onScroll,
  onDragStart,
  onDragEnd,
  onIndexChange,
  scrollViewContainerRef,
  scrollViewPageY,
  scrollViewHeightY,
  scrollViewScrollOffsetY,
  scrollViewScrollEnabledProp,
  scrollViewCurrentScrollEnabled,
  scrollable,
  outerScrollGesture,
  cellAnimations,
  dragEnabled = true,
  shouldUpdateActiveItem,
  itemLayoutAnimation,
  panGesture,
  panEnabled = true,
  panActivateAfterLongPress,
  data,
  keyExtractor,
  ...rest
}, ref) => {
  const scrollEnabled = rest.scrollEnabled ?? true;
  const flatListRef = (0, _reactNativeReanimated.useAnimatedRef)();
  const markedCellsRef = (0, _react.useRef)();
  const [activeIndex, setActiveIndex] = (0, _react.useState)(-1);
  const prevItemCount = (0, _react.useRef)(data.length);
  const currentScrollEnabled = (0, _reactNativeReanimated.useSharedValue)(scrollEnabled);
  const gestureState = (0, _reactNativeReanimated.useSharedValue)(_reactNativeGestureHandler.State.UNDETERMINED);
  const currentY = (0, _reactNativeReanimated.useSharedValue)(0);
  const currentTranslationY = (0, _reactNativeReanimated.useSharedValue)(0);
  const currentItemDragCenterY = (0, _reactNativeReanimated.useSharedValue)(null);
  const startItemDragCenterY = (0, _reactNativeReanimated.useSharedValue)(0);
  const flatListScrollOffsetY = (0, _reactNativeReanimated.useSharedValue)(0);
  const flatListHeightY = (0, _reactNativeReanimated.useSharedValue)(0);
  const flatListPageY = (0, _reactNativeReanimated.useSharedValue)(0);
  // The scroll y translation of the list since drag start
  const dragScrollTranslationY = (0, _reactNativeReanimated.useSharedValue)(0);
  // The initial scroll offset y of the list on drag start
  const dragInitialScrollOffsetY = (0, _reactNativeReanimated.useSharedValue)(0);
  // The scroll y translation of the ScrollViewContainer since drag start
  const scrollViewDragScrollTranslationY = (0, _reactNativeReanimated.useSharedValue)(0);
  // The initial scroll offset y of the ScrollViewContainer on drag start
  const scrollViewDragInitialScrollOffsetY = (0, _reactNativeReanimated.useSharedValue)(0);
  const draggedHeight = (0, _reactNativeReanimated.useSharedValue)(0);
  const itemOffset = (0, _reactNativeReanimated.useSharedValue)([]);
  const itemHeight = (0, _reactNativeReanimated.useSharedValue)([]);
  // We need to track data length since itemOffset and itemHeight might contain more data than we need.
  // e.g. items are removed from the list, in which case layout data for those items is set to 0.
  const itemCount = (0, _reactNativeReanimated.useSharedValue)(data.length);
  const autoscrollTrigger = (0, _reactNativeReanimated.useSharedValue)(-1);
  const lastAutoscrollTrigger = (0, _reactNativeReanimated.useSharedValue)(-1);
  const dragY = (0, _reactNativeReanimated.useSharedValue)(0);
  const currentIndex = (0, _reactNativeReanimated.useSharedValue)(-1);
  const draggedIndex = (0, _reactNativeReanimated.useSharedValue)(-1);
  const state = (0, _reactNativeReanimated.useSharedValue)(_types.ReorderableListState.IDLE);
  const dragEndHandlers = (0, _reactNativeReanimated.useSharedValue)([]);
  const startY = (0, _reactNativeReanimated.useSharedValue)(0);
  const scaleDefault = (0, _reactNativeReanimated.useSharedValue)(1);
  const opacityDefault = (0, _reactNativeReanimated.useSharedValue)(1);
  const dragDirection = (0, _reactNativeReanimated.useSharedValue)(0);
  const lastDragDirectionPivot = (0, _reactNativeReanimated.useSharedValue)(null);
  const itemLayoutAnimationPropRef = (0, _react.useRef)(itemLayoutAnimation);
  itemLayoutAnimationPropRef.current = itemLayoutAnimation;
  const keyExtractorPropRef = (0, _react.useRef)(keyExtractor);
  keyExtractorPropRef.current = keyExtractor;
  const scrollEnabledProp = (0, _hooks.usePropAsSharedValue)(scrollEnabled);
  const animationDurationProp = (0, _hooks.usePropAsSharedValue)(animationDuration);
  const autoscrollActivationDeltaProp = (0, _hooks.usePropAsSharedValue)(autoscrollActivationDelta);
  const dragEnabledProp = (0, _hooks.usePropAsSharedValue)(dragEnabled ?? true);

  // Position of the list relative to the scroll container
  const nestedFlatListPositionY = (0, _reactNativeReanimated.useDerivedValue)(() => flatListPageY.value - ((scrollViewPageY === null || scrollViewPageY === void 0 ? void 0 : scrollViewPageY.value) || 0));
  (0, _react.useEffect)(() => {
    itemCount.value = data.length;

    // This could be done unmount of the removed cell, however it leads to bugs.
    // Surprisingly the unmount gets sometimes called after the onLayout event
    // setting all layout data to 0 and breaking the list. So we solve it like this.
    if (data.length < prevItemCount.current) {
      for (let i = data.length; i < prevItemCount.current; i++) {
        (0, _reactNativeReanimated.runOnUI)(() => {
          itemHeight.value[i] = 0;
          itemOffset.value[i] = 0;
        })();
      }
    }
    prevItemCount.current = data.length;
  }, [data.length, itemHeight, itemOffset, itemCount]);
  (0, _react.useEffect)(() => {
    if (!markedCellsRef.current ||
    // Clean keys once they surpass by 10% the size of the list itself.
    markedCellsRef.current.size <= data.length + Math.ceil(data.length * 0.1)) {
      return;
    }

    // Can be heavy to loop through all items, defer the task to run after interactions.
    const task = _reactNative.InteractionManager.runAfterInteractions(() => {
      if (!markedCellsRef.current) {
        return;
      }
      const map = new Map();
      for (let i = 0; i < data.length; i++) {
        var _keyExtractorPropRef$;
        const key = ((_keyExtractorPropRef$ = keyExtractorPropRef.current) === null || _keyExtractorPropRef$ === void 0 ? void 0 : _keyExtractorPropRef$.call(keyExtractorPropRef, data[i], i)) || i.toString();
        if (markedCellsRef.current.has(key)) {
          map.set(key, markedCellsRef.current.get(key));
        }
      }
      markedCellsRef.current = map;
    });
    return () => {
      task.cancel();
    };
  }, [data]);
  const createCellKey = (0, _react.useCallback)(cellKey => {
    var _markedCellsRef$curre;
    const mark = ((_markedCellsRef$curre = markedCellsRef.current) === null || _markedCellsRef$curre === void 0 ? void 0 : _markedCellsRef$curre.get(cellKey)) || 0;
    return `${cellKey}#${mark}`;
  }, []);
  const listContextValue = (0, _react.useMemo)(() => ({
    draggedHeight,
    currentIndex,
    draggedIndex,
    dragEndHandlers,
    activeIndex,
    itemLayoutAnimation: itemLayoutAnimationPropRef,
    cellAnimations: {
      ...cellAnimations,
      transform: cellAnimations && 'transform' in cellAnimations ? cellAnimations.transform : [{
        scale: scaleDefault
      }],
      opacity: cellAnimations && 'opacity' in cellAnimations ? cellAnimations.opacity : opacityDefault
    }
  }), [draggedHeight, currentIndex, draggedIndex, dragEndHandlers, activeIndex, cellAnimations, itemLayoutAnimationPropRef, scaleDefault, opacityDefault]);

  /**
   * Decides the intended drag direction of the user.
   * This is used to to determine if the user intends to autoscroll
   * when within the threshold area.
   *
   * @param e - The payload of the pan gesture update event.
   */
  const setDragDirection = (0, _react.useCallback)(e => {
    'worklet';

    const direction = e.velocityY > 0 ? 1 : -1;
    if (direction !== dragDirection.value) {
      if (lastDragDirectionPivot.value === null) {
        lastDragDirectionPivot.value = e.absoluteY;
      } else if (Math.abs(e.absoluteY - lastDragDirectionPivot.value) >= autoscrollActivationDeltaProp.value) {
        dragDirection.value = direction;
        lastDragDirectionPivot.value = e.absoluteY;
      }
    }
  }, [dragDirection, lastDragDirectionPivot, autoscrollActivationDeltaProp]);
  const setCurrentItemDragCenterY = (0, _react.useCallback)(e => {
    'worklet';

    if (currentItemDragCenterY.value === null) {
      if (currentIndex.value >= 0) {
        const itemCenter = itemHeight.value[currentIndex.value] * 0.5;
        // the y coordinate of the item relative to the list
        const itemY = itemOffset.value[currentIndex.value] - (flatListScrollOffsetY.value + scrollViewDragScrollTranslationY.value);
        const value = itemY + itemCenter + e.translationY;
        startItemDragCenterY.value = value;
        currentItemDragCenterY.value = value;
      }
    } else {
      currentItemDragCenterY.value = startItemDragCenterY.value + e.translationY;
    }
  }, [currentItemDragCenterY, currentIndex, startItemDragCenterY, itemOffset, itemHeight, flatListScrollOffsetY, scrollViewDragScrollTranslationY]);
  const panGestureHandler = (0, _react.useMemo)(() => (panGesture || _reactNativeGestureHandler.Gesture.Pan()).onBegin(e => {
    'worklet';

    // prevent new dragging until item is completely released
    if (state.value === _types.ReorderableListState.IDLE) {
      startY.value = e.y;
      currentY.value = e.y;
      currentTranslationY.value = e.translationY;
      dragY.value = e.translationY;
      gestureState.value = e.state;
    }
  }).onUpdate(e => {
    'worklet';

    if (state.value === _types.ReorderableListState.DRAGGED) {
      setDragDirection(e);
    }
    if (state.value !== _types.ReorderableListState.RELEASED) {
      setCurrentItemDragCenterY(e);
      currentY.value = startY.value + e.translationY;
      currentTranslationY.value = e.translationY;
      dragY.value = e.translationY + dragScrollTranslationY.value + scrollViewDragScrollTranslationY.value;
      gestureState.value = e.state;
    }
  }).onEnd(e => {
    'worklet';

    gestureState.value = e.state;
  }).onFinalize(e => {
    'worklet';

    gestureState.value = e.state;
  }), [panGesture, state, startY, currentY, currentTranslationY, dragY, gestureState, dragScrollTranslationY, scrollViewDragScrollTranslationY, setDragDirection, setCurrentItemDragCenterY]);
  const panGestureHandlerWithPropOptions = (0, _react.useMemo)(() => {
    if (typeof panActivateAfterLongPress === 'number') {
      panGestureHandler.activateAfterLongPress(panActivateAfterLongPress);
    }
    if (!panEnabled) {
      panGestureHandler.enabled(panEnabled);
    }
    return panGestureHandler;
  }, [panActivateAfterLongPress, panEnabled, panGestureHandler]);
  const gestureHandler = (0, _react.useMemo)(() => _reactNativeGestureHandler.Gesture.Simultaneous(_reactNativeGestureHandler.Gesture.Native(), panGestureHandlerWithPropOptions), [panGestureHandlerWithPropOptions]);
  const setScrollEnabled = (0, _react.useCallback)(enabled => {
    // When re-enabling the scroll of the flatlist we check whether its prop is set to true.
    if (enabled && scrollEnabledProp.value || !enabled) {
      var _flatListRef$current, _flatListRef$current$;
      currentScrollEnabled.value = enabled;
      (_flatListRef$current = flatListRef.current) === null || _flatListRef$current === void 0 || (_flatListRef$current$ = _flatListRef$current.setNativeProps) === null || _flatListRef$current$ === void 0 || _flatListRef$current$.call(_flatListRef$current, {
        scrollEnabled: enabled
      });
    }
    if (scrollViewContainerRef && scrollViewScrollEnabledProp && scrollViewCurrentScrollEnabled && (
    // When re-enabling the scroll of the container we check whether its prop is set to true.
    enabled && scrollViewScrollEnabledProp !== null && scrollViewScrollEnabledProp !== void 0 && scrollViewScrollEnabledProp.value || !enabled)) {
      var _scrollViewContainerR, _scrollViewContainerR2;
      scrollViewCurrentScrollEnabled.value = enabled;
      (_scrollViewContainerR = scrollViewContainerRef.current) === null || _scrollViewContainerR === void 0 || (_scrollViewContainerR2 = _scrollViewContainerR.setNativeProps) === null || _scrollViewContainerR2 === void 0 || _scrollViewContainerR2.call(_scrollViewContainerR, {
        scrollEnabled: enabled
      });
    }
  }, [flatListRef, scrollEnabledProp, currentScrollEnabled, scrollViewScrollEnabledProp, scrollViewCurrentScrollEnabled, scrollViewContainerRef]);
  const resetSharedValues = (0, _react.useCallback)(() => {
    'worklet';

    state.value = _types.ReorderableListState.IDLE;
    draggedIndex.value = -1;
    dragY.value = 0;
    dragScrollTranslationY.value = 0;
    scrollViewDragScrollTranslationY.value = 0;
    dragDirection.value = 0;
    lastDragDirectionPivot.value = null;
    currentItemDragCenterY.value = null;
  }, [state, draggedIndex, dragY, dragScrollTranslationY, scrollViewDragScrollTranslationY, dragDirection, lastDragDirectionPivot, currentItemDragCenterY]);
  const resetSharedValuesAfterAnimations = (0, _react.useCallback)(() => {
    setTimeout((0, _reactNativeReanimated.runOnUI)(resetSharedValues), animationDurationProp.value);
  }, [resetSharedValues, animationDurationProp]);
  const markCells = (fromIndex, toIndex) => {
    if (!markedCellsRef.current) {
      markedCellsRef.current = new Map();
    }
    const start = Math.min(fromIndex, toIndex);
    const end = Math.max(fromIndex, toIndex);
    for (let i = start; i <= end; i++) {
      var _keyExtractorPropRef$2;
      const cellKey = ((_keyExtractorPropRef$2 = keyExtractorPropRef.current) === null || _keyExtractorPropRef$2 === void 0 ? void 0 : _keyExtractorPropRef$2.call(keyExtractorPropRef, data[i], i)) || i.toString();
      if (!markedCellsRef.current.has(cellKey)) {
        markedCellsRef.current.set(cellKey, 1);
      } else {
        markedCellsRef.current.delete(cellKey);
      }
    }
  };
  const reorder = (fromIndex, toIndex) => {
    (0, _reactNativeReanimated.runOnUI)(resetSharedValues)();
    markCells(fromIndex, toIndex);
    if (fromIndex !== toIndex) {
      onReorder({
        from: fromIndex,
        to: toIndex
      });
    }
  };
  const recomputeLayout = (0, _react.useCallback)((from, to) => {
    'worklet';

    const itemDirection = to > from;
    const index1 = itemDirection ? from : to;
    const index2 = itemDirection ? to : from;
    const newOffset1 = itemOffset.value[index1];
    const newHeight1 = itemHeight.value[index2];
    const newOffset2 = itemOffset.value[index2] + itemHeight.value[index2] - itemHeight.value[index1];
    const newHeight2 = itemHeight.value[index1];
    itemOffset.value[index1] = newOffset1;
    itemHeight.value[index1] = newHeight1;
    itemOffset.value[index2] = newOffset2;
    itemHeight.value[index2] = newHeight2;
  }, [itemOffset, itemHeight]);

  /**
   * Computes a potential new drop container for the current dragged item and evaluates
   * whether the dragged item center is nearer to the center of the current container or the new one.
   *
   * @returns The new index if the center of the dragged item is closer to the center of
   * the new drop container or the current index if closer to the current drop container.
   */
  const computeCurrentIndex = (0, _react.useCallback)(() => {
    'worklet';

    if (currentItemDragCenterY.value === null) {
      return currentIndex.value;
    }

    // apply scroll offset and scroll container translation
    const relativeDragCenterY = flatListScrollOffsetY.value + scrollViewDragScrollTranslationY.value + currentItemDragCenterY.value;
    const currentOffset = itemOffset.value[currentIndex.value];
    const currentHeight = itemHeight.value[currentIndex.value];
    const currentCenter = currentOffset + currentHeight * 0.5;
    const max = itemCount.value;
    const possibleIndex = relativeDragCenterY < currentCenter ? Math.max(0, currentIndex.value - 1) : Math.min(max - 1, currentIndex.value + 1);
    if (currentIndex.value !== possibleIndex) {
      let possibleOffset = itemOffset.value[possibleIndex];
      if (possibleIndex > currentIndex.value) {
        possibleOffset += itemHeight.value[possibleIndex] - currentHeight;
      }
      const possibleCenter = possibleOffset + currentHeight * 0.5;
      const distanceFromCurrent = Math.abs(relativeDragCenterY - currentCenter);
      const distanceFromPossible = Math.abs(relativeDragCenterY - possibleCenter);
      return distanceFromCurrent <= distanceFromPossible ? currentIndex.value : possibleIndex;
    }
    return currentIndex.value;
  }, [currentIndex, currentItemDragCenterY, itemCount, itemOffset, itemHeight, flatListScrollOffsetY, scrollViewDragScrollTranslationY]);
  const setCurrentIndex = (0, _react.useCallback)(() => {
    'worklet';

    const newIndex = computeCurrentIndex();
    if (currentIndex.value !== newIndex) {
      recomputeLayout(currentIndex.value, newIndex);
      currentIndex.value = newIndex;
      onIndexChange === null || onIndexChange === void 0 || onIndexChange({
        index: newIndex
      });
    }
  }, [currentIndex, computeCurrentIndex, recomputeLayout, onIndexChange]);
  const runDefaultDragAnimations = (0, _react.useCallback)(type => {
    'worklet';

    // if no custom scale run default
    if (!(cellAnimations && 'transform' in cellAnimations)) {
      const scaleConfig = _constants.SCALE_ANIMATION_CONFIG_DEFAULT[type];
      scaleDefault.value = (0, _reactNativeReanimated.withTiming)(scaleConfig.toValue, scaleConfig);
    }

    // if no custom opacity run the default
    if (!(cellAnimations && 'opacity' in cellAnimations)) {
      const opacityConfig = _constants.OPACITY_ANIMATION_CONFIG_DEFAULT[type];
      opacityDefault.value = (0, _reactNativeReanimated.withTiming)(opacityConfig.toValue, opacityConfig);
    }
  }, [cellAnimations, scaleDefault, opacityDefault]);
  (0, _reactNativeReanimated.useAnimatedReaction)(() => gestureState.value, () => {
    if (gestureState.value !== _reactNativeGestureHandler.State.ACTIVE && gestureState.value !== _reactNativeGestureHandler.State.BEGAN && (state.value === _types.ReorderableListState.DRAGGED || state.value === _types.ReorderableListState.AUTOSCROLL)) {
      state.value = _types.ReorderableListState.RELEASED;

      // enable back scroll on releasing
      (0, _reactNativeReanimated.runOnJS)(setScrollEnabled)(true);
      if (shouldUpdateActiveItem) {
        (0, _reactNativeReanimated.runOnJS)(setActiveIndex)(-1);
      }

      // trigger onDragEnd event
      let e = {
        from: draggedIndex.value,
        to: currentIndex.value
      };
      onDragEnd === null || onDragEnd === void 0 || onDragEnd(e);
      const handlers = dragEndHandlers.value[draggedIndex.value];
      if (Array.isArray(handlers)) {
        handlers.forEach(fn => fn(e.from, e.to));
      }

      // they are actually swapped on drag translation
      const currentItemOffset = itemOffset.value[draggedIndex.value];
      const currentItemHeight = itemHeight.value[draggedIndex.value];
      const draggedItemOffset = itemOffset.value[currentIndex.value];
      const draggedItemHeight = itemHeight.value[currentIndex.value];
      const newTopPosition = currentIndex.value > draggedIndex.value ? draggedItemOffset - currentItemOffset : draggedItemOffset - currentItemOffset + (draggedItemHeight - currentItemHeight);
      runDefaultDragAnimations('end');
      if (dragY.value !== newTopPosition) {
        // animate dragged item to its new position on release
        dragY.value = (0, _reactNativeReanimated.withTiming)(newTopPosition, {
          duration: animationDurationProp.value,
          easing: _reactNativeReanimated.Easing.out(_reactNativeReanimated.Easing.ease)
        }, () => {
          (0, _reactNativeReanimated.runOnJS)(reorder)(draggedIndex.value, currentIndex.value);
        });
      } else {
        // user might drag and release the item without moving it so,
        // since the animation end callback is not executed in that case
        // we need to reset values as the reorder function would do
        (0, _reactNativeReanimated.runOnJS)(resetSharedValuesAfterAnimations)();
      }
    }
  });
  const computeHiddenArea = (0, _react.useCallback)(() => {
    'worklet';

    if (!scrollViewScrollOffsetY || !scrollViewHeightY) {
      return {
        top: 0,
        bottom: 0
      };
    }

    // hidden area cannot be negative
    const top = Math.max(0, scrollViewScrollOffsetY.value - nestedFlatListPositionY.value);
    const bottom = Math.max(0, nestedFlatListPositionY.value + flatListHeightY.value - (scrollViewScrollOffsetY.value + scrollViewHeightY.value));
    return {
      top,
      bottom
    };
  }, [scrollViewScrollOffsetY, scrollViewHeightY, nestedFlatListPositionY, flatListHeightY]);
  const computeThresholdArea = (0, _react.useCallback)(() => {
    'worklet';

    const hiddenArea = computeHiddenArea();
    const offsetTop = Math.max(0, (autoscrollThresholdOffset === null || autoscrollThresholdOffset === void 0 ? void 0 : autoscrollThresholdOffset.top) || 0);
    const offsetBottom = Math.max(0, (autoscrollThresholdOffset === null || autoscrollThresholdOffset === void 0 ? void 0 : autoscrollThresholdOffset.bottom) || 0);
    const threshold = Math.max(0, Math.min(autoscrollThreshold, 0.4));
    const visibleHeight = flatListHeightY.value - (hiddenArea.top + hiddenArea.bottom) - (offsetTop + offsetBottom);
    const area = visibleHeight * threshold;
    const top = area + offsetTop;
    const bottom = flatListHeightY.value - area - offsetBottom;
    return {
      top,
      bottom
    };
  }, [computeHiddenArea, autoscrollThreshold, autoscrollThresholdOffset, flatListHeightY]);
  const computeContainerThresholdArea = (0, _react.useCallback)(() => {
    'worklet';

    if (!scrollViewHeightY) {
      return {
        top: -Infinity,
        bottom: Infinity
      };
    }
    const offsetTop = Math.max(0, (autoscrollThresholdOffset === null || autoscrollThresholdOffset === void 0 ? void 0 : autoscrollThresholdOffset.top) || 0);
    const offsetBottom = Math.max(0, (autoscrollThresholdOffset === null || autoscrollThresholdOffset === void 0 ? void 0 : autoscrollThresholdOffset.bottom) || 0);
    const threshold = Math.max(0, Math.min(autoscrollThreshold, 0.4));
    const visibleHeight = scrollViewHeightY.value - (offsetTop + offsetBottom);
    const area = visibleHeight * threshold;
    const top = area + offsetTop;
    const bottom = visibleHeight - area - offsetBottom;
    return {
      top,
      bottom
    };
  }, [autoscrollThreshold, autoscrollThresholdOffset, scrollViewHeightY]);
  const shouldScrollContainer = (0, _react.useCallback)(y => {
    'worklet';

    const containerThresholdArea = computeContainerThresholdArea();
    const nestedListHiddenArea = computeHiddenArea();

    // We should scroll the container if there's a hidden part of the nested list.
    // We might have floating errors like 0.0001 which we should ignore.
    return nestedListHiddenArea.top > 0.01 && y <= containerThresholdArea.top || nestedListHiddenArea.bottom > 0.01 && y >= containerThresholdArea.bottom;
  }, [computeHiddenArea, computeContainerThresholdArea]);
  const getRelativeContainerY = (0, _react.useCallback)(() => {
    'worklet';

    return currentY.value + nestedFlatListPositionY.value - scrollViewDragInitialScrollOffsetY.value;
  }, [currentY, nestedFlatListPositionY, scrollViewDragInitialScrollOffsetY]);
  const getRelativeListY = (0, _react.useCallback)(() => {
    'worklet';

    return currentY.value + scrollViewDragScrollTranslationY.value;
  }, [currentY, scrollViewDragScrollTranslationY]);
  const scrollDirection = (0, _react.useCallback)(() => {
    'worklet';

    const relativeContainerY = getRelativeContainerY();
    if (shouldScrollContainer(relativeContainerY)) {
      const containerThresholdArea = computeContainerThresholdArea();
      if (relativeContainerY <= containerThresholdArea.top) {
        return -1;
      }
      if (relativeContainerY >= containerThresholdArea.bottom) {
        return 1;
      }
    } else if (scrollable) {
      const relativeListY = getRelativeListY();
      const thresholdArea = computeThresholdArea();
      if (relativeListY <= thresholdArea.top) {
        return -1;
      }
      if (relativeListY >= thresholdArea.bottom) {
        return 1;
      }
    }
    return 0;
  }, [shouldScrollContainer, computeThresholdArea, computeContainerThresholdArea, getRelativeContainerY, getRelativeListY, scrollable]);
  (0, _reactNativeReanimated.useAnimatedReaction)(() => currentY.value, () => {
    if (state.value === _types.ReorderableListState.DRAGGED || state.value === _types.ReorderableListState.AUTOSCROLL) {
      setCurrentIndex();

      // Trigger autoscroll when:
      // 1. Within the threshold area (top or bottom of list)
      // 2. Have dragged in the same direction as the scroll
      // 3. Not already in autoscroll mode
      if (dragDirection.value === scrollDirection()) {
        // When the first two conditions are met and it's already in autoscroll mode, we let it continue (no-op)
        if (state.value !== _types.ReorderableListState.AUTOSCROLL) {
          state.value = _types.ReorderableListState.AUTOSCROLL;
          lastAutoscrollTrigger.value = autoscrollTrigger.value;
          autoscrollTrigger.value *= -1;
        }
      } else if (state.value === _types.ReorderableListState.AUTOSCROLL) {
        state.value = _types.ReorderableListState.DRAGGED;
      }
    }
  });
  (0, _reactNativeReanimated.useAnimatedReaction)(() => autoscrollTrigger.value, () => {
    if (autoscrollTrigger.value !== lastAutoscrollTrigger.value && state.value === _types.ReorderableListState.AUTOSCROLL) {
      const autoscrollIncrement = dragDirection.value * _constants.AUTOSCROLL_CONFIG.increment * autoscrollSpeedScale;
      if (autoscrollIncrement !== 0) {
        let scrollOffset = flatListScrollOffsetY.value;
        let listRef = flatListRef;

        // Checking on every autoscroll whether to scroll the container,
        // this allows to smoothly pass the scroll from the container to the nested list
        // without any gesture input.
        if (scrollViewScrollOffsetY && shouldScrollContainer(getRelativeContainerY())) {
          scrollOffset = scrollViewScrollOffsetY.value;
          listRef = scrollViewContainerRef;
        }
        (0, _reactNativeReanimated.scrollTo)(listRef, 0, scrollOffset + autoscrollIncrement, true);
      }

      // when autoscrolling user may not be moving his finger so we need
      // to update the current position of the dragged item here
      setCurrentIndex();
    }
  });

  // flatlist scroll handler
  const handleScroll = (0, _reactNativeReanimated.useAnimatedScrollHandler)(e => {
    flatListScrollOffsetY.value = e.contentOffset.y;

    // checking if the list is not scrollable instead of the scrolling state
    // fixes a bug on iOS where the item is shifted after autoscrolling and then
    // moving away from autoscroll area
    if (!currentScrollEnabled.value) {
      dragScrollTranslationY.value = flatListScrollOffsetY.value - dragInitialScrollOffsetY.value;
    }
    if (state.value === _types.ReorderableListState.AUTOSCROLL) {
      dragY.value = currentTranslationY.value + dragScrollTranslationY.value + scrollViewDragScrollTranslationY.value;
      lastAutoscrollTrigger.value = autoscrollTrigger.value;
      autoscrollTrigger.value = (0, _reactNativeReanimated.withDelay)(autoscrollDelay, (0, _reactNativeReanimated.withTiming)(autoscrollTrigger.value * -1, {
        duration: 0
      }));
    }
  });

  // container scroll handler
  (0, _reactNativeReanimated.useAnimatedReaction)(() => scrollViewScrollOffsetY === null || scrollViewScrollOffsetY === void 0 ? void 0 : scrollViewScrollOffsetY.value, value => {
    if (value && scrollViewCurrentScrollEnabled) {
      // checking if the list is not scrollable instead of the scrolling state
      // fixes a bug on iOS where the item is shifted after autoscrolling and moving away from the area
      if (!scrollViewCurrentScrollEnabled.value) {
        scrollViewDragScrollTranslationY.value = value - scrollViewDragInitialScrollOffsetY.value;
      }
      if (state.value === _types.ReorderableListState.AUTOSCROLL) {
        dragY.value = currentTranslationY.value + scrollViewDragScrollTranslationY.value;
        lastAutoscrollTrigger.value = autoscrollTrigger.value;
        autoscrollTrigger.value = (0, _reactNativeReanimated.withDelay)(autoscrollDelay, (0, _reactNativeReanimated.withTiming)(autoscrollTrigger.value * -1, {
          duration: 0
        }));
      }
    }
  });
  const startDrag = (0, _react.useCallback)(index => {
    'worklet';

    if (!dragEnabledProp.value) {
      return;
    }

    // allow new drag when item is completely released
    if (state.value === _types.ReorderableListState.IDLE) {
      // resetting shared values again fixes a flickeing bug in nested lists where
      // after scrolling the parent list it would offset the new dragged item in another nested list
      resetSharedValues();
      if (shouldUpdateActiveItem) {
        (0, _reactNativeReanimated.runOnJS)(setActiveIndex)(index);
      }
      dragInitialScrollOffsetY.value = flatListScrollOffsetY.value;
      scrollViewDragInitialScrollOffsetY.value = (scrollViewScrollOffsetY === null || scrollViewScrollOffsetY === void 0 ? void 0 : scrollViewScrollOffsetY.value) || 0;
      draggedHeight.value = itemHeight.value[index];
      draggedIndex.value = index;
      currentIndex.value = index;
      state.value = _types.ReorderableListState.DRAGGED;
      (0, _reactNativeReanimated.runOnJS)(setScrollEnabled)(false);

      // run animation before onDragStart to avoid potentially waiting for it
      runDefaultDragAnimations('start');
      onDragStart === null || onDragStart === void 0 || onDragStart({
        index
      });
    }
  }, [dragEnabledProp, resetSharedValues, shouldUpdateActiveItem, dragInitialScrollOffsetY, scrollViewScrollOffsetY, scrollViewDragInitialScrollOffsetY, setScrollEnabled, currentIndex, draggedHeight, draggedIndex, state, flatListScrollOffsetY, itemHeight, onDragStart, runDefaultDragAnimations]);
  const handleFlatListLayout = (0, _react.useCallback)(e => {
    flatListHeightY.value = e.nativeEvent.layout.height;

    // If nested in a scroll container.
    if (scrollViewScrollOffsetY) {
      // Timeout fixes a bug where measure returns height 0.
      setTimeout(() => {
        (0, _reactNativeReanimated.runOnUI)(() => {
          const measurement = (0, _reactNativeReanimated.measure)(flatListRef);
          if (!measurement) {
            return;
          }

          // We need to use pageY because the list might be nested into other views,
          // It's important that we take the measurement of the list without any scroll offset
          // from the scroll container.
          flatListPageY.value = measurement.pageY + ((scrollViewScrollOffsetY === null || scrollViewScrollOffsetY === void 0 ? void 0 : scrollViewScrollOffsetY.value) || 0);
        })();
      }, 100);
    }
    onLayout === null || onLayout === void 0 || onLayout(e);
  }, [flatListRef, flatListPageY, flatListHeightY, scrollViewScrollOffsetY, onLayout]);
  const handleRef = (0, _react.useCallback)(value => {
    flatListRef(value);
    if (typeof ref === 'function') {
      ref(value);
    } else if (ref) {
      ref.current = value;
    }
  }, [flatListRef, ref]);
  const combinedGesture = (0, _react.useMemo)(() => {
    // android is able to handle nested scroll view, but not the full height ones like iOS
    if (outerScrollGesture && !(_reactNative.Platform.OS === 'android' && scrollable)) {
      return _reactNativeGestureHandler.Gesture.Simultaneous(outerScrollGesture, gestureHandler);
    }
    return gestureHandler;
  }, [scrollable, outerScrollGesture, gestureHandler]);
  const composedScrollHandler = (0, _reactNativeReanimated.useComposedEventHandler)([handleScroll, onScroll || null]);
  const renderAnimatedCell = (0, _hooks.useStableCallback)(({
    cellKey,
    ...props
  }) => /*#__PURE__*/_react.default.createElement(_ReorderableListCell.ReorderableListCell, _extends({}, props, {
    // forces remount with key change on reorder
    key: createCellKey(cellKey),
    itemOffset: itemOffset,
    itemHeight: itemHeight,
    dragY: dragY,
    draggedIndex: draggedIndex,
    animationDuration: animationDurationProp,
    startDrag: startDrag
  })));
  return /*#__PURE__*/_react.default.createElement(_contexts.ReorderableListContext.Provider, {
    value: listContextValue
  }, /*#__PURE__*/_react.default.createElement(_reactNativeGestureHandler.GestureDetector, {
    gesture: combinedGesture
  }, /*#__PURE__*/_react.default.createElement(AnimatedFlatList, _extends({}, rest, {
    ref: handleRef,
    data: data,
    keyExtractor: keyExtractor,
    CellRendererComponent: renderAnimatedCell,
    onLayout: handleFlatListLayout,
    onScroll: composedScrollHandler,
    scrollEventThrottle: 1,
    horizontal: false,
    removeClippedSubviews: false,
    numColumns: 1
  }))));
};
const MemoizedReorderableListCore = exports.ReorderableListCore = /*#__PURE__*/_react.default.memo(/*#__PURE__*/_react.default.forwardRef(ReorderableListCore));
//# sourceMappingURL=ReorderableListCore.js.map