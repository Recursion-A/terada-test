import { useEffect, useState } from 'react'
import { Pager, ListCard } from '@freee_jp/vibes'

const gridContainerStyle = {
  display: 'grid',
  gridTemplateColumns: 'repeat(7, 1fr)', // 5列のレイアウトを作成
  gap: '20px', // グリッドアイテム間のスペース
  listStyle: 'none', // リストのスタイルをリセット
  padding: 0 // パディングをリセット
}

export default function PopularMovies() {
  const [movies, setMovies] = useState([])
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(0)

  function CustomListCard({ title, imageSrc, ...props }) {
    const cardStyle = {
      display: 'flex',
      alignItems: 'flex-start' // アイテムを上端に揃える
    }

    // 画像スタイル
    const imageStyle = {
      width: '90px',
      height: 'auto',
      marginRight: '20px' // 画像とテキストの間に余白を設定
    }

    // テキストコンテンツのスタイル
    const contentStyle = {
      flex: 1 // 残りのスペースをテキストが使用
    }

    return (
      <ListCard title={title} {...props} style={cardStyle} ma={0.5}>
        <img src={imageSrc} alt={title} style={imageStyle} />
        <div style={contentStyle}>{content}</div>
      </ListCard>
    )
  }

  useEffect(() => {
    fetch(`/api/movies/popular?page=${page}`)
      .then((response) => response.json())
      .then((data) => {
        const results = data.results || []
        const totalPages = data.total_pages >= 500 ? 500 : totalPages
        setMovies(results)
        setTotalPages(totalPages)
      })

      .catch((error) => console.error('Error fetching data:', error))
  }, [page])

  return (
    <div>
      <h2>Popular Movies</h2>
      <Pager
        currentPage={page}
        pageCount={totalPages}
        pageRange={5}
        sidePageRange={1}
        onPageChange={setPage}
        small={true}
      />
      <ul style={gridContainerStyle}>
        {movies &&
          movies.map((movie) => (
            <li key={movie.id} style={{ marginBottom: '20px' }}>
              <CustomListCard
                title={movie.title}
                imageSrc={`https://image.tmdb.org/t/p/w300${movie.poster_path}`}
                content={movie.overview}
              />
            </li>
          ))}
      </ul>
      <Pager
        currentPage={page}
        pageCount={totalPages}
        pageRange={5}
        sidePageRange={1}
        onPageChange={setPage}
        small={false}
      />
    </div>
  )
}
