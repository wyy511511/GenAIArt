import logo from "../images/logo.svg";
import "../App.css";

const NavBar = () => {
  return (
    <header className="App-header">
      {/* <img src={logo} className="App-logo" alt="logo" width={100} /> */}
      <p>ATLS 4519 Generative AI</p>
      <a
        className="App-link"
        href="https://github.com/wyy511511/GenAIArt.git"
        target="_blank"
        rel="noopener noreferrer"
      >
        GitHub
      </a>
    </header>
  );
}

export default NavBar;
