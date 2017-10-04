requirejs.config({
    base_url: '/static',
    paths: {
        jquery: 'jquery.min',
        velocity: 'velocity.min'
    }
});
 
require(['velocity', 'sidebar']);
