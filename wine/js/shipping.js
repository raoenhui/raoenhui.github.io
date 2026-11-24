(function () {
  // 顺丰运费按收货地区分三档：首瓶价 + 每增加一瓶的加价。
  const groups = [
    {first:12, extra:4, provinces:'上海市 安徽省 江苏省 浙江省'.split(' ')},
    {first:21, extra:8, provinces:'北京市 福建省 河北省 河南省 湖北省 湖南省 江西省 内蒙古自治区 山东省 山西省 天津市'.split(' ')},
    {first:22, extra:10, provinces:'四川省 甘肃省 广东省 广西壮族自治区 贵州省 陕西省 海南省 黑龙江省 吉林省 辽宁省 宁夏回族自治区 青海省 云南省 西藏自治区 新疆维吾尔自治区'.split(' ')},
  ];
  const threshold = 2000;      // 酒款小计满 ¥2,000 免运费（包装费照收）
  const packingFee = 2;        // 每瓶酒、每个皮盒各收的防破损包装费

  // 顺丰运费已包含皮盒的运送成本，不再单独收取皮盒运费；
  // 这里统计皮盒数只是为了计算每件 ¥2 的防破损包装费。
  // 套餐内含的酒瓶数与皮质包装件数。
  const bundleUnits = {
    'bundle-king':       {bottles:2, boxes:1},  // 2022 + 2019 + 黑色皮质礼盒
    'bundle-td-1':       {bottles:2, boxes:1},  // 天 + 地 + 黑色皮质礼盒
    'bundle-td-2':       {bottles:2, boxes:0},  // 交 + 通 + 纸袋
    'bundle-sjtu-1':     {bottles:2, boxes:1},  // 甜白 + 玫瑰红 + 皮质礼袋
    'bundle-sjtu-2':     {bottles:2, boxes:1},  // 冰白 + 冰红 + 皮质礼袋
    'bundle-sjtu-3':     {bottles:2, boxes:1},  // 干红 + 甜白 + 红色皮质礼盒
    'bundle-sjtu-4':     {bottles:2, boxes:1},  // 橡木桶 + 晚收甜白 + 红色皮质礼盒
    'bundle-1':          {bottles:2, boxes:1},  // 珍藏干红 + 珍藏干白 + 黑色皮质礼盒
    'bundle-2':          {bottles:2, boxes:1},  // 珍藏干红 + 脱醇甜红 + 红色皮质礼盒
    'bundle-3':          {bottles:2, boxes:1},  // 脱醇甜红 + 珍藏干白 + 皮质礼袋
    'bundle-td-3-sky':   {bottles:1, boxes:0},  // 单支 + 木盒
    'bundle-td-3-earth': {bottles:1, boxes:0},
    'bundle-td-3-red':   {bottles:1, boxes:0},
    'bundle-td-3-rose':  {bottles:1, boxes:0},
  };
  // 包装周边中按“皮盒”计费的商品（皮质礼盒/皮箱/皮袋）；木盒、纸袋、酒杯、开瓶器不计。
  const boxItems = new Set([
    'merch-sjtu-box', 'merch-black-2', 'merch-black-4', 'merch-indigo-case', 'merch-lychee-bag',
  ]);

  // 一件商品折算的酒瓶数与皮盒数。
  function units(item) {
    if (!item) return {bottles:0, boxes:0};
    if (bundleUnits[item.id]) return bundleUnits[item.id];
    if (boxItems.has(item.id)) return {bottles:0, boxes:1};
    if (item.series === '包装周边') return {bottles:0, boxes:0};
    return {bottles:1, boxes:0};
  }

  // 汇总整单的酒瓶数、皮盒数（皮盒仅计入包装费）。
  function countUnits(lines) {
    return lines.reduce((total, {item, qty}) => {
      const u = units(item);
      total.bottles += u.bottles * qty;
      total.boxes += u.boxes * qty;
      return total;
    }, {bottles:0, boxes:0});
  }

  function quote(subtotal, bottles, boxes, method, province) {
    // 自提：无快递费，也无包装费。
    if (method === 'pickup') return {shipping:0, packing:0, total:subtotal};
    const group = groups.find(group => group.provinces.includes(province));
    if (!group) return {shipping:null, packing:null, total:null};
    const freeShipping = subtotal >= threshold;
    const shipping = freeShipping || !bottles ? 0 : group.first + (bottles - 1) * group.extra;
    const packing = (bottles + boxes) * packingFee;
    return {shipping, packing, total:subtotal + shipping + packing};
  }

  const rules = {groups, threshold, packingFee, bundleUnits, boxItems, units, countUnits, quote};
  if (typeof module === 'object') module.exports = rules;
  else window.WineShipping = rules;
})();
