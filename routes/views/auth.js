import express from 'express';
const router = express.Router();

router.get('/register', (req, res) => {
    const token = req.cookies && req.cookies.token;
    if (token) return res.redirect('/me');
    res.render('register', { title: 'Register', error: null, username: '' });
});

router.get('/login', (req, res) => {
    const token = req.cookies && req.cookies.token;
    if (token) return res.redirect('/me');
    const registered = req.query.registered;
    res.render('login', { title: 'Login', registered });
});

router.get('/logout', (req, res) => {
    res.clearCookie('token');
    res.redirect('/login');
});

// Add view-only routes here

export default router;