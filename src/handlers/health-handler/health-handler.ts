import healthService, {
  HealthServiceResponse
} from "../../services/health-service";

const health = (_event: any, _context: any, callback: any) => {
  const response: HealthServiceResponse = healthService();

  callback(null, response);
};

export default health;
