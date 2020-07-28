import { healthService } from "../../services/health-service";

const health = (_event: any, _context: any, callback: any) => {
  const response = healthService();

  callback(null, response);
};

export { health };
