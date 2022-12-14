import express, { Request, Response } from 'express';
import bodyParser from 'body-parser';
import { filterImageFromURL, deleteLocalFiles } from './util/util';

(async () => {

  // Init the Express application
  const app = express();

  // Set the network port
  const port = process.env.PORT || 8082;

  // Use the body parser middleware for post requests
  app.use(bodyParser.json());

  app.get("/filteredimage", async (req: Request, res: Response) => {
    const { image_url } = req.query;
    try {
      const filePath = await filterImageFromURL(image_url);
      res.status(200).sendFile(filePath, (err) => {
        if (err) {
          res.status(500).send("An error occurred");
          return;
        }
        deleteLocalFiles([filePath]);
      });
    } catch(e) {
      res.status(422).send("An error occurred");
      return;
    }
  })

  // Root Endpoint
  // Displays a simple message to the user
  app.get("/", async (req: Request, res: Response) => {
    res.status(200).send("try GET /filteredimage?image_url={{}}")
  });


  // Start the Server
  app.listen(port, () => {
    console.log(`server running http://localhost:${port}`);
    console.log(`press CTRL+C to stop server`);
  });
})();