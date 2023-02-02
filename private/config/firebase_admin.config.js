require('dotenv').config();
const admin = require("firebase-admin");
const serviceAccount = require("./service.json");

admin.initializeApp({
  credential: admin.credential.cert(
    // {
    //   "type": process.env.SECRET_TYPE,
    //   "project_id": process.env.SERVICE_PROJECT_ID,
    //   "private_key_id": process.env.SERVICE_PRIVATE_KEY_ID,
    //   "private_key": process.env.SECRET_PRIVATE_KEY,
    //   "client_email": process.env.SERVICE_CLIENT_EMAIL,
    //   "client_id": process.env.SERVICE_CLIENT_ID,
    //   "auth_uri": process.env.SERVICE_AUTH_URI,
    //   "token_uri": process.env.SERVICE_TOKEN_URI,
    //   "auth_provider_x509_cert_url": process.env.SERVICE_AUTH_PROVIDER_X509_CERT_URL,
    //   "client_x509_cert_url": process.env.SERVICE_CLIENT_X509_CERT_URL
    // }
    {
      privateKey: process.env._SERVICE_PRIVATE_KEY,
      projectId: process.env._SERVICE_PROJECT_ID,
      clientEmail: process.env._SERVICE_CLIENT_EMAIL,
    }
  ),
});

module.exports.admin = admin;
