import { useState, useRef, useEffect, useContext } from 'react';
import { NavLink, Link } from 'react-router-dom';
import axios from 'axios';
import translations from '../../../translations';
import config from '../../../config.json';
import { LanguageContext } from '../../../LanguageContext';
import '../asset/css/Navbar.css';

function Navbar() {
  const { language, setLanguage } = useContext(LanguageContext);
  const [showLangList, setShowLangList] = useState(false);
  const [transitioning, setTransitioning] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const [dropdownVisible, setDropdownVisible] = useState(false);
  const mobileLangRef = useRef(null);
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
        console.log(err);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    function handleClickOutside(event) {
      if (
        mobileLangRef.current &&
        !mobileLangRef.current.contains(event.target) &&
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
    return () => document.removeEventListener('mousedown', handleClickOutside);
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
  return (
    <>
      {/* إضافة فئة scrolled عند التمرير */}
      <header className={`h_p fixed-header ${scrolled ? 'scrolled' : ''}`}>
        <div className="d_p_img">
          <Link to="/">
            <img src="/default-logo.png" alt="Logo" className="h_img_p" />
          </Link>
        </div>

        {/* زر القائمة للشاشات الصغيرة */}
        <button className="menu_toggle_h" onClick={() => setMenuOpen(!menuOpen)}>
          ☰
        </button>

        {/* القائمة الجانبية للشاشات الصغيرة */}
        <div className={`h_p_s_list ${menuOpen ? 'open' : ''} ${language === 'ar' ? 'rtl' : 'ltr'}`}>
          <div className="h_p_s_h_1">
            <i className="fa-solid fa-xmark" onClick={() => setMenuOpen(false)}></i>
            <Link to="/">
              <img src="/default-logo.png" alt="Logo" className="h_img_p_s" />
            </Link>
          </div>
          <div className="h_p_s_h_2">
            <nav className="h_p_s_n">
              <NavLink to="/" className="h_p_a" onClick={() => setMenuOpen(false)}>
                <span>{translations[language].home}</span>
              </NavLink>
              <NavLink to="/about" onClick={() => setMenuOpen(false)}>
                <span>{translations[language].about}</span>
              </NavLink>
              <NavLink to="/contact" onClick={() => setMenuOpen(false)}>
                <span>{translations[language].contact}</span>
              </NavLink>
              <NavLink to="/plus" onClick={() => setMenuOpen(false)}>
                <span>{translations[language].plus}</span>
              </NavLink>

              {/* قائمة اللغات الخاصة بالشاشات الصغيرة */}
              <div className="h_p_lang_s" ref={mobileLangRef}>
                <div
                  className="h_p_lang_def_s"
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
                    className="h_p_lang_img_s"
                  />
                  <span>{language === 'en' ? "English" : "العربية"}</span>
                </div>
                {showLangList && (
                  <div className="h_p_lang_list_s">
                    <div className="h_p_lang_item_s" onClick={() => changeLanguage('en')}>
                      <img
                        src="https://th.bing.com/th/id/R.4b469fc5fd75039cf4ca410f0ffe2e66?rik=XIePqIPXj025RQ&pid=ImgRaw&r=0"
                        alt=""
                        className="h_p_lang_img_s"
                      />
                      <span>English</span>
                    </div>
                    <div className="h_p_lang_item_s" onClick={() => changeLanguage('ar')}>
                      <img
                        src="https://1.bp.blogspot.com/-hRMbrb2nchM/YS_lXij7zMI/AAAAAAAAQk8/VV14WNfrwusNsyM5U6VDy85gxMKJMkzcwCLcBGAsYHQ/s16000/%25D8%25B9%25D9%2584%25D9%2585%2B%25D9%2585%25D8%25B5%25D8%25B1%2Bpng%2B%25D8%25A8%25D8%25AC%25D9%2588%25D8%25AF%25D8%25A9%2B%25D8%25B9%25D8%25A7%25D9%2584%25D9%258A%25D8%25A9.png"
                        alt=""
                        className="h_p_lang_img"
                      />
                      <span>العربية</span>
                    </div>
                  </div>
                )}
              </div>
            </nav>
          </div>
        </div>

        {/* القائمة الرئيسية */}
        <div className={`h_p_left ${menuOpen ? 'open' : ''} language-transition ${transitioning ? '' : 'show'}`}>
          <div className="h_p_links">
            <NavLink to="/" className="h_p_a" onClick={() => setMenuOpen(false)}>
              <span>{translations[language].home}</span>
            </NavLink>
            <NavLink to="/about" className="h_p_a" onClick={() => setMenuOpen(false)}>
              <span>{translations[language].about}</span>
            </NavLink>
            <NavLink to="/contact" className="h_p_a" onClick={() => setMenuOpen(false)}>
              <span>{translations[language].contact}</span>
            </NavLink>
            <NavLink to="/plus" className="h_p_a_plus" onClick={() => setMenuOpen(false)}>
              <span className="h_p_plus_text">{translations[language].plus}</span>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512" className="h_p_icon">
                <path d="M309 106c11.4-7 19-19.7 19-34c0-22.1-17.9-40-40-40s-40 17.9-40 40c0 14.4 7.6 27 19 34L209.7 220.6c-9.1 18.2-32.7 23.4-48.6 10.7L72 160c5-6.7 8-15 8-24c0-22.1-17.9-40-40-40S0 113.9 0 136s17.9 40 40 40c.2 0 .5 0 .7 0L86.4 427.4c5.5 30.4 32 52.6 63 52.6h277.2c30.9 0 57.4-22.1 63-52.6L535.3 176c.2 0 .5 0 .7 0c22.1 0 40-17.9 40-40s-17.9-40-40-40s-40 17.9-40 40c0 9 3 17.3 8 24l-89.1 71.3c-15.9 12.7-39.5 7.5-48.6-10.7L309 106z"/>
              </svg>
            </NavLink>
          </div>
        </div>

        {/* اختيار اللغة في النسخة الرئيسية */}
        <div className="h_p_right">
          <div className="h_p_lang" ref={desktopLangRef}>
            <div
              className="h_p_lang_def"
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
                className="h_p_lang_img"
              />
              <span>{language === 'en' ? "English" : "العربية"}</span>
            </div>
            {showLangList && (
              <div className="h_p_lang_list">
                <div className="h_p_lang_item" onClick={() => changeLanguage('en')}>
                  <img
                    src="https://th.bing.com/th/id/R.4b469fc5fd75039cf4ca410f0ffe2e66?rik=XIePqIPXj025RQ&pid=ImgRaw&r=0"
                    alt=""
                    className="h_p_lang_img"
                  />
                  <span>English</span>
                </div>
                <div className="h_p_lang_item" onClick={() => changeLanguage('ar')}>
                  <img
                    src="https://1.bp.blogspot.com/-hRMbrb2nchM/YS_lXij7zMI/AAAAAAAAQk8/VV14WNfrwusNsyM5U6VDy85gxMKJMkzcwCLcBGAsYHQ/s16000/%25D8%25B9%25D9%2584%25D9%2585%2B%25D9%2585%25D8%25B5%25D8%25B1%2Bpng%2B%25D8%25A8%25D8%25AC%25D9%2588%25D8%25AF%25D8%25A9%2B%25D8%25B9%25D8%25A7%25D9%2584%25D9%258A%25D8%25A9.png"
                    alt=""
                    className="h_p_lang_img"
                  />
                  <span>العربية</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* زر تسجيل الدخول / عرض قائمة المستخدم */}
        <div className="h_p_login">
          {loading ? (
            <div className="loader_h"></div>
          ) : user ? (
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
                            <Link to="/admin" className='profile_user_h'>
                            <i class="fa-solid fa-hammer"></i>
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
          ) : (
            <button className="h_p_login_button" onClick={handleLogin}>
              <i className="fa-solid fa-arrow-right-to-bracket"></i>
              <span>{translations[language].login}</span>
            </button>
          )}
        </div>
      </header>
    </>
  );
}

export default Navbar;
