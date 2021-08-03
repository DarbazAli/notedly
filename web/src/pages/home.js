import React, { useEffect } from "react"
import { useQuery, gql } from "@apollo/client"

const getNotes = gql`
    query {
        notes {
            id
            content
            favoriteCount
        }
    }
`
const Home = () => {
    const { data, loading, error, fetchMore } = useQuery(getNotes)

    useEffect(() => {
        document.title = "Home - Notedly"
    })

    if (loading) return <p>Loadding...</p>
    if (error) return <p>Error!</p>

    return (
        <div>
            the Data loaded
            {data &&
                data.notes.map((note) => (
                    <div key={note.id}>
                        <h1>{note.content}</h1>
                        <p>Likes {note.favoriteCount}</p>
                    </div>
                ))}
        </div>
    )
}

export default Home
