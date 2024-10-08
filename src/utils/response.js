const sendResponse = ({
  message,
  title,
  Response = {},
  statusCode = 200,
  status = true,
  res,
}) => {
  return res.status(statusCode).json({
    statusCode,
    status,
    title,
    message,
    ...(status !== false &&
      Response &&
      ((Array.isArray(Response) && Response.length > 0) ||
        (!Array.isArray(Response) && Object.keys(Response).length > 0)) && {
        Response,
      }),
  });
};

module.exports = { sendResponse };
