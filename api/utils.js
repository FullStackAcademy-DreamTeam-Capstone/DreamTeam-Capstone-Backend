
function requireUser(req, res, next) {
    if (!req.user) {
        res.status(401)
        next({
            error: "401",
            name: "MissingUserError",
            message: "You must be logged in to perform this action"
        })
    }
    next()
}

function requireAdmin(req, res, next) {
console.log(req.user, "this is req.user")

    if (!req.user.isadmin) {
        res.status(401)
        next({
            error: "401",
            name: "MissingAdminError",
            message: "You must be an Admin to perform this action"
        })
    }
    next()
}

module.exports = {requireUser, requireAdmin}