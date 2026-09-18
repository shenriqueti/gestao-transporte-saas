const supabase = require('../config/supabase');

function unauthorized(res) {
    return res.status(401).json({ error: 'Authentication required' });
}

function authUnavailable(res) {
    return res.status(503).json({ error: 'Authentication service unavailable' });
}

async function authMiddleware(req, res, next) {
    const authorization = req.get('Authorization');

    if (!authorization) {
        return unauthorized(res);
    }

    const [scheme, token, ...extraParts] = authorization.trim().split(/\s+/);
    if (scheme !== 'Bearer' || !token || extraParts.length > 0) {
        return unauthorized(res);
    }

    try {
        const { data, error } = await supabase.auth.getUser(token);

        if (error || !data.user) {
            if (error && (error.status === 401 || error.status === 403)) {
                return unauthorized(res);
            }

            return authUnavailable(res);
        }

        req.user = {
            id: data.user.id,
            email: data.user.email
        };

        return next();
    } catch (error) {
        return authUnavailable(res);
    }
}

module.exports = authMiddleware;
