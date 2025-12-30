const { mockProducts } = require('./data/index.js');

Page({
  data: {
    products: []
  },

  onLoad() {
    // 加载商品数据
    this.setData({
      products: mockProducts
    });

    console.log(`已加载 ${mockProducts.length} 条商品数据`);
  },

  // 点击商品
  onProductTap(e) {
    const { product } = e.detail;
    console.log('点击商品:', product);
    wx.showToast({
      title: `点击了商品${product.id}`,
      icon: 'none'
    });
  }
});
