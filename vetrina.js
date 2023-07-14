const mysql = require("mysql");
const axios = require("axios");
const express = require("express");
var app = express();

const bodyParser = require("body-parser");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
//<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< connection
var conn = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "vetrina",
});

conn.connect((err) => {
  if (!err) console.log("DB-vetrina connection succeded");
  else
    console.log(
      "DB-vetrina connection failed \n error : " +
        JSON.stringify(err, undefined, 2)
    );
});

app.listen(4000, () => console.log("exxpress server-vetrina work"));
// <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< get and insert data >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
//               <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< get data

function getData(urls) {
  const requests = urls.map((URL) => axios.get(URL));

  return Promise.all(requests)
    .then((responses) => responses.map((response) => response.data))
    .catch((error) => {
      throw new Error(`Error fetching data: ${error.message}`);
    });
}
//         <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< Define filterColumnNames function
function filterColumnNames(columnNames, searchKeywords) {
  return columnNames.filter((cn) =>
    searchKeywords.some((keyword) => cn.includes(keyword))
  );
}
//           <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< search columnNames >
async function searchColumnNames(req, res, searchKeyword, apiURLs) {
  try {
    const responses = await getData(apiURLs);
    const columnNames = [];

    responses.forEach((response) => {
      const apiColumnNames = Object.keys(response[0]);
      columnNames.push(...apiColumnNames);
    });

    console.log("Column Names:", columnNames);

    const keywordsArray = Array.isArray(searchKeyword)
      ? searchKeyword
      : searchKeyword.split(",");
    if (keywordsArray.length > 0) {
      const filteredColumnNames = filterColumnNames(columnNames, keywordsArray);
      return { responses, columnNames: filteredColumnNames };
    } else {
      return { responses, columnNames };
    }
  } catch (error) {
    console.error("Error searching column names:", error.message);
    res.status(500).send("Error searching column names");
    throw error; // Rethrow the error to ensure proper error handling
  }
}
//             <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< insert data

app.post("/posted", async (req, res) => {
  try {
    const apiURLsQuery = "SELECT url FROM apiURLs";
    conn.query(apiURLsQuery, async (error, results) => {
      if (error) {
        console.error("Error retrieving API URLs:", error.message);
        res.status(500).send("Error retrieving API URLs");
        return;
      }

      const apiURLs = results.map((row) => row.url);

      const data = await getData(apiURLs);
      console.log("type data  >>", typeof data);
      console.log(data);

      const { responses, columnNames: columnNamesBrand } =
        await searchColumnNames(req, res, ["bra"], apiURLs);
      console.log("columnNamesBrand", columnNamesBrand);
      const { columnNames: columnNamesId } = await searchColumnNames(
        req,
        res,
        ["id"],
        apiURLs
      );
      console.log("columnNamesId", columnNamesId);
      const { columnNames: columnNamesName } = await searchColumnNames(
        req,
        res,
        ["name"],
        apiURLs
      );
      console.log("columnNamesName", columnNamesName);
      const { columnNames: columnNamesmodel } = await searchColumnNames(
        req,
        res,
        ["model"],
        apiURLs
      );
      console.log("columnNamesmodel", columnNamesmodel);
      const { columnNames: columnNamesquant } = await searchColumnNames(
        req,
        res,
        ["quant"],
        apiURLs
      );
      console.log("columnNamesquant", columnNamesquant);
      const { columnNames: columnNamescolor } = await searchColumnNames(
        req,
        res,
        ["color"],
        apiURLs
      );
      console.log("columnNamescolor", columnNamescolor);

      const flattenedValues = responses.flatMap((response, index) => {
        return response.map((item) => [
          item[columnNamesBrand[index]],
          item[columnNamesId[index]],
          item[columnNamesName[index]],
          item[columnNamesmodel[index]],
          item[columnNamesquant[index]],
          item[columnNamescolor[index]],
        ]);
      });

      console.log("Flattened Values:", flattenedValues);

      flattenedValues.forEach((values) => {
        const [brand, id_item] = values.slice(0, 2);
        const updateQuery = `UPDATE vetrina SET name = ?, model = ?, quant = ?, color = ? WHERE brand = ? AND id_item = ?`;
        const insertQuery = `INSERT INTO vetrina (brand, id_item, name, model, quant, color) VALUES (?, ?, ?, ?, ?, ?)`;

        const params = values.slice(2);

        conn.query(
          `SELECT * FROM vetrina WHERE brand = ? AND id_item = ?`,
          [brand, id_item],
          (err, rows) => {
            if (err) {
              console.error("Error selecting data:", err);
              res.status(500).send("Error inserting/updating data");
              return;
            }

            if (rows.length > 0) {
              // Row with same brand and id_item exists, update the row
              conn.query(
                updateQuery,
                [...params, brand, id_item],
                (err, result) => {
                  if (err) {
                    console.error("Error updating data:", err);
                    res.status(500).send("Error inserting/updating data");
                  } else {
                    console.log("Data updated successfully in the database");
                  }
                }
              );
            } else {
              // Row with brand and id_item does not exist, insert a new row
              conn.query(
                insertQuery,
                [brand, id_item, ...params],
                (err, result) => {
                  if (err) {
                    console.error("Error inserting data:", err);
                    res.status(500).send("Error inserting/updating data");
                  } else {
                    console.log("Data inserted successfully into the database");
                  }
                }
              );
            }
          }
        );
      });

      res.send("Data inserted/updated successfully");
      console.log("Data fetched from multiple URLs:", data);
    });
  } catch (error) {
    console.error("Error retrieving data:", error.message);
    res.status(500).send("Error retrieving data");
  }
});

