import os from "os";

const getLocalIP = (): string => {
  const nets = os.networkInterfaces();
  for (const name of Object.keys(nets)) {
    for (const net of nets[name]!) {
      if (net.family === "IPv4" && !net.internal) {
        return net.address;
      }
    }
  }
  return "localhost";
};

const localIP = process.env.LOCAL_IP || getLocalIP();

export default ({ config }: { config: Record<string, any> }) => ({
  ...config,
  expo: {
    ...config.expo,
    extra: {
      BACKEND_URL: `http://${localIP}:3000`,
    },
  },
});
