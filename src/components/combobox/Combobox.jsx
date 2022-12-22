import { useState } from "react";
import "./combobox.css";
function Combobox({ options, categoryActive, setCategoryActive }) {
  const [isActive, setIsActive] = useState(false);

  return (
    <div className="dropdown">
      <div className="dropdown-btn" onClick={(e) => setIsActive(!isActive)}>
        <p>{categoryActive}</p>
        <span className="fas fa-caret-down"></span>
      </div>
      {isActive && (
        <div className="dropdown-content">
          <div
            className="dropdown-item"
            onClick={() => {
              setCategoryActive("Tất cả");
              setIsActive(false);
            }}
          >
            Tất cả
          </div>
          {options.map((option) => (
            <div
              onClick={(e) => {
                setCategoryActive(option.name);
                setIsActive(false);
              }}
              className="dropdown-item"
            >
              {option.name}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Combobox;
