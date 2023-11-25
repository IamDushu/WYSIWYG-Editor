import { useState } from "react";
import { Toaster } from "react-hot-toast";
import Edit from "./components/Edit";
import help from "./assets/icons/help.svg";
import logo from "./assets/icons/logo.png";

function App() {
  const [save, setSave] = useState(false);

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
        <div>
          <img src={help} alt="help" height={40} width={40} className="help" />
        </div>
      </section>
    </>
  );
}

export default App;
