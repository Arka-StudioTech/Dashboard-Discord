const express = require('express');
const session = require('express-session');
const passport = require('passport');
const axios = require('axios')
const fs = require('fs');
const path = require('path');
const DiscordStrategy = require('passport-discord').Strategy;
const cors = require('cors'); 
const MongoStore = require('connect-mongo');
const config = require('./config.js');
require('dotenv').config();

const app = express();

app.use(cors({
  origin: config.website.FRONTEND_URL,
  credentials: true,
}));

app.use(express.json());

app.use(session({
  secret: 'your-secret-key',
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({
    mongoUrl: config.bot.mongourl,
    ttl: 365 * 24 * 60 * 60,
  }),
  cookie: {
    secure: false,
    httpOnly: true,
    sameSite: 'lax',
    maxAge: 365 * 24 * 60 * 60 * 1000,
  },
}));

app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser((user, done) => {
  done(null, user);
});
passport.deserializeUser((obj, done) => {
  done(null, obj);
});

passport.use(new DiscordStrategy({
  clientID: config.website.clientID,
  clientSecret: config.website.secret,
  callbackURL: config.website.callback,
  scope: ['identify', 'email', 'guilds']
}, (accessToken, refreshToken, profile, done) => {
  profile.accessToken = accessToken; // إضافة الـ access token إلى الملف الشخصي
  process.nextTick(() => done(null, profile));
}));

app.get('/auth/discord', (req, res, next) => {
  if (req.headers.referer) {
    req.session.redirectTo = req.headers.referer;
  }
  passport.authenticate('discord')(req, res, next);
});

app.get('/auth/discord/callback', passport.authenticate('discord', {
  failureRedirect: '/'
}), (req, res) => {
  const redirectTo = req.session.redirectTo || config.website.FRONTEND_URL;
  delete req.session.redirectTo;
  res.redirect(redirectTo);
});

app.get('/logout', (req, res) => {
  req.logout((err) => {
    if (err) console.log(err);
    req.session.destroy(() => {
      res.redirect(config.website.FRONTEND_URL);
    });
  });
});

app.get('/api/user', (req, res) => {
  res.json(req.user || null);
});

// --- Partners Endpoints --- //

const partnersFile = path.join(__dirname, 'partners.json');

// Middleware to verify admin privileges
const isAdmin = (req, res, next) => {
  if (req.user && req.user.id) {
    const isOwner = Array.isArray(config.bot.owners)
      ? config.bot.owners.includes(req.user.id)
      : config.bot.owners === req.user.id;
    const hasAdminRole = req.user.roles && req.user.roles.includes(config.server.roles.admin);
    if (isOwner || hasAdminRole) {
      return next();
    }
  }
  res.status(403).json({ error: 'Unauthorized' });
};

// Endpoint to check admin status
app.get('/api/check-admin', (req, res) => {
  if (req.user && req.user.id) {
    const isOwner = Array.isArray(config.bot.owners)
      ? config.bot.owners.includes(req.user.id)
      : config.bot.owners === req.user.id;
    const hasAdminRole = req.user.roles && req.user.roles.includes(config.server.roles.admin);
    if (isOwner || hasAdminRole) {
      return res.json({ isAdmin: true });
    }
  }
  res.json({ isAdmin: false });
});

// Public endpoint to get partners (no admin check)
app.get('/api/partners', (req, res) => {
  fs.readFile(partnersFile, 'utf8', (err, data) => { // use utf8 encoding
    if (err) {
      console.error("Error reading partners file:", err);
      return res.status(500).json({ error: 'Error reading file' });
    }
    let partners;
    try {
      partners = JSON.parse(data);
    } catch (parseErr) {
      console.error("Error parsing partners file:", parseErr);
      return res.status(500).json({ error: 'Error parsing JSON file' });
    }
    if (!Array.isArray(partners)) {
      console.warn("Partners is not an array. Converting to empty array.");
      partners = [];
    }
    res.json(partners);
  });
});


