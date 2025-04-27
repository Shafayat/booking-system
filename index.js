import express from 'express';
import sequelize from './db/index.js';
import routes from './routes/index.js';
import dotenv from 'dotenv';
import path from 'path';
import expressLayouts from 'express-ejs-layouts';
import {fileURLToPath} from 'url';
import cookieParser from 'cookie-parser';
import seed from './db/seed.js';

dotenv.config();

// Support ES modules __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({extended: true}));

// Set EJS view engine and views path
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(expressLayouts);
app.set('layout', 'layout');
app.use(express.static(path.join(__dirname, 'public')));
app.use(cookieParser());
app.use((req, res, next) => {
    // If JWT auth is in cookies; adjust if you use sessions or headers instead
    const token = req.cookies && req.cookies.token;
    res.locals.loggedIn = !!token;
    next();
});

// Sync models
sequelize.sync();

// Use aggregated routes
app.use('/', routes);

// Simple home page
app.get('/', (req, res) => {
    res.render('index', {title: 'Home'});
});


sequelize.sync().then(async () => {
    await seed();
    app.listen(PORT, () => {
        console.log(`Server running at http://localhost:${PORT}`);
    });
});

