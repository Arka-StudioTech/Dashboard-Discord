module.exports = {
    bot: {
        token: '',
        owners: '',
        mongourl: ""

    },

    website: {
        callback: "http://localhost:3000/auth/discord/callback",
        secret: "",
        clientID: "",
        FRONTEND_URL: "http://localhost:5173",
        scopes: ["identify", "guilds"],
    },

    server: {
        id:"1223619219308937320",
        channels: {
            login:'1223619219308937323',
            webstatus: '1223619219308937323'
        },
        roles: {
            admin: "1223619244248272896"
        }
    }
}