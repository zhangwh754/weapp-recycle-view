/**
 * 根据字符串生成固定的hash颜色
 * @param {string} str - 输入字符串
 * @returns {string} - 十六进制颜色值
 */
function stringToColor(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  const color = Math.abs(hash).toString(16);
  return "#" + color.padStart(6, "0");
}

/**
 * 生成mock商品图片URL（使用占位图服务）
 * @param {string} color - 颜色值
 * @param {number} id - 商品ID
 * @returns {string} - 图片URL
 */
function generateProductImage(color, id) {
  // 使用picsum.photos作为占位图服务，添加固定参数确保图片稳定
  return `https://picsum.photos/seed/${id}/200/200`;
}

/**
 * 生成随机价格
 * @returns {number} - 价格（保留2位小数）
 */
function generatePrice() {
  return (Math.random() * 1000 + 10).toFixed(2);
}

/**
 * 生成随机库存
 * @returns {number} - 库存数量
 */
function generateStock() {
  return Math.floor(Math.random() * 1000);
}

/**
 * 商品分类列表
 */
const categories = [
  "电子产品",
  "服装鞋帽",
  "食品饮料",
  "家居用品",
  "美妆护肤",
  "运动户外",
  "图书文具",
  "母婴用品",
  "汽车用品",
  "数码配件",
];

/**
 * 生成mock商品数据
 * @param {number} count - 商品数量
 * @returns {Array} - 商品数据数组
 */
function generateMockProducts(count = 3000) {
  const products = [];

  for (let i = 1; i <= count; i++) {
    const category = categories[Math.floor(Math.random() * categories.length)];
    const color = stringToColor(`product_${i}`);

    products.push({
      id: i,
      name: `${category} - 商品${i}`,
      category: category,
      price: parseFloat(generatePrice()),
      originalPrice: parseFloat((parseFloat(generatePrice()) * 1.2).toFixed(2)),
      stock: generateStock(),
      image: generateProductImage(color, i),
      color: color,
      description: `这是${category}的高品质商品，型号${i}，具有优异的性能和性价比。`,
      sales: Math.floor(Math.random() * 10000),
      rating: (Math.random() * 2 + 3).toFixed(1), // 3.0-5.0之间的评分
      tags:
        Math.random() > 0.5 ? ["热销"] : Math.random() > 0.5 ? ["新品"] : [],
      createTime: new Date(
        Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000,
      ).toISOString(),
    });
  }

  return products;
}

// 生成3000条商品数据
const mockProducts = generateMockProducts(1200);

console.log(`已生成 ${mockProducts.length} 条商品数据`);

module.exports = {
  mockProducts,
  generateMockProducts,
  stringToColor,
  generateProductImage,
};
