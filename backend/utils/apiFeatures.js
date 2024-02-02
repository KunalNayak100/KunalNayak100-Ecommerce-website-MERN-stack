class ApiFeatures {
  constructor(query, queryStr) {
    //query is product.find()
    //querystr is jitne bhi params denge unka json like ek hi param dia hai to { keyword: 'product2' }

    this.query = query;
    this.queryStr = queryStr;
  }

  search() {
    const keyword = this.queryStr.keyword
      ? {
          name: {
            $regex: this.queryStr.keyword,
            //i for case insensitive
            $options: "i",
          },
        }
      : {};
    //query ko modify krke query ke andar regular expression search kia hai, eg product.find() ki jaha product.find({name:"regex"})
    this.query = this.query.find({ ...keyword });
    return this;
  }

  filter() {
    const queryCopy = { ...this.queryStr };
    //   Removing some fields for category
    const removeFields = ["keyword", "page", "limit"];

    removeFields.forEach((key) => delete queryCopy[key]);

    // Filter For Price and Rating

    let queryStr = JSON.stringify(queryCopy);
    queryStr = queryStr.replace(/\b(gt|gte|lt|lte)\b/g, (key) => `$${key}`);

    this.query = this.query.find(JSON.parse(queryStr));

    return this;
  }

  pagination(resultPerPage){
    const currentPage=Number(this.queryStr.page)||1;

    const skip=resultPerPage*(currentPage-1);
    this.query=this.query.limit(resultPerPage).skip(skip);
    return this;
  }
}

module.exports = ApiFeatures;
