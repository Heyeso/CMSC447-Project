import React from "react";
import styled from "styled-components";
import { COLORS } from "./utils/constants";

const Container = styled.div`
  background-color: ${COLORS.GRAY6};
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  padding: 10px;
  display: flex;
`;

function App() {
  return <Container className="App"></Container>;
}

export default App;
