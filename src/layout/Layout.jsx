import Header from './Header'

const Layout = ({ children }) => {
  return (
    <div className="bg-gray-100 min-h-screen">
      <div className="fixed top-0 left-0 right-0 z-50">
        <Header />
      </div>

      <div className="flex pt-14">
        {children}
      </div>
    </div>
  )
}

export default Layout
