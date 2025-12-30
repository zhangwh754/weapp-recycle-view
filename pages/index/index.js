const { mockProducts } = require("./data/index.js");

Page({
  data: {
    allProducts: [], // 所有商品数据
    visibleProducts: [], // 当前可见的商品数据
  },

  onLoad() {
    setTimeout(() => {
      // 加载商品数据
      this.setData({
        allProducts: mockProducts,
      });
      console.log(`已加载 ${mockProducts.length} 条商品数据`);
    }, 1500);
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
