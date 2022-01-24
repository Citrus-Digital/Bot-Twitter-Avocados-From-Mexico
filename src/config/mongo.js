const Conn = async (mongoose) => {
    const url = `mongodb://${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_DATABASE}`;
  
    await mongoose
      .connect(url, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      })
      .then(() =>
        console.log(`DATABASE: Connected -> ${url}\r\n`)
      )
      .catch((err) => console.log(`DATABASE: Error -> ${err}`));
};

module.exports = Conn;