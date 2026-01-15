import FindFriends from "../pages/home/FindFriends";
import Games from "../pages/home/Games";
import Home from "../pages/home/Home";
import MarketPlace from "../pages/home/MarketPlace";
import Reels from "../pages/home/Reels";

export const route = [
  {
    path: "/home",
    component: <Home />,
  },
  {
    path: "/reels",
    component: <Reels />,
  },
  {
    path: "/findfriends",
    component: <FindFriends />,
  },
  {
    path: "/marketplace",
    component : <MarketPlace/>
  },
  {
    path: '/games',
    component : <Games/>
  }
];
