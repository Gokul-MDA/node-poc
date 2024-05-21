export const metaData = {
  base: {
    apiPort: 8000,
    key: "4686acba-e8b4-4348-b125-c2994a1b0cdb",
    expire: 86400,
  },
  db: {
    // connectionURL: "mongodb+srv://gokul:admin@cluster0.n6pnmbc.mongodb.net/",
    connectionURL: "mongodb://127.0.0.1:27017",
    databaseName: "demo_proj",
    collectionDetails: {
      // admin: "admin_details",
      user: "user",
      course: "course",
      staff: "staf",
      student: "student",
      random: "random",
    },
  },
};
