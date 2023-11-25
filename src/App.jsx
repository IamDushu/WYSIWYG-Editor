import { useState } from "react";
import { Toaster } from "react-hot-toast";
import Edit from "./components/Edit";
import help from "./assets/icons/help.svg";
import logo from "./assets/icons/logo.png";

function App() {
  const [save, setSave] = useState(false);
  const [showHelp, setShowHelp] = useState(false);

  return (
    <>
      <section>
        <div className="logoHolder">
          <img src={logo} alt="logo" width={60} height={60} />
        </div>
        <Toaster />
        <nav>
          <h4>Demo editor by Dushyanth</h4>
          <button
            onClick={() => {
              setSave(true);
            }}
            className="btn"
          >
            Save
          </button>
        </nav>

        <Edit save={save} set={setSave} />
        <div className="help">
          <img
            src={help}
            alt="help"
            height={40}
            width={40}
            onClick={() => setShowHelp((prev) => !prev)}
          />
          <div
            className="helpBox"
            style={{ display: `${showHelp ? "block" : "none"}` }}
          >
            <ul>
              <li>
                <h5>Heading: </h5>
                <p>Type # ,then press space.</p>
              </li>
              <li>
                <h5>BOLD: </h5>Type * ,then press space.
              </li>
              <li>
                <h5>Red Font: </h5>Type ** ,then press space.
              </li>
              <li>
                <h5>Underline: </h5>Type *** ,then press space.
              </li>
              <li>
                <h5>Code Block: </h5>Type ``` ,then press space.
              </li>
            </ul>
          </div>
        </div>
      </section>
    </>
  );
}

export default App;
