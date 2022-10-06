import React from "react";

const ProgressBar = (props) => {
  const { completed } = props;

  const containerStyles = {
    height: 7,
    width: '100%',
    backgroundColor: "#e0e0de",
    borderRadius: 50,
  }

  const fillerStyles = {
    height: '100%',
    width: `${completed}%`,
    backgroundColor: '#6a1b9a',
    borderRadius: 'inherit',
    textAlign: 'right',
    transition: 'all 1s linear'
  }

  const labelStyles = {
    padding: 5,
    color: 'white',
    fontWeight: 'bold'
  }

  return (
    <div style={containerStyles}>
      <div style={fillerStyles}>
      </div>
    </div>
  );
};

export default ProgressBar;