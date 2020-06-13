'use strict'
const generatePagination = (total, page, limit) => {
  const totalPages = Math.ceil((total / limit) - 1) || 0
  const nextPage = (page + 1 > totalPages) ? 0 : page + 1
  const prevPage = (page - 1 < 0) ? 0 : page - 1
  const lastIndex = (1 + page) * limit //if page = 0, last 10, if page 2, 30
  const firstIndex = ((lastIndex - limit) > 0) ? (lastIndex - limit) : 1  //if page = 0, firstIndex = 1 
  return {
    total,
    page,
    limit,
    nextPage,
    prevPage,
    totalPages,
    firstIndex,
    lastIndex
  }
}
// total: clientes.count, page, limit, nextPage, prevPage, totalPages,
const paginateModel = ({ page, pageSize }) => {
  const offset = page * pageSize
  const limit = pageSize
  return {
    offset,
    limit,
  }
}

module.exports = {
  generatePagination,
  paginateModel
}