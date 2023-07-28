const Vetrina = require("../models/vetrina");
const Apis = require("../models/apis");
const pathS = require("../models/pathS");

const axios = require("axios");
const { urlencoded } = require("body-parser");
const { response } = require("express");

const _ = require("lodash");

// <<<>><<>><><<>><><><><><><><> get dat ><<>><<><><>><><><
const getData = async (urls) => {
  const requests = urls.map((URL) => axios.get(URL));
  console.log(urls);
  return Promise.all(requests)
    .then((responses) => responses.map((response) => response.data))

    .catch((error) => {
      throw new Error(`Error fetching data: ${error.message}`);
    });
};



// >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> get>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
async function getDataFromPath(brand) {
  try {
    const apiData = await Apis.findOne({
      where: {
        brand: brand,
      },
      attributes: [
        "url",
        "pathName",
        "pathQuant",
        "pathColor",
        "pathModel",
        "pathid_item",
      ],
    });

    if (!apiData) {
      throw new Error("APIs not found for the given brand.");
    }

    const { url, pathName, pathQuant, pathColor, pathModel, pathid_item } =
      apiData.dataValues;
    const urls = [url];
    const apiResponse = await getData(urls);

   
    const extractDataFromPath = (response, path) => {
      const segments = path.split(/[.[\]]+/).filter(Boolean); // Split the path into segments

      function traverse(obj, segs) {
        if (segs.length === 0) return obj; // Base case: end of the path

        const currentSeg = segs.shift();

        if (Array.isArray(obj)) {
          const index = parseInt(currentSeg);
          if (!isNaN(index) && obj[index]) {
            return traverse(obj[index], segs);
          } else {
            return null;
          }
        } else if (typeof obj === "object" && obj !== null) {
          if (obj.hasOwnProperty(currentSeg)) {
            return traverse(obj[currentSeg], segs);
          } else {
            return null;
          }
        } else {
          return null; // Not an object or array
        }
      }

      return traverse(response, segments);
    };

    const numOfRows = apiResponse.length; 
    console.log(numOfRows, "nuuuuuuumber ");
    const extractedDataList = [];

    for (let i = 0; i < numOfRows; i++) {
      console.log(
        i,
        "iiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiisd"
      );
      const extractedData = {
        brand: brand,
        name: extractDataFromPath(
          apiResponse,
          convertToSpecifierPath(pathName, i)
        ),
        quant: extractDataFromPath(
          apiResponse,
          convertToSpecifierPath(pathQuant, i)
        ),
        color: extractDataFromPath(
          apiResponse,
          convertToSpecifierPath(pathColor, i)
        ),
        model: extractDataFromPath(
          apiResponse,
          convertToSpecifierPath(pathModel, i)
        ),
        id_item: extractDataFromPath(
          apiResponse,
          convertToSpecifierPath(pathid_item, i)
        ),
      };

      extractedDataList.push(extractedData);

      const existingVetrinaEntry = await Vetrina.findOne({
        where: {
          brand: brand,
          id_item: extractedData.id_item,
        },
      });

      if (existingVetrinaEntry) {
        await existingVetrinaEntry.update(extractedData);
        console.log("Vetrina entry updated:", existingVetrinaEntry);
      } else {
        const createdVetrinaEntry = await Vetrina.create(extractedData);
        console.log("New Vetrina entry created:", createdVetrinaEntry);
      }
    }

    return extractedDataList;
  } catch (error) {
    throw error;
  }
}
//>>....................<<<<<<<<<<<<<<<<<<<<<<<<<<<get data with path>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>...............................................

async function ggety(urls) {
  try {
    const response = await axios.get(urls[0]);
    return response.data; // Return the entire response data
  } catch (error) {
    console.error("Error fetching data:", error);
    return null;
  }
}


function getValueAtPath(obj, path) {
  const pathSegments = path.split(".");
  let value = obj;

  for (const segment of pathSegments) {
    if (value === null || value === undefined) {
      break;
    }

    const match = segment.match(/(.+)\[(\d+)\]/); 
    if (match) {
      const arrayProperty = match[1];
      const index = parseInt(match[2]);
      value = value[arrayProperty] ? value[arrayProperty][index] : undefined;
    } else {
      value = value[segment];
    }
  }

  return value !== undefined ? value : null;
}


