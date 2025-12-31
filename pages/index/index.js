const { mockProducts } = require("./data/index.js");

Page({
  data: {
    allProducts: [], // 已加载的商品数据
    visibleProducts: [], // 当前可见的商品数据
    loading: false, // 是否正在加载
    currentPage: 0, // 当前页码
    pageSize: 3000, // 每页数量
    totalProducts: 3000, // 总数据量
  },

  onLoad() {
    // 初始加载第一页数据
    this.loadMoreData();
  },

  // 加载更多数据
  loadMoreData() {
    // 如果正在加载或已达到总数，则不再加载
    if (this.data.loading || this.data.allProducts.length >= this.data.totalProducts) {
      return;
    }

    this.setData({
      loading: true,
    });

    // 模拟网络延迟
    setTimeout(() => {
      const currentPage = this.data.currentPage;
      const startIndex = currentPage * this.data.pageSize;
      const endIndex = Math.min(startIndex + this.data.pageSize, this.data.totalProducts);

      // 获取这一页的数据
      const newProducts = mockProducts.slice(startIndex, endIndex);

      // 将新数据追加到已有数据中
      this.setData({
        allProducts: [...this.data.allProducts, ...newProducts],
        currentPage: currentPage + 1,
        loading: false,
      });

      console.log(`已加载第 ${currentPage + 1} 页，新增 ${newProducts.length} 条数据，总共 ${this.data.allProducts.length} 条`);
    }, 500);
  },

  // 滚动到底部事件
  onScrollToLower() {
    console.log("滚动到底部，触发加载更多");
    this.loadMoreData();
  },

  // 监听虚拟列表组件的可见数据变化
  onVisibleChange(e) {
    const { visibleProducts, startIndex, endIndex } = e.detail;
    console.log("可见商品:", {
      startIndex,
      endIndex,
      count: visibleProducts.length,
    });
    // 更新页面的 visibleProducts，插槽内容会重新渲染
    this.setData({
      visibleProducts,
    });
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
});