//<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< insert api
app.post("/insert-api-data", async (req, res) => {
  try {
    const { name, url, updateurl } = req.body;

    const selectQuery = "SELECT * FROM apiURLs WHERE name = ?";
    const insertQuery =
      "INSERT INTO apiURLs (name, url, updateurl) VALUES (?, ?, ?)";
    const updateQuery =
      "UPDATE apiURLs SET url = ?, updateurl = ? WHERE name = ?";

    conn.query(selectQuery, [name], (err, rows) => {
      if (err) {
        console.error("Error selecting data:", err);
        res.status(500).send("Error inserting/updating data");
        return;
      }

      if (rows.length > 0) {
        conn.query(updateQuery, [url, updateurl, name], (err, result) => {
          if (err) {
            console.error("Error updating data:", err);
            res.status(500).send("Error inserting/updating data");
          } else {
            console.log("Data updated successfully in the database");
            res.send("Data updated successfully");
          }
        });
      } else {
        conn.query(insertQuery, [name, url, updateurl], (err, result) => {
          if (err) {
            console.error("Error inserting data:", err);
            res.status(500).send("Error inserting/updating data");
          } else {
            console.log("Data inserted successfully into the database");
            res.send("Data inserted successfully");
          }
        });
      }
    });
  } catch (error) {
    console.error("Error inserting/updating data:", error.message);
    res.status(500).send("Error inserting/updating data");
  }
});

// <<<<<<<<<<<<<<<<<<<<<<<< update quant >>>>>>>>>>>>>>>>>>>>>>>>>>>
//     //        find url of product>>>>>>>>>>>>>>>>>>>>>>>>>>>
function findProduct(id) {
  return new Promise((resolve, reject) => {
    conn.query(
      "SELECT brand FROM vetrina WHERE id = ?",
      id,
      (err, rows, fields) => {
        if (err) {
          console.error(err);
          reject(err);
          return;
        }

        if (rows.length > 0) {
          const brand = rows[0].brand;
          conn.query(
            "SELECT updateURL FROM apiurls WHERE name = ?",
            brand,
            (err, rows, fields) => {
              if (err) {
                console.error(err);
                reject(err);
                return;
              }

              let urlUP = "";
              console.log("typekjkjjkjkjk", typeof urlUP);
              console.log("typekjkjjkjkjk", rows[0]);

              if (rows.length > 0) {
                urlUP = rows[0].updateURL;
              } else {
                console.log("URL not found for brand:", brand);
              }

              resolve(urlUP);
              console.log("fffbfbf", urlUP);
            }
          );
        } else {
          console.log("Product not found");
          console.log("Product not ii", id);

          resolve(null);
        }
      }
    );
  });
}

////         <<<<<<<<<<<<<< send to update >>>>>>>>>>>>>>>>>>>>
function getCurrentQuant(id) {
  return new Promise((resolve, reject) => {
    console.log("cccc id", id);

    conn.query(
      "SELECT quant FROM vetrina WHERE id = ?",
      [id],
      (err, rows, fields) => {
        if (err) {
          console.error("Error retrieving current quant:", err);
          reject(err);
          return;
        }
        console.log("cccc", rows[0]);

        if (rows && rows.length > 0) {
          const currentQuant = rows[0].quant;
          resolve(currentQuant);
        } else {
          console.log("No item found for the given id:", id);
          resolve(null);
        }
      }
    );
  });
}

app.get("/update", async (req, res) => {
  try {
    let { id, quant } = req.body;

    const currentQuant = await getCurrentQuant(id);

    const newQuant = currentQuant - quant;

    console.log("newQuant", newQuant);

    const idItem = await selectIdItem(id);
    console.log("Selected id_item:", idItem);

    const URLUP = await findProduct(id);
    console.log("URL:", URLUP);

    await updateProduct(newQuant, id);

    console.log("Rows updated");

    id = idItem;

    if (URLUP) {
      const response = await axios.get(URLUP, { params: { id, quant } });
      console.log("Response from Server:", response.data);
    }

    res.send("Parameters sent successfully");
  } catch (error) {
    console.error("Error sending parameters:", error.message);
    res.status(500).send("Error sending parameters");
  }
});

///                 update product in my data
const updateProduct = (quant, id) => {
  console.log("up me", id, "<>", quant);
  return new Promise((resolve, reject) => {
    const query = "UPDATE vetrina SET quant = ? WHERE id= ?";
    conn.query(query, [quant, id], (err, result) => {
      if (!err) {
        console.log("Rows updated:", result.affectedRows);
        resolve();
      } else {
        console.error("Error updating product:", err);
        reject(err);
      }
    });
  });
};

///         <<<<<<<<<<<<<<<<<<<<< select the prodact to update >>>>>>>>>>>>>
async function selectIdItem(id) {
  return new Promise((resolve, reject) => {
    console.log("idffitem", id);

    const query = "SELECT id_item FROM vetrina WHERE id = ?";
    conn.query(query, [id], (err, rows, fields) => {
      if (err) {
        console.error("Error selecting id_item:", err);
        reject(err);
        return;
      }
      console.log("rowsitem", rows[0]);
      if (rows && rows.length > 0) {
        const idItem = rows[0].id_item;
        resolve(idItem);
      } else {
        console.log("No item found for the given id:", id);
        resolve(null);
      }
    });
  });
}

//<<<<<<<< end of update >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
