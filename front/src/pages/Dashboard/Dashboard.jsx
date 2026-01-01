import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import config from '../../config.json';
import '../asset/css/UserServers.css';
import Navbar from "../../components/public/parts/Navbar";
import { LanguageContext } from '../../LanguageContext';
import translations from '../../translations';
import { Link } from 'react-router-dom';

function UserServers() {
  const { language } = useContext(LanguageContext);
  const [guilds, setGuilds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [animate, setAnimate] = useState(false);
  const [transitionActive, setTransitionActive] = useState(true);

  useEffect(() => {
    axios
      .get(`${config.api}api/user/guilds`, { withCredentials: true })
      .then((res) => {
        const allGuilds = Array.isArray(res.data) ? res.data : [];
        const filteredGuilds = allGuilds.filter((guild) => {
          try {
            const perms = BigInt(guild.permissions);
            const result = (perms & 32n) === 32n || guild.owner;
            return result;
          } catch (error) {
            return false;
          }
        });

        filteredGuilds.forEach((guild) => {
          if (typeof guild.hasBot === 'undefined') {
            guild.hasBot = false;
          }
        });

        filteredGuilds.sort((a, b) => {
          if (a.hasBot && !b.hasBot) return -1;
          if (!a.hasBot && b.hasBot) return 1;
          return a.name.localeCompare(b.name);
        });

        setGuilds(filteredGuilds);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching guilds:", err);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    if (!loading) {
      const timer = setTimeout(() => setAnimate(true), 100);
      return () => clearTimeout(timer);
    }
  }, [loading]);

  useEffect(() => {
    setTransitionActive(false);
    const timeoutTransition = setTimeout(() => {
      setTransitionActive(true);
    }, 10);
    return () => clearTimeout(timeoutTransition);
  }, [language]);

  return (
    <>
      <Navbar />
      <br />
      {loading ? (
        <div className="loader-wrapper">
          <div className="loader_h"></div>
        </div>
      ) : (
        <div className={`user-servers-container ${animate ? 'fade-in' : ''} ${transitionActive ? 'transition-active' : ''}`}>
          <h2>{translations[language].yourServers}</h2>
          {guilds.length > 0 ? (
            <div className="servers-grid">
              {guilds.map((guild) => (
                <div key={guild.id} className="server-card">
                  <img
                    src={
                      guild.icon 
                        ? `https://cdn.discordapp.com/icons/${guild.id}/${guild.icon}.png?size=1024`
                        : 'https://cdn.glitch.com/82fe990a-7942-42e3-9790-39807ccdb9f6%2Ficon-404-dark.png?v=1602427904949'
                    }
                    alt={guild.name} 
                    className="server-icon"
                  />
                  <h3 className="server-name">{guild.name}</h3>
                  {guild.member_count && (
                    <p className="server-members">
                      {guild.member_count} {translations[language].members}
                    </p>
                  )}
                  <div className="server-buttons">
                    {guild.hasBot ? (
                        <Link to={`/server/${guild.id}/overview`} className="manage-btn">
  {translations[language].manage}
</Link>
                    ) : (
                      <button className="invite-btn">{translations[language].inviteBot}</button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p>{translations[language].noServersFound}</p>
          )}
        </div>
      )}
    </>
  );
}

export default UserServers;
