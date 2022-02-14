import * as functions from "firebase-functions";
import axios from "axios";
import * as cors from "cors";
const fl = functions.logger;
// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//
export const queryCoinMarketCap = functions.region("europe-west3")
    .https.onRequest((req, res) => {
      cors({origin: true})(req, res, async () => {
        try {
			  fl.info("Hello logs!", {structuredData: true});
			  // let params = req.query
			  const price_api = "https://pro-api.coinmarketcap.com/v2/cryptocurrency/quotes/latest?symbol=NEAR&convert=USD";

			  const result = await axios.get(price_api, {
			    headers: {
			      "X-CMC_PRO_API_KEY": "fbe92b44-44d0-484d-9275-05cbd58cee0e",
			    },
			  });
			  console.log("queryCoinMarketCap res ", result?.data?.data.NEAR);
			  res.send(result?.data?.data);
        } catch (e) {
          console.log("queryCoinMarketCap err: ", e);
        }
      });
    });
