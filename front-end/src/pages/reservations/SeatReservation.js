import { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router";
import SelectTable from "../../components/SelectTable";
import ErrorAlert from "../../layout/ErrorAlert";
import { listTables, readReservation, seatTable } from "../../utils/api";

export default function SeatReservation() {
  const [reservation, setReservation] = useState({});
  const [tables, setTables] = useState([]);
  const [table_id, setTable_Id] = useState("");
  const [error, setError] = useState(null);
  const { reservation_id } = useParams();
  const history = useHistory();

  useEffect(load, [reservation_id]);

  function load() {
    const ac = new AbortController();
    async function loadReservation() {
      try {
        setError(null);
        const res = await readReservation(reservation_id);
        setReservation({ ...res });
      } catch (err) {
        setError(err);
      }
    }
    async function loadTables() {
      try {
        setError(null);
        const tabList = await listTables();
        setTables([...tabList]);
      } catch (err) {
        setError(err);
      }
    }
    loadTables();
    loadReservation();
    return ac.abort();
  }

  const handleChange = ({ target }) => {
    console.log("setTable_id before: ",table_id)
    setTable_Id(target.value);
    //NOTE: "set" sets the value for the next page render
    console.log("setTable_id after: ",table_id)
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const ac = new AbortController();
    try {
      await seatTable(reservation_id, table_id, ac.signal);
      history.push("/");
    } catch (err) {
      setError(err);
    }
    return ac.abort();
  };

  return (
    <>
      <ErrorAlert error={error} />
      <h1 className="text-center">Seating:</h1>
      <h2 className="text-center">
        <span className="med-green">
          {reservation.first_name} {reservation.last_name}{" "}
        </span>
        <span className="medium">party of</span>
        <span className="med-green"> {reservation.people}</span>
      </h2>
      <form onSubmit={handleSubmit}>
        <div className="seat-form-buffer">
          <select
            name="table_id"
            className="form-control"
            required
            onChange={handleChange}
            autoFocus
          >
            <option value="">Choose Table</option>
            {tables.map((table) => (
              <SelectTable key={table.table_id} table={table} />
            ))}
          </select>
        </div>
        <div>
          <button
            type="button"
            className="form-btn medium-bg light"
            onClick={history.goBack}
          >
            Cancel
          </button>
          <button type="submit" className="form-btn light-green-bg">
            Submit
          </button>
        </div>
      </form>
    </>
  );
}
