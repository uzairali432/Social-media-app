import LeftSidebar from '../../components/home/LeftSidebar'
import RightSidebar from '../../components/home/RightSidebar'
import Feeds from '../../components/home/Feeds'

const Home = () => {
  return (
    <>
      <div className="hidden md:block">
        <LeftSidebar />
      </div>
      <div className="flex-1 mx-4">
        <Feeds />
      </div>
      <div className="hidden lg:block">
        <RightSidebar />
      </div>
    </>
  )
}

export default Home
