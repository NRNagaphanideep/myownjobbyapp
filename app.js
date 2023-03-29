const express = require("express");
const path = require("path");
const { open } = require("sqlite");
const sqlite3 = require("sqlite3");
const app = express();
app.use(express.json());
let db = null;
const dbPath = path.join(__dirname, "jobbyapp.db");
const initializeDbAndServer = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });
    app.listen(3000, () => {
      console.log("Server Running at http://localhost:3000/");
    });
  } catch (e) {
    console.log(`DB Error: ${e.message}`);
    process.exit(1);
  }
};

initializeDbAndServer();

const convertJobbyDbObjectToResponseObject = (dbObject) => {
  return {
    id: dbObject.id,
    companyName: dbObject.company_name,
    companyWebsite: dbObject.company_website,
    jobDescription: dbObject.job_description,
    openings: dbObject.openings,
  };
};

const convertJobby_AppDbObjectToResponseObject = (dbObject) => {
  return {
    job_id: dbObject.jobId,
    companyName: dbObject.company_name,
    jobDescription: dbObject.job_description,
    openings: dbObject.openings,
  };
};

//GET ALL jobs API
app.get("/jobs/", async (request, response) => {
  const getJobsQuery = `
    SELECT
    *
    FROM
    Jobby_App;
    `;
  const jobsArray = await db.all(getJobsQuery);
  response.send(
    jobsArray.map((eachJob) =>
      convertJobby_AppDbObjectToResponseObject(eachJob)
    )
  );
});

//jobId api
app.get("/jobs/:jobId/", async (request, response) => {
  const { jobId } = request.params;
  const getJobQuery = `
    SELECT
    *
    FROM 
    Jobby
    WHERE
    job_id = ${jobId};
    `;
  const jobsArray = await db.get(getJobQuery);
  response.send(convertJobby_AppDbObjectToResponseObject(jobsArray));
});

module.exports = app;
