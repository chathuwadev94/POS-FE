export const environment = {
    production: false,
    apiBaseUrl: 'http://localhost:3000/v1/',
    services :{
        auth:'auth',
        user: 'user',
        stock:'stock',
        item:'item',
        sale:'sale'
    },
    cookies:{
        authCookieName : 'AUTH_USER',
       
    },
    localStorageKeys:{
        cartKey:'CART'
    }
};
