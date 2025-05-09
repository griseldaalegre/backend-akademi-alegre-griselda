async function paginate(model, filter = {}, page = 1, limit = 10) {
  page = parseInt(page);
  limit = parseInt(limit);
  const skip = (page - 1) * limit;

  const data = await model.find(filter).skip(skip).limit(limit);
  const total = await model.countDocuments(filter);

  return {
    total,
    page,
    pages: Math.ceil(total / limit),
    data,
  };
}

module.exports = paginate;
