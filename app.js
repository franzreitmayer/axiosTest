var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var app = express();
var axios = require('axios');
var buffer = require('buffer');
var atob = require('atob');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


var base64;
app.use("/static", express.static(path.join(__dirname,"static")));
app.post("/byUrl", function(req, res) {
    var url = req.body.url;
    console.log(url);
    axios({
        url: url, //your url
        method: 'GET',
        responseType: 'arraybuffer', // important
    }).then((response) => {
        // var dataBlob = new buffer.Blob[response.data];
        //console.log(dataBlob);
        base64 = Buffer.from(response.data, 'binary').toString('base64');
        const byteChars = atob(base64);
        // console.log(base64);
        res.status(200).send(`<htm><head><title>download</title>
        </head><body><a id="a">Download</a>
        <pre>Response Type: ${response.responseType}</pre>
        <pre>${JSON.stringify(response.headers, 1) }</pre>
        <script>var a="${base64}";
        const byteChars = atob(a);
        const byteNumbers = new Array(byteChars.length);
        for (let i = 0; i < byteChars.length; i++) {
            byteNumbers[i] = byteChars.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        const blob = new Blob([byteArray], {type: '${response.headers['content-type']}'});
        const blobUrl = URL.createObjectURL(blob);

        var a = document.getElementById('a');
        a.href = blobUrl;
        </script>
        </body></html>`);
    });
});

app.listen(8080);