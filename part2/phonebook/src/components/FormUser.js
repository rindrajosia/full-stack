const FormUser = ({submitForm, valueName, changeName, valueNumber, changeNumber}) => {
  return (
    <form onSubmit={submitForm}>
      <div>
        name:
        <input
          value={valueName}
          onChange={changeName}
        />
      </div>
      <div>
        number:
        <input
          value={valueNumber}
          onChange={changeNumber}
        />
      </div>
      <div>
        <button type="submit">add</button>
      </div>
    </form>
  )
}

export default FormUser;
