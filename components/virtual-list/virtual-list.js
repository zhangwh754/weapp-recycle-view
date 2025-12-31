Component({
  properties: {
    // 完整的列表数据
    list: {
      type: Array,
      value: [],
      observer: function (newVal) {
        // 当list数据变化时，重新初始化可见列表
        if (newVal && newVal.length > 0 && this.itemHeightPx) {
          this.initVisibleList();
        }
      },
    },
    // 单个元素的高度（rpx）
    itemHeight: {
      type: Number,
      value: 220,
    },
    // 初始化显示的数据条数
    initCount: {
      type: Number,
      value: 20,
    },
    // 预设的可见数据（可选）
    visibleProducts: {
      type: Array,
      value: null,
      observer: function (newVal) {
        if (newVal && newVal.length > 0) {
          this.setData({
            visibleList: newVal,
          });
        }
      },
    },
    // 可视区域倍数
    viewportScale: {
      type: Number,
      value: 2,
    },
    // 缓冲区数量（上下各多渲染的数量）
    bufferCount: {
      type: Number,
      value: 5,
    },
  },

  data: {
    visibleList: [], // 当前可见的列表数据
    startIndex: 0, // 起始索引
    endIndex: 0, // 结束索引
    scrollTop: 0, // 滚动距离
    upperHeight: 0, // 上方占位高度
    lowerHeight: 0, // 下方占位高度
  },

  lifetimes: {
    attached() {
      // 初始化系统信息
      this.initSystemInfo();
    },
  },

  methods: {
    // 初始化系统信息
    initSystemInfo() {
      const res = wx.getSystemInfoSync();
      this.systemInfo = res;

      // 计算每个商品项的实际高度（rpx转px）
      const itemHeightPx = (this.properties.itemHeight * res.windowWidth) / 750;

      // 计算可视区域可以显示的商品数量
      const visibleCount = Math.ceil(
        (res.windowHeight * this.properties.viewportScale) / itemHeightPx,
      );

      this.itemHeightPx = itemHeightPx;
      this.visibleCount = visibleCount;

      console.log("虚拟列表项高度:", itemHeightPx, "px");
      console.log("可视区域数量:", visibleCount);

      // 如果有list数据，初始化可见列表
      if (this.properties.list && this.properties.list.length > 0) {
        this.initVisibleList();
      }
    },

    // 初始化可见列表（根据initCount渲染前N条数据）
    initVisibleList() {
      const initCount = this.properties.initCount;
      const endIndex = Math.min(initCount - 1, this.properties.list.length - 1);
      console.log("初始化可见列表:", {
        initCount,
        endIndex,
      });
      this.updateVisibleProducts(0, endIndex);
    },

    // 监听滚动事件
    onScroll(e) {
      const scrollTop = e.detail.scrollTop;

      // 节流：只有滚动距离超过阈值才触发更新
      const scrollDiff = Math.abs(scrollTop - this.lastScrollTop);
      const threshold = this.itemHeightPx * 0.5; // 半个商品高度的阈值

      // 如果滚动距离太小，不处理
      if (scrollDiff < threshold && this.isScrolling) {
        return;
      }

      this.lastScrollTop = scrollTop;
      this.isScrolling = true;

      // 清除之前的定时器
      if (this.scrollTimer) {
        clearTimeout(this.scrollTimer);
      }

      // 计算起始索引
      const startIndex = Math.floor(scrollTop / this.itemHeightPx);

      // 计算结束索引
      const endIndex = Math.min(
        startIndex + this.visibleCount + this.properties.bufferCount * 2,
        this.properties.list.length - 1,
      );

      // 如果索引发生变化，才更新数据
      if (
        startIndex !== this.data.startIndex ||
        endIndex !== this.data.endIndex
      ) {
        this.updateVisibleProducts(startIndex, endIndex);
      }

      // 设置定时器，延迟重置滚动状态
      this.scrollTimer = setTimeout(() => {
        this.isScrolling = false;
      }, 100);
    },

    // 滚动到顶部事件
    onScrollToUpper(e) {
      this.triggerEvent("scrolltoupper", e.detail);
    },

    // 滚动到底部事件
    onScrollToLower(e) {
      this.triggerEvent("scrolltolower", e.detail);
    },

    // 更新可见列表
    updateVisibleProducts(startIndex, endIndex) {
      if (!this.properties.list || this.properties.list.length === 0) {
        return;
      }

      // 如果没有传入endIndex，则计算一个默认值
      if (endIndex === undefined || endIndex === null) {
        endIndex =
          startIndex + this.visibleCount + this.properties.bufferCount * 2;
        endIndex = Math.min(endIndex, this.properties.list.length - 1);
      }

      // 添加缓冲区，上下各多渲染几条
      const actualStartIndex = Math.max(
        0,
        startIndex - this.properties.bufferCount,
      );
      const actualEndIndex = Math.min(
        endIndex + this.properties.bufferCount,
        this.properties.list.length - 1,
      );

      // 避免重复更新相同的范围
      if (
        actualStartIndex === this.data.startIndex &&
        actualEndIndex === this.data.endIndex
      ) {
        return;
      }

      const visibleList = this.properties.list.slice(
        actualStartIndex,
        actualEndIndex + 1,
      );

      // 计算上下占位高度
      const upperHeight = actualStartIndex * this.itemHeightPx;
      const lowerHeight =
        (this.properties.list.length - actualEndIndex - 1) * this.itemHeightPx;

      this.setData({
        visibleList,
        startIndex: actualStartIndex,
        endIndex: actualEndIndex,
        upperHeight,
        lowerHeight,
      });

      console.log(
        `组件内部可见列表更新: ${actualStartIndex} - ${actualEndIndex}, 共 ${visibleList.length} 条`,
      );

      // 触发事件，将visibleProducts传递到外部
      this.triggerEvent("visiblechange", {
        visibleProducts: visibleList,
        startIndex: actualStartIndex,
        endIndex: actualEndIndex,
      });
    },
  },

  pageLifetimes: {
    unload() {
      // 清理定时器
      if (this.scrollTimer) {
        clearTimeout(this.scrollTimer);
      }
    },
  },
});