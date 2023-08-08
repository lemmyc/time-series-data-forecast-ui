import styles from "./Home.module.scss";
import { DataEntry } from "../../components";
import { useState } from "react";
import { Input, Button, Card, InputNumber, Radio} from "antd";
import { fetchData } from "../../service/fetchData";
import Plot from "react-plotly.js";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
const GET_PREDICTIONS_API = "http://127.0.0.1:5000/predict";

function Home() {
  const [fileName, setFileName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState({});
  const [columns, setColumns] = useState([]);
  const [model, setModel] = useState("prophet");
  const [dateFormat, setDateFormat] = useState("%d/%m/%Y");
  const [ds, setDs] = useState(15);
  const [dsCol, setDsCol] = useState("");
  const [yCol, setYCol] = useState("");

  const changeFileName = (name) => {
    setFileName(name);
  };
  const resetData = () => {
    setData({});
  };
  const getColumns = (cols) => {
    setColumns(cols);
  };

  const handleChangeDateFormat = (e) => {
    setDateFormat(e.target.value);
  };
  const handleChangeDs = (value) => {
    setDs(value);
  };
  const handleChangeModel = ({ target: { value } }) => {
    setModel(value);
  };
  const handleChangeDsCol = (e)=>{
    setDsCol(e.target.value);
  }
  const handleChangeYCol = (e)=>{
    setYCol(e.target.value);
  }
  const handleClick = () => {
    if(dsCol === yCol){
      toast.error("Date column and Y-value column can not be the same.", {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        });
      return;
    }
    setIsLoading(true);
    let submit_data = {
      filename: fileName,
      furtureDs: ds || 30,
      dateFormat: dateFormat || "%d/%m/%y %H:%M:%S.%f",
      model: model || "prophet",
      dsCol: dsCol || "ds",
      yCol: yCol || "y",
    };


    let response = fetchData("POST", GET_PREDICTIONS_API, submit_data);
    response.then((result) => {
      setIsLoading(false)
      if(result["status"] === "success"){
        toast.success(result["msg"], {
          position: "top-center",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
          });
        setData(result["data"]);
      }else{
        toast.error(result["msg"], {
          position: "top-center",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
          });
      } 
    });
  };



  let props = {
    changeFileName: changeFileName,
    resetData: resetData,
    getColumns: getColumns,
    toast: toast,
  };



  return (
    <>
      <div className={styles.container}>
          <ToastContainer />
          <h1 className={styles.header}>Upload your Dataset</h1>
          <DataEntry {...props}></DataEntry>
        {fileName !== "" ? (
          <>
            <div className={styles.configuration}>
              <div style={{width: "100%", margin: "16px 0 8px"}}>
                <p style={{ margin: "8px 0"}}>
                  <b>Select Forecasting Model</b>
                </p>
                <Radio.Group
                  defaultValue="prophet"
                  value={model}
                  onChange={handleChangeModel}
                  size="large"
                  buttonStyle="solid"
                >
                  <Radio.Button value="prophet">
                    Facebook Prophet (fastest)
                  </Radio.Button>
                  <Radio.Button value="lstm">LSTM (normal)</Radio.Button>
                  <Radio.Button value="lstm_gru">
                    LSTM + GRU (slowest)
                  </Radio.Button>
                </Radio.Group>
              </div>
              <div style={{width: "100%", margin: "8px 0"}}>
                <p style={{ margin: "8px 0" }}>
                  <b>Select Date Column</b>
                </p>
                <Radio.Group onChange={handleChangeDsCol} value={dsCol}>
                  {columns.map((item, index)=>(<Radio key={`${item}__${index}`} value={item}>{item}</Radio>))}
                </Radio.Group>
              </div>
              <div style={{width: "100%", margin: "8px 0"}}>
                <p style={{ margin: "8px 0" }}>
                  <b>Select Y-value Column</b>
                </p>
                <Radio.Group onChange={handleChangeYCol} value={yCol}>
                  {columns.map((item, index)=>(<Radio key={`${item}__${index}`} value={item}>{item}</Radio>))}
                </Radio.Group>
              </div>
              <div className={styles.indexConfig}>
                <Card
                  title="Date format"
                  style={{ width: 300, minHeight: "300px", margin: "16px" }}
                >
                  <p>
                    <b>%Y</b> - Year [0001,..., 2018, 2019,..., 9999]
                  </p>
                  <p>
                    <b>%m</b> - Month [01, 02, ..., 11, 12]
                  </p>
                  <p>
                    <b>%d</b> - Day [01, 02, ..., 30, 31]
                  </p>
                  <p>
                    <b>%H</b> - Hour [00, 01, ..., 22, 23]
                  </p>
                  <p>
                    <b>%M</b> - Minute [00, 01, ..., 58, 59]
                  </p>
                  <p>
                    <b>%S</b> - Second [00, 01, ..., 58, 59]
                  </p>
                  <Input
                    placeholder="Date format: i.e %d/%m/%Y"
                    style={{ margin: "16px 0" }}
                    value={dateFormat}
                    onChange={handleChangeDateFormat}
                  />
                </Card>
                <Card
                  title="No. of days to forecast"
                  style={{ width: 300, minHeight: "300px", margin: "16px" }}
                >
                  <p>
                    The <b>No. of days or N</b> has to be a{" "}
                    <b>natural number</b>.
                  </p>
                  <p>
                    It should be <b>greater than 0 and less than 30 days</b> so
                    the model can forecast properly.
                  </p>
                  <InputNumber
                    placeholder="No. of days: i.e 15"
                    style={{ margin: "16px 0", width: "100%" }}
                    min={1}
                    max={30}
                    controls={false}
                    value={ds}
                    onChange={handleChangeDs}
                  />
                </Card>
              </div>
              <Button
                type="primary"
                size="large"
                className={styles.submitBtn}
                loading={isLoading}
                onClick={handleClick}
                style={{ width: "100%", maxWidth: "300px", margin: "16px" }}
              >
                Forecast
              </Button>
            </div>
            {Object.keys(data).length !== 0 ? (
              <>
                <h1>{fileName} Forecast</h1>
                <Plot
                  data={[
                    {
                      x: data["ds"].map((d) => new Date(d)),
                      y: data["y"],
                      mode: "lines",
                      marker: { color: "red" },
                      name: "Provided Values",
                    },
                    {
                      x: data["predicted_ds"].map((d) => new Date(d)),
                      y: data["predicted_y"],
                      mode: "lines+markers",
                      marker: { color: "blue" },
                      name: "Forecast Values",
                    },
                  ]}
                  layout={{
                    autosize: true,
                    xaxis: {
                      tickformat: "%d/%m/%Y",
                    },
                  }}
                  useResizeHandler
                  style={{ width: "90%" }}
                />
              </>
            ) : (
              <></>
            )}
          </>
        ) : (
          <></>
        )}
      </div>
    </>
  );
}

export default Home;