async function getAllAttributeValues(data, attributePaths) {
  const attributeValuesList = [];

  if (!data || typeof data !== "object") {
    // Return an empty list for attribute values if data is not in the expected format
    for (const targetPath of attributePaths) {
      attributeValuesList.push([]);
    }
    return attributeValuesList;
  }

  for (const targetPath of attributePaths) {
    const pathSegments = splitPath(data, targetPath);
    let values = [];
    console.log(pathSegments, "llllllllllllllllllllllllllllllllll");

    if (pathSegments[1].length > 0) {
      const arrayProperty = pathSegments[0];
      console.log(pathSegments[1], "llllllllllllllllllllllllllllllllll");
      const p = pathSegments[1]
      console.log(p,"///?????????????")
      const arrayValues = data[p].map((item) => item[arrayProperty]);
      values = arrayValues.filter((value) => value !== undefined);
    } else {
      values = data.map((obj) => getValueAtPath(obj, targetPath));
    }

    attributeValuesList.push(values);
  }

  return attributeValuesList;
}

function splitPath(data, path) {
  const pathSegments = path.split(".");
  console.log(pathSegments, "hjhjhj");
 
  let p = "";
  let s = ""
  let pathsplit = [];
  for (const segment of pathSegments) {
    console.log(segment, "hhjhjjbb");
    console.log(data[segment], typeof segment);
    if (_.isArray(data[segment])) {
       p = p + segment;
      console.log(
        p,
        "pppppppppppppppppppppppppppppppppppppppppppppppppppqppqpqqpqpqqqqqqqqqqqqqq"
      );
    } else {
      s= segment
      console.log(p);
      pathsplit = [s,p];
      console.log(
        ">>>>><<><><>><<><><><><><>,..,,.,,.,..,.,.,,<><><>><><><><><><><><><><><><<>><<>><><<><>><<>><<>",
        pathsplit
      );
      return pathsplit;
    }
  }
}


