const   http = require('http'), //provides http servers functionalities
        path = require('path'), // provides utilities to work with the file and directory paths
        express = require('express'), //allows the app to respond http requests, defining routing and render back content
        fs = require('fs'), //read and write files
        xmlParse = require('xslt-processor').xmlParse, //allow use of xml files
        xsltProcess = require('xslt-processor').xsltProcess, //allow use of xsl files
        xml2js = require('xml2js'); //converts xml to json

const router = express();
const server = http.createServer(router);

router.use(express.static(path.resolve(__dirname,'views'))); //set ''views'' folder public
router.use(express.urlencoded({extended: true})); //data sent from client can be encoded in applications end point
router.use(express.json()); //applies json support

/*!
 * Function copied from Lecturer Mikhail on github: https://github.com/mikhail-cct/ssp-practical/blob/main/index.js
 */

// Function to read in XML file and convert it to JSON
function XMLtoJSON(filename, cb) {
    var filepath = path.normalize(path.join(__dirname, filename));
    fs.readFile(filepath, 'utf8', function(err, xmlStr) {
      if (err) throw (err);
      xml2js.parseString(xmlStr, {}, cb);
    });
};

/*!
 * Function copied from Lecturer Mikhail on github: https://github.com/mikhail-cct/ssp-practical/blob/main/index.js
 */

//Function to convert JSON to XML and save it
function JSONtoXML(filename, obj, cb) {
    var filepath = path.normalize(path.join(__dirname, filename));
    var builder = new xml2js.Builder();
    var xml = builder.buildObject(obj);
    fs.unlinkSync(filepath);
    fs.writeFile(filepath, xml, cb);
};

//take xml and xsl files to a variable and use toString method to print the information

router.get('/get/html', function(req, res){

    res.writeHead(200, {'Content-type' : 'text/html'});

    let xml = fs.readFileSync('DoubleXcycle.xml', 'utf8'),
        xsl = fs.readFileSync('DoubleXcycle.xsl', 'utf8');
        
    let doc = xmlParse(xml),
        stylesheet = xmlParse(xsl);
            
    let result = xsltProcess(doc, stylesheet);

    res.end(result.toString());

});

/*!
 * Code copied from Lecturer Mikhail on github: https://github.com/mikhail-cct/ssp-practical/blob/main/index.js
 */

router.post('/post/json', function (req, res) {

    function appendJSON(obj) {

        console.log(obj)

        XMLtoJSON('DoubleXcycle.xml', function (err, result) {
            if (err) throw (err);
            
            result.store.section[obj.sec_n].item.push({'model': obj.model, 'price': obj.price});

            console.log(JSON.stringify(result, null, "  "));

            JSONtoXML('DoubleXcycle.xml', result, function(err){
                if (err) console.log(err);
            });
        });
    };

    appendJSON(req.body);

    res.redirect('back');

});

/*!
 * Code copied from Lecturer Mikhail on github: https://github.com/mikhail-cct/ssp-practical/blob/main/index.js
 */

router.post('/post/delete', function (req, res) {

    function deleteJSON(obj) {

        console.log(obj)

        XMLtoJSON('DoubleXcycle.xml', function (err, result) {
            if (err) throw (err);
            
            delete result.store.section[obj.section].item[obj.entree];

            console.log(JSON.stringify(result, null, "  "));

            JSONtoXML('DoubleXcycle.xml', result, function(err){
                if (err) console.log(err);
            });
        });
    };

    deleteJSON(req.body);

    res.redirect('back');

});

server.listen(process.env.PORT || 3000, process.env.IP || "0.0.0.0", function()
{
    const addr = server.address();
    console.log("Server listening at", addr.address + ":" + addr.port)
});