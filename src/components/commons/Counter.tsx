import React from "react";

function Counter(props: any) {
  return (
    <>
      <div id="dialog_base" onClick={() => props.onClose()}></div>
      <div id="dialog_content">
        <div className="card alert-box">
          <div className="alert-text">
            <h4 className="yellow"></h4>
          </div>
        </div>
      </div>
    </>
  );
}

export default Counter;
