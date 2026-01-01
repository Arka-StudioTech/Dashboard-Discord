import React, { useState, useEffect, useContext, useRef  } from 'react';
import { Link, NavLink,useNavigate  } from 'react-router-dom';
import axios from 'axios';
import { LanguageContext } from '../../../LanguageContext';
import translations from '../../../translations';
import config from '../../../config.json';
import './css/sidebar.header.css';

function Header_sidebar() {
  const { language, setLanguage } = useContext(LanguageContext);
  const [showLangList, setShowLangList] = useState(false);
  const [transitioning, setTransitioning] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [dropdownVisible, setDropdownVisible] = useState(false);

  const desktopLangRef = useRef(null);
  const dropdownRef = useRef(null);

  const changeLanguage = (lang) => {
    setTransitioning(true);
    setTimeout(() => {
      setLanguage(lang);
      setTransitioning(false);
      setShowLangList(false);
    }, 400);
  };

  useEffect(() => {
    axios
      .get(`${config.api}api/user`, { withCredentials: true })
      .then((res) => {
        setUser(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  // إغلاق القائمة عند النقر خارجها
  useEffect(() => {
    function handleClickOutside(event) {
      if (
        desktopLangRef.current &&
        !desktopLangRef.current.contains(event.target)
      ) {
        setShowLangList(false);
      }
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownVisible(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () =>
      document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogin = () => {
    window.location.href = `${config.api}auth/discord`;
  };

  const handleLogout = () => {
    window.location.href = `${config.api}logout`;
  };

  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // فتح/إغلاق قائمة المستخدم المنسدلة
  const toggleDropdown = () => {
    setDropdownVisible((prev) => !prev);
  };

  const [isAdmin, setIsAdmin] = useState(null);
  useEffect(() => {
    axios
      .get(`${config.api}api/check-admin`, { withCredentials: true })
      .then((response) => {
        setIsAdmin(response.data.isAdmin);
      })
      .catch((error) => {
        console.error("Error checking admin:", error);
        setIsAdmin(false);
      });
  }, []);

  const navigate = useNavigate();

  useEffect(() => {
    if (!user && !loading) {
      navigate("/"); 
    }
  }, [user, loading, navigate]);
  if (loading) {
    return ;
  }

  return (
    <>
      <div className="header_sidebar">
        <div className="img_sidebar_header_left">
          <NavLink to="/">
            <img src="/logo" alt="Logo" className="logo_sidebar_header" />
          </NavLink>
        </div>

        <div className="header_sidebar_rigth">
          <div
            className="header_sidebar_rigth_lang"
            ref={desktopLangRef}
          >
            <div
              className="h_s_lang_def"
              onClick={(e) => {
                e.stopPropagation();
                setShowLangList(!showLangList);
              }}
            >
              <img
                src={
                  language === 'en'
                    ? "https://th.bing.com/th/id/R.4b469fc5fd75039cf4ca410f0ffe2e66?rik=XIePqIPXj025RQ&pid=ImgRaw&r=0"
                    : "https://1.bp.blogspot.com/-hRMbrb2nchM/YS_lXij7zMI/AAAAAAAAQk8/VV14WNfrwusNsyM5U6VDy85gxMKJMkzcwCLcBGAsYHQ/s16000/%25D8%25B9%25D9%2584%25D9%2585%2B%25D9%2585%25D8%25B5%25D8%25B1%2Bpng%2B%25D8%25A8%25D8%25AC%25D9%2588%25D8%25AF%25D8%25A9%2B%25D8%25B9%25D8%25A7%25D9%2584%25D9%258A%25D8%25A9.png"
                }
                alt=""
                className="h_s_lang_img"
              />
              <span>{language === 'en' ? "English" : "العربية"}</span>
            </div>
            {showLangList && (
              <div className="h_s_lang_list">
                <div
                  className="h_s_lang_item"
                  onClick={() => changeLanguage('en')}
                >
                  <img
                    src="https://th.bing.com/th/id/R.4b469fc5fd75039cf4ca410f0ffe2e66?rik=XIePqIPXj025RQ&pid=ImgRaw&r=0"
                    alt=""
                    className="h_p_lang_img"
                  />
                  <span>English</span>
                </div>
                <div
                  className="h_s_lang_item"
                  onClick={() => changeLanguage('ar')}
                >
                  <img
                    src="https://1.bp.blogspot.com/-hRMbrb2nchM/YS_lXij7zMI/AAAAAAAAQk8/VV14WNfrwusNsyM5U6VDy85gxMKJMkzcwCLcBGAsYHQ/s16000/%25D8%25B9%25D9%2584%25D9%2585%2B%25D9%2585%25D8%25B5%25D8%25B1%2Bpng%2B%25D8%25A8%25D8%25AC%25D9%2588%25D8%25AF%25D8%25A9%2B%25D8%25B9%25D8%25A7%25D9%2584%25D9%258A%25D8%25A9.png"
                    alt=""
                    className="h_s_lang_img"
                  />
                  <span>العربية</span>
                </div>
              </div>
            )}
          </div>

          <div className="user-dropdown-container" ref={dropdownRef}>
            <div className="h_p_user_contier" onClick={toggleDropdown}>
              <img
                className="user-avatar"
                draggable="false"
                src={`https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png`}
                alt="User Avatar"
              />
              <p className="h_p_login_username">{user.username}</p>
            </div>
            {dropdownVisible && (
              <div className="dropdown-list">
                <nav className="h_profile_user_p">
                  <ul>
                    <li className="Link_drop">
                      <Link to="/profile" className="profile_user_h">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="20px"
                          height="20px"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="tabler-icon tabler-icon-id"
                        >
                          <path d="M3 4m0 3a3 3 0 0 1 3 -3h12a3 3 0 0 1 3 3v10a3 3 0 0 1 -3 3h-12a3 3 0 0 1 -3 -3z"></path>
                          <path d="M9 10m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0"></path>
                          <path d="M15 8l2 0"></path>
                          <path d="M15 12l2 0"></path>
                          <path d="M7 16l10 0"></path>
                        </svg>
                        {translations[language].profile}
                      </Link>
                    </li>
                    {isAdmin && (
                      <>
                        <hr className="line_h_profile" />
                        <li className="Link_drop">
                          <Link to="/admin" className="profile_user_h">
                            <i className="fa-solid fa-hammer"></i>
                            {translations[language].admin}
                          </Link>
                        </li>
                      </>
                    )}
                    <hr className="line_h_profile" />
                    <li onClick={handleLogout} className="logout_h">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20px"
                        height="20px"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="#f44336"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="tabler-icon tabler-icon-logout"
                      >
                        <path d="M14 8v-2a2 2 0 0 0 -2 -2h-7a2 2 0 0 0 -2 2v12a2 2 0 0 0 2 2h7a2 2 0 0 0 2 -2v-2"></path>
                        <path d="M9 12h12l-3 -3"></path>
                        <path d="M18 15l3 -3"></path>
                      </svg>
                      <span>{translations[language].logout}</span>
                    </li>
                  </ul>
                </nav>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default Header_sidebar;
