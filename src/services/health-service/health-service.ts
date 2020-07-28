import { Health } from "../../models/health";

const healthService = () => {
  const currentTime = new Date().toTimeString();
  const health: Health = {
    message: "Hello! It looks like this service is working.",
    currentTime
  };

  return health;
};

export { healthService };
