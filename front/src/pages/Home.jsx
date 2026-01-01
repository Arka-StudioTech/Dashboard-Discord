import { useContext, useEffect, useState } from 'react';
import translations from '../translations';
import Navbar from "../components/public/parts/Navbar";
import { LanguageContext } from '../LanguageContext';
import { Link } from 'react-router-dom';
import './asset/css/home.css';
import axios from 'axios';
import config from '../config.json';
import Footer from '../components/public/parts/Footer'


function Home() {
  const { language } = useContext(LanguageContext);
  const [transitionActive, setTransitionActive] = useState(false);

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const [partners, setPartners] = useState([]);
  const [partnersLoading, setPartnersLoading] = useState(true);

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
    setTransitionActive(false);
    const timeoutTransition = setTimeout(() => {
      setTransitionActive(true);
    }, 10);
    return () => clearTimeout(timeoutTransition);
  }, [language]);

  useEffect(() => {
    axios
      .get(`${config.api}api/partners`)
      .then((res) => {
        setPartners(Array.isArray(res.data) ? res.data : []);
        setTimeout(() => {
          setPartnersLoading(false);
        }, 500);
      })
      .catch((err) => {
        console.error("Error fetching partners:", err);
        setPartnersLoading(false);
      });
  }, []);

  const handleLogin = () => {
    window.location.href = `${config.api}auth/discord`;
  };

  const renderSkeletons = (count = 4) => {
    const skeletonArray = Array.from({ length: count }, (_, i) => i);
    return (
      <div className="partners-skeleton">
        {skeletonArray.map((index) => (
          <div key={index} className="skeleton-card">
            <div className="skeleton-info">
              <div className="skeleton-icon"></div>
              <div className="skeleton-lines">
                <div className="skeleton-line"></div>
                <div className="skeleton-line short"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <>
      <Navbar />
      <main className="home-container">
        <div className="home-overlay"></div>
        {loading ? (
          <div className="loader_h"></div>
        ) : (
          <section className="home_top_1">
            <div
              className={`home_text_top language-transition ${
                transitionActive ? 'show' : ''
              }`}
            >
              <h1 className="home_top_h1">
                {translations[language].welcome_home}
              </h1>
              <p className="home_top_p">
                {translations[language].welcome_home_p}
              </p>
            </div>
            <div className="home_top_buttons">
              <Link to="/invite" target="_blank" className="home_invite">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="30px"
                  height="30px"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="tabler-icon tabler-icon-external-link"
                >
                  <path d="M12 6h-6a2 2 0 0 0 -2 2v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2 -2v-6" />
                  <path d="M11 13l9 -9" />
                  <path d="M15 4h5v5" />
                </svg>
                <span>{translations[language].invite}</span>
              </Link>

              {user ? (
                <Link to="/dashboard" className="home_dashboard">
                  {translations[language].dashboard}
                </Link>
              ) : (
                <Link onClick={handleLogin} className="home_dashboard">
                  {translations[language].login}
                </Link>
              )}
            </div>
          </section>
        )}
      </main>

      {/* Partners Section */}
      <section className="partners-section">
        <div className="partners-heading">
          <h2>{translations[language].partenr}</h2>
        </div>

        {partnersLoading ? (
          renderSkeletons(4) 
        ) : partners.length > 0 ? (
          <div className="partners-marquee">
            <div className="partners-list">
              {partners.map((partner) => (
                <a
                  href={partner.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  key={partner.id}
                >
                  <div className="partner-card">
                    <img
                      src={partner.image}
                      alt={partner.name}
                      className="partner-icon"
                    />
                    <h3 className="partner-name">{partner.name}</h3>
                    <p className="partner-members">{partner.description}</p>
                  </div>
                </a>
              ))}
            </div>
          </div>
        ) : (
          <p>No partners available</p>
        )}
      </section>
      {/* Features Section */}

      <section className="features-section">
        <div className="features-heading">
          <h2>{translations[language].featuresTitle || "مميزاتنا"}</h2>
          <p>{translations[language].featuresSubtitle || "اكتشف ما يميز منصتنا عن غيرها"}</p>
        </div>
        <div className="features-list">
          <div className="feature-card">
            <img src="/assets/icons/fast.png" alt="سرعة" className="feature-icon" />
            <h3 className="feature-title">{translations[language].feature1Title || "سرعة الأداء"}</h3>
            <p className="feature-description">
              {translations[language].feature1Desc || "تشغيل سريع وتجربة مستخدم ممتازة دون تأخير."}
            </p>
          </div>
          <div className="feature-card">
            <img src="/assets/icons/support.png" alt="دعم" className="feature-icon" />
            <h3 className="feature-title">{translations[language].feature2Title || "دعم فني متميز"}</h3>
            <p className="feature-description">
              {translations[language].feature2Desc || "فريق دعم متواجد دائمًا للإجابة على استفساراتك."}
            </p>
          </div>
          <div className="feature-card">
            <img src="/assets/icons/security.png" alt="أمان" className="feature-icon" />
            <h3 className="feature-title">{translations[language].feature3Title || "أمان عالي"}</h3>
            <p className="feature-description">
              {translations[language].feature3Desc || "نستخدم أحدث التقنيات لضمان حماية بياناتك."}
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}

export default Home;
