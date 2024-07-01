type IProps = {
  onFilter: Function;
  showLocation?: boolean;
}

function UserFilter({
  onFilter,
  showLocation = true
}: IProps) {
  return (
    <>
      <div className="dropdown mr-2">
        <select className="btn btn-outline-default dropdown-toggle" onChange={(e) => onFilter(e.target.value)}>
          <option value="">Alle</option>
          <option value="male">Männlich</option>
          <option value="female">Weiblich</option>
          <option value="transgender">Transsexuelle</option>
        </select>
      </div>

      <div className="dropdown mr-2">
        <select className="btn btn-outline-default dropdown-toggle" onChange={(e) => onFilter(e.target.value)}>
          <option value="">Standort</option>
          {showLocation && <option value="location">Alle Land</option>}
        </select>
      </div>

    </>
  );
}

export default UserFilter;
