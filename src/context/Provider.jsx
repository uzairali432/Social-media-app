import React from 'react'
import AppContext from './AppContext'
import AuthContext from './AuthContext'
import PostContextProvider from './PostContext'

const Provider = ({ children }) => {
  return (
    <>
      <AppContext>
        <AuthContext>
          <PostContextProvider>
            {children}
          </PostContextProvider>
        </AuthContext>
      </AppContext>
    </>
  )
}

export default Provider