const getAllAttriValues = async (req, res) => {
  try {
    let { brand } = req.body;
    console.log(brand);

    const apiData = await Apis.findOne({
      where: {
        brand: brand,
      },
      attributes: [
        "url",
        "pathName",
        "pathQuant",
        "pathColor",
        "pathModel",
        "pathid_item",
      ],
    });

    if (!apiData) {
      throw new Error("APIs not found for the given brand.");
    }

    const { url, pathName, pathQuant, pathColor, pathModel, pathid_item } =
      apiData.dataValues;
    const urls = [url];
    const data = await ggety(urls); 
    console.log("uuuu", urls);
    console.log("Data:", data);

    const attributePaths = [
      pathName,
      pathQuant,
      pathColor,
      pathModel,
      pathid_item,
    ];
    console.log("Attribute Paths:", attributePaths);

    if (!attributePaths.every(Boolean)) {
      return res
        .status(400)
        .json({ error: "Invalid or missing path(s) provided." });
    }

    const attributeValuesList = await getAllAttributeValues(
      data,
      attributePaths
    );
    console.log("Attribute values for each path:", attributeValuesList);

    
    if (
      !attributeValuesList.every(
        (arr) => arr.length === attributeValuesList[0].length
      )
    ) {
      return res
        .status(500)
        .json({ error: "Attribute value arrays have different lengths." });
    }

    
    for (let i = 0; i < attributeValuesList[0].length; i++) {
      const dataObj = {
        brand,
        id_item: attributeValuesList[4][i], 
        name: attributeValuesList[0][i], 
        quant: attributeValuesList[1][i], 
        color: attributeValuesList[2][i], 
        model: attributeValuesList[3][i], 
      };
      
    
      console.log(dataObj);
      const existingRow = await Vetrina.findOne({
        where: { brand, id_item : dataObj.id_item },
      });

      if (existingRow) {
        const { name, model, quant, color } = dataObj;
        await existingRow.update({ name, model, quant, color });
        console.log("Data updated successfully in the database");
      } else {
        
        await Vetrina.create({
          brand,
          id_item: dataObj.id_item,
          name: dataObj.name,
          model: dataObj.model,
          quant: dataObj.quant,
          color: dataObj.color,
        });
        console.log("Data inserted successfully into the database");
      }
    
    }

   
    res.json(attributeValuesList);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

//.............................................

//**********************************findpath************************************************>< */

const findAttributePath = (data, attributeName) => {
  const traverse = (obj, currentPath) => {
    for (const key in obj) {
      const newPath = currentPath ? `${currentPath}.${key}` : key;
      if (key === attributeName) {
        return newPath;
      } else if (typeof obj[key] === "object" && obj[key] !== null) {
        const result = traverse(obj[key], newPath);
        if (result) {
          return result;
        }
      }
    }
    return null;
  };

  return traverse(data, "");
};

const gget = async (urls) => {
  return fetch(urls[0]).then((response) => response.json());
};

const run = async () => {
  const urls = ["http://localhost:3001/produits/ "];

  try {
    const data = await gget(urls);
    console.log(data);

    const attributeName = "zaraid";
    const path = findAttributePath(data, attributeName);
    if (path) {
      console.log(`Path to attribute '${attributeName}': ${path}`);
    } else {
      console.log(`Attribute '${attributeName}' not found in the data.`);
    }
  } catch (error) {
    console.error("Error fetching data:", error.message);
  }
};

run();

//**********************************************************************************>< */

// >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>  inser new api >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>


const insertApiData = async (req, res) => {
  try {
    const {
      brand,
      url,
      updateurl,
      typeUrlUpdate,
      pathid_item,
      pathname,
      pathmodel,
      pathquant,
      pathcolor,
      delimiter,
    } = req.body;

    const existingApi = await Apis.findOne({ where: { brand } });

    if (existingApi) {
      await existingApi.update({
        url,
        updateurl,
        typeUrlUpdate,
        pathid_item,
        pathname,
        pathmodel,
        pathquant,
        pathcolor,
        delimiter,
      });
      console.log("Data updated successfully in the database");
      res.send("Data updated successfully");
    } else {
      await Apis.create({
        brand,
        url,
        updateurl,
        typeUrlUpdate,
        pathid_item,
        pathname,
        pathmodel,
        pathquant,
        pathcolor,
        delimiter,
      });
      console.log("Data inserted successfully into the database");
      res.send("Data inserted successfully");
    }
  } catch (error) {
    console.error("Error inserting/updating data:", error.message);
    res.status(500).send("Error inserting/updating data");
  }
};
//<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< update quant<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
const update = async (req, res) => {
  try {
    let { id, quant } = req.body;

    const currentQuant = await Vetrina.findOne({ where: { id } });

    if (!currentQuant) {
      console.log("No item found for the given id:", id);
      res.status(404).send("Item not found");
      return;
    }

    const newQuant = currentQuant.quant - quant;

    console.log("newQuant", newQuant);

    const idItem = currentQuant.id_item;
    console.log("Selected id_item:", idItem);

    await Vetrina.update({ quant: newQuant }, { where: { id } });

    console.log("Rows updated");

    const apiData = await Apis.findOne({
      where: { brand: currentQuant.brand },
    });

    if (!apiData) {
      throw new Error("No API data found for the specified idItem");
    } else {
      const { typeUrlUpdate } = apiData;

      let response;

      if (typeUrlUpdate === "URL Path") {
        const urlWithParams = `${URLUP}/${idItem}/${quant}`;
        response = await axios.get(urlWithParams);
      } else if (typeUrlUpdate === "Query Parameters") {
        response = await axios.get(URLUP, { params: { id: idItem, quant } });
      } else if (typeUrlUpdate === "Request Body") {
        const requestBody = {
          id_item: idItem,
          quant: quant,
        };
        response = await axios.post(URLUP, requestBody);
      }

      console.log("Response from Server:", response.data);
    }

    res.send("Parameters sent successfully");
  } catch (error) {
    console.error("Error sending parameters:", error.message);
    res.status(500).send("Error sending parameters");
  }
};

module.exports = {
  // posted,
  insertApiData,
  update,
  getDataFromPath,
  getAllAttriValues,
};
