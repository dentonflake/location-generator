const express = require('express')
const bodyParser = require('body-parser');
const http = require('http')
const xlsx = require('xlsx');
const path = require('path');

const app = express()

const server = http.createServer(app)

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static('public'))

app.post('/submit', (req, res) => {
    console.log(req.body)


    let locations = [];

    // for (let i = 0; i <= (end - start); i++) {
    //     for (let j = 0; j < column; j++) {
    //         for (let k = 0; k < row; k++) {
    //             let bay = start + i;
    //             let columnIndex = j + 1;
    //             let rowIndex = k + 1;

    //             let prefix = warehouse + aisle;
    //             let suffix = `${bay}${columnIndex}${rowIndex}`;

    //             let code = `${prefix}.${suffix}`;
    //             let label = `${aisle}.${suffix}`;

    //             locations.push({ code, label });
    //         }
    //     }
    // }

    const filePath = path.join(__dirname, 'locations.xlsx');
    const workbook = xlsx.utils.book_new();

    const worksheet = xlsx.utils.json_to_sheet(locations, { header: ["code", "label"] });

    xlsx.utils.book_append_sheet(workbook, worksheet, 'Locations');

    xlsx.writeFile(workbook, filePath);

    res.download(filePath, 'locations.xlsx', (err) => {
        if (err) {
            console.error('Error sending file:', err);
            res.status(500).send('Error downloading file.');
        }
    });
});

const port = 3000

server.listen(port, () => {
    console.clear()
    console.log(`Server is running on port ${port}`)
})