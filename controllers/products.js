import Product from "../models/product.js";

const getAllProductsStatic = async (req, res) => {
  const search = "ac";
  const products = await Product.find({}).sort("name");

  res.status(200).json({ products, nbHits: products.length });
};
const getAllProducts = async (req, res) => {
  const { featured, company, name, sort, fields, numericFilters } = req.query;
  const queryObject = {};

  if (featured) {
    queryObject.featured = featured === "true" ? true : false;
  }
  if (company) {
    queryObject.company = company;
  }
  if (name) {
    queryObject.name = { $regex: name, $options: "i" };
  }

  // Numeric Filters
  // Numeric Filters
  if (numericFilters) {
    const operatorMap = {
      ">": "$gt",
      ">=": "$gte",
      "<": "$lt",
      "<=": "$lte",
      "=": "$eq",
    };
    // مهم: نحط المشغلات الأطول الأول
    const regEx = /(<=|>=|<|>|=)/g;

    // أشيل أي مسافات عشان أضمن التطابق
    let filters = numericFilters.replace(/\s+/g, "");

    // price>40,rating>=4  ->  price-$gt-40,rating-$gte-4
    filters = filters.replace(regEx, (match) => `-${operatorMap[match]}-`);

    const options = ["price", "rating"];
    // لا تعيّن نتيجة forEach
    filters.split(",").forEach((item) => {
      const [field, operator, value] = item.split("-");
      if (options.includes(field) && !isNaN(Number(value))) {
        // لو الحقل موجود بالفعل ندمج المشغلات بدل الاستبدال
        queryObject[field] = {
          ...(queryObject[field] || {}),
          [operator]: Number(value),
        };
      }
    });
  }
  let result = Product.find(queryObject);

  // sort
  if (sort) {
    let sortedProducts = sort
      .split(",")
      .map((item) => item.trim()) // يشيل أي فراغات زيادة
      .join(" "); // يحط مسافات زي ما Mongoose عايز
    result = result.sort(sortedProducts);
  } else {
    result = result.sort("createdAt");
  }
  //fields
  if (fields) {
    let fieldsProducts = fields
      .split(",")
      .map((item) => item.trim()) // يشيل أي فراغات زيادة
      .join(" "); // يحط مسافات زي ما Mongoose عايز
    result = result.select(fieldsProducts);
  }
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  result = result.skip(skip).limit(limit);
  let products = await result;

  res.status(200).json({ products, numberOfProducts: products.length });
};

export { getAllProducts, getAllProductsStatic };
