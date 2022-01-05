import { useState, useEffect } from "react";

function OptionsList(props: any) {
  const { options } = props;
  const [menu, setMenu] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
      } catch (error: any) {}
    };

    fetchData();
  }, []);

  return (
    <div className="element-container">
      <div>
        {options.map((option: any) => (
          <div className="option-title" key={option._id}>
            {option.name}
          </div>
        ))}
      </div>
    </div>
  );
}

export default OptionsList;