// POST: Add new partner (protected)
app.post('/api/admin/partners', isAdmin, (req, res) => {
  const newPartner = req.body;
  fs.readFile(partnersFile, (err, data) => {
    if (err) return res.status(500).json({ error: 'Error reading file' });
    let partners;
    try {
      partners = JSON.parse(data);
    } catch (parseErr) {
      return res.status(500).json({ error: 'Error parsing JSON file' });
    }
    if (!Array.isArray(partners)) {
      partners = [];
    }
    partners.push(newPartner);
    fs.writeFile(partnersFile, JSON.stringify(partners, null, 2), (err) => {
      if (err) return res.status(500).json({ error: 'Error writing file' });
      res.status(201).json(newPartner);
    });
  });
});

// PUT: Update partner (protected)
app.put('/api/admin/partners/:id', isAdmin, (req, res) => {
  const partnerId = req.params.id;
  const updatedPartner = req.body;
  fs.readFile(partnersFile, (err, data) => {
    if (err) return res.status(500).json({ error: 'Error reading file' });
    let partners;
    try {
      partners = JSON.parse(data);
    } catch (parseErr) {
      return res.status(500).json({ error: 'Error parsing JSON file' });
    }
    if (!Array.isArray(partners)) {
      partners = [];
    }
    partners = partners.map(p => (p.id === partnerId ? updatedPartner : p));
    fs.writeFile(partnersFile, JSON.stringify(partners, null, 2), (err) => {
      if (err) return res.status(500).json({ error: 'Error writing file' });
      res.json(updatedPartner);
    });
  });
});

// DELETE: Remove partner (protected)
app.delete('/api/admin/partners/:id', isAdmin, (req, res) => {
  const partnerId = req.params.id;
  fs.readFile(partnersFile, (err, data) => {
    if (err) return res.status(500).json({ error: 'Error reading file' });
    let partners;
    try {
      partners = JSON.parse(data);
    } catch (parseErr) {
      return res.status(500).json({ error: 'Error parsing JSON file' });
    }
    if (!Array.isArray(partners)) {
      partners = [];
    }
    partners = partners.filter(p => p.id !== partnerId);
    fs.writeFile(partnersFile, JSON.stringify(partners, null, 2), (err) => {
      if (err) return res.status(500).json({ error: 'Error writing file' });
      res.status(204).end();
    });
  });
});



// --- Endpoints for fetching user guilds --- //

app.get('/api/user/guilds', async (req, res) => {
  if (!req.user || !req.user.accessToken) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const userGuildsResp = await axios.get('https://discord.com/api/users/@me/guilds', {
      headers: { Authorization: `Bearer ${req.user.accessToken}` }
    });
    let userGuilds = userGuildsResp.data; 

    const botGuildsResp = await axios.get('https://discord.com/api/users/@me/guilds', {
      headers: { Authorization: `Bot ${config.bot.token}` } 
    });
    const botGuilds = botGuildsResp.data; 

    const botGuildIDs = botGuilds.map(g => g.id);

    userGuilds = userGuilds.map(g => {
      g.hasBot = botGuildIDs.includes(g.id); 
      return g;
    });

    res.json(userGuilds);
  } catch (err) {
    console.error("Error fetching guilds:", err.response?.data || err.message);
    res.status(500).json({ error: 'Failed to fetch guilds' });
  }
});

// إضافة هذا الكود إلى ملف السيرفر (server.js مثلاً)
app.get('/api/server/:id/details', async (req, res) => {
  if (!req.user) return res.status(401).json({ error: 'Unauthorized' });
  
  const guildId = req.params.id;
  
  try {
    const [guildResp, channelsResp, rolesResp] = await Promise.all([
      axios.get(`https://discord.com/api/guilds/${guildId}`, {
        headers: { Authorization: `Bot ${config.bot.token}` }
      }),
      axios.get(`https://discord.com/api/guilds/${guildId}/channels`, {
        headers: { Authorization: `Bot ${config.bot.token}` }
      }),
      axios.get(`https://discord.com/api/guilds/${guildId}/roles`, {
        headers: { Authorization: `Bot ${config.bot.token}` }
      })
    ]);
    
    const details = {
      guild: guildResp.data,
      channels: channelsResp.data,
      roles: rolesResp.data,
      channelCount: channelsResp.data.length,
      roleCount: rolesResp.data.length
    };
    
    res.json(details);
  } catch (err) {
    console.error("Error fetching server details:", err.response?.data || err.message);
    res.status(500).json({ error: 'Failed to fetch server details' });
  }
});





const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
