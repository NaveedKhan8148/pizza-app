 const authController = require('../app/http/controllers/authController')
const cartController = require('../app/http/controllers/customers/cartController');
const homeController = require('../app/http/controllers/homeColntroller')
const guest = require('../app/http/middlewares/guest')
function initRoutes(app){
    app.get('/',homeController().index);
    app.get('/cart',cartController().index);  
    app.get('/login',guest,authController().login);
    app.post('/login',authController().postLogin);
    app.get('/register',guest,authController().register);
    app.post('/register',authController().PostRegister);
    app.post('/update-cart',cartController().update)
    app.post('/logout',authController().logout)
}

module.exports= initRoutes;