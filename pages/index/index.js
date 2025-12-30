const { mockProducts } = require("./data/index.js");

Page({
  data: {
    allProducts: [], // 所有商品数据
    visibleProducts: [], // 当前可见的商品数据
    startIndex: 0, // 起始索引
    endIndex: 20, // 结束索引
    scrollTop: 0, // 滚动距离
    upperHeight: 0, // 上方占位高度
    lowerHeight: 0, // 下方占位高度
  },

  // 虚拟列表配置
  ITEM_HEIGHT: 220, // 每个商品项的高度（rpx转px，约220rpx）
  BUFFER_COUNT: 5, // 缓冲区数量（上下各多渲染5条）
  VIEWPORT_SCALE: 2, // 可视区域倍数（显示屏幕高度的2倍）

  // 滚动节流相关
  lastScrollTop: 0,
  scrollTimer: null,
  isScrolling: false,

  onLoad() {
    setTimeout(() => {
      // 加载商品数据
      this.setData({
        allProducts: mockProducts,
      });

      console.log(`已加载 ${mockProducts.length} 条商品数据`);
      // 获取系统信息计算可视区域
      this.getSystemInfo();
    }, 1500);
  },

  // 获取系统信息
  getSystemInfo() {
    const res = wx.getSystemInfoSync();
    this.systemInfo = res;

    // 计算每个商品项的实际高度（rpx转px）
    const itemHeight = (this.ITEM_HEIGHT * res.windowWidth) / 750;

    // 计算可视区域可以显示的商品数量（屏幕高度的2倍）
    const visibleCount = Math.ceil(
      (res.windowHeight * this.VIEWPORT_SCALE) / itemHeight
    );

    this.itemHeight = itemHeight;
    this.visibleCount = visibleCount;

    console.log("商品项高度:", itemHeight, "px");
    console.log("可视区域商品数量:", visibleCount);

    // 重新计算结束索引 - 需要传入endIndex参数
    const endIndex = Math.min(
      visibleCount + this.BUFFER_COUNT * 2,
      this.data.allProducts.length - 1
    );
    this.updateVisibleProducts(0, endIndex);
  },

  // 监听滚动事件（添加节流和防抖）
  onScroll(e) {
    const scrollTop = e.detail.scrollTop;

    // 节流：只有滚动距离超过阈值才触发更新
    const scrollDiff = Math.abs(scrollTop - this.lastScrollTop);
    const threshold = this.itemHeight * 0.5; // 半个商品高度的阈值

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
    const startIndex = Math.floor(scrollTop / this.itemHeight);

    // 计算结束索引（屏幕高度的2倍 + 缓冲区）
    const endIndex = Math.min(
      startIndex + this.visibleCount + this.BUFFER_COUNT * 2,
      this.data.allProducts.length - 1
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

  // 更新可见商品列表
  updateVisibleProducts(startIndex, endIndex) {
    // 如果没有传入endIndex，则计算一个默认值
    if (endIndex === undefined || endIndex === null) {
      endIndex = startIndex + this.visibleCount + this.BUFFER_COUNT * 2;
      endIndex = Math.min(endIndex, this.data.allProducts.length - 1);
    }

    // 添加缓冲区，上下各多渲染几条
    const actualStartIndex = Math.max(0, startIndex - this.BUFFER_COUNT);
    const actualEndIndex = Math.min(
      endIndex + this.BUFFER_COUNT,
      this.data.allProducts.length - 1
    );

    // 避免重复更新相同的范围
    if (
      actualStartIndex === this.data.startIndex &&
      actualEndIndex === this.data.endIndex
    ) {
      return;
    }

    const visibleProducts = this.data.allProducts.slice(
      actualStartIndex,
      actualEndIndex + 1
    );

    // 计算上下占位高度
    const upperHeight = actualStartIndex * this.itemHeight;
    const lowerHeight =
      (this.data.allProducts.length - actualEndIndex - 1) * this.itemHeight;

    this.setData({
      visibleProducts,
      startIndex: actualStartIndex,
      endIndex: actualEndIndex,
      upperHeight,
      lowerHeight,
    });

    console.log(
      `可见商品: ${actualStartIndex} - ${actualEndIndex}, 共 ${visibleProducts.length} 条`
    );
  },

  // 点击商品
  onProductTap(e) {
    const { product } = e.detail;
    console.log("点击商品:", product);
    wx.showToast({
      title: `点击了商品${product.id}`,
      icon: "none",
    });
  },

  onUnload() {
    // 清理定时器
    if (this.scrollTimer) {
      clearTimeout(this.scrollTimer);
    }
  }
});
