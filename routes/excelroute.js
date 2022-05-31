// importing the modules
const express = require('express');
const ExcelJS = require('exceljs');
const fetch = require('node-fetch');

// creating router
const router = express.Router();

// home page
router.get('/', (req, res) => {
  res.render('home');
});

// uploading the excel file
router.post('/add-excel', (req, res) => {
  const file = req.files.file;
  const fileName = file.name;
  const wb = new ExcelJS.Workbook();

  // reading and updating the file
  wb.xlsx.readFile(fileName).then(() => {

    const ws = wb.getWorksheet('Sheet1');

    // reading the titles of the product and making an array which is used to retrieve prices
    let titles = [];
    for (let i = 2; i <= 10; i++) {
      let myRow = ws.getRow(i);
      titles.push(myRow.getCell(1).value);
    }

    // retrieving the prices using promise
    let prices = [];
    titles.forEach(title => {
      prices.push(getPrice(title));
    });

    // updating the file by using the prices array
    Promise.all(prices).then(allData => {
      for (let i = 2; i <= 10; i++) {
        let myRow = ws.getRow(i);
        myRow.getCell(2).value = allData[i - 2]['data']['price'];;
        myRow.commit();
        wb.xlsx.writeFile(fileName);
      }
      console.log("File Updated with prices.");
    });
  }).catch(err => {
    console.log(err.message);
  });

  res.redirect('/');
});

// function to get price for each product
function getPrice(title) {
  return new Promise((resolve, reject) => {
    fetch('https://api.storerestapi.com/products/' + title)
      .then((resp) => resp.json())
      .then(data => resolve(data));
  })
}

// exporting the router
module.exports = router;