// eslint-disable-next-line consistent-return
const isCorrectDate = (req, res, next) => {
  try {
    const currentDate = new Date().toJSON().slice(0, 10);

    if (new Date(req.body.date) < new Date(currentDate)) {
      return res
        .status(400)
        .json({ message: "provide a current or future date" });
    }
    next();
  } catch (error) {
    return res.status(400).json({ message: "date is not correct" });
  }
};

module.exports = {
  isCorrectDate,
};
