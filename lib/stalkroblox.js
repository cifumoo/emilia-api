

  /*
  //
  // Dibuat oleh Kaze
  // https://github.com/KazeDevID
  // https://whatsapp.com/channel/0029VaFNnRTHLHQR6G0fC01O
  //
  */

import axios from 'axios';

const robloxStalk = async (usernames) => {
  try {

    const getUsernameData = async function() {
      const response = await axios.post("https://users.roblox.com/v1/usernames/users", {
        "usernames": [usernames]
      }, {
        headers: {
          "Content-Type": "application/json"
        }
      });
      return response.data;
    };

    const getUserData = async function(id) {
      const response = await axios.get("https://users.roblox.com/v1/users/" + id);
      return response.data;
    };

    const getProfile = async function(id) {
      const response = await axios.get("https://thumbnails.roblox.com/v1/users/avatar?userIds=" + id + "&size=720x720&format=Png&isCircular=false");
      return response.data.data[0].imageUrl;
    };

    const getPresenceData = async function(id) {
      const response = await axios.post("https://presence.roblox.com/v1/presence/users", {
        "userIds": [parseInt(id)]
      }, {
        headers: {
          "Content-Type": "application/json"
        }
      });
      return response.data.userPresences[0].lastOnline;
    };

    const { data } = await getUsernameData();
    const id = data[0].id;

    const userDetails = await getUserData(id);

    const profileDetails = await getProfile(id);

    const lastOnline = await getPresenceData(id);

    return { userDetails, lastOnline, profileDetails };
  } catch (error) {
    console.error(error);
  }
};
export default robloxStalk;