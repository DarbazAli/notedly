import React, { useEffect } from 'react'

const Home = () => {
  useEffect(() => {
    document.title = 'Home - Notedly'
  })
  return (
    <div>
      <h1>Notedly</h1>
      <p>This is the home page</p>
    </div>
  )
}

export default Home
