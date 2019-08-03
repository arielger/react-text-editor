const WORDS_API_URL = "https://api.datamuse.com";

const fetchSynonyms = word => {
  const url = `${WORDS_API_URL}/words?ml=${word}`;

  return fetch(url)
    .then(res => res.json())
    .then(synonymsData => synonymsData.map(({ word }) => word).slice(0, 5));
};

export { fetchSynonyms };
