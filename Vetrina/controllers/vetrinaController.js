const Vetrina = require("../models/vetrina");
const Apis = require("../models/apis");
const pathS = require("../models/pathS");

const axios = require("axios");
const { urlencoded } = require("body-parser");
const { response } = require("express");

const _ = require('lodash');
const getData = async (urls) => {
  const requests = urls.map((URL) => axios.get(URL));
console.log(urls)
  return Promise.all(requests)
    .then((responses) => responses.map((response) => response.data))

    

    .catch((error) => {
      throw new Error(`Error fetching data: ${error.message}`);
    });
};

// async function saveToVetrina(brand, extractedData) {
//   try {
//     const [vetrinaRecord, created] = await Vetrina.findOrCreate({
//       where: {
//         brand: brand,
//         id_item: extractedData.id_item,
//       },
//       defaults: extractedData,
//     });

//     if (!created) {
//       await vetrinaRecord.update(extractedData);
//     }
//   } catch (error) {
//     throw error;
//   }
// }

// ......................................................................................
// async function getDataFromPath(brand) {
  
//   try {
//     const apiData = await Apis.findOne({
//       where: {
//         brand: brand,
//       },
//       attributes: ['url', 'pathName', 'pathQuant', 'pathColor', 'pathModel', 'pathid_item'],
//     });

//     if (!apiData) {
//       throw new Error('APIs not found for the given brand.');
//     }

//     const { url, pathName, pathQuant, pathColor, pathModel, pathid_item } = apiData.dataValues;
//     const urls = [url];
//     const apiResponse = await getData(urls);
//     console.log(pathColor,pathModel)
//     console.log("aaaaaaaaaaaaaaaaaaa", apiResponse)
//     console.log(JSON.stringify(apiResponse, null, 2));
//     dataextracted = JSON.stringify(apiResponse, null, 2)
//     console.log("fgbdshnmkvgbfchdnjbhdcnj<><><><><>><><><><><><><>",dataextracted)
//     dd = _.get(apiResponse, pathColor),
//     console.log("Value found:", dd); 
//     const convertToSpecifierPath = (path, index) => {
//       console.log(index)
//       return path.replace(/\bproduit\b/g, `.produit[${index}]`);
//     };
    
   
//     let inda = 1;
//     const extractedData = {
      
//       brand: brand,
//       name: _.get(apiResponse, convertToSpecifierPath(pathName, inda)),
//       quant: _.get(apiResponse, convertToSpecifierPath(pathQuant, inda)),
//       color: _.get(apiResponse, convertToSpecifierPath(pathColor, inda)),
//       model: _.get(apiResponse, convertToSpecifierPath(pathModel, inda)),
//       id_item: _.get(apiResponse, convertToSpecifierPath(pathid_item, inda)),
      
//     };

//     console.log(extractedData.id_item,"changeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeed")

//     const columnData = {};

// for (const columnName in apiData.dataValues) {
//   columnData[columnName] = _.get(apiResponse, apiData.dataValues[columnName]);
// }

//     console.log("Value found:", extractedData); 
    
//     const existingVetrinaEntry = await Vetrina.findOne({
//       where: {
//         brand: brand,
//         id_item: pathid_item,
//       },
//     });
//     console.log("Value found:", extractedData); 
//     if (existingVetrinaEntry) {


//       await existingVetrinaEntry.update(extractedData);
//       console.log("Vetrina entry updated:", existingVetrinaEntry);
//     } else {


//       const createdVetrinaEntry = await Vetrina.create(extractedData);
//       console.log("New Vetrina entry created:", createdVetrinaEntry);
//     }

//     return extractedData;
//   } catch (error) {
//     throw error;
//   }
// }

// ..............................................................................

