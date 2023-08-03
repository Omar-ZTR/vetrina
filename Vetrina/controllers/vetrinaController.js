const Vetrina = require("../models/vetrina");
const Apis = require("../models/apis");
const pathS = require("../models/pathS");
const UrlS = require("../models/urls");

const axios = require("axios");
const { urlencoded } = require("body-parser");
const { response } = require("express");

const _ = require("lodash");

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


async function getAllAttributeValues(data, targetPath, params, id) {
  const pathSegments = splitPath(data, targetPath);
 

  const arrayProperty = pathSegments.s;
  const p = pathSegments.p;


  if (p.length > 0 && data[p] && Array.isArray(data[p])) {
    const filteredValue = data[p].find((item) => item[params] === id);
    
    if (filteredValue) {
      return filteredValue[arrayProperty];
    }
  } else {
    const filteredValue = data.find((obj) => obj[params] === id);
    if (filteredValue) {
      return getValueAtPath(filteredValue, targetPath);
    }
  }

  return null;
}

function splitPath(data, path) {
  const pathSegments = path.split(".");
  



  let p = "";
  let s = "";

  for (const segment of pathSegments) {
  
    if (_.isArray(data[segment])) {
      p = p + segment + ".";
    
    } else {
      s = segment;
    }
  }

  const pathsplit = { s, p: p.slice(0, -1) };

  return pathsplit;
}


async function getone(urls, nameparams, paramsval) {
  try {
    if (nameparams.length !== paramsval.length) {
      throw new Error(
        "The 'nameparams' and 'paramsval' lists must have the same length."
      );
    }

    const queryParams = {};
    nameparams.forEach((name, index) => {
      queryParams[name] = paramsval[index];
    });

    const response = await axios.get(urls[0], { params: queryParams });
    return response.data; 
  } catch (error) {
    console.error("Error fetching data:", error);
    return null;
  }
}

const getproduitspecif = async (req, res) => {
  try {
    let { brand, colName, id } = req.body;

    const apiData = await UrlS.findOne({
      where: {
        brand: brand,
      },
      attributes: ["url", "paramsget"],
    });

    if (!apiData) {
      throw new Error("APIs not found for the given brand.");
    }

    const { url, paramsget } = apiData.dataValues;
    const URL = [url];
    const paramsname = [paramsget];
    const paramsval = [id];
    const data = await getone(URL, paramsname, paramsval);
    console.log("uuuu", URL);
    console.log("Data:", data);


    // get path attribute and params from pathS


    const getpath = await pathS.findOne({
      where: {
        brand: brand,
        nameAttribute: colName,
      },
      attributes: ["pathAttribute", "params"],
    });
    const { pathAttribute, params } = getpath.dataValues;

    console.log("Attribute Paths:", pathAttribute);


    // call fun getAllAttributeValues to get value of attribute

    if (!pathAttribute) {
      return res
        .status(400)
        .json({ error: "Invalid or missing path(s) provided." });
    }

    const attributeValuesList = await getAllAttributeValues(
      data,
      pathAttribute,
      params,
      id
    );

    res.json(attributeValuesList);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

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

// run();

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

const insertUrlS = async (req, res) => {
  try {
    const { brand, url, updateurl, paramsget, paramsupdate, method } = req.body;

    const existingApi = await UrlS.findOne({ where: { brand } });

    if (existingApi) {
      await existingApi.update({
        brand,
        url,
        updateurl,
        paramsget,
        paramsupdate,
        method,
      });
      console.log("Data updated successfully in the database");
      res.send("Data updated successfully");
    } else {
      await UrlS.create({
        brand,
        url,
        updateurl,
        paramsget,
        paramsupdate,
        method,
      });
      console.log("Data inserted successfully into the database");
      res.send("Data inserted successfully");
    }
  } catch (error) {
    console.error("Error inserting/updating data:", error.message);
    res.status(500).send("Error inserting/updating data");
  }
};

const insertpathS = async (req, res) => {
  try {
    const { brand, nameAttribute, pathAttribute, url, params } = req.body;

    const existingApi = await pathS.findOne({ where: { nameAttribute } });

    if (existingApi) {
      await existingApi.update({
        brand,
        nameAttribute,
        pathAttribute,
        url,
        params,
      });
      console.log("Data updated successfully in the database");
      res.send("Data updated successfully");
    } else {
      await pathS.create({
        brand,
        nameAttribute,
        pathAttribute,
        url,
        params,
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


function getParameterType(urlString) {
  const parsedURL = new URL(urlString);

  if (parsedURL.searchParams && parsedURL.searchParams.toString() !== '') {
    return 'Query Parameters';
  }

  const pathTokens = parsedURL.pathname.split('/');
  for (const token of pathTokens) {
    if (token.startsWith('{') && token.endsWith('}')) {
      return 'URL Parameters';
    }
  }

  return 'Request Body Parameters';
}


async function updateDataWithParameterType(urlString, method, parameters) {
  try {
    const parameterType = getParameterType(urlString);

    if (parameterType === 'Query Parameters') {
      const response = await axios.get(urlString, { params: parameters });
      console.log('Response:', response.data);
      return response.data;
    } else if (parameterType === 'URL Parameters') {
      const parsedURL = new URL(urlString);
      const pathTokens = parsedURL.pathname.split('/');
      for (let i = 0; i < pathTokens.length; i++) {
        const token = pathTokens[i];
        if (token.startsWith('{') && token.endsWith('}')) {
          const paramName = token.slice(1, -1);
          if (parameters[paramName]) {
            parsedURL.pathname = parsedURL.pathname.replace(`{${paramName}}`, parameters[paramName]);
            break;
          } else {
            throw new Error(`Missing URL parameter: ${paramName}`);
          }
        }
      }

      const requestOptions = {
        method: method.toUpperCase(),
        url: parsedURL.toString(),
        data: method === 'post' ? parameters : undefined,
      };
      const response = await axios(requestOptions);
      console.log('Response:', response.data);
      return response.data;
    } else if (parameterType === 'Request Body Parameters') {
      const requestOptions = {
        method: method.toUpperCase(),
        url: urlString,
        data: parameters,
      };
      const response = await axios(requestOptions);
      console.log('Response:', response.data);
      return response.data;
    } else {
      throw new Error('Unknown parameter type');
    }
  } catch (error) {
    console.error('Error:', error.message);
    throw error;
  }
}


const updated = async (req, res) => {
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
    
        const apiData = await UrlS.findOne({
          where: { brand: currentQuant.brand },
        });
    
    if (!apiData) {
      throw new Error("No API data found for the specified idItem");
    } else {
      const { method, paramsupdate, updateurl } = apiData;

      const { id: idParam, quant: quantParam } = paramsupdate;

      let paramsToSend = {};
      if (idParam) {
        paramsToSend[idParam] = idItem;
      }
      if (quantParam) {
        paramsToSend[quantParam] = newQuant;
      }

      let response;
      if (method === 'get') {
        response = await updateDataWithParameterType(updateurl, 'get', paramsToSend);
      } else {
        response = await updateDataWithParameterType(updateurl, method, paramsToSend);
      }

      console.log("Response from Server:", response);
    }

    res.send("Parameters sent successfully");
  } catch (error) {
    console.error("Error sending parameters:", error.message);
    res.status(500).send("Error sending parameters");
  }
};


module.exports = {
  
  insertApiData,
  updated,
  insertUrlS,
  insertpathS,
  getproduitspecif,

};
