import { useState } from "react";
import Edit from "./components/Edit";

function App() {
  const [save, setSave] = useState(false);

  return (
    <>
      <h1 className="text-red-900">Title</h1>
      <button
        onClick={() => {
          setSave(true);
        }}
      >
        Save
      </button>
      <Edit save={save} set={setSave} />
    </>
  );
}

export default App;
