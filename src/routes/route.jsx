import FindFriends from "../pages/home/FindFriends";
import Games from "../pages/home/Games";
import Home from "../pages/home/Home";
import MarketPlace from "../pages/home/MarketPlace";
import Reels from "../pages/home/Reels";
import Search from "../pages/home/Search";

export const route = [
  {
    path: "/home",
    component: <Home />,
  },
  {
    path: "/search",
    component: <Search />,
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
