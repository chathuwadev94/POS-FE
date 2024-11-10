export const environment = {
    production: false,
    apiBaseUrl: 'http://localhost:3000/v1/',
    services :{
        auth:'auth',
        user: 'user',
        stock:'stock',
        item:'item'
    },
    cookies:{
        authCookieName : 'AUTH_USER',
        cartKey:'CART'
    },
    localStorageKeys:{
        cartKey:'CART'
    }
};
