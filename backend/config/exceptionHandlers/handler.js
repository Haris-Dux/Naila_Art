


export const AppErrorHandler = (err, req, res, next) => {
  res.status(err.status || 500);

  const error = err?.cause || err?.message;
  res.json(error);
};

