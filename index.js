const   http = require('http'),
        path = require('path'),
        express = require('express'),
        fs = require('fs'),
        xmlParse = require('xslt-processor').xmlParse,
        xsltProcess = require('xslt-processor').xsltProcess,
        xml2js = require('xml2js');

const router = express();
const server = http.createServer(router);

router.use(express.static(path.resolve(__dirname,'views')));
router.use(express.urlencoded({extended: true}));
router.use(express.json());

/*!
 * Function copied from Lecturer Mikhail on github: https://github.com/mikhail-cct/ssp-practical/blob/main/index.js
 */

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

function JSONtoXML(filename, obj, cb) {
    var filepath = path.normalize(path.join(__dirname, filename));
    var builder = new xml2js.Builder();
    var xml = builder.buildObject(obj);
    fs.unlinkSync(filepath);
    fs.writeFile(filepath, xml, cb);
};

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