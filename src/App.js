import React from "react";
import styled from "styled-components";

import TextEditor from "./TextEditor";
import { fetchSynonyms } from "./api";

const Wrapper = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 80px;
`;

export default function App() {
  return (
    <Wrapper>
      <TextEditor
        initialValue="A year ago I was in the audience at a gathering of designers in San Francisco. There were four designers on stage, and two of them worked for me. I was there to support them. The topic of design responsibility came up, possibly brought up by one of my designers, I honestly don’t remember the details. What I do remember is that at some point in the discussion I raised my hand and suggested, to this group of designers, that modern design problems were very complex. And we ought to need a license to solve them."
        loadSynonyms={fetchSynonyms}
      />
    </Wrapper>
  );
}
