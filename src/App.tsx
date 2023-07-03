import MainPage from "./pages/MainPage";
import { Routes, Route } from "react-router-dom";
import PostPage from "./pages/PostPage";
import DetailPage from "./pages/DetailPage";
import ProfilePage from "./pages/ProfilePage";
import ChatRoomPage from "./pages/Chat/ChatRoomPage";
import ChatListPage from "./pages/Chat/ChatListPage";
import { Provider } from "jotai";
import SignUp from "./pages/SignupPage";
import SigninPage from "./pages/SigninPage";
import { QueryClient, QueryClientProvider } from "react-query";
import { CookiesProvider } from "react-cookie";
import CartPage from "./pages/CartPage";
import Editprofile from "./pages/EditprofilePage";
import Findpassword from "./pages/FindpasswordPage";
import Editpassword from "./pages/EditpasswordPage";

const queryClient = new QueryClient();

function App() {
  return (
    <Provider>
      <CookiesProvider>
        <QueryClientProvider client={queryClient}>
          <Routes>
            <Route path="/" element={<SigninPage />}></Route>
            <Route path="/main" element={<MainPage />}></Route>
            <Route path="/post" element={<PostPage />}></Route>
            <Route path="/edit/:postId" element={<PostPage />}></Route>
            <Route path="/detail/:postId" element={<DetailPage />}></Route>
            <Route path="/cart" element={<CartPage />}></Route>
            <Route path="/profile/:profileId" element={<ProfilePage />}></Route>
            <Route path="/chatlist" element={<ChatListPage />}></Route>
            <Route path="/chat/:chatRoomId" element={<ChatRoomPage />}></Route>
            <Route path="/signup" element={<SignUp />}></Route>
            <Route path="/editprofile" element={<Editprofile />}></Route>
            <Route path="/findPassword" element={<Findpassword />}></Route>
            <Route path="/editpassword" element={<Editpassword />}></Route>
          </Routes>
        </QueryClientProvider>
      </CookiesProvider>
    </Provider>
  );
}
export default App;
