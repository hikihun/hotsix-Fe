import Profile from "../components/Profile/Profile";
import MyPostList from "../components/Profile/MyPostList";
import { useEffect, useState } from "react";
import SettingButtons from "../components/Profile/SettingButtons";
import Header from "../components/Profile/Header";
import { useNavigate, useParams } from "react-router-dom";
import Footer from "../components/common/Footer";
import { getUserId } from "../components/API/TokenAction";
import { JsonConfig } from "../components/API/AxiosModule";

interface PartnerType {
  membershipId: number;
  imgPath: string;
  nickname: string;
}

const ProfilePage = () => {
  const [showSettingButtons, setShowSettingButtons] = useState(false);
  const [mypage, setMypage] = useState(false);
  const [notMyProfile, setNotMyProfile] = useState(false);
  const { profileId } = useParams();
  const [partner, setPartner] = useState<PartnerType>({
    membershipId: 0,
    imgPath: "",
    nickname: "",
  });
  const navigate = useNavigate();
  const userId = getUserId();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
  }, []);

  useEffect(() => {
    if (Number(profileId) === userId) {
      setMypage(true);
      setNotMyProfile(false);
    } else {
      setMypage(false);
      setNotMyProfile(true);
    }
  }, [userId, profileId]);

  const goChatRoom = async () => {
    try {
      const response = await JsonConfig("post", "api/chat/room", {
        senderId: userId,
        receiverId: Number(profileId),
      });
      navigate(`/chat/${response.data}`, { state: partner });
    } catch (err) {
      console.log(err);
    }
  };

  if (!profileId) return <></>;

  return (
    <div className="pt-16 min-h-screen bg-main-100">
      <Header handleShow={() => setShowSettingButtons(true)} mypage={mypage} />
      <Profile profileId={profileId} setPartner={setPartner} />
      {mypage && userId && (
        <>
          <MyPostList />
          {showSettingButtons && <SettingButtons userId={userId} handleShow={() => setShowSettingButtons(false)} />}
        </>
      )}
      {notMyProfile && (
        <button
          className="fixed bottom-16 left-1/2 -translate-x-2/4 block w-11/12 h-12 rounded-md bg-main-400 text-white focus:outline-none"
          onClick={goChatRoom}
        >
          채팅 보내기
        </button>
      )}
      <Footer userId={userId} selected={false} />
    </div>
  );
};

export default ProfilePage;
