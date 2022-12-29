import React, { useEffect, useRef, useState } from "react";
import "./TimeLogger.css";

export default function TimeLogger() {
  const [items, setItems] = useState([]);
  const [render, setRender] = useState(0);
  let startTime = useRef();
  let endTime = useRef();
  let dis = useRef();
  let date = useRef();

  function load() {
    setRender((pre) => pre + 1);
  }

  function add(event) {
    event.preventDefault();
    let enterDate = date.current.value;

    let enterDis = dis.current.value;

    let enterEndTime = endTime.current.value;
    let enterStartTime = startTime.current.value;
    let data = {
      startTime: enterStartTime,
      description: enterDis,
      endTime: enterEndTime,
      date: enterDate,
    };
    fetch(
      `https://new-task-ba81c-default-rtdb.firebaseio.com/${enterDate}.json`,
      {
        method: "POST",
        body: JSON.stringify(data),
      }
    ).then((res) => {
      if (res.ok) {
        setRender((pre) => pre + 1);
      } else {
        res.json().then((data) => alert(data.error.message));
      }
    });
  }
  useEffect(() => {
    let enterDate = date.current.value;
    fetch(
      `https://new-task-ba81c-default-rtdb.firebaseio.com/${enterDate}.json`
    ).then((res) => {
      if (res.ok) {
        res.json().then((data) => {
          let arr = [];
          {
            for (let keys in data) {
              let obj = {
                ...data[keys],
                id: keys,
              };
              arr.push(obj);
            }
            setItems((pre) => [...arr]);
          }
        });
      } else {
        res.json().then((data) => console.log(data));
      }
    });
  }, [render]);
  function deleteExpense(id) {
    let enterDate = date.current.value;
    fetch(
      `https://new-task-ba81c-default-rtdb.firebaseio.com/${enterDate}/${id}.json`,
      {
        method: "DELETE",
        // body: JSON.stringify(item),
      }
    ).then((res) => {
      if (res.ok) {
        setRender((pre) => pre - 1);
        alert("Expense successfuly deleted 💸");
      } else {
        res.json().then((data) => alert(data.error.message));
      }
    });
  }
  function editExpense(item) {
    startTime.current.value = item.startTime;
    endTime.current.value = item.endTime;
    dis.current.value = item.description;
    let enterDate = date.current.value;
    fetch(
      `https://new-task-ba81c-default-rtdb.firebaseio.com/${enterDate}/${item.id}.json`,
      {
        method: "DELETE",
      }
    ).then((res) => {
      if (res.ok) {
        setRender((pre) => pre - 1);
        alert("Now edite the time logger 📝");
      } else {
        res.json().then((data) => alert(data.error.message));
      }
    });
  }
  function convertHourstoMinute(timeInHour) {
    var timeParts = timeInHour.split(":");
    return Number(timeParts[0]) * 60 + Number(timeParts[1]);
  }

  function makeCSV(item) {
    console.log(item);
    let arr1 = item.map((obj) => {
      let arr2 = [obj.startTime, item.endTime, item.description];
      return arr2.join();
    });
    arr1.unshift(["START-TIME:-", "END-TIME:-", "DESCRIPTION"]);
    return arr1.join("\n");
  }
  const blob = new Blob([makeCSV(items)]);

  return (
    <div>
      <form onSubmit={add}>
        <div className="head">
          <span>
            <label>Select date: </label>
            <input type="date" ref={date} required/>
          </span>
          <button type="button " onClick={load}>
            Load
          </button>
          <a href={URL.createObjectURL(blob)} download="TimeBlogger.csv">
            Export Timesheet as PNG
          </a>
        </div>
        <hr />
        <div className="head">
          <label>Start Time:- </label>
          <input
            className="input"
            type="time"
            placeholder="Start time"
            ref={startTime}
            required
          />
          <label>End Time:- </label>
          <input
            className="input"
            type="time"
            placeholder="End time"
            ref={endTime}
            required
          />
          <input
            className="input1"
            type="text"
            placeholder="Text description"
            ref={dis}
            required
          />
          <button type="button ">Add</button>
        </div>
        <hr />
      </form>
      <div className="App">
        <table>
          <tr>
            <th>Start Time:-</th>
            <th>End Time:-</th>
            <th>Minutes</th>
            <th>Description</th>
            <th></th>
          </tr>
          {items.map((val, key) => {
            return (
              <>
                <tr key={key}>
                  <td>{val.startTime}</td>
                  <td>{val.endTime}</td>
                  <td>
                    {convertHourstoMinute(val.endTime) -
                      convertHourstoMinute(val.startTime)}
                  </td>
                  <td>{val.description}</td>
                  <button
                    className="button"
                    onClick={() => deleteExpense(val.id)}
                  >
                    delete
                  </button>
                  <button className="button" onClick={() => editExpense(val)}>
                    edit
                  </button>
                </tr>
              </>
            );
          })}
        </table>
      </div>
    </div>
  );
}
