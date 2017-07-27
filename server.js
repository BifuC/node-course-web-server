const express = require('express');
const hbs = require('hbs');
const fs = require('fs');

// heroku will set an environment variable to use for the listening port (see app.listen
// call further below).  heroku will change it everytime you deploy your app, so need to 
// get it / set it here, in order for node to be able to use it.
// Note that, in order to run locally, we will need to use a local port (3000) instead.
const port = process.env.PORT || 3000;

var app = express();

// register the location to use hbs partials (exa., footer.hbs) from.
// Use them in hbs files as {{> footer}}
hbs.registerPartials(__dirname + '/views/partials');
app.set('view engine', 'hbs');

app.use((req, res, next) => {
    // This middleware allows us to add in some logging of our requests.
    var now = new Date().toString();
    var log = `${now}: ${req.method} ${req.url}`;

    fs.appendFile('server.log', log + '\n', (err) => {
        if (err) {
            console.log('Unable to append to server.log');
        }
    });

    console.log(`${now}: ${req.method} ${req.url}`);
    // Need to call next(), in order for the anonymous, middleware call to continue. 
    next();
});

/*
// Register maintenance middleware
app.use((req, res, next) => {
    res.render('maintenance.hbs');
    // By not calling next() here, any get handlers below will never be processed.
    // This prevents the user from getting past the Maintenance page.
    next();
})
*/

// You need to register this directory middleware after the above Maintenance middleware.
// If you don't, pages in the public  directory (help.html) will still render before Maintenance can stop them.
app.use(express.static(__dirname + '/public'));

// register some HandleBars data to be used with {{getCurrentYear}} in an hbs template.
hbs.registerHelper('getCurrentYear', () => {
    return new Date().getFullYear();
});

// register some HandleBars method to be used with {{screamIt welcomeMessage}} in an hbs template.
hbs.registerHelper('screamIt', (text) => {
    return text.toUpperCase();
});

app.get('/', (req, res) => {
    // res.send('<h1>Hello Express</h1>');
    /*res.send({name:'Bob', likes:[
        'Biking',
        'Hiking'
    ]});*/
    res.render('home.hbs', {
        welcomeMessage: 'Welcome to my awesome page',
        pageTitle: 'Home Page'
    });
});

app.get('/about', (req, res) => {
    res.render('about.hbs', {
        pageTitle: 'About Page'
    });
});

app.get('/bad', (req, res) => {
    res.send({
        errorMessage: 'Unable to handle request'
    });
});

app.listen(port, () => {
    console.log(`Server is up on port ${port}`);
});