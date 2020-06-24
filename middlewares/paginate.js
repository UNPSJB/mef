function paginateData(req, res, next) {
    let page = req.query.page
    let limit = req.query.limit

    page = Number.parseInt(page)
    limit = Number.parseInt(limit)
    
    // por defecto page = 1, limit = 10
    if (isNaN(page)) page = 0
    if (isNaN(limit)) limit = 10
    
    req.query.page = page
    req.query.limit = limit

    next()
}
module.exports = paginateData