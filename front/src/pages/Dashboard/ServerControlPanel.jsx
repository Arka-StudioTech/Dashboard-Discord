import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import config from '../../config.json';
import Sidbar from './asset/sidbar';
import './asset/css/Owiver.css';

function ServerManage() {
  const { id } = useParams();
  
  const [serverDetails, setServerDetails] = useState(null);

  useEffect(() => {
    axios
      .get(`${config.api}api/server/${id}/details`, { withCredentials: true })
      .then((res) => {
        console.log("Server details response:", res.data);
        setServerDetails(res.data);
      })
      .catch((err) => {
        console.error("Error fetching server details:", err);
      });
  }, [id]);

  // استخراج المعلومات المطلوبة من كائن serverDetails
  const guild = serverDetails?.guild;
  const channelCount = serverDetails?.channelCount;
  const roleCount = serverDetails?.roleCount;

  return (
    <>
      <Sidbar />
      <div className="server-manage-content">
        {guild && (
          <>
            {/* بطاقات معلومات السيرفر */}
            <div className="info-cards">
              <div className="info-card">
                <h3>Server Name</h3>
                <p>{guild.name}</p>
              </div>
              <div className="info-card">
                <h3>Channels</h3>
                <p>{channelCount}</p> {/* عرض عدد القنوات الحقيقي */}
              </div>
              <div className="info-card">
                <h3>Roles</h3>
                <p>{roleCount}</p> {/* عرض عدد الأدوار الحقيقي */}
              </div>
            </div>

            {/* حاوية الـ Bot Profile */}
            <div className="bot-profile-container">
              <h2>BOT PROFILE</h2>
              <div className="profile-section">
                <div className="profile-info">
                  <label>Bot Username</label>
                  <input type="text" placeholder="Bot Username" />

                  <label>Status</label>
                  <select>
                    <option>Online</option>
                    <option>Idle</option>
                    <option>Do Not Disturb</option>
                    <option>Invisible</option>
                  </select>

                  <label>Activity Type</label>
                  <input type="text" placeholder="Playing, Watching, Listening..." />

                  <button className="save-btn">Save</button>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
      {/* مسافة إضافية في نهاية الصفحة */}
      <br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br />
    </>
  );
}

export default ServerManage;
