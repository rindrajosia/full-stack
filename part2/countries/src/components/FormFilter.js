const FormFilter = ({filter, changeFilter}) => {
  return (
      <div>
        Filter Shown with:
        <input
          value={filter}
          onChange={changeFilter}
        />
      </div>
  )
}

export default FormFilter;
