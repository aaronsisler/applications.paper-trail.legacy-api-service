import { Health } from "../../models/health";

class HealthService {
  getHealth = (): Health => {
    const health: Health = {
      message: "Hello! It looks like this service is working.",
      currentTime: new Date().toTimeString()
    };

    return health;
  };
}

export { HealthService };
