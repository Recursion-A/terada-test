import React from 'react';
import NavigationBar from './NavigationBar';

const Home: React.FC = () => {
  return (
    <div>
      <NavigationBar />
      <h1>ホームページ</h1>
      <p>ようこそ、映画情報サイトへ！</p>
    </div>
  );
}

export default Home;
