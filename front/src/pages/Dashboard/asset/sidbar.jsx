import React, { useState, useEffect, useContext, useRef } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { LanguageContext } from '../../../LanguageContext';
import { FaBars, FaTimes, FaPlus, FaCog } from 'react-icons/fa';
import { ChevronDown, ChevronUp } from 'react-feather';
import './css/sidebar.css';
import Header from './header';
import axios from 'axios';
import config from '../../../config.json';
import translations from '../../../translations';

function FancySidebar() {
  const { language } = useContext(LanguageContext);
  const [isOpen, setIsOpen] = useState(false);
  const [guilds, setGuilds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedGuild, setSelectedGuild] = useState(null);
  const [isGuildsListOpen, setIsGuildsListOpen] = useState(false);
  const [openCategories, setOpenCategories] = useState({
    general: true,
    admin: true,
  });

  const serversSidebarRef = useRef(null);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const toggleCategory = (category) => {
    setOpenCategories((prev) => ({
      ...prev,
      [category]: !prev[category],
    }));
  };

  useEffect(() => {
    function handleClickOutside(e) {
      if (
        isGuildsListOpen &&
        serversSidebarRef.current &&
        !serversSidebarRef.current.contains(e.target)
      ) {
        setIsGuildsListOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isGuildsListOpen]);

  useEffect(() => {
    axios
      .get(`${config.api}api/user/guilds`, { withCredentials: true })
      .then((res) => {
        const allGuilds = Array.isArray(res.data) ? res.data : [];
        const filteredGuilds = allGuilds.filter((guild) => {
          try {
            const perms = BigInt(guild.permissions);
            return (perms & 32n) === 32n || guild.owner;
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
        if (filteredGuilds.length > 0 && !selectedGuild) {
          setSelectedGuild(filteredGuilds[0]);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching guilds:", err);
        setLoading(false);
      });
  }, [selectedGuild]);

  return (
    <>
      <Header />
      <div className={`fancy-sidebar-toggle ${language === 'ar' ? 'fancy-sidebar-toggle-right' : 'fancy-sidebar-toggle-left'}`} onClick={toggleSidebar}>
        {isOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
      </div>
      <div className={`fancy-sidebar ${language === 'ar' ? 'fancy-sidebar-right' : 'fancy-sidebar-left'} ${isOpen ? 'open' : ''}`}>
        <div className="sidebar-bg-animation"></div>
        <div className="sidebar-content">
          <div className="servers_sidebar" ref={serversSidebarRef}>
            {loading ? (
              <div className="servers-loader">
                <div className="loader-skeleton loader-icon"></div>
                <div className="loader-skeleton loader-text"></div>
              </div>
            ) : (
              <>
                {selectedGuild && (
                  <div className="selected-guild" onClick={() => setIsGuildsListOpen(!isGuildsListOpen)}>
                    <img src={selectedGuild.icon ? `https://cdn.discordapp.com/icons/${selectedGuild.id}/${selectedGuild.icon}.png?size=1024` : 'https://cdn.glitch.com/82fe990a-7942-42e3-9790-39807ccdb9f6%2Ficon-404-dark.png?v=1602427904949'} alt={selectedGuild.name} className="guild-icon" />
                    <span className="guild-name">{selectedGuild.name}</span>
                  </div>
                )}
                {isGuildsListOpen && (
                  <ul className="guilds-list">
                    {guilds.filter((g) => g.id !== selectedGuild?.id).map((guild) => (
                      <li key={guild.id} className="guild-item" onClick={() => { setSelectedGuild(guild); setIsGuildsListOpen(false); }}>
                        <img src={guild.icon ? `https://cdn.discordapp.com/icons/${guild.id}/${guild.icon}.png?size=1024` : 'https://cdn.glitch.com/82fe990a-7942-42e3-9790-39807ccdb9f6%2Ficon-404-dark.png?v=1602427904949'} alt={guild.name} className="guild-icon" />
                        <span className="guild-name">{guild.name}</span>
                        <span className="guild-action">{guild.hasBot ? <FaCog title="إعدادات السيرفر" /> : <FaPlus title="أضف البوت" />}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </>
            )}
          </div>

          {/* التصنيفات القابلة للإغلاق */}
          <nav>
            <ul>
              {/* التصنيف العام */}
              <li className="category_sidebar" onClick={() => toggleCategory('general')}>
                <span>{translations[language].General_sidebar}</span>
                {openCategories.general ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </li>
              {openCategories.general && (
                <ul className="sub-menu">
                  {selectedGuild && (
                    <li className="li_sidebar_dashboard">
                      <NavLink 
                        to={`/server/${selectedGuild.id}/overview`}
                        className={({ isActive }) => isActive ? "active_sidebar" : ""}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512">
                          <path d="M288 32c-80.8 0-145.5 36.8-192.6 80.6C48.6 156 17.3 208 2.5 243.7c-3.3 7.9-3.3 16.7 0 24.6C17.3 304 48.6 356 95.4 399.4C142.5 443.2 207.2 480 288 480s145.5-36.8 192.6-80.6c46.8-43.5 78.1-95.4 93-131.1c3.3-7.9 3.3-16.7 0-24.6c-14.9-35.7-46.2-87.7-93-131.1C433.5 68.8 368.8 32 288 32zM144 256a144 144 0 1 1 288 0 144 144 0 1 1 -288 0zm144-64c0 35.3-28.7 64-64 64c-7.1 0-13.9-1.2-20.3-3.3c-5.5-1.8-11.9 1.6-11.7 7.4c.3 6.9 1.3 13.8 3.2 20.7c13.7 51.2 66.4 81.6 117.6 67.9s81.6-66.4 67.9-117.6c-11.1-41.5-47.8-69.4-88.6-71.1c-5.8-.2-9.2 6.1-7.4 11.7c2.1 6.4 3.3 13.2 3.3 20.3z"/>
                        </svg>
                        <span>{translations[language].Overview_sidebar}</span>
                      </NavLink>
                    </li>
                  )}

                  <li>
                    <NavLink 
                      to={`/server/${selectedGuild?.id}/settings`}
                      className={({ isActive }) => isActive ? "active_sidebar" : ""}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                        <path d="M495.9 166.6c3.2 8.7 .5 18.4-6.4 24.6l-43.3 39.4c1.1 8.3 1.7 16.8 1.7 25.4s-.6 17.1-1.7 25.4l43.3 39.4c6.9 6.2 9.6 15.9 6.4 24.6c-4.4 11.9-9.7 23.3-15.8 34.3l-4.7 8.1c-6.6 11-14 21.4-22.1 31.2c-5.9 7.2-15.7 9.6-24.5 6.8l-55.7-17.7c-13.4 10.3-28.2 18.9-44 25.4l-12.5 57.1c-2 9.1-9 16.3-18.2 17.8c-13.8 2.3-28 3.5-42.5 3.5s-28.7-1.2-42.5-3.5c-9.2-1.5-16.2-8.7-18.2-17.8l-12.5-57.1c-15.8-6.5-30.6-15.1-44-25.4L83.1 425.9c-8.8 2.8-18.6 .3-24.5-6.8c-8.1-9.8-15.5-20.2-22.1-31.2l-4.7-8.1c-6.1-11-11.4-22.4-15.8-34.3c-3.2-8.7-.5-18.4 6.4-24.6l43.3-39.4C64.6 273.1 64 264.6 64 256s.6-17.1 1.7-25.4L22.4 191.2c-6.9-6.2-9.6-15.9-6.4-24.6c4.4-11.9 9.7-23.3 15.8-34.3l4.7-8.1c6.6-11 14-21.4 22.1-31.2c5.9-7.2 15.7-9.6 24.5-6.8l55.7 17.7c13.4-10.3 28.2-18.9 44-25.4l12.5-57.1c2-9.1 9-16.3 18.2-17.8C227.3 1.2 241.5 0 256 0s28.7 1.2 42.5 3.5c9.2 1.5 16.2 8.7 18.2 17.8l12.5 57.1c15.8 6.5 30.6 15.1 44 25.4l55.7-17.7c8.8-2.8 18.6-.3 24.5 6.8c8.1 9.8 15.5 20.2 22.1 31.2l4.7 8.1c6.1 11 11.4 22.4 15.8 34.3zM256 336a80 80 0 1 0 0-160 80 80 0 1 0 0 160z"/>
                      </svg>
                      <span>Settings</span>
                    </NavLink>
                  </li>
                </ul>
              )}

              {/* التصنيف الإداري */}
              <li className="category_sidebar" onClick={() => toggleCategory('admin')}>
                <span>{translations[language].Plugins_sidebar}</span>
                {openCategories.admin ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </li>
              {openCategories.admin && (
                <ul className="sub-menu">
                  <li>
                    <NavLink to="/admin/partner" className={({ isActive }) => isActive ? "active_sidebar" : ""}>
                      Partners
                    </NavLink>
                  </li>
                  <li>
                    <NavLink to="/admin/logs" className={({ isActive }) => isActive ? "active_sidebar" : ""}>
                      Logs
                    </NavLink>
                  </li>
                </ul>
              )}
            </ul>
          </nav>
        </div>
      </div>
    </>
  );
}

export default FancySidebar;
