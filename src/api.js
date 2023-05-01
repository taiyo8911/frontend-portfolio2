// 指定した文字列を受け取りAPIから画像のURL一覧を作成する関数
export async function fetchImages(generation) {
    // PokeAPIからポケモンの情報を取得する
    const response = await fetch(
        `https://pokeapi.co/api/v2/generation/${generation}/`
    );
    const data = await response.json();

    // ポケモンのURLを抽出する
    const pokemonUrls = data.pokemon_species.map(species => species.url);

    // URLからポケモンのIDを取得する
    const pokemonIds = pokemonUrls.map(url => parseInt(url.match(/\/(\d+)\/$/)[1]));

    // IDを昇順にソートする
    pokemonIds.sort((a, b) => a - b);

    // IDから画像URLを作成する
    const pokemonImageUrls = pokemonIds.map(id => `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`);

    return pokemonImageUrls;
}

// ポケモンの名前を取得する関数
export async function fetchPokemonNames(generation) {
    // PokeAPIからポケモンの情報を取得する
    const response = await fetch(
        `https://pokeapi.co/api/v2/generation/${generation}/`
    );
    const data = await response.json();

    // ポケモンのURLを抽出する
    const pokemonUrls = data.pokemon_species.map(species => species.url);

    // URLからポケモンのIDを取得する
    const pokemonIds = pokemonUrls.map(url => parseInt(url.match(/\/(\d+)\/$/)[1]));

    // IDを昇順にソートする
    pokemonIds.sort((a, b) => a - b);

    // ポケモンの名前を取得するためのPromiseの配列を初期化
    const pokemonNamesPromises = [];

    // 重複を取り除いたポケモンIDのリストをループして、各ポケモンの名前を取得する
    for (let id of new Set(pokemonIds)) {
        // ポケモンの種類を取得するためにAPIリクエストを送信し、レスポンスをJSON形式で取得する
        pokemonNamesPromises.push(fetch(`https://pokeapi.co/api/v2/pokemon-species/${id}/`)
            .then(response => response.json())
            // 日本語の名前を検索して返す
            .then(data => {
                const name = data.names.find(name => name.language.name === "ja")?.name;
                return name || "";
            })
        );
    }

    // すべてのポケモンの名前を取得するために、Promise.all()を使用する
    const pokemonNames = await Promise.all(pokemonNamesPromises);

    // 空の名前をフィルタリングして、有効な名前だけを返す
    return pokemonNames.filter(name => name !== "");
}


// // APIリクエストを行う関数
// async function fetchData(generation) {
//     const response = await fetch(`https://pokeapi.co/api/v2/generation/${generation}/`);
//     return await response.json();
// }

// // 取得したデータ数を返す関数
// export async function fetchCount(generation) {
//     const data = await fetchData(generation);
//     return data.pokemon_species.length;
// }

// // 地方名を日本語で取得するためのオブジェクト
// const regionNames = {
//     kanto: 'カントー',
//     johto: 'ジョウト',
//     hoenn: 'ホウエン',
//     sinnoh: 'シンオウ',
//     unova: 'イッシュ',
//     kalos: 'カロス',
//     alola: 'アローラ',
//     galar: 'ガラル'
// };

// // main_regionの名前を日本語で取得する関数
// export async function fetchRegionName(generation) {
//     const data = await fetchData(generation);
//     return regionNames[data.main_region.name] || data.main_region.name;
// }

// // 世代の名前を日本語で取得するためのオブジェクト
// const generationNames = {
//     'generation-i': '第一世代',
//     'generation-ii': '第二世代',
//     'generation-iii': '第三世代',
//     'generation-iv': '第四世代',
//     'generation-v': '第五世代',
//     'generation-vi': '第六世代',
//     'generation-vii': '第七世代',
//     'generation-viii': '第八世代'
// };

// // 世代の名前を日本語で取得する関数
// export async function fetchGenerationName(generation) {
//     const data = await fetchData(generation);
//     return generationNames[data.name] || data.name;
// }