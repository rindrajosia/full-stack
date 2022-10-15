const Total = ({parts}) => {
  const total = (arg) => {
    return arg.reduce(
      (s, part) => s+part.exercises, 0
    );
  }
  return (
    <p>
      {`Total of ${total(parts)} exercises`}
    </p>
  )
}

export default Total;
