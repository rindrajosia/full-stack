const Bouton = ({click, text}) => {
  return (
      <>
        <button onClick={click}>{text}</button>
      </>
    )
}

export default Bouton;
