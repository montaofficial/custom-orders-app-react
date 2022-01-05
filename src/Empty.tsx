import { useState, useEffect } from "react";

function Empty(props: any) {
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
    <div className="page-background">
      <div>
        {options.map((option: any) => (
          <div key={option._id}>{option.name}</div>
        ))}
      </div>
    </div>
  );
}

export default Empty;
