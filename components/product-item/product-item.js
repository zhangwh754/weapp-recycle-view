Component({
  /**
   * 组件的属性列表
   */
  properties: {
    product: {
      type: Object,
      value: {}
    }
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    // 点击商品项
    onTap() {
      this.triggerEvent('tap', {
        product: this.data.product
      });
    }
  }
});
