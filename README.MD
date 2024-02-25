## Introduction to the Project

This repository comprises two folders: client and server.
- **Client**: React Application
- **Server**: Node.js Application

## Getting Started with the Frontend (Client)

The frontend application is readily accessible through the following link:
[https://roxiler-project.vercel.app/](https://roxiler-project.vercel.app/)

Alternatively, you can clone the repository and initiate it in development mode using the following command:
### `npm start`

## Getting Started with the Backend (Server)

The backend Node.js application is hosted at:
[https://roxiler-project-3h6z.vercel.app/](https://roxiler-project-3h6z.vercel.app/)

You can also clone the repository and run it in development mode using:
### `npm start`

### Required APIs

1. API for retrieving all transactions:
[https://roxiler-project-3h6z.vercel.app/transactions/getAll](https://roxiler-project-3h6z.vercel.app/transactions/getAll)

2. API for obtaining transactions with a specific month's Date of Sale (e.g., March):
[https://roxiler-project-3h6z.vercel.app/transactions/searchWith?month=march](https://roxiler-project-3h6z.vercel.app/transactions/searchWith?month=march)

3. API for acquiring statistics for a particular month with page no , no of records per page(limit) and text:
[https://roxiler-project-3h6z.vercel.app/transactions/searchWith?month=january&page=1&limit=3&text=Casual](https://roxiler-project-3h6z.vercel.app/transactions/searchWith?month=january&page=1&limit=3&text=Casual)


4. API for acquiring statistics for a particular month:
[https://roxiler-project-3h6z.vercel.app/transactions/getStatistics?month=january](https://roxiler-project-3h6z.vercel.app/transactions/getStatistics?month=january)

5. API for retrieving a Bar Chart:
[https://roxiler-project-3h6z.vercel.app/transactions/getBarChart?month=january](https://roxiler-project-3h6z.vercel.app/transactions/getBarChart?month=january)

6. API for Obtaining a Pie Diagram:
[https://roxiler-project-3h6z.vercel.app/transactions/getPieDiagram?month=march](https://roxiler-project-3h6z.vercel.app/transactions/getPieDiagram?month=march)

7. API for obtaining a combined result from the above three APIs:
[https://roxiler-project-3h6z.vercel.app/transactions/getAllStats?month=march](https://roxiler-project-3h6z.vercel.app/transactions/getAllStats?month=march)
