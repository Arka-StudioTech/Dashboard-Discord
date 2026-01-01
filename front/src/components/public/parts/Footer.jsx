import { useContext, useEffect, useState } from 'react';
import translations from '../../../translations';
import { LanguageContext } from '../../../LanguageContext';
import { Link } from 'react-router-dom';
import '../asset/css/Footer.css';

function Footer() {
  const { language } = useContext(LanguageContext);
  const [transitionActive, setTransitionActive] = useState(false);

  useEffect(() => {
    setTransitionActive(false);
    const timeoutTransition = setTimeout(() => {
      setTransitionActive(true);
    }, 10);
    return () => clearTimeout(timeoutTransition);
  }, [language]);

  return (
    <footer className={`footer ${transitionActive ? 'fade-in' : ''}`}>
      <div className="footer-container">
        <div className="footer-top">
          <div className="footer-logo">
            <Link to="/">
              <img src="/default-logo.png" alt="Logo" />
            </Link>
          </div>
          <div className="footer-nav">
            <ul>
              <li><Link to="/about">{translations[language].about || "حول"}</Link></li>
              <li><Link to="/contact">{translations[language].contact || "اتصل بنا"}</Link></li>
              <li><Link to="/faq">{translations[language].faq || "الأسئلة الشائعة"}</Link></li>
              <li><Link to="/privacy">{translations[language].privacy || "سياسة الخصوصية"}</Link></li>
            </ul>
          </div>
          <div className="footer-social">
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
              <i className="fab fa-facebook-f"></i>
            </a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
              <i className="fab fa-twitter"></i>
            </a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
              <i className="fab fa-instagram"></i>
            </a>
            <a href="https://discord.com" target="_blank" rel="noopener noreferrer">
              <i className="fab fa-discord"></i>
            </a>
          </div>
        </div>
        <div className="footer-bottom">
          <p>
            &copy; {new Date().getFullYear()} {translations[language].siteName || "اسم الموقع"}. {translations[language].rightsReserved || "جميع الحقوق محفوظة"}.
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
