import React from "react";
import styled from "styled-components";

const Wrapper = styled.div`
  margin-top: 24px;
`;

const Title = styled.h4`
  margin: 0 0 16px 0;
`;

const Synonym = styled.button`
  border: none;
  background-color: rgba(0, 0, 0, 0.05);
  font-size: 16px;
  padding: 6px 12px;
  margin: 0 8px 8px 0;
  border-radius: 4px;
  cursor: pointer;

  &:focus,
  &:hover {
    background-color: rgba(0, 0, 0, 0.1);
    outline: none;
  }
`;

export default function Synonyms({
  loadSynonyms,
  selectedWord,
  replaceSelected
}) {
  const [synonyms, setSynonyms] = React.useState({
    loading: false,
    list: [],
    error: false
  });

  React.useEffect(() => {
    if (selectedWord) {
      setSynonyms({ loading: true });

      loadSynonyms(selectedWord)
        .then(synonyms => {
          setSynonyms({
            list: synonyms
          });
        })
        .catch(error => {
          setSynonyms({ error: true });
        });
    }
  }, [selectedWord, loadSynonyms]);

  if (!selectedWord) return null;

  return (
    <Wrapper>
      <Title>Synonyms:</Title>
      {synonyms.error ? (
        <span>There was an error loading the synonyms</span>
      ) : (
        !synonyms.loading &&
        synonyms.list &&
        synonyms.list.length > 0 &&
        synonyms.list.map(word => (
          <Synonym onClick={() => replaceSelected(word)} key={word}>
            {word}
          </Synonym>
        ))
      )}
    </Wrapper>
  );
}
