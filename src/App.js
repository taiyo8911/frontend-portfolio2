// ポケモン図鑑 for React
import { useEffect, useState, useRef } from "react"; // Reactのフックを使う
import { fetchImages, fetchPokemonNames } from "./api"; // APIから画像のURL一覧を取得する関数をインポート
import './App.css'; // CSSをインポート


// ヘッダー
function Header() {
  return (
    <header className="hero has-background-warning is-bold">
      <div className="hero-body p-3">
        <div className="container">
          <h1 className='title is-3'>POKE-Database<span className='subtitle mx-3'>β版</span></h1>
        </div>
      </div>
    </header>
  );
}

// 入力フォームのコンポーネント
function Form(props) {
  // 選択した要素を表示するためのstate
  const [selectedGeneration, setSelectedGeneration] = useState("");

  // フォームが送信された時の処理(select要素のvalueをAPIに送信)
  function handleSubmit(event) {
    // ページ遷移しないようにする
    event.preventDefault();
    // フォームの値を取得
    const { generation } = event.target.elements;
    // 親コンポーネントの関数を呼び出す
    props.onFormSubmit(generation.value);
    // 選択した要素を表示する
    setSelectedGeneration(options[generation.value - 1].generation);
  }

  // フォームのオプション
  const options = [
    {
      region: "カントー",
      version: "赤・緑",
      generation: "第一世代",
      value: "1",
    },
    {
      region: "ジョウト",
      version: "金・銀",
      generation: "第二世代",
      value: "2",
    },
    {
      region: "ホウエン",
      version: "ルビー・サファイア",
      generation: "第三世代",
      value: "3",
    },
    {
      region: "シンオウ",
      version: "ダイヤモンド・パール",
      generation: "第四世代",
      value: "4",
    },
    {
      region: "イッシュ",
      version: "ブラック・ホワイト",
      generation: "第五世代",
      value: "5",
    },
    {
      region: "カロス",
      version: "X・Y",
      generation: "第六世代",
      value: "6",
    },
    {
      region: "アローラ",
      version: "サン・ムーン",
      generation: "第七世代",
      value: "7",
    },
    {
      region: "ガラル",
      version: "ソード・シールド",
      generation: "第八世代",
      value: "8",
    },
    {
      region: "パルデア",
      version: "スカーレット・バイオレット",
      generation: "第九世代",
      value: "9",
    },
  ];

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div className="field has-addons">
          <div className='control'>
            <div className="select is-fullwidth">
              <select name="generation">
                {options.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.version}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className='control'>
            <button type="submit" className="button is-dark">更新</button>
          </div>
          {/* 選択した要素を表示する */}
          <div className='has-text-weight-bold mx-3 flex'>
            <p>{selectedGeneration}</p>
          </div>
        </div>
      </form>
    </div>
  );
}



// imgコンポーネント（Galleryコンポーネントから画像URLを受け取る）
function Image(props) {
  // 画像のURLとタイトルを受け取る
  const { src, title } = props;

  // マウスオーバーした時に表示するテキスト
  const tooltipRef = useRef(null);

  // マウスオーバーした時の処理
  const handleMouseOver = (event) => {
    tooltipRef.current.innerHTML = event.target.title;
    tooltipRef.current.style.display = 'block';
  };

  // マウスアウトした時の処理
  const handleMouseOut = () => {
    tooltipRef.current.style.display = 'none';
  };

  // クリックした時の処理
  const handleClick = (event) => {
    tooltipRef.current.innerHTML = event.target.title;
    tooltipRef.current.style.display = 'block';
  }


  return (
    <div className='card'>
      <div className='card-image'>
        <figure className='image'>
          <img src={src} title={title} onMouseOver={handleMouseOver} onMouseOut={handleMouseOut} onClick={handleClick} />
          <div ref={tooltipRef} className="tooltip"></div>
        </figure>
      </div>
    </div>
  );
}


// ローディング中のコンポーネント
function Loading() {
  return <p>Loading...</p>;
}


// 取得URLをImageコンポーネントへ渡して複数の画像を表示するコンポーネント
const Gallery = ({ imageUrls = [], pokemonNames = [] }) => {
  if (!imageUrls.length) {
    return <Loading />;
  }

  return (
    <div className="columns is-multiline is-mobile can-scroll m-0 m-auto">
      {imageUrls.map((imageUrl, index) => (
        <div key={`image-${index}`} className="column is-3">
          <Image src={imageUrl} title={pokemonNames[index]} />
        </div>
      ))}
    </div>
  );
};



function Main() {
  // 配列を保持する状態変数
  const [imageUrls, setImageUrls] = useState([]);
  const [pokemonNames, setPokemonNames] = useState([]);

  // コンポーネントがDOMに追加されたときに実行される
  useEffect(() => {
    async function fetchData(generation) {
      const [images, names] = await Promise.all([
        fetchImages(generation),
        fetchPokemonNames(generation),
      ]);
      setImageUrls(images);
      setPokemonNames(names);
    }
    fetchData("1");
  }, []);

  // フォームが送信されたときに実行される関数
  async function reloadImages(generation) {
    const [images, names] = await Promise.all([
      fetchImages(generation),
      fetchPokemonNames(generation),
    ]);
    setImageUrls(images);
    setPokemonNames(names);
  }

  // メインのJSXを返す
  return (
    <main>
      <section className='section pt-5 pb-0'>
        <div className='container flex'>
          <Form onFormSubmit={reloadImages} />
          <p className="has-text-weight-bold mx-2">データ数:<span>{imageUrls.length}</span></p>
        </div>
      </section>

      <section className='section pt-5 pb-0'>
        <div className='container'>
          <Gallery imageUrls={imageUrls} pokemonNames={pokemonNames} />
        </div>
      </section>
    </main>
  );
}


// フッター
function Footer() {
  return (
    <footer id="footer" className='footer'>
      <div className='content has-text-centered'>
        <p>Pokemon images are retrieved from <a href="https://pokeapi.co/about">Poke API</a></p>
      </div>
    </footer>
  );
}


// Appコンポーネント
function App() {
  return (
    <div>
      <Header />
      <Main />
      <Footer />
    </div>
  );
}

// Appコンポーネントをエクスポート
export default App;