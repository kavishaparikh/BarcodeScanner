import "bootstrap/dist/css/bootstrap.min.css";
import React, { useState, useEffect, useParams, useRef } from "react";
import { useBarcode } from "@createnextapp/react-barcode";

function downloadBlob(blob, filename) {
  const objectUrl = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = objectUrl;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  setTimeout(() => URL.revokeObjectURL(objectUrl), 5000);
}

const GetBarCode = (value) => {
  const { inputRef } = useBarcode({
    value, //Product Number from database
    options: {
      background: "#ffffff",
      fontSize: 20,
      margin: 30,
      fontOptions: "bold",
      width: 1,
      height: 70,
    },
  });
  return inputRef;
};

const Barcode = () => {
  // useEffect(() => {
  //   loadBrcode();
  // }, []);
  const svgRef = useRef({});

  const [data, setData] = useState([
    {
      name: "cards",
      barcode: "1234cards",
    },
    {
      name: "apple",
      barcode: "1234apple",
    },
    {
      name: "sam",
      barcode: "1234sam",
    },
    {
      name: "hii",
      barcode: "345678",
    },
  ]);

  const loadBrcode = () => {
    var response = fetch("https://non-sense-backend.herokuapp.com/getProduct")
      .then(function (response) {
        return response.json();
      })
      .then(function (myJson) {
        setData(myJson);
      });
  };

  const getTableRow = (m) => {
    return (
      <tr>
        <td>1</td>
        <td>
          <h5>{m.name}</h5>
        </td>
        <td
          ref={(ref, key) => {
            svgRef.current[m.name] = ref;
          }}
        >
          <svg ref={GetBarCode(m.barcode)} />
        </td>
        <td>
          <button
            type="submit"
            className="btn btn-primary"
            onClick={() => {
              downloadSVG(m.name);
            }}
            name="submit"
          >
            Download
          </button>
        </td>
      </tr>
    );
  };

  // Code for Inserting barcode into database

  const downloadSVG = (i) => {
    const svg = svgRef.current[i].innerHTML;
    const blob = new Blob([svg], { type: "image/svg+xml" });
    downloadBlob(blob, `${i}.svg`);
  };

  return (
    <div className="container">
      <div className="row">
        <div
          className="col-sm-12"
          style={{ border: "1px solid rgb(206 200 200)" }}
        >
          <h5 className="text-center  ml-4 mb-5 mt-4">Barcodes</h5>
          <table className="table table-hover mb-5">
            <thead>
              <tr>
                <th>Id</th>
                <th>Product Name</th>
                <th>Barcode Number</th>
                <th>Download</th>
              </tr>
            </thead>
            <tbody id="output">
              {data.map((m, i) => {
                return getTableRow(m);
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Barcode;
