require('nodemailer')
require('nodemailer-smtp-pool')

module.exports = function(app) {

    //read settings from configuration file
    var config = app.readConfig(__dirname, 'mailConfig.json');

    return {
        send: function(req, res, callback){

            var nodemailer = require('nodemailer');
            var smtpPool = require('nodemailer-smtp-pool');
            var transporter = nodemailer.createTransport(
                smtpPool(config["SMTP"])
            );

            try {
                var mailOptions = req.body;

                //use default from address if it doesn't exist in request body
                if (!mailOptions["from"]) mailOptions["from"] = config["from"];

                transporter.sendMail(mailOptions);
            }
            catch(err) {
                console.log('err:' + err.message);
            }
            finally {
                transporter.close();
            }
        }
    };
}
