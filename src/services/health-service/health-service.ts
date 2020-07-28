const healthService = () => {
  const currentTime = new Date().toTimeString();
  const response = {
    statusCode: 200,
    body: {
      message: "Hello, it looks like this service is working.",
      currentTime: `The current time is ${currentTime}.`
    }
  };

  return response;
};

export { healthService };
