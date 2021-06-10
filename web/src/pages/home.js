import React from 'react'
import { Link } from 'react-router-dom'
const Home = () => {
  return (
    <div>
      <h1>Notedly</h1>
      <p>This is the home page</p>
      <ul>
        <li>
          <Link to='/mynotes'>My Notes</Link>
        </li>
        <li>
          <Link to='/favorites'>Favorites</Link>
        </li>
      </ul>
    </div>
  )
}

export default Home