async function getDataFromPath(brand) {
  try {
    const apiData = await Apis.findOne({
      where: {
        brand: brand,
      },
      attributes: ['url', 'pathName', 'pathQuant', 'pathColor', 'pathModel', 'pathid_item'],
    });

    if (!apiData) {
      throw new Error('APIs not found for the given brand.');
    }

    const { url, pathName, pathQuant, pathColor, pathModel, pathid_item } = apiData.dataValues;
    const urls = [url];
    const apiResponse = await getData(urls);

    // Updated function to extract data from the response based on the split path
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
        } else if (typeof obj === 'object' && obj !== null) {
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

    const numOfRows = apiResponse.length; // Get the number of rows (products)
    console.log(numOfRows, "nuuuuuuumber ")
    const extractedDataList = [];

    for (let i = 0; i < numOfRows; i++) {
      console.log(i, "iiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiisd")
      const extractedData = {
        brand: brand,
        name: extractDataFromPath(apiResponse, convertToSpecifierPath(pathName, i)),
        quant: extractDataFromPath(apiResponse, convertToSpecifierPath(pathQuant, i)),
        color: extractDataFromPath(apiResponse, convertToSpecifierPath(pathColor, i)),
        model: extractDataFromPath(apiResponse, convertToSpecifierPath(pathModel, i)),
        id_item: extractDataFromPath(apiResponse, convertToSpecifierPath(pathid_item, i)),
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
//>>...................................................................
// Function to get the value at a specific path within an object
// Function to get the value at a specific path within an object

// async function ggety(urls) {
//   try {
//     const response = await axios.get(urls[0]);
//     return response.data.produit; // Return the 'produit' array directly
//   } catch (error) {
//     console.error('Error fetching data:', error);
//     return null;
//   }
// }

async function ggety(urls) {
try {
  const response = await axios.get(urls[0]);
  return response.data; // Return the entire response data
} catch (error) {
  console.error('Error fetching data:', error);
  return null;
}
}



// function getValueAtPath(obj, path) {
//   const pathSegments = path.split('.');
//   let value = obj;

//   for (const segment of pathSegments) {
//     if (value === null || value === undefined) {
//       break;
//     }

//     const match = segment.match(/(.+)\[(\d+)\]/); // Check for array index in the segment
//     if (match) {
//       const arrayProperty = match[1];
//       const index = parseInt(match[2]);
//       value = value[arrayProperty] ? value[arrayProperty][index] : undefined;
//     } else {
//       value = value[segment];
//     }
//   }

//   return value !== undefined ? value : null;
// }
function getValueAtPath(obj, path) {
  const pathSegments = path.split('.');
  let value = obj;

  for (const segment of pathSegments) {
    if (value === null || value === undefined) {
      break;
    }

    const match = segment.match(/(.+)\[(\d+)\]/); // Check for array index in the segment
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


// Function to get all attribute values for each path
// async function getAllAttributeValues(data, attributePaths) {
//   const attributeValuesList = [];

//   if (!data || !Array.isArray(data)) {
//     console.log(data)
//     // Return an empty list for attribute values if data is not in the expected format
//     for (const targetPath of attributePaths) {
//       attributeValuesList.push([]);
//     }
//     return attributeValuesList;
//   }

//   for (const targetPath of attributePaths) {
//     const attributeValues = data.map(obj => getValueAtPath(obj, targetPath));
//     attributeValuesList.push(attributeValues);
//   }

//   return attributeValuesList;
// }
// is work /.................. 
// async function getAllAttributeValues(data, attributePaths) {
//   const attributeValuesList = [];

//   if (!data || typeof data !== 'object') {
//     // Return an empty list for attribute values if data is not in the expected format
//     for (const targetPath of attributePaths) {
//       attributeValuesList.push([]);
//     }
//     return attributeValuesList;
//   }

//   for (const targetPath of attributePaths) {
//     const pathSegments = targetPath.split('.');
//     let values = [];

//     if (pathSegments[0] === 'produit') {
//       const arrayProperty = pathSegments[1];
//       const arrayValues = data.produit.map(item => item[arrayProperty]);
//       values = arrayValues.filter(value => value !== undefined);
//     } else {
//       values = data.map(obj => getValueAtPath(obj, targetPath));
//     }

//     attributeValuesList.push(values);
//   }

//   return attributeValuesList;
// }

//....ddd
async function getAllAttributeValues(data, attributePaths) {
  const attributeValuesList = [];

  if (!data || typeof data !== 'object') {
    // Return an empty list for attribute values if data is not in the expected format
    for (const targetPath of attributePaths) {
      attributeValuesList.push([]);
    }
    return attributeValuesList;
  }

  for (const targetPath of attributePaths) {
    const attributeValues = extractValuesAtPath(data, targetPath);
    attributeValuesList.push(attributeValues);
  }

  return attributeValuesList;
}
/// """"""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""

function extractValuesAtPath(data, path) {
  const pathSegments = path.split('.');
  console.log(pathSegments,"hjhjhj")
let p = ""
  for (const segment of pathSegments) {
    console.log(segment,"hhjhjjbb")
    console.log(data[segment], typeof segment)
    if(_.isArray(data[segment])){
      p= p + "." + segment;
      console.log(p,"pppppppppppppppppppppppppppppppppppppppppppppppppppqppqpqqpqpqqqqqqqqqqqqqq");
    }else{
      console.log(p);
      return p
      
    }
  
}}


// Main function to get all attribute values for a given brand
const getAllAttriValues = async (req, res) => {
  try {
    let { brand } = req.body;
    console.log(brand);

    const apiData = await Apis.findOne({
      where: {
        brand: brand,
      },
      attributes: ['url', 'pathName', 'pathQuant', 'pathColor', 'pathModel', 'pathid_item'],
    });

    if (!apiData) {
      throw new Error('APIs not found for the given brand.');
    }

    const { url, pathName, pathQuant, pathColor, pathModel, pathid_item } = apiData.dataValues;
    const urls = [url];
    const data = await ggety(urls); // Assuming getData is a function that fetches the data from the provided URL
    console.log("uuuu", urls)
    console.log('Data:', data);

    const attributePaths = [pathName, pathQuant, pathColor, pathModel, pathid_item];
    console.log('Attribute Paths:', attributePaths);

    if (!attributePaths.every(Boolean)) {
      return res.status(400).json({ error: 'Invalid or missing path(s) provided.' });
    }

    const attributeValuesList = await getAllAttributeValues(data, attributePaths);
    console.log('Attribute values for each path:', attributeValuesList);

    // Ensure all attribute values are arrays of the same length
    if (!attributeValuesList.every(arr => arr.length === attributeValuesList[0].length)) {
      return res.status(500).json({ error: 'Attribute value arrays have different lengths.' });
    }

    // Prepare the data for bulk insert or update
    const bulkData = [];
    for (let i = 0; i < attributeValuesList[0].length; i++) {
      const dataObj = {
        brand,
        id_item: attributeValuesList[4][i], // Assuming pathid_item is at index 4
        name: attributeValuesList[0][i],   // Assuming pathName is at index 0
        quant: attributeValuesList[1][i],  // Assuming pathQuant is at index 1
        color: attributeValuesList[2][i],  // Assuming pathColor is at index 2
        model: attributeValuesList[3][i],  // Assuming pathModel is at index 3
      };
      bulkData.push(dataObj);
    }

    // Perform bulk insert or update using upsert (insert or update if exists)
    await Vetrina.bulkCreate(bulkData, { updateOnDuplicate: ['name', 'quant', 'color', 'model'] });

    res.json(attributeValuesList);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Internal Server Error' });
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
      } else if (typeof obj[key] === 'object' && obj[key] !== null) {
        const result = traverse(obj[key], newPath);
        if (result) {
          return result;
        }
      }
    }
    return null;
  };

  return traverse(data, '');
};

const gget = async (urls) => {

  return fetch(urls[0]).then(response => response.json());
};

const run = async () => {
  const urls = ['http://localhost:3001/produits/ ']; 

  try {
    const data = await gget(urls); 
    console.log(data);

    const attributeName = 'zaraid'; 
    const path = findAttributePath(data, attributeName);
    if (path) {
      console.log(`Path to attribute '${attributeName}': ${path}`);
    } else {
      console.log(`Attribute '${attributeName}' not found in the data.`);
    }
  } catch (error) {
    console.error('Error fetching data:', error.message);
  }
};

run();


//**********************************************************************************>< */





// >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
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
    } else if (typeof obj === 'object' && obj !== null) {
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

 // Output: "test1 Product"
   
// const extractedData = {};

// // Function to extract data from the response based on the split path
// const extractDataFromPath = (response, segments) => {
//   let data = response;
//   for (const segment of segments) {
//     console.log(",,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,",segments)
//     if (data[segment]) {
//       console.log("datasegdccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccc",data[segment])
//       data = data[segment];
//       console.log("//////////////////////////////////////////////////",data)
//     } else {
//       return null;
//     }
//   }
//   return data;
// };
// const numOfRows = 3; // Change this to the actual number of rows you have

// const extractedDataList = [];

// const convertToSpecifierPath = (path, index) => {
//   return path.replace(/\bproduit\b/g, `.produit[${index}]`);
// };

// for (let i = 0; i < numOfRows; i++) {

//   pathid_item= convertToSpecifierPath(pathid_item, i),
//   pathName= convertToSpecifierPath(pathName, i),
//    pathModel= convertToSpecifierPath(pathModel, i),
  
//    pathQuant =convertToSpecifierPath(pathQuant, i),
//    pathColor= convertToSpecifierPath(pathColor, i),
    
//   };

// for (const columnName in pathsToExtract) {
//   const path = pathsToExtract[columnName];
//   const segments = path.split(/[.[\]]+/).filter(Boolean); // Split the path into segments
//   const data = extractDataFromPath(apiResponse, segments);
//   extractedData[columnName] = data;
// }
// }
// ?????????????????????????????????????????????????????????????????????????????


// const brand = 'exist';
// const apiResponse = {
//   produit: [
//     {
//       existname: 'Test Product',
//       existquant: 10,
//       existcolor: 'Red',
//       existmodel: 'Test Model',
//       existid: 1,
//     },
//     // More data...
//   ],
//   // Other properties...
// };

// const extractedData = getDataFromPath(brand, apiResponse);
// console.log(extractedData ,"rdddddddddddddddddd");


// async function getDataFromPath(brand) {
//   try {

//     const apiData = await Apis.findOne({
//       where: {
//         brand: brand,
//       },
//       attributes: ['url','delimiter','pathName', 'pathQuant', 'pathColor', 'pathModel', 'pathid_item'],
//     });
//     console.log("<<<>>><><<>><><<>><><><<>><<>><<>.... apidata....<><><><><><><>><><><><><>",apiData)

//     if (!apiData) {
//       throw new Error('APIs not found for the given brand.');
//     }
// const {url,delimiter} = apiData;
// const urls = [url];
// console.log(urls)
//     const { pathName, pathQuant, pathColor, pathModel, pathid_item } = apiData.dataValues;
//     // const apiResponse = await getData(urls);

//     let apiResponse = [
//       {
//         produit: [
//           {
//             existid: 1,
//             existname: 'Test Product',
//             existmodel: 'Test Model',
//             existbrand: 'Test Brand',
//             existquant: 10,
//             existreference: 'T12345',
//             existcolor: 'Red',
//             createdAt: '2023-07-20T20:05:51.000Z',
//             updatedAt: '2023-07-20T20:05:51.000Z'
//           },
//           {
//             existid: 2,
//             existname: 'test2 Product',
//             existmodel: 'test2 Model',
//             existbrand: 'test2 Brand',
//             existquant: 110,
//             existreference: 's12345',
//             existcolor: 'bleu',
//             createdAt: '2023-07-20T20:06:53.000Z',
//             updatedAt: '2023-07-20T20:06:53.000Z'
//           },
//           {
//             existid: 3,
//             existname: 'test3Product',
//             existmodel: 'test3Model',
//             existbrand: 'test3Brand',
//             existquant: 2340,
//             existreference: 's13345',
//             existcolor: 'bleu',
//             createdAt: '2023-07-20T20:08:13.000Z',
//             updatedAt: '2023-07-20T20:08:13.000Z'
//           }
//         ],
//         proc: [
//           {
//             existid: 222,
//             existname: 'Test Product',
//             existmodel: 'Test Model',
//             existbrand: 'Test Brand',
//             existquant: 10,
//             existreference: 'T12345',
//             existcolor: 'Red',
//             createdAt: '2023-07-20T20:05:51.000Z',
//             updatedAt: '2023-07-20T20:05:51.000Z'
//           },
//           {
//             existid: 1112,
//             existname: 'test2 Product',
//             existmodel: 'test2 Model',
//             existbrand: 'test2 Brand',
//             existquant: 110,
//             existreference: 's12345',
//             existcolor: 'bleu',
//             createdAt: '2023-07-20T20:06:53.000Z',
//             updatedAt: '2023-07-20T20:06:53.000Z'
//           },
//           {
//             existid: 1113,
//             existname: 'test3Product',
//             existmodel: 'test3Model',
//             existbrand: 'test3Brand',
//             existquant: 2340,
//             existreference: 's13345',
//             existcolor: 'bleu',
//             createdAt: '2023-07-20T20:08:13.000Z',
//             updatedAt: '2023-07-20T20:08:13.000Z'
//           }
//         ]
//       }
//     ];
//     console.log("<><><><><><><><><><><><><><><><><><><><><><><><><><><<><>><><><><><><><><><><><><><", apiResponse);

//     const paths = { pathName, pathQuant, pathColor, pathModel, pathid_item };
//     console.log("<<<>>><><<>><><<>><><><<>><<>><<>.... paths....<><><><><><><>><><><><><>", paths)


//     for (const [pathKey, path] of Object.entries(paths)) {
//       console.log("<<<>>><><<>><><<>><><><<>><<>><<>.... del....<><><><><><><>><><><><><>",delimiter)

//       const keys = path.split(delimiter);
//       console.log("<<<>>><><<>><><<>><><><<>><<>><<>.... keys....<><><><><><><>><><><><><>",keys)

//       let value = apiResponse;
//       for (const key of keys) {
//         try {
//           console.log("<<<>>><><<>><><<>><><><<>><<>><<>.... 1key....<><><><><><><>><><><><><>", key)
      
//           // Use square brackets to access the nested property
//           value = value[key];
//           console.log("<<<>>><><<>><><<>><><><<>><<>><<>.... value....<><><><><><><>><><><><><>", value)
//         } catch (error) {
//           value = undefined;
//           break;
//         }
//       }
//       if (value === undefined) {
//         return "ssss";
//       }

//       const extractedData = {
//         brand: brand,
//         [pathKey]: value,
//       };
//       await saveToVetrina(brand, extractedData);
//     }

//     return value;
  
//   } catch (error) {
//     throw error;
//   }
// }


// const posted = async (req, res) => {
//   try {
//     const { brand } = req.body;
//     console.log("req", brand);

//     if (!brand) {
//       throw new Error("No brand provided");
//     }

//     const apiData = await Apis.findOne({
//       where: { brand: brand },
//     });

//     if (!apiData) {
//       throw new Error("No API data found for the specified brand");
//     }

//     const { url, id_item, name, model, quant, color } = apiData;
//     const urls = [url];

//     const data = await getData(urls);
//     console.log(typeof data, "data ");

//     const flattenedValues = data.flatMap((response, index) => {
//       return response.map((item) => {
//         const brandValue = brand;
//         const idItemValue = item[id_item];
//         const nameValue = item[name];
//         const modelValue = item[model];
//         const quantValue = item[quant];
//         const colorValue = item[color];

//         return {
//           brand: brandValue,
//           id_item: idItemValue,
//           name: nameValue,
//           model: modelValue,
//           quant: quantValue,
//           color: colorValue,
//         };
//       });
//     });

//     console.log("Flattened Values:", flattenedValues);

//     for (const values of flattenedValues) {
//       const { brand, id_item } = values;
//       console.log(brand);
//       const existingRow = await Vetrina.findOne({
//         where: { brand, id_item },
//       });

//       if (existingRow) {
//         // Row with same brand and id_item exists, update the row
//         const { name, model, quant, color } = values;
//         await existingRow.update({ name, model, quant, color });
//         console.log("Data updated successfully in the database");
//       } else {
//         // Row with brand and id_item does not exist, insert a new row
//         await Vetrina.create({
//           brand,
//           id_item,
//           name: values.name,
//           model: values.model,
//           quant: values.quant,
//           color: values.color,
//         });
//         console.log("Data inserted successfully into the database");
//       }
//     }

//     res.send("Data inserted/updated successfully");
//     console.log("Data fetched from multiple URLs:", data);
//   } catch (error) {
//     console.error("Error retrieving data:", error.message);
//     res.status(500).send("Error retrieving data");
//   }
// };

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